import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFavorites } from './useFavorites'
import * as api from '../services/api'

beforeEach(() => vi.restoreAllMocks())

describe('useFavorites', () => {
  it('fetches favorites on mount', async () => {
    vi.spyOn(api, 'get').mockResolvedValueOnce({ ok: true, favorites: [{ _id: '1', title: 'Inception' }] })
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(api.get).toHaveBeenCalledWith('/movies/favorites')
    expect(result.current.favorites).toHaveLength(1)
  })

  it('add() posts the movieId and refreshes the list', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, favorites: [] })
      .mockResolvedValueOnce({ ok: true, favorites: [{ _id: '1', title: 'Inception' }] })
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, msg: 'Added' })
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.add('1') })
    expect(api.post).toHaveBeenCalledWith('/movies/favorites', { movieId: '1' })
    expect(result.current.favorites).toHaveLength(1)
  })

  it('remove() deletes the favorite and refreshes the list', async () => {
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ ok: true, favorites: [{ _id: '1', title: 'Inception' }] })
      .mockResolvedValueOnce({ ok: true, favorites: [] })
    vi.spyOn(api, 'del').mockResolvedValueOnce({ ok: true, msg: 'Removed' })
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.remove('1') })
    expect(api.del).toHaveBeenCalledWith('/movies/favorites/1')
    expect(result.current.favorites).toHaveLength(0)
  })

  it('sets error message on fetch failure', async () => {
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
  })
})
