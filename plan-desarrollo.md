# Plan de desarrollo — Frontend Movie App

Cada fase debe estar completada, probada y aprobada antes de continuar con la siguiente.
No se avanza sin el visto bueno explícito del desarrollador.

---

## FASE 1 — Configuración del proyecto

**Objetivo:** Proyecto arrancando con la estructura correcta, ESLint configurado y sin errores.
**Sin TDD en esta fase.**

---

### 1.1 Inicializar el proyecto

```bash
yarn create vite iafrontendmovies --template react
cd iafrontendmovies
```

Verificar que `package.json` contiene `"react": "^19.0.0"` y `"vite": "^6.0.0"`.

---

### 1.2 Instalar dependencias base

```bash
# Dependencias de producción
yarn add react-router-dom sass

# Dependencias de desarrollo
yarn add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

No instalar ninguna otra dependencia sin aprobación previa.

---

### 1.3 Configurar Vite

Editar `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using React plugin with Babel for React Compiler support
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

Crear `src/test/setup.js`:

```js
// Global test setup: extends Jest matchers with Testing Library assertions
import '@testing-library/jest-dom'
```

---

### 1.4 Configurar ESLint

Verificar que existe `eslint.config.js` con Flat Config. Si no existe, crearlo:

```js
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

// Flat config for ESLint 10 — no .eslintrc files
export default [
  js.configs.recommended,
  {
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },
]
```

---

### 1.5 Añadir scripts a `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src"
}
```

---

### 1.6 Crear la estructura de carpetas completa

Crear manualmente todos los directorios y archivos vacíos (con comentario de cabecera):

```
src/
├── test/
│   └── setup.js
├── styles/
│   ├── style.scss
│   ├── _variables.scss
│   ├── _reset.scss
│   ├── _fonts.scss
│   ├── _mixins.scss
│   ├── _estructura.scss
│   └── _elements.scss
├── assets/
├── context/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── hooks/
├── components/
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.scss
│   └── Navbar/
│       ├── Navbar.jsx
│       └── Navbar.scss
├── pages/
│   ├── Login/
│   │   ├── Login.jsx
│   │   └── Login.scss
│   ├── Register/
│   │   ├── Register.jsx
│   │   └── Register.scss
│   ├── Movies/
│   │   ├── Movies.jsx
│   │   └── Movies.scss
│   ├── MovieDetail/
│   │   ├── MovieDetail.jsx
│   │   └── MovieDetail.scss
│   ├── Favorites/
│   │   ├── Favorites.jsx
│   │   └── Favorites.scss
│   └── Admin/
│       ├── Admin.jsx
│       └── Admin.scss
├── routes/
│   └── AppRouter.jsx
├── utils/
├── main.jsx
└── App.jsx
```

También en la raíz del proyecto:

```
docs/
├── arquitectura.md
├── componentes.md
├── hooks.md
├── api.md
└── diseno.md
CHANGELOG.md
.env
.env.example
```

---

### 1.7 Crear `.env` y `.env.example`

`.env` (no subir a GitHub):
```
VITE_API_URL=http://localhost:5000
```

`.env.example` (sí subir a GitHub):
```
# Base URL of the REST API backend
VITE_API_URL=https://your-backend.onrender.com
```

---

### 1.8 Crear `CHANGELOG.md` inicial

```markdown
# Changelog

## [0.1.0] - YYYY-MM-DD

### Added
- Initial project setup with Vite + React 19
- ESLint flat config
- Base folder structure defined in AGENTS.md
- Vitest + React Testing Library configured
```

---

### ✅ Criterio de salida — Fase 1

- `yarn dev` arranca sin errores en `http://localhost:5173`
- `yarn test` ejecuta sin errores (sin tests aún, debe mostrar "no tests found")
- `yarn lint` sin errores
- Estructura de carpetas correcta y completa
- `.env` y `.env.example` creados
- `CHANGELOG.md` con entrada inicial

**Esperar aprobación antes de continuar.**

---

## FASE 2 — Sistema de diseño y estilos globales

**Objetivo:** Todos los parciales SCSS creados, compilando y documentados.
**Sin TDD en esta fase (los estilos no se testean con Vitest/RTL).**

---

### 2.1 `_variables.scss`

Definir todos los tokens de diseño. Estructura obligatoria:

```scss
// ─── Typography ──────────────────────────────────────────────────────────────
$font-primary: 'Inter', sans-serif;      // Main UI font
$font-secondary: 'Merriweather', serif;  // Headings and titles

// ─── Font sizes ──────────────────────────────────────────────────────────────
$txt-xl:    2.5rem;
$txt-lg:    1.8rem;
$txt-md:    1.25rem;
$txt-base:  1rem;
$txt-sm:    0.875rem;
$txt-xs:    0.75rem;

// ─── Font weights ────────────────────────────────────────────────────────────
$fw-bold:     700;
$fw-semibold: 600;
$fw-regular:  400;
$fw-light:    300;

// ─── Colors ──────────────────────────────────────────────────────────────────
$color-primary:       #E50914;   // Netflix-inspired red — main actions
$color-primary-dark:  #B20710;   // Hover state for primary
$color-secondary:     #F5F5F1;   // Off-white — card backgrounds
$color-bg:            #141414;   // Dark background
$color-surface:       #1F1F1F;   // Cards and panels
$color-text:          #FFFFFF;   // Main text on dark background
$color-text-muted:    #A3A3A3;   // Secondary text
$color-error:         #CF6679;   // Error states
$color-success:       #4CAF50;   // Success states
$color-border:        #2C2C2C;   // Borders and dividers

// ─── Spacing ─────────────────────────────────────────────────────────────────
$sp-4:   4px;
$sp-8:   8px;
$sp-12:  12px;
$sp-16:  16px;
$sp-24:  24px;
$sp-32:  32px;
$sp-48:  48px;
$sp-64:  64px;

// ─── Border radius ───────────────────────────────────────────────────────────
$radius-sm:   4px;
$radius-md:   8px;
$radius-lg:   16px;
$radius-full: 9999px;

// ─── Breakpoints ─────────────────────────────────────────────────────────────
$bp-768:  768px;
$bp-990:  990px;
$bp-1200: 1200px;

// ─── Transitions ─────────────────────────────────────────────────────────────
$transition: all 0.2s ease;
```

---

### 2.2 `_reset.scss`

```scss
// CSS reset — removes browser default styles for consistency across browsers
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { font-size: 100%; scroll-behavior: smooth; }

body {
  font-family: variables.$font-primary;
  background-color: variables.$color-bg;
  color: variables.$color-text;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, video { max-width: 100%; display: block; }

button { cursor: pointer; border: none; background: none; font-family: inherit; }

a { color: inherit; text-decoration: none; }

ul, ol { list-style: none; }

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}
```

---

### 2.3 `_fonts.scss`

```scss
// Global typographic styles for HTML elements
@use './variables';

h1 { font-size: variables.$txt-xl; font-weight: variables.$fw-bold; line-height: 1.2; }
h2 { font-size: variables.$txt-lg; font-weight: variables.$fw-bold; line-height: 1.3; }
h3 { font-size: variables.$txt-md; font-weight: variables.$fw-semibold; }
h4, h5, h6 { font-size: variables.$txt-base; font-weight: variables.$fw-semibold; }

p {
  font-size: variables.$txt-base;
  color: variables.$color-text-muted;
  line-height: 1.6;
  margin-bottom: variables.$sp-8;
}
```

---

### 2.4 `_mixins.scss`

```scss
// Reusable utility mixins — import only in files that need them

// Flex shortcuts
@mixin flex($direction: row, $justify: flex-start, $align: stretch, $wrap: nowrap) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $wrap;
}

@mixin flex-center { display: flex; justify-content: center; align-items: center; }
@mixin flex-between { display: flex; justify-content: space-between; align-items: center; }

// Responsive breakpoints — always mobile first
@mixin bp-768 { @media screen and (min-width: 768px) { @content; } }
@mixin bp-990 { @media screen and (min-width: 990px) { @content; } }
@mixin bp-1200 { @media screen and (min-width: 1200px) { @content; } }

// Typography helpers
@mixin truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@mixin visually-hidden {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

---

### 2.5 `_estructura.scss`

```scss
// Global layout — main structure, header, footer and container utilities
@use './variables';
@use './mixins';

main {
  @include mixins.flex(column);
  min-height: 100vh;
}

.container {
  width: 100%;
  padding: 0 variables.$sp-16;

  @include mixins.bp-768 { max-width: 720px; margin: 0 auto; }
  @include mixins.bp-990 { max-width: 960px; }
  @include mixins.bp-1200 { max-width: 1200px; }
}

footer {
  margin-top: auto;
  padding: variables.$sp-24 0;
  text-align: center;
  border-top: 1px solid variables.$color-border;
  color: variables.$color-text-muted;
  font-size: variables.$txt-sm;
}
```

---

### 2.6 `_elements.scss`

Botones con variantes BEM:

```scss
// Reusable UI elements — buttons and form inputs
@use './variables';
@use './mixins';

// ─── Buttons ─────────────────────────────────────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: variables.$sp-8;
  padding: variables.$sp-8 variables.$sp-24;
  border-radius: variables.$radius-md;
  font-size: variables.$txt-sm;
  font-weight: variables.$fw-semibold;
  font-family: variables.$font-primary;
  transition: variables.$transition;
  cursor: pointer;
  border: 2px solid transparent;

  &--primary {
    background-color: variables.$color-primary;
    color: variables.$color-text;
    &:hover { background-color: variables.$color-primary-dark; }
  }

  &--secondary {
    background-color: transparent;
    color: variables.$color-text;
    border-color: variables.$color-border;
    &:hover { border-color: variables.$color-text; }
  }

  &--danger {
    background-color: variables.$color-error;
    color: variables.$color-text;
    &:hover { opacity: 0.85; }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}

// ─── Form inputs ──────────────────────────────────────────────────────────────
.form {
  @include mixins.flex(column, flex-start, stretch);
  gap: variables.$sp-16;

  &__field {
    @include mixins.flex(column, flex-start, stretch);
    gap: variables.$sp-8;
  }

  &__label {
    font-size: variables.$txt-sm;
    font-weight: variables.$fw-semibold;
    color: variables.$color-text;
  }

  &__input {
    padding: variables.$sp-12 variables.$sp-16;
    background-color: variables.$color-surface;
    border: 1px solid variables.$color-border;
    border-radius: variables.$radius-md;
    color: variables.$color-text;
    font-size: variables.$txt-base;
    transition: variables.$transition;

    &:focus {
      outline: none;
      border-color: variables.$color-primary;
    }

    &--error { border-color: variables.$color-error; }
  }

  &__error {
    font-size: variables.$txt-xs;
    color: variables.$color-error;
  }
}
```

---

### 2.7 `style.scss` — punto de entrada

```scss
// Global stylesheet entry point — import order matters
@use 'variables';
@use 'reset';
@use 'fonts';
@use 'mixins';
@use 'estructura';
@use 'elements';
```

Importar `style.scss` en `main.jsx`:

```jsx
import './styles/style.scss'
```

---

### ✅ Criterio de salida — Fase 2

- `yarn dev` compila sin errores de SCSS
- Todos los parciales tienen comentarios en inglés
- No hay valores de color, spacing ni tipografía hardcodeados fuera de `_variables.scss`
- `style.scss` importa todos los parciales en el orden correcto

**Esperar aprobación antes de continuar.**

---

## FASE 3 — Autenticación (TDD estricto)

**Objetivo:** Login, registro y rutas protegidas funcionando con tests en verde.
**Ciclo obligatorio en cada subtarea: Red → Green → Refactor → `yarn test`**

---

### 3.1 Wrapper API (`src/services/api.js`)

**RED — Crear el test primero**

Crear `src/services/api.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { get, post, patch, del } from './api'

// Mock global fetch to avoid real HTTP calls in tests
beforeEach(() => {
  global.fetch = vi.fn()
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
})
```

Ejecutar `yarn test` → debe fallar (RED).

**GREEN — Implementar `api.js`**

```js
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

// Core request function — throws error with backend message if response is not ok
const request = async (method, endpoint, body) => {
  const options = {
    method,
    headers: buildHeaders(body),
  }
  if (body) options.body = body instanceof FormData ? body : JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.msg || 'Request failed')
  return data
}

export const get  = (endpoint)        => request('GET',    endpoint)
export const post = (endpoint, body)  => request('POST',   endpoint, body)
export const patch = (endpoint, body) => request('PATCH',  endpoint, body)
export const del  = (endpoint)        => request('DELETE', endpoint)
```

Ejecutar `yarn test` → debe pasar (GREEN).

**REFACTOR:** Verificar que no hay duplicación. Aplicar KISS. Ejecutar `yarn test` de nuevo.

---

### 3.2 AuthContext y hook `useAuth`

**RED — Crear el test primero**

Crear `src/context/AuthContext.test.jsx`:

```jsx
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import * as api from '../services/api'

// Helper component to expose hook values in the DOM for assertions
const TestComponent = () => {
  const { user, token, loading, error } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'null'}</span>
      <span data-testid="token">{token || 'null'}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="error">{error || 'null'}</span>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useAuth', () => {
  it('exposes user, token, loading and error with initial null values', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>)
    expect(screen.getByTestId('user').textContent).toBe('null')
    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('error').textContent).toBe('null')
  })

  it('login() sets token in localStorage and updates user state', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, token: 'fake-token' })
    const LoginTest = () => {
      const { login, token } = useAuth()
      return (
        <div>
          <button onClick={() => login('a@a.com', '123')}>Login</button>
          <span data-testid="token">{token || 'null'}</span>
        </div>
      )
    }
    render(<AuthProvider><LoginTest /></AuthProvider>)
    await act(async () => { screen.getByRole('button').click() })
    expect(localStorage.getItem('token')).toBe('fake-token')
  })

  it('logout() clears token from localStorage and resets user state', async () => {
    localStorage.setItem('token', 'existing-token')
    const LogoutTest = () => {
      const { logout, token } = useAuth()
      return (
        <div>
          <button onClick={logout}>Logout</button>
          <span data-testid="token">{token || 'null'}</span>
        </div>
      )
    }
    render(<AuthProvider><LogoutTest /></AuthProvider>)
    await act(async () => { screen.getByRole('button').click() })
    expect(localStorage.getItem('token')).toBeNull()
  })
})
```

Ejecutar `yarn test` → debe fallar (RED).

**GREEN — Implementar `AuthContext.jsx`**

```jsx
// AuthContext — provides authentication state and actions (login, logout, signup)
// to the entire component tree. Only one context for auth — all other state is local.
import { createContext, useContext, useState, useEffect } from 'react'
import { post } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  // Decode token on mount to restore user session
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch {
        logout()
      }
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true); setError(null)
    try {
      const data = await post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name, email, password) => {
    setLoading(true); setError(null)
    try {
      const data = await post('/auth/signup', { name, email, password })
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth — consumes AuthContext. Must be used inside AuthProvider.
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
```

Ejecutar `yarn test` → debe pasar (GREEN). **REFACTOR** y ejecutar `yarn test` de nuevo.

---

### 3.3 Páginas Login y Register

**RED — Test de Login**

Crear `src/pages/Login/Login.test.jsx`:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Login from './Login'
import * as api from '../../services/api'

const renderLogin = () => render(
  <MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>
)

describe('Login page', () => {
  it('renders email and password fields and a submit button', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('calls login() with email and password on submit', async () => {
    vi.spyOn(api, 'post').mockResolvedValueOnce({ ok: true, token: 'fake-token' })
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'a@a.com', password: '123456' }))
  })

  it('shows loading state while request is in progress', async () => {
    vi.spyOn(api, 'post').mockImplementation(() => new Promise(() => {}))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/cargando/i)).toBeInTheDocument()
  })

  it('shows error message when login fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValueOnce(new Error('Credenciales incorrectas'))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@a.com' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument()
  })
})
```

Ejecutar `yarn test` → debe fallar (RED). **GREEN:** Implementar `Login.jsx` con HTML semántico, clases BEM y `Login.scss`. **REFACTOR** y ejecutar `yarn test`.

Repetir el mismo ciclo para `Register.jsx`.

---

### 3.4 Rutas protegidas (`AppRouter.jsx`)

**RED — Test de rutas**

Crear `src/routes/AppRouter.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './AppRouter'

// Mock pages to isolate routing logic
vi.mock('../pages/Login/Login', () => ({ default: () => <div>Login Page</div> }))
vi.mock('../pages/Movies/Movies', () => ({ default: () => <div>Movies Page</div> }))
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => children,
}))

import { useAuth } from '../context/AuthContext'

describe('AppRouter', () => {
  it('redirects unauthenticated user from /movies to /login', () => {
    useAuth.mockReturnValue({ token: null, user: null })
    render(<MemoryRouter initialEntries={['/movies']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders Movies page for authenticated user', () => {
    useAuth.mockReturnValue({ token: 'fake-token', user: { role: 'user' } })
    render(<MemoryRouter initialEntries={['/movies']}><AppRouter /></MemoryRouter>)
    expect(screen.getByText('Movies Page')).toBeInTheDocument()
  })
})
```

Ejecutar `yarn test` → debe fallar (RED). **GREEN:** Implementar `AppRouter.jsx`. **REFACTOR** y ejecutar `yarn test`.

---

### ✅ Criterio de salida — Fase 3

- `yarn test` en verde con todos los tests de esta fase
- Cobertura ≥ 80% en `api.js`, `AuthContext.jsx`, `Login.jsx`, `Register.jsx`, `AppRouter.jsx`
- Login y registro funcionan en el navegador
- Rutas protegidas redirigen correctamente
- `CHANGELOG.md` actualizado con entrada `[0.2.0]`

**Esperar aprobación antes de continuar.**

---

## FASE 4 — Componentes y páginas (TDD estricto)

**Objetivo:** Todos los componentes y páginas implementados con tests en verde.
**Orden obligatorio de desarrollo por dependencias.**

---

### 4.1 Componente Card

**RED:** Crear `src/components/Card/Card.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from './Card'

const mockMovie = { _id: '1', title: 'Inception', poster: 'poster.jpg', year: 2010 }

describe('Card', () => {
  it('renders movie title', () => {
    render(<Card movie={mockMovie} />)
    expect(screen.getByText('Inception')).toBeInTheDocument()
  })

  it('renders movie poster with alt text', () => {
    render(<Card movie={mockMovie} />)
    expect(screen.getByRole('img', { name: /inception/i })).toBeInTheDocument()
  })

  it('renders with BEM block class "card"', () => {
    const { container } = render(<Card movie={mockMovie} />)
    expect(container.firstChild).toHaveClass('card')
  })
})
```

Ejecutar `yarn test` → RED. **GREEN:** Implementar `Card.jsx` y `Card.scss`. **REFACTOR.**

---

### 4.2 Componente Navbar

**RED:** Crear `src/components/Navbar/Navbar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext')

describe('Navbar', () => {
  it('shows login link when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /entrar/i })).toBeInTheDocument()
  })

  it('shows logout button when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { name: 'Carlos' }, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /salir/i })).toBeInTheDocument()
  })

  it('shows admin link when user has admin role', () => {
    useAuth.mockReturnValue({ user: { name: 'Admin', role: 'admin' }, logout: vi.fn() })
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument()
  })
})
```

Ejecutar `yarn test` → RED. **GREEN:** Implementar `Navbar.jsx` y `Navbar.scss`. **REFACTOR.**

---

### 4.3 Hook `useMovies` + Página Movies

**RED:** Crear `src/hooks/useMovies.test.js`:

```js
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
```

Ejecutar `yarn test` → RED. **GREEN:** Implementar `useMovies.js` y `Movies.jsx`. **REFACTOR.**

Repetir el mismo ciclo para:
- **4.4** `useMovieDetail` + `MovieDetail.jsx`
- **4.5** `useFavorites` + `Favorites.jsx`
- **4.6** `useAdminMovies` + `Admin.jsx`

---

### ✅ Criterio de salida — Fase 4

- `yarn test` en verde con todos los tests
- Cobertura global ≥ 80%
- Toda la app es navegable en el navegador
- Todos los componentes usan HTML semántico y clases BEM
- `CHANGELOG.md` actualizado con entrada `[0.3.0]`

**Esperar aprobación antes de continuar.**

---

## FASE 5 — Revisión y despliegue

**Objetivo:** App lista para producción.

---

### 5.1 Verificación de tests y cobertura

```bash
yarn test
yarn test:coverage
```

Corregir cualquier test en rojo. Verificar que la cobertura global es ≥ 80%.

---

### 5.2 Revisión de accesibilidad

Comprobar manualmente en el navegador:
- Navegación completa con teclado (Tab, Enter, Escape)
- Todos los `<img>` tienen `alt` descriptivo
- Todos los `<input>` tienen `<label>` asociado
- Contraste de texto cumple WCAG AA (ratio mínimo 4.5:1 para texto normal)
- No hay `<div>` o `<span>` donde corresponda un elemento semántico

---

### 5.3 Revisión de responsive

Comprobar en el navegador en los 4 breakpoints:
- Mobile (< 768px)
- Tablet (768px)
- Desktop medio (990px)
- Desktop grande (1200px)

---

### 5.4 Despliegue en Render

1. Configurar variable de entorno `VITE_API_URL` en el panel de Render con la URL del backend
2. Build command: `yarn build`
3. Publish directory: `dist`
4. Verificar que la app funciona correctamente en la URL de producción

---

### 5.5 Actualizar `CHANGELOG.md`

```markdown
## [1.0.0] - YYYY-MM-DD

### Added
- Full production deployment on Render
- Accessibility review passed (WCAG AA)
- Responsive layout verified across all breakpoints
```

---

### ✅ Criterio de salida — Fase 5

- `yarn test` en verde
- Cobertura global ≥ 80%
- App desplegada y funcionando en Render
- `CHANGELOG.md` actualizado con `[1.0.0]`

**Proyecto completado.**
