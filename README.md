# 🎬 Movie Recommendation System

A complete, production-ready Movie Recommendation System with a modern Netflix/IMDb-inspired UI, powered by Machine Learning (TF-IDF + Cosine Similarity) and OMDb API integration.

## ✨ Features

### Backend (FastAPI + ML)
- **Content-based filtering** using TF-IDF vectorization + Cosine Similarity
- **TMDB 5000 Movie Dataset** with real movie metadata
- **OMDb API integration** with included API key for live movie data and posters
- **REST API** with three endpoints: `/movies`, `/recommend/{movie}`, `/movie/{movie}`
- **Fuzzy matching** for movie title search
- **Top 5 recommendations** with similarity scores

### Frontend (React + Vite + Tailwind)
- **Netflix-inspired dark UI** with cinematic design
- **Animated particle hero** with smooth scroll
- **Smart autocomplete search** with 5000+ movie suggestions
- **Responsive movie cards** with posters, ratings, cast, director, genres
- **Match percentage** showing similarity score
- **Loading states** and **error handling** with retry
- **Fully responsive** — mobile, tablet, desktop

## 🏗️ Architecture

```
movie-recommendation-system/
├── backend/
│   ├── main.py              # FastAPI server + ML engine
│   ├── prepare_data.py       # Dataset download + preprocessing
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Optional TMDB API key config
│   └── data/                 # Dataset + model files
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API calls
│   │   ├── App.jsx           # Main app
│   │   └── index.css         # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download & preprocess the TMDB 5000 dataset
python prepare_data.py

# Start the FastAPI server
python main.py
```

Backend runs at `http://localhost:8000`

**Note:** An OMDb API key is included by default. The system is ready to use out of the box!

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at `http://localhost:3000`

### 3. Try It Out

1. Open `http://localhost:3000`
2. Search for any movie (e.g., "Inception", "The Dark Knight", "Avatar")
3. Get AI-powered recommendations with real posters!

## 📊 Dataset

Uses the **TMDB 5000 Movie Dataset** containing:
- 4,800+ movies with metadata
- Genres, keywords, cast, crew
- Overviews and release dates
- Vote averages and popularity scores

## 🔬 ML Algorithm

1. **Feature Extraction**: Combines overview + genres + keywords + cast + director into tags
2. **TF-IDF Vectorization**: Converts text tags into numerical vectors (max 5000 features)
3. **Cosine Similarity**: Computes similarity between all movie vectors
4. **Recommendation**: Returns top 5 most similar movies (excluding the input movie itself)

## 🎬 OMDb API Integration (Key Included)

The system uses the **OMDb API** (with a key included by default) to dynamically fetch:
- Movie poster images
- Real-time IMDb ratings
- Up-to-date cast and director information
- Plot overviews

*(Note: The codebase also contains fallback support for the TMDB API, which can optionally be configured via the `.env` file).*

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | API info & movie count |
| `GET /movies` | List all movie titles (for autocomplete) |
| `GET /movie/{movie_name}` | Detailed info for a specific movie |
| `GET /recommend/{movie_name}` | Top 5 similar movies with full metadata |

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, Lucide Icons |
| Backend | FastAPI, Uvicorn, Pandas, Scikit-learn |
| ML | TF-IDF, Cosine Similarity, Content-Based Filtering |
| Data | TMDB 5000 Dataset + OMDb API (live posters) |

## 📝 License

MIT License — free to use for projects and portfolios.
