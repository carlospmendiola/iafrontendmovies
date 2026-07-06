// Admin page — CRUD for movies (create, list, delete); create/update use multipart/form-data for the poster upload
import { useState } from 'react'
import { useAdminMovies } from '../../hooks/useAdminMovies'
import './Admin.scss'

const Admin = () => {
  const { movies, loading, error, create, remove } = useAdminMovies()
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [poster, setPoster] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('year', year)
    if (poster) formData.append('poster', poster)
    create(formData)
    setTitle(''); setYear(''); setPoster(null)
  }

  return (
    <main className="admin container">
      <h1 className="admin__title">Administrar películas</h1>

      <form className="form admin__form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label className="form__label" htmlFor="admin-title">Título</label>
          <input
            className="form__input"
            id="admin-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="admin-year">Año</label>
          <input
            className="form__input"
            id="admin-year"
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
          />
        </div>

        <div className="form__field">
          <label className="form__label" htmlFor="admin-poster">Póster</label>
          <input
            className="form__input"
            id="admin-poster"
            type="file"
            accept="image/*"
            onChange={(event) => setPoster(event.target.files[0])}
          />
        </div>

        {error && <p className="form__error" role="alert">{error}</p>}

        <button className="btn btn--primary" type="submit" disabled={loading}>
          Crear
        </button>
      </form>

      <ul className="admin__list">
        {movies.map((movie) => (
          <li key={movie._id} className="admin__item">
            <span className="admin__item-title">{movie.title}</span>
            <button className="btn btn--danger" type="button" onClick={() => remove(movie._id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Admin
