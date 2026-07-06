import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Admin from './Admin'
import * as api from '../../services/api'

const renderAdmin = () => render(<MemoryRouter><Admin /></MemoryRouter>)

describe('Admin page', () => {
  it('renders a form with title, year and poster fields', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movies: [] })
    renderAdmin()
    await waitFor(() => expect(api.get).toHaveBeenCalled())
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/año/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/póster/i)).toBeInTheDocument()
  })

  it('renders a list of existing movies with a delete button', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      ok: true,
      movies: [{ _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010 }],
    })
    renderAdmin()
    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument()
  })

  it('creates a movie on form submit', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, movies: [] })
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception' }] })
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, msg: 'Created' })
    renderAdmin()
    await waitFor(() => expect(api.get).toHaveBeenCalled())
    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Inception' } })
    fireEvent.change(screen.getByLabelText(/año/i), { target: { value: '2010' } })
    fireEvent.click(screen.getByRole('button', { name: /crear/i }))
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/admin/movies', expect.any(FormData)))
  })

  it('deletes a movie when clicking the delete button', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010 }] })
      .mockResolvedValueOnce({ ok: true, movies: [] })
    vi.spyOn(api, 'del').mockResolvedValueOnce({ ok: true, msg: 'Removed' })
    renderAdmin()
    await screen.findByText('Inception')
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
    await waitFor(() => expect(api.del).toHaveBeenCalledWith('/admin/movies/1'))
  })
})
