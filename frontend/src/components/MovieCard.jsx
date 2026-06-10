import React, { useState } from 'react'
import { Star, Calendar, User, Clapperboard, Users, ChevronRight, TrendingUp } from 'lucide-react'

const MovieCard = ({ movie, index, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const releaseYear = movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')
  const rating = movie.rating || 0

  const generateGradient = (title) => {
    const gradients = [
      'from-red-900/40 to-black', 'from-blue-900/40 to-black', 'from-purple-900/40 to-black',
      'from-green-900/40 to-black', 'from-orange-900/40 to-black', 'from-pink-900/40 to-black',
      'from-cyan-900/40 to-black', 'from-yellow-900/40 to-black',
    ]
    let hash = 0
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash)
    return gradients[Math.abs(hash) % gradients.length]
  }

  const fallbackGradient = generateGradient(movie.title)

  return (
    <div 
      className="group relative bg-netflix-card rounded-xl overflow-hidden card-hover border border-white/5 animate-slide-up cursor-pointer" 
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
      onClick={onClick}
    >
      <div className={`relative aspect-[2/3] overflow-hidden bg-gradient-to-b ${fallbackGradient}`}>
        {movie.poster && !imageError ? (
          <>
            <img src={movie.poster} alt={movie.title} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)} onError={() => setImageError(true)} />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-netflix-red/30 border-t-netflix-red rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-b ${fallbackGradient} flex items-center justify-center`}>
            <div className="text-center p-4">
              <Clapperboard className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm font-medium">{movie.title}</p>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
        </div>

        {movie.similarity_score && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-netflix-red/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white">{(movie.similarity_score * 100).toFixed(0)}% match</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-netflix-card via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-netflix-red/0 group-hover:bg-netflix-red/10 transition-colors duration-300" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-netflix-red transition-colors duration-200">{movie.title}</h3>

        <div className="flex items-center gap-3 mb-3 text-xs text-netflix-gray">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{releaseYear}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{movie.director || 'Unknown'}</span>
        </div>

        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genres.slice(0, 3).map((genre, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/5 text-netflix-light text-[10px] rounded-md border border-white/10 hover:bg-netflix-red/20 hover:border-netflix-red/30 transition-colors duration-200">{genre}</span>
            ))}
          </div>
        )}

        {movie.cast && movie.cast.length > 0 && (
          <div className="flex items-start gap-1.5 mb-3">
            <Users className="w-3 h-3 text-netflix-gray mt-0.5 flex-shrink-0" />
            <p className="text-xs text-netflix-gray line-clamp-1">{movie.cast.slice(0, 3).join(', ')}</p>
          </div>
        )}

        {movie.overview && (
          <div className="relative">
            <p className={`text-xs text-netflix-gray leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{movie.overview}</p>
            {movie.overview.length > 100 && (
              <button
  onClick={(e) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }}
  className="mt-1 text-xs text-netflix-red hover:text-red-400 transition-colors duration-200 flex items-center gap-0.5"
>
  {isExpanded ? 'Show less' : 'Read more'}
  <ChevronRight
    className={`w-3 h-3 transition-transform duration-200 ${
      isExpanded ? 'rotate-90' : ''
    }`}
  />
</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard
