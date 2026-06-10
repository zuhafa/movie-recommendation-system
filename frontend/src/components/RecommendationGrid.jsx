import React from 'react'
import MovieCard from './MovieCard'

const RecommendationGrid = ({ movies, searchedMovie, onMovieClick }) => {
  if (!movies || movies.length === 0) return null

  return (
    <section id="results" className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-netflix-red rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recommendations</h2>
          </div>
          <p className="text-netflix-gray text-sm sm:text-base ml-15">
            Because you liked <span className="text-netflix-red font-semibold">"{searchedMovie}"</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} index={index} onClick={() => onMovieClick(movie)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecommendationGrid
