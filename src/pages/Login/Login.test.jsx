import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Login from './Login'
import * as api from '../../services/api'

const renderLogin = () => render(
  <MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>
)

describe('Login page', () => {
  it('renders email and password fields and a submit button', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('calls login() with email and password on submit', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, token: 'fake-token' })
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'a@a.com', password: '123456' }))
  })

  it('shows loading state while request is in progress', async () => {
    vi.spyOn(api, 'post').mockImplementation(() => new Promise(() => {}))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error message when login fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValueOnce(new Error('Credenciales incorrectas'))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument()
  })
})
