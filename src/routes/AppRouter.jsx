// AppRouter — defines public and protected routes based on authentication state
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Movies from '../pages/Movies/Movies'
import MovieDetail from '../pages/MovieDetail/MovieDetail'
import Favorites from '../pages/Favorites/Favorites'
import Admin from '../pages/Admin/Admin'

// Redirects to /login when there is no authenticated user, or to /movies when the user's role doesn't match
const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/movies" replace />
  return children
}

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/movies" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/movies"
      element={
        <ProtectedRoute>
          <Movies />
        </ProtectedRoute>
      }
    />
    <Route
      path="/movies/:id"
      element={
        <ProtectedRoute>
          <MovieDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/favorites"
      element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <Admin />
        </ProtectedRoute>
      }
    />
  </Routes>
)

export default AppRouter
