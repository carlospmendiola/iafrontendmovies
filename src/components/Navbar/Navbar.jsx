// Navbar — top navigation bar; shows auth-aware links (login/logout, admin) and app navigation
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Navbar.scss'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link className="navbar__brand" to="/movies">iafrontendmovies</Link>

      <div className="navbar__links">
        {user ? (
          <>
            <Link className="navbar__link" to="/favorites">Favoritos</Link>
            {user.role === 'admin' && (
              <Link className="navbar__link" to="/admin">Admin</Link>
            )}
            <button className="navbar__link" type="button" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <Link className="navbar__link" to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
