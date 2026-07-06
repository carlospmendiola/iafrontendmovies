import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../../hooks/useAuth'

vi.mock('../../hooks/useAuth')

describe('Navbar', () => {
  it('shows login link when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument()
  })

  it('shows logout button when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { name: 'Carlos' }, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /salir/i })).toBeInTheDocument()
  })

  it('shows admin link when user has admin role', () => {
    useAuth.mockReturnValue({ user: { name: 'Admin', role: 'admin' }, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument()
  })
})
