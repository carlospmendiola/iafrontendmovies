import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Movies from './Movies'
import * as api from '../../services/api'

const renderMovies = () => render(
  <MemoryRouter><Movies /></MemoryRouter>
)

describe('Movies page', () => {
  it('renders a search input and button', () => {
    renderMovies()
    expect(screen.getByLabelText(/buscar/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument()
  })

  it('calls the search endpoint with the typed title on submit', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movies: [] })
    renderMovies()
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'Inception' } })
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/movies/search?title=Inception'))
  })

  it('renders a Card for each returned movie', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      ok: true,
      movies: [{ _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010 }],
    })
    renderMovies()
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'Inception' } })
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))
    expect(await screen.findByText('Inception')).toBeInTheDocument()
  })

  it('shows an error message when the search fails', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))
    renderMovies()
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'Inception' } })
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))
    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  it('shows an empty state message when there are no results', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movies: [] })
    renderMovies()
    fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'Inception' } })
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }))
    expect(await screen.findByText(/no se encontraron/i)).toBeInTheDocument()
  })
})
