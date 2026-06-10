import React from 'react'
import { AlertCircle, SearchX, RefreshCw } from 'lucide-react'

const ErrorMessage = ({ message, onRetry, movieName }) => {
  const isNotFound = message?.toLowerCase().includes('not found') || message?.toLowerCase().includes('no recommendations')

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl" />
        <div className="relative w-20 h-20 bg-netflix-card rounded-full flex items-center justify-center border border-red-500/20">
          {isNotFound ? <SearchX className="w-10 h-10 text-red-400" /> : <AlertCircle className="w-10 h-10 text-red-400" />}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 text-center">{isNotFound ? 'Movie Not Found' : 'Something Went Wrong'}</h3>

      <p className="text-netflix-gray text-sm text-center max-w-md mb-6">
        {isNotFound ? (
          <>
            We couldn't find recommendations for <span className="text-white font-medium">"{movieName}"</span>.
            <br />Try searching for a different movie title.
          </>
        ) : (message || 'An error occurred while fetching recommendations. Please try again.')}
      </p>

      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-6 py-2.5 bg-netflix-card hover:bg-netflix-hover text-white rounded-lg border border-white/10 hover:border-netflix-red/30 transition-all duration-200 hover:shadow-lg">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}

      {isNotFound && (
        <div className="mt-8 w-full max-w-md">
          <p className="text-xs text-netflix-gray uppercase tracking-wider mb-3 text-center">Popular searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction', 'The Matrix'].map((movie) => (
              <button key={movie} onClick={() => onRetry?.(movie)} className="px-3 py-1.5 bg-white/5 hover:bg-netflix-red/20 text-netflix-light hover:text-white text-sm rounded-lg border border-white/10 hover:border-netflix-red/30 transition-all duration-200">
                {movie}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ErrorMessage
