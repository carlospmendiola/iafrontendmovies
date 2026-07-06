import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAdminMovies } from './useAdminMovies'
import * as api from '../services/api'

beforeEach(() => vi.restoreAllMocks())

describe('useAdminMovies', () => {
  it('fetches movies on mount', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception' }] })
    const { result } = renderHook(() => useAdminMovies())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(api.get).toHaveBeenCalledWith('/admin/movies')
    expect(result.current.movies).toHaveLength(1)
  })

  it('create() posts the form data and refreshes the list', async () => {
    const formData = new FormData()
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, movies: [] })
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception' }] })
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, msg: 'Created' })
    const { result } = renderHook(() => useAdminMovies())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.create(formData) })
    expect(api.post).toHaveBeenCalledWith('/admin/movies', formData)
    expect(result.current.movies).toHaveLength(1)
  })

  it('update() patches the form data and refreshes the list', async () => {
    const formData = new FormData()
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Old' }] })
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'New' }] })
    vi.spyOn(api, 'patch').mockResolvedValueOnce({ ok: true, msg: 'Updated' })
    const { result } = renderHook(() => useAdminMovies())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.update('1', formData) })
    expect(api.patch).toHaveBeenCalledWith('/admin/movies/1', formData)
    expect(result.current.movies[0].title).toBe('New')
  })

  it('remove() deletes the movie and refreshes the list', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception' }] })
      .mockResolvedValueOnce({ ok: true, movies: [] })
    vi.spyOn(api, 'del').mockResolvedValueOnce({ ok: true, msg: 'Removed' })
    const { result } = renderHook(() => useAdminMovies())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.remove('1') })
    expect(api.del).toHaveBeenCalledWith('/admin/movies/1')
    expect(result.current.movies).toHaveLength(0)
  })

  it('sets error message on fetch failure', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useAdminMovies())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
  })
})
