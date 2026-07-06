// Favorites page — lists the authenticated user's favorite movies, backed by useFavorites()
import { useFavorites } from '../../hooks/useFavorites'
import Card from '../../components/Card/Card'
import './Favorites.scss'

const Favorites = () => {
  const { favorites, loading, error, remove } = useFavorites()

  if (loading) return <main className="favorites__status">Cargando…</main>
  if (error) return <main className="favorites__error" role="alert">{error}</main>

  return (
    <main className="favorites container">
      <h1 className="favorites__title">Mis favoritos</h1>

      {favorites.length === 0 ? (
        <p className="favorites__empty">No tienes películas favoritas todavía</p>
      ) : (
        <div className="favorites__grid">
          {favorites.map((movie) => (
            <div key={movie._id} className="favorites__item">
              <Card movie={movie} />
              <button className="btn btn--secondary" type="button" onClick={() => remove(movie._id)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Favorites
