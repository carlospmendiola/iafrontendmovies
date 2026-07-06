# Arquitectura

## Capas

- **`services/api.js`** — único punto de contacto con el backend (fetch nativo). Adjunta el JWT automáticamente y normaliza los errores del backend (ver `docs/api.md`).
- **`context/AuthContext.jsx`** — único contexto global de la app, gestiona sesión (token, usuario derivado del JWT, login/signup/logout).
- **`hooks/`** — un hook por caso de uso de datos (`useAuth`, `useMovies`, `useMovieDetail`, `useFavorites`, `useAdminMovies`). Cada uno encapsula loading/error/success de su operación.
- **`components/`** — piezas de UI reutilizables sin lógica de negocio (`Card`, `Navbar`).
- **`pages/`** — vistas completas, componen hooks + componentes.
- **`routes/AppRouter.jsx`** — rutas públicas, protegidas por sesión y protegidas por rol (`admin`).

## Decisiones relevantes

- **`useAuth` vive en `hooks/useAuth.js`, separado de `AuthContext.jsx`.** El código de ejemplo inicial los co-ubicaba, pero eso mezcla un componente (`AuthProvider`) y un hook en el mismo archivo, lo que rompe el Fast Refresh de Vite (regla ESLint `react-refresh/only-export-components`) y no coincide con el catálogo de hooks de este documento.
- **`user` se deriva de `token` en cada render** (`decodeToken(token)`), en vez de guardarse como estado aparte sincronizado por un `useEffect`. Evita una cascada de renders innecesaria y sigue la recomendación de React de no usar efectos para derivar estado.
- **`api.js` entiende dos formatos de error del backend**: `{ msg }` para errores de negocio y `{ errors: { campo: { msg } } }` (express-validator) para errores de validación de formularios. Sin esto, los errores de validación se mostraban como "Request failed" genérico.
- **Rutas protegidas por rol**: `ProtectedRoute` acepta una prop opcional `role`; si el usuario autenticado no tiene ese rol, se le redirige a `/movies` en vez de a `/login`.
