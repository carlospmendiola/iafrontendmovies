// API wrapper — centralizes all HTTP calls to the backend REST API.
// Reads base URL from VITE_API_URL env variable.
// Automatically attaches JWT token from localStorage when available.
// Supports JSON and multipart/form-data (FormData) requests.

const BASE_URL = import.meta.env.VITE_API_URL

// Builds request headers — skips Content-Type for FormData to let browser set boundary
const buildHeaders = (body) => {
  const token = localStorage.getItem('token')
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  return headers
}

// Reads a human-readable message from either error shape the backend returns:
// a flat `msg` for business-logic errors, or express-validator's `errors.<field>.msg` for validation errors
const extractErrorMessage = (data) => {
  if (data.msg) return data.msg
  const firstFieldError = data.errors && Object.values(data.errors)[0]
  return firstFieldError?.msg || 'Request failed'
}

// Core request function — throws error with backend message if response is not ok
const request = async (method, endpoint, body) => {
  const options = {
    method,
    headers: buildHeaders(body),
  }
  if (body) options.body = body instanceof FormData ? body : JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(extractErrorMessage(data))
  return data
}

export const get  = (endpoint)        => request('GET',    endpoint)
export const post = (endpoint, body)  => request('POST',   endpoint, body)
export const patch = (endpoint, body) => request('PATCH',  endpoint, body)
export const del  = (endpoint)        => request('DELETE', endpoint)
