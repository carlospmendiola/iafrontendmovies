// MovieDetail page — shows full details for a single movie fetched by the :id route param
import { useParams } from 'react-router-dom'
import { useMovieDetail } from '../../hooks/useMovieDetail'
import './MovieDetail.scss'

const MovieDetail = () => {
  const { id } = useParams()
  const { movie, loading, error } = useMovieDetail(id)

  if (loading) return <main className="movie-detail__status">Cargando…</main>
  if (error) return <main className="movie-detail__error" role="alert">{error}</main>
  if (!movie) return null

  return (
    <main className="movie-detail container">
      <img className="movie-detail__poster" src={movie.poster} alt={movie.title} />
      <div className="movie-detail__info">
        <h1 className="movie-detail__title">{movie.title}</h1>
        <span className="movie-detail__year">{movie.year}</span>
        {movie.description && <p className="movie-detail__description">{movie.description}</p>}
      </div>
    </main>
  )
}

export default MovieDetail
