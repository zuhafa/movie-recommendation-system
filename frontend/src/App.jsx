import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import SearchBar from './components/SearchBar'
import RecommendationGrid from './components/RecommendationGrid'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import { fetchRecommendations } from './services/api'

const App = () => {
  const [recommendations, setRecommendations] = useState([])
  const [searchedMovie, setSearchedMovie] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  

  const handleSearch = useCallback(async (movieName) => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setSearchedMovie(movieName)
    setRecommendations([])

    try {
      const data = await fetchRecommendations(movieName)
      if (data && Array.isArray(data) && data.length > 0) {
        setRecommendations(data)
      
      } else {
        setError(`No recommendations found for "${movieName}"`)
        setRecommendations([])
      }
    } catch (err) {
      console.error('Search error:', err)
      if (err.response?.status === 404) {
        setError(`Movie "${movieName}" not found in our database`)
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.')
      } else if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the recommendation server. Please check your connection.')
      } else {
        setError(err.message || 'An unexpected error occurred')
      }
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRetry = useCallback((movieName) => {
    const searchTerm = movieName || searchedMovie
    if (searchTerm) handleSearch(searchTerm)
  }, [searchedMovie, handleSearch])

  return (
    <div className="min-h-screen bg-netflix-darker text-white">
      <Header />
      <main>
        <HeroSection />

        {/* Statistics Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-netflix-card p-4 rounded-xl text-center border border-white/10">
              <h2 className="text-3xl font-bold text-netflix-red">4803</h2>
              <p className="text-netflix-gray">Movies Analyzed</p>
            </div>

            <div className="bg-netflix-card p-4 rounded-xl text-center border border-white/10">
              <h2 className="text-3xl font-bold text-netflix-red">5000+</h2>
              <p className="text-netflix-gray">Features Extracted</p>
            </div>

            <div className="bg-netflix-card p-4 rounded-xl text-center border border-white/10">
              <h2 className="text-3xl font-bold text-netflix-red">ML</h2>
              <p className="text-netflix-gray">Cosine Similarity</p>
            </div>
          </div>
        </div>


        <section id="search" className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-netflix-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section className="pb-20">
          {isLoading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <LoadingSpinner />
            </div>
          )}

          {error && !isLoading && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ErrorMessage message={error} movieName={searchedMovie} onRetry={handleRetry} />
            </div>
          )}

          {!isLoading && !error && recommendations.length > 0 && (
            <RecommendationGrid movies={recommendations} searchedMovie={searchedMovie} onMovieClick={setSelectedMovie}/>
          )}

          {!isLoading && !error && !hasSearched && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                <span className="text-sm text-netflix-gray">Ready to discover your next favorite movie?</span>
              </div>
              <p className="text-netflix-gray text-sm">Search for any movie above to get personalized AI recommendations</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-netflix-red rounded-full animate-pulse" />
              <span className="text-sm text-netflix-gray">Movie Recommendation System</span>
            </div>
            <p className="text-xs text-netflix-gray">Powered by Machine Learning • Built with React & Vite</p>
          </div>
        </div>
      </footer>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-netflix-card max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
              className="w-full h-80 object-cover rounded-xl"
            />

            <h2 className="text-2xl font-bold mt-4">
              {selectedMovie.title}
            </h2>
            {selectedMovie.similarity_score && (
           <p className="text-green-400 font-semibold mt-2">
          🔥 {(selectedMovie.similarity_score * 100).toFixed(0)}% Match
          </p>
        )}

            <p>⭐ {selectedMovie.rating}</p>
            
            <p>📅 {selectedMovie.release_year}</p>

            <p>🎭 {selectedMovie.genres?.join(", ")}</p>

            <p>
              🎬 Director: {selectedMovie.director}
            </p>

            <p>
              👥 Cast: {selectedMovie.cast?.join(", ")}
            </p>

            <p className="mt-4">
              {selectedMovie.overview}
            </p>

            <button
              onClick={() => setSelectedMovie(null)}
              className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

