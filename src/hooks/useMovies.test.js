import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMovies } from './useMovies'
import * as api from '../services/api'

beforeEach(() => vi.restoreAllMocks())

describe('useMovies', () => {
  it('exposes movies, loading, error and search()', () => {
    const { result } = renderHook(() => useMovies())
    expect(result.current.movies).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.search).toBe('function')
  })

  it('sets loading to true while fetching', async () => {
    vi.spyOn(api, 'get').mockImplementation(() => new Promise(() => {}))
    const { result } = renderHook(() => useMovies())
    act(() => { result.current.search('Inception') })
    expect(result.current.loading).toBe(true)
  })

  it('populates movies array on success', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, movies: [{ _id: '1', title: 'Inception' }] })
    const { result } = renderHook(() => useMovies())
    await act(async () => { await result.current.search('Inception') })
    expect(result.current.movies).toHaveLength(1)
    expect(result.current.loading).toBe(false)
  })

  it('sets error message on failure', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useMovies())
    await act(async () => { await result.current.search('Inception') })
    expect(result.current.error).toBe('Network error')
  })
})
