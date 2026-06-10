#!/usr/bin/env python3
import os
import ast
import sys

try:
    import requests
    import pandas as pd
    import numpy as np
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import pickle
except ImportError as e:
    print("Missing dependencies. Please install them first:")
    print("   pip install -r requirements.txt")
    print(f"   Error: {e}")
    sys.exit(1)

MOVIES_URL = "https://raw.githubusercontent.com/harshitcodes/tmdb_movie_data_analysis/master/tmdb-5000-movie-dataset/tmdb_5000_movies.csv"
CREDITS_URL = "https://raw.githubusercontent.com/harshitcodes/tmdb_movie_data_analysis/master/tmdb-5000-movie-dataset/tmdb_5000_credits.csv"

def download_dataset():
    print("Downloading TMDB 5000 Movie Dataset...")
    print("  -> Downloading movies.csv...")
    r = requests.get(MOVIES_URL, timeout=60)
    r.raise_for_status()
    with open("data/tmdb_5000_movies.csv", "wb") as f:
        f.write(r.content)
    print("  -> Downloading credits.csv...")
    r = requests.get(CREDITS_URL, timeout=60)
    r.raise_for_status()
    with open("data/tmdb_5000_credits.csv", "wb") as f:
        f.write(r.content)
    print("Dataset downloaded successfully!")

def extract_names(obj):
    if pd.isna(obj):
        return []
    try:
        data = ast.literal_eval(obj)
        return [item['name'] for item in data]
    except:
        return []

def extract_director(obj):
    if pd.isna(obj):
        return ""
    try:
        data = ast.literal_eval(obj)
        for item in data:
            if item.get('job') == 'Director':
                return item.get('name', '')
        return ""
    except:
        return ""

def extract_top_cast(obj, n=5):
    if pd.isna(obj):
        return []
    try:
        data = ast.literal_eval(obj)
        return [item['name'] for item in data[:n]]
    except:
        return []

def preprocess_data():
    print("Preprocessing data...")
    movies = pd.read_csv("data/tmdb_5000_movies.csv")
    credits = pd.read_csv("data/tmdb_5000_credits.csv")
    print(f"   Movies columns: {list(movies.columns)}")
    print(f"   Credits columns: {list(credits.columns)}")
    credits = credits.rename(columns={'movie_id': 'id'})
    credits = credits[['id', 'cast', 'crew']]
    movies = movies.merge(credits, on='id')
    print(f"   After merge columns: {list(movies.columns)}")
    print(f"   Merged rows: {len(movies)}")
    print("  -> Extracting genres, keywords, cast, crew...")
    movies['genres_list'] = movies['genres'].apply(extract_names)
    movies['keywords_list'] = movies['keywords'].apply(extract_names)
    movies['cast_list'] = movies['cast'].apply(lambda x: extract_top_cast(x, 5))
    movies['director'] = movies['crew'].apply(extract_director)
    def clean_text(text_list):
        return [str(x).replace(" ", "").lower() for x in text_list]
    movies['genres_clean'] = movies['genres_list'].apply(clean_text)
    movies['keywords_clean'] = movies['keywords_list'].apply(clean_text)
    movies['cast_clean'] = movies['cast_list'].apply(clean_text)
    movies['director_clean'] = movies['director'].apply(lambda x: [str(x).replace(" ", "").lower()] if x else [])
    movies['tags'] = (
        movies['overview'].fillna('').apply(lambda x: x.split()) +
        movies['genres_clean'] +
        movies['keywords_clean'] +
        movies['cast_clean'] +
        movies['director_clean']
    )
    movies['tags'] = movies['tags'].apply(lambda x: " ".join(x))
    processed = movies[[
        'id', 'title', 'overview', 'genres_list', 'keywords_list',
        'cast_list', 'director', 'release_date', 'vote_average',
        'vote_count', 'popularity', 'runtime', 'tags'
    ]].copy()
    processed.columns = [
        'movie_id', 'title', 'overview', 'genres', 'keywords',
        'cast', 'director', 'release_date', 'rating',
        'vote_count', 'popularity', 'runtime', 'tags'
    ]
    processed.to_csv("data/processed_movies.csv", index=False)
    print(f"Processed {len(processed)} movies")
    print("Building TF-IDF vectors...")
    tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
    tfidf_matrix = tfidf.fit_transform(processed['tags'].fillna(''))
    print("  -> Computing cosine similarity matrix...")
    similarity_matrix = cosine_similarity(tfidf_matrix)
    print("  -> Saving models...")
    with open("data/tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(tfidf, f)
    with open("data/similarity_matrix.pkl", "wb") as f:
        pickle.dump(similarity_matrix, f)
    with open("data/movies_data.pkl", "wb") as f:
        pickle.dump(processed, f)
    print("Preprocessing complete!")
    print(f"   Movies: {len(processed)}")
    print(f"   TF-IDF features: {tfidf_matrix.shape[1]}")
    print(f"   Similarity matrix: {similarity_matrix.shape}")
    return processed

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    download_dataset()
    preprocess_data()
    print("Dataset ready! Run 'python main.py' to start the API server.")
