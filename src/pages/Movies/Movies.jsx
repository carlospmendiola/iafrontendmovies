// Movies page — search form backed by useMovies(), renders results as a grid of Card links
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMovies } from '../../hooks/useMovies'
import Card from '../../components/Card/Card'
import './Movies.scss'

const Movies = () => {
  const { movies, loading, error, search } = useMovies()
  const [title, setTitle] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSearched(true)
    search(title)
  }

  return (
    <main className="movies container">
      <form className="form movies__search" onSubmit={handleSubmit}>
        <div className="form__field">
          <label className="form__label" htmlFor="movies-search">Buscar película</label>
          <input
            className="form__input"
            id="movies-search"
            type="search"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Cargando…' : 'Buscar'}
        </button>
      </form>

      {error && <p className="movies__error" role="alert">{error}</p>}

      {searched && !loading && !error && movies.length === 0 && (
        <p className="movies__empty">No se encontraron películas</p>
      )}

      <div className="movies__grid">
        {movies.map((movie) => (
          <Link key={movie._id} to={`/movies/${movie._id}`}>
            <Card movie={movie} />
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Movies
