import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Register from './Register'
import * as api from '../../services/api'

const renderRegister = () => render(
  <MemoryRouter><AuthProvider><Register /></AuthProvider></MemoryRouter>
)

describe('Register page', () => {
  it('renders name, email and password fields and a submit button', () => {
    renderRegister()
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('calls signup() with name, email and password on submit', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, token: 'header.eyJ9.sig' })
    renderRegister()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/signup', { name: 'Carlos', email: 'a@a.com', password: '123456' }))
  })

  it('shows loading state while request is in progress', async () => {
    vi.spyOn(api, 'post').mockImplementation(() => new Promise(() => {}))
    renderRegister()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    expect(await screen.findByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error message when signup fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValueOnce(new Error('El email ya está registrado'))
    renderRegister()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Carlos' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))
    expect(await screen.findByText(/el email ya está registrado/i)).toBeInTheDocument()
  })
})
