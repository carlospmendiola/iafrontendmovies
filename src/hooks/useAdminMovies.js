// useAdminMovies — CRUD for movies in the admin panel.
// Receives no parameters. Returns { movies, loading, error, create(formData), update(id, formData), remove(id) }.
// create/update take a FormData instance (multipart/form-data, includes the poster file).
// Use in the Admin page to list, create, update and delete movies.
import { useState, useEffect } from 'react'
import { get, post, patch, del } from '../services/api'

export const useAdminMovies = () => {
  const [movies, setMovies]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchMovies = async () => {
    setLoading(true); setError(null)
    try {
      const data = await get('/admin/movies')
      setMovies(data.movies)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount
    fetchMovies()
  }, [])

  const create = async (formData) => {
    await post('/admin/movies', formData)
    await fetchMovies()
  }

  const update = async (id, formData) => {
    await patch(`/admin/movies/${id}`, formData)
    await fetchMovies()
  }

  const remove = async (id) => {
    await del(`/admin/movies/${id}`)
    await fetchMovies()
  }

  return { movies, loading, error, create, update, remove }
}
