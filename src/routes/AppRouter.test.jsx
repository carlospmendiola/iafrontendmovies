import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './AppRouter'

// Mock pages to isolate routing logic
vi.mock('../pages/Login/Login', () => ({ default: () => <div>Login Page</div> }))
vi.mock('../pages/Movies/Movies', () => ({ default: () => <div>Movies Page</div> }))
vi.mock('../pages/Admin/Admin', () => ({ default: () => <div>Admin Page</div> }))
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../hooks/useAuth'

describe('AppRouter', () => {
  it('redirects unauthenticated user from /movies to /login', () => {
    useAuth.mockReturnValue({ token: null, user: null })
    render(<MemoryRouter initialEntries={['/movies']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders Movies page for authenticated user', () => {
    useAuth.mockReturnValue({ token: 'fake-token', user: { role: 'user' } })
    render(<MemoryRouter initialEntries={['/movies']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Movies Page')).toBeInTheDocument()
  })

  it('redirects non-admin authenticated user from /admin to /movies', () => {
    useAuth.mockReturnValue({ token: 'fake-token', user: { role: 'user' } })
    render(<MemoryRouter initialEntries={['/admin']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Movies Page')).toBeInTheDocument()
  })

  it('renders Admin page for admin user', () => {
    useAuth.mockReturnValue({ token: 'fake-token', user: { role: 'admin' } })
    render(<MemoryRouter initialEntries={['/admin']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Admin Page')).toBeInTheDocument()
  })
})
