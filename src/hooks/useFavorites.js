// useFavorites — manages the authenticated user's favorite movies.
// Receives no parameters. Returns { favorites, loading, error, add(movieId), remove(movieId) }.
// Use in the Favorites page to list, add and remove favorites.
import { useState, useEffect } from 'react'
import { get, post, del } from '../services/api'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchFavorites = async () => {
    setLoading(true); setError(null)
    try {
      const data = await get('/movies/favorites')
      setFavorites(data.favorites)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount
    fetchFavorites()
  }, [])

  const add = async (movieId) => {
    await post('/movies/favorites', { movieId })
    await fetchFavorites()
  }

  const remove = async (movieId) => {
    await del(`/movies/favorites/${movieId}`)
    await fetchFavorites()
  }

  return { favorites, loading, error, add, remove }
}
