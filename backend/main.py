#!/usr/bin/env python3
"""
Movie Recommendation System - FastAPI Backend
Content-based filtering using TF-IDF + Cosine Similarity
Integrates with TMDB API for posters and metadata (free key included)
"""
import os
import pickle
import requests
from typing import List, Optional
from difflib import get_close_matches

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
OMDB_API_KEY = "34797f7e"
# TMDB API Configuration - uses free key from freekeys npm package if no custom key provided
# Free TMDB key (from freekeys package - no registration needed)
FREE_TMDB_KEY = "e547e17d4e91f3e62a571655cd1ccaff"
TMDB_API_KEY = os.getenv("TMDB_API_KEY", FREE_TMDB_KEY)
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original"

app = FastAPI(
    title="Movie Recommendation System",
    description="AI-powered movie recommendations using content-based filtering with TMDB integration",
    version="1.0.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load preprocessed data
print("Loading recommendation models...")
try:
    with open("data/movies_data.pkl", "rb") as f:
        movies_df = pickle.load(f)
    with open("data/similarity_matrix.pkl", "rb") as f:
        similarity_matrix = pickle.load(f)
    print(f"✅ Loaded {len(movies_df)} movies")
except FileNotFoundError:
    print("❌ Model files not found. Run 'python prepare_data.py' first.")
    movies_df = pd.DataFrame()
    similarity_matrix = None

# Pydantic Models
class MovieRecommendation(BaseModel):
    title: str
    poster: Optional[str] = None
    backdrop: Optional[str] = None
    rating: float
    release_date: Optional[str] = None
    release_year: Optional[int] = None
    director: str
    cast: List[str]
    genres: List[str]
    overview: str
    runtime: Optional[int] = None
    popularity: Optional[float] = None
    similarity_score: Optional[float] = None

class MovieDetail(BaseModel):
    title: str
    poster: Optional[str] = None
    backdrop: Optional[str] = None
    rating: float
    release_date: Optional[str] = None
    release_year: Optional[int] = None
    director: str
    cast: List[str]
    genres: List[str]
    keywords: List[str]
    overview: str
    runtime: Optional[int] = None
    popularity: Optional[float] = None

class MovieListItem(BaseModel):
    title: str
    movie_id: int

# TMDB API Integration
def fetch_tmdb_data(movie_title: str) -> dict:
    """Fetch movie data from TMDB API using free key."""
    try:
        # Search for movie
        search_url = f"{TMDB_BASE_URL}/search/movie"
        params = {
            "api_key": TMDB_API_KEY,
            "query": movie_title,
            "language": "en-US",
            "page": 1
        }
        response = requests.get(search_url, params=params, timeout=10)
        data = response.json()

        if data.get("results"):
            movie = data["results"][0]
            movie_id = movie.get("id")

            # Get detailed info
            detail_url = f"{TMDB_BASE_URL}/movie/{movie_id}"
            detail_params = {"api_key": TMDB_API_KEY, "language": "en-US"}
            detail_response = requests.get(detail_url, params=detail_params, timeout=10)
            detail_data = detail_response.json()

            # Get credits
            credits_url = f"{TMDB_BASE_URL}/movie/{movie_id}/credits"
            credits_response = requests.get(credits_url, params={"api_key": TMDB_API_KEY}, timeout=10)
            credits_data = credits_response.json()

            # Extract director
            director = ""
            for crew in credits_data.get("crew", []):
                if crew.get("job") == "Director":
                    director = crew.get("name", "")
                    break

            # Extract top cast
            cast = [c.get("name", "") for c in credits_data.get("cast", [])[:5]]

            return {
                "poster": f"{TMDB_IMAGE_BASE}{movie.get('poster_path')}" if movie.get("poster_path") else None,
                "backdrop": f"{TMDB_BACKDROP_BASE}{movie.get('backdrop_path')}" if movie.get("backdrop_path") else None,
                "rating": detail_data.get("vote_average", 0),
                "release_date": detail_data.get("release_date"),
                "runtime": detail_data.get("runtime"),
                "popularity": detail_data.get("popularity"),
                "director": director,
                "cast": cast,
                "genres": [g.get("name", "") for g in detail_data.get("genres", [])],
                "overview": detail_data.get("overview", "")
            }
    except Exception as e:
        print(f"TMDB API error for '{movie_title}': {e}")

    return {}

def fetch_omdb_data(movie_title: str):
    try:
        url = f"https://www.omdbapi.com/?apikey={OMDB_API_KEY}&t={movie_title}"

        response = requests.get(url, timeout=5)
        data = response.json()

        if data.get("Response") == "True":
            return {
                "poster": data.get("Poster"),
                "rating": float(data.get("imdbRating", 0))
                if data.get("imdbRating") not in [None, "N/A"]
                else 0,
                "director": data.get("Director", "Unknown"),
                "cast": data.get("Actors", "").split(", "),
                "genres": data.get("Genre", "").split(", "),
                "overview": data.get("Plot", "")
            }

    except Exception as e:
        print(f"OMDb API error for '{movie_title}': {e}")

    return {}

def find_movie_index(title: str) -> int:
    """Find movie index with fuzzy matching."""
    titles = movies_df['title'].tolist()

    # Exact match
    exact = movies_df[movies_df['title'].str.lower() == title.lower()]
    if not exact.empty:
        return exact.index[0]

    # Close match
    matches = get_close_matches(title, titles, n=1, cutoff=0.6)
    if matches:
        return movies_df[movies_df['title'] == matches[0]].index[0]

    raise ValueError(f"Movie '{title}' not found")

# API Endpoints
@app.get("/")
def root():
    return {
        "message": "Movie Recommendation System API",
        "docs": "/docs",
        "movies_count": len(movies_df)
    }

@app.get("/movies", response_model=List[str])
def get_movies():
    """Return list of all movie titles for autocomplete."""
    if movies_df.empty:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    return movies_df['title'].tolist()

@app.get("/movie/{movie_name}", response_model=MovieDetail)
def get_movie_detail(movie_name: str):
    """Get detailed info for a specific movie."""
    if movies_df.empty:
        raise HTTPException(status_code=500, detail="Dataset not loaded")

    try:
        idx = find_movie_index(movie_name)
        movie = movies_df.iloc[idx]
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_name}' not found")

    movie_data = fetch_omdb_data(movie['title'])
    release_year = None
    if pd.notna(movie.get('release_date')) and str(movie['release_date']) != 'nan':
        try:
            release_year = int(str(movie['release_date'])[:4])
        except:
            pass

    return MovieDetail(
        title=movie['title'],
        poster=movie_data.get('poster'),
        backdrop=movie_data.get('backdrop'),
        rating=movie_data.get('rating', float(movie['rating']) if pd.notna(movie['rating']) else 0),
        release_date=str(movie['release_date']) if pd.notna(movie.get('release_date')) else None,
        release_year=release_year,
        director=movie_data.get('director', str(movie['director']) if pd.notna(movie['director']) else 'Unknown'),
        cast=movie_data.get('cast', movie['cast'] if isinstance(movie['cast'], list) else []),
        genres=movie['genres'] if isinstance(movie['genres'], list) else [],
        keywords=movie['keywords'] if isinstance(movie['keywords'], list) else [],
        overview=movie_data.get('overview', str(movie['overview']) if pd.notna(movie['overview']) else ''),
        runtime=movie_data.get('runtime'),
        popularity=movie_data.get('popularity')
    )

@app.get("/recommend/{movie_name}", response_model=List[MovieRecommendation])
def get_recommendations(movie_name: str):
    """Get top 5 movie recommendations based on content similarity."""
    if movies_df.empty or similarity_matrix is None:
        raise HTTPException(status_code=500, detail="Recommendation model not loaded")

    try:
        idx = find_movie_index(movie_name)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_name}' not found")

    # Get similarity scores
    distances = similarity_matrix[idx]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])

    recommendations = []

    # Skip first (the movie itself), take top 5
    for i in movies_list[1:6]:
        movie_idx = i[0]
        similarity_score = float(i[1])
        movie = movies_df.iloc[movie_idx]

        movie_data = fetch_omdb_data(movie['title'])
        release_year = None
        if pd.notna(movie.get('release_date')) and str(movie['release_date']) != 'nan':
            try:
                release_year = int(str(movie['release_date'])[:4])
            except:
                pass

        rec = MovieRecommendation(
            title=movie['title'],
            poster=movie_data.get('poster'),
            backdrop=movie_data.get('backdrop'),
            rating=round(movie_data.get('rating', float(movie['rating']) if pd.notna(movie['rating']) else 0), 1),
            release_date=str(movie['release_date']) if pd.notna(movie.get('release_date')) else None,
            release_year=release_year,
            director=movie_data.get('director', str(movie['director']) if pd.notna(movie['director']) else 'Unknown'),
            cast=movie_data.get('cast', movie['cast'] if isinstance(movie['cast'], list) else []),
            genres=movie['genres'] if isinstance(movie['genres'], list) else [],
            overview=movie_data.get('overview', str(movie['overview']) if pd.notna(movie['overview']) else '')[:200] + "...",
            runtime=movie_data.get('runtime'),
            popularity=movie_data.get('popularity'),
            similarity_score=round(similarity_score, 3)
        )
        recommendations.append(rec)

    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
