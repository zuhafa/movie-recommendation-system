#!/bin/bash
# Movie Recommendation System - Setup Script

echo "🎬 Setting up Movie Recommendation System..."

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend
pip install -r requirements.txt

if [ ! -f "data/processed_movies.csv" ]; then
    echo "📥 Downloading dataset..."
    python prepare_data.py
else
    echo "✅ Dataset already prepared"
fi

echo ""
echo "🚀 Starting backend server..."
python main.py &
BACKEND_PID=$!

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend
npm install

echo ""
echo "🚀 Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

wait $BACKEND_PID $FRONTEND_PID
