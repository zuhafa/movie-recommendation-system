import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchMovies = async () => {
  try {
    const response = await api.get('/movies')
    return response.data
  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}

export const fetchRecommendations = async (movieName) => {
  try {
    const response = await api.get(`/recommend/${encodeURIComponent(movieName)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

export const fetchMovieDetail = async (movieName) => {
  try {
    const response = await api.get(`/movie/${encodeURIComponent(movieName)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie detail:', error)
    throw error
  }
}

export default api
