# 🎬 Movie Recommendation System

A content-based Movie Recommendation System built using FastAPI, React, TF-IDF, and Cosine Similarity. The application analyzes movie metadata from the TMDB 5000 dataset and provides personalized recommendations with posters, ratings, cast information, director details, and similarity-based matching through a modern Netflix-inspired interface.

## 📸 Application Preview
### Home Page
<img width="530" height="494" alt="Screenshot 2026-06-10 155207" src="https://github.com/user-attachments/assets/2e4f22df-1c2a-40fc-b061-273fce6cb308" />


### Recommendation Results
<img width="334" height="599" alt="Screenshot 2026-06-10 160734" src="https://github.com/user-attachments/assets/38ae3975-ad20-45e4-a660-6ecc11ba2c81" />



### Movie Details Modal
<img width="344" height="482" alt="Screenshot 2026-06-10 155842" src="https://github.com/user-attachments/assets/b8fb03ae-57e8-433c-aab3-60d782167bfc" />


## ✨ Features

### Backend (FastAPI + ML)
- **Content-based filtering** using TF-IDF vectorization + Cosine Similarity
- **TMDB 5000 Movie Dataset** with 4,800+ movie records
- **OMDb API integration** for posters, ratings, cast information, and movie details.
- **REST API** with three endpoints: `/movies`, `/recommend/{movie}`, `/movie/{movie}`
- **Fuzzy matching** for movie title search
- **Top 5 recommendations** with similarity scores
- **Real-time movie metadata retrieval**

### Frontend (React + Vite + Tailwind)
-** Netflix-inspired dark UI**
- Animated hero section
- Smart autocomplete search
- **Responsive movie cards**
- **Movie detail modal** with poster, cast, director, rating, and overview
- **Similarity match percentage display**
- **Dataset statistics dashboard**
- Loading states and error handling
- **Fully responsive design**


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

**Note:** Configure your OMDb API key in the environment settings.

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

## 🎬 OMDb API Integration

The system uses the **OMDb API** to dynamically fetch:
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
