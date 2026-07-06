// useMovieDetail — fetches a single movie's details by id.
// Receives movieId (string). Returns { movie, loading, error }.
// Use in the MovieDetail page, passing the :id route param.
import { useState, useEffect } from 'react'
import { get } from '../services/api'

export const useMovieDetail = (movieId) => {
  const [movie, setMovie]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data fetch on mount/id change, not derived render state
    setLoading(true); setError(null)
    get(`/movies/${movieId}`)
      .then((data) => { if (active) setMovie(data.movie) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [movieId])

  return { movie, loading, error }
}
