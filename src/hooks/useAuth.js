// useAuth — consumes AuthContext. Must be used inside AuthProvider.
// Receives no parameters. Returns { user, token, loading, error, login(), logout(), signup() }.
// Use in any component that needs to read auth state or trigger login/logout/signup.
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
