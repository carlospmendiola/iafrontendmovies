// AuthContext — provides authentication state and actions (login, logout, signup)
// to the entire component tree. Only one context for auth — all other state is local.
import { createContext, useState, useEffect } from 'react'
import { post } from '../services/api'

// eslint-disable-next-line react-refresh/only-export-components -- Context + Provider are intentionally co-located; useAuth lives in hooks/useAuth.js
export const AuthContext = createContext(null)

// Decodes the JWT payload; returns null when the token is missing or malformed
const decodeToken = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken]     = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  // Derived directly from token on every render — no separate state to keep in sync
  const user = decodeToken(token)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  // Syncs localStorage with React state: clears a corrupted/undecodable token.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate sync with an external system (localStorage), not derived render state
    if (token && !user) logout()
  }, [token, user])

  // Shared by login and signup — both just hit a different endpoint with a different payload
  const authenticate = async (endpoint, payload) => {
    setLoading(true); setError(null)
    try {
      const data = await post(endpoint, payload)
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = (email, password) => authenticate('/auth/login', { email, password })

  const signup = (name, email, password) => authenticate('/auth/signup', { name, email, password })

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
