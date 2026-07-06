import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MovieDetail from './MovieDetail'
import * as api from '../../services/api'

const renderMovieDetail = (id = '1') => render(
  <MemoryRouter initialEntries={[`/movies/${id}`]}>
    <Routes>
      <Route path="/movies/:id" element={<MovieDetail />} />
    </Routes>
  </MemoryRouter>
)

describe('MovieDetail page', () => {
  it('shows a loading state while fetching', () => {
    vi.spyOn(api, 'get').mockImplementation(() => new Promise(() => {}))
    renderMovieDetail()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renders the movie title, poster and description on success', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({
      ok: true,
      movie: { _id: '1', title: 'Inception', poster: 'p.jpg', year: 2010, description: 'A mind-bending thriller' },
    })
    renderMovieDetail()
    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /inception/i })).toBeInTheDocument()
    expect(screen.getByText('A mind-bending thriller')).toBeInTheDocument()
  })

  it('shows an error message when the fetch fails', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Not found'))
    renderMovieDetail()
    expect(await screen.findByText(/not found/i)).toBeInTheDocument()
  })
})
