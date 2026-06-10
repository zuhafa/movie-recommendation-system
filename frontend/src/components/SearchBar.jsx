import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, ChevronDown, Loader2 } from 'lucide-react'
import { fetchMovies } from '../services/api'

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allMovies, setAllMovies] = useState([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoadingMovies(true)
      try {
        const movies = await fetchMovies()
        setAllMovies(movies || [])
      } catch (error) {
        console.error('Failed to load movies:', error)
        setAllMovies([
          'Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction',
          'The Matrix', 'Forrest Gump', 'The Shawshank Redemption',
          'Fight Club', 'Goodfellas', 'The Godfather', 'Parasite',
          'Avengers: Endgame', 'Joker', 'Dune', 'Spider-Man: No Way Home',
          'The Batman', 'Oppenheimer', 'Barbie', 'Top Gun: Maverick',
          'Everything Everywhere All at Once', 'Avatar', 'Titanic',
          'The Lion King', 'Frozen', 'Toy Story', 'Finding Nemo',
          'Up', 'WALL-E', 'Coco', 'Soul', 'Luca', 'Turning Red'
        ])
      } finally {
        setIsLoadingMovies(false)
      }
    }
    loadMovies()
  }, [])

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const filtered = allMovies.filter(movie => movie.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [query, allMovies])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }, [query, onSearch])

  const handleSuggestionClick = (movie) => {
    setQuery(movie)
    setShowSuggestions(false)
    onSearch(movie)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-netflix-red animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-netflix-gray group-focus-within:text-netflix-red transition-colors duration-200" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a movie..."
            className="w-full pl-12 pr-12 py-4 bg-netflix-card/80 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-netflix-gray text-base focus:outline-none focus:border-netflix-red/50 focus:ring-2 focus:ring-netflix-red/20 transition-all duration-300 shadow-lg"
            disabled={isLoading}
          />

          {query && (
            <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
              <X className="w-4 h-4 text-netflix-gray hover:text-white" />
            </button>
          )}

          <div className="absolute inset-0 rounded-xl bg-netflix-red/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="mt-4 w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 sm:mt-0 px-6 py-2.5 bg-netflix-red hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-netflix-red/25 active:scale-95"
        >
          {isLoading ? 'Searching...' : 'Get Recommendations'}
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {isLoadingMovies ? (
            <div className="p-4 text-center text-netflix-gray">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Loading movies...
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {suggestions.map((movie, index) => (
                <li key={index} onClick={() => handleSuggestionClick(movie)} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors duration-150 flex items-center gap-3">
                  <Search className="w-4 h-4 text-netflix-gray flex-shrink-0" />
                  <span className="text-netflix-light text-sm">{movie}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="px-4 py-2 border-t border-white/5 text-xs text-netflix-gray flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Press Enter to search
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
