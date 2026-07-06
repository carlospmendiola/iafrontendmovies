import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMovieDetail } from './useMovieDetail'
import * as api from '../services/api'

beforeEach(() => vi.restoreAllMocks())

describe('useMovieDetail', () => {
  it('exposes movie, loading and error with initial null/loading values', () => {
    vi.spyOn(api, 'get').mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useMovieDetail('1'))
    expect(result.current.movie).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('fetches the movie by id on mount and populates movie', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movie: { _id: '1', title: 'Inception' } })
    const { result } = renderHook(() => useMovieDetail('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(api.get).toHaveBeenCalledWith('/movies/1')
    expect(result.current.movie).toEqual({ _id: '1', title: 'Inception' })
  })

  it('sets error message on failure', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Not found'))
    const { result } = renderHook(() => useMovieDetail('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Not found')
  })
})
