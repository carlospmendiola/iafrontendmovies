import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Favorites from './Favorites'
import * as api from '../../services/api'

const renderFavorites = () => render(<MemoryRouter><Favorites /></MemoryRouter>)

describe('Favorites page', () => {
  it('shows an empty state message when there are no favorites', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, favorites: [] })
    renderFavorites()
    expect(await screen.findByText(/no tienes/i)).toBeInTheDocument()
  })

  it('renders a Card for each favorite movie', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      ok: true,
      favorites: [{ _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010 }],
    })
    renderFavorites()
    expect(await screen.findByText('Inception')).toBeInTheDocument()
  })

  it('removes a favorite when clicking the remove button', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, favorites: [{ _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010 }] })
      .mockResolvedValueOnce({ ok: true, favorites: [] })
    vi.spyOn(api, 'del').mockResolvedValueOnce({ ok: true, msg: 'Removed' })
    renderFavorites()
    await screen.findByText('Inception')
    fireEvent.click(screen.getByRole('button', { name: /quitar/i }))
    await waitFor(() => expect(api.del).toHaveBeenCalledWith('/movies/favorites/1'))
  })

  it('shows an error message when fetching fails', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))
    renderFavorites()
    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })
})
