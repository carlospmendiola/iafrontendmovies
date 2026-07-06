// useMovies — searches movies by title.
// Receives no parameters. Returns { movies, loading, error, search(title) }.
// Use in the Movies page to back the search input/listing.
import { useState } from 'react'
import { get } from '../services/api'

export const useMovies = () => {
  const [movies, setMovies]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const search = async (title) => {
    setLoading(true); setError(null)
    try {
      const data = await get(`/movies/search?title=${encodeURIComponent(title)}`)
      setMovies(data.movies)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { movies, loading, error, search }
}
