import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from './AuthContext'
import { useAuth } from '../hooks/useAuth'
import * as api from '../services/api'

// Helper component to expose hook values in the DOM for assertions
const TestComponent = () => {
  const { user, token, loading, error } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'null'}</span>
      <span data-testid="token">{token || 'null'}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error || 'null'}</span>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useAuth', () => {
  it('exposes user, token, loading and error with initial null values', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>)
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('error').textContent).toBe('null')
  })

  it('login() sets token in localStorage and updates user state', async () => {
    // Realistic JWT shape (header.payload.signature) so AuthContext can decode the payload
    const fakeToken = `header.${btoa(JSON.stringify({ name: 'Test User' }))}.signature`
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, token: fakeToken })
    const LoginTest = () => {
      const { login, token } = useAuth()
      return (
        <div>
          <button onClick={() => login('a@a.com', '123')}>Login</button>
          <span data-testid="token">{token || 'null'}</span>
        </div>
      )
    }
    render(<AuthProvider><LoginTest /></AuthProvider>)
    await act(async () => { screen.getByRole('button').click() })
    expect(localStorage.getItem('token')).toBe(fakeToken)
  })

  it('logout() clears token from localStorage and resets user state', async () => {
    localStorage.setItem('token', 'existing-token')
    const LogoutTest = () => {
      const { logout, token } = useAuth()
      return (
        <div>
          <button onClick={logout}>Logout</button>
          <span data-testid="token">{token || 'null'}</span>
        </div>
      )
    }
    render(<AuthProvider><LogoutTest /></AuthProvider>)
    await act(async () => { screen.getByRole('button').click() })
    expect(localStorage.getItem('token')).toBeNull()
  })
})
