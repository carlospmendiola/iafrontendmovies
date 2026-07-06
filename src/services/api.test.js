import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get, post, patch, del } from './api'

// Mock global fetch to avoid real HTTP calls in tests
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('api wrapper', () => {
  it('get() calls fetch with GET method and correct URL', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, data: [] }) })
    await get('/movies')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movies'),
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('post() calls fetch with POST method and JSON body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    await post('/auth/login', { email: 'a@a.com', password: '123' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('post() with FormData does NOT set Content-Type header', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    const formData = new FormData()
    formData.append('title', 'Test')
    await post('/admin/movies', formData)
    const callArgs = fetch.mock.calls[0][1]
    expect(callArgs.headers?.['Content-Type']).toBeUndefined()
  })

  it('patch() calls fetch with PATCH method and JSON body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    await patch('/admin/movies/1', { title: 'Updated' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/movies/1'),
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    )
  })

  it('del() calls fetch with DELETE method', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    await del('/movies/favorites/123')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movies/favorites/123'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('throws an error when response is not ok', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ msg: 'Unauthorized' }) })
    await expect(get('/movies')).rejects.toThrow('Unauthorized')
  })

  it('throws the field message when the backend returns express-validator style errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        ok: false,
        errors: { password: { type: 'field', msg: 'Invalid value', path: 'password' } },
      }),
    })
    await expect(post('/auth/signup', { password: 'x' })).rejects.toThrow('Invalid value')
  })
})
