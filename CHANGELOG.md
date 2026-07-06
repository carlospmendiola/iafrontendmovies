# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo, siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

## [0.3.1] - 2026-07-02

### Fixed
- Contraste insuficiente (3.84:1, por debajo del mínimo WCAG AA de 4.5:1) del texto en `$color-primary` sobre `$color-bg` en la marca y los enlaces del `Navbar`; ahora usan `$color-text`
- `MovieDetail` y `Favorites` no envolvían sus estados de carga/error en un `<main>`, dejando la página sin landmark semántico en esos casos
- La utilidad `.container` (definida en la Fase 2 con `max-width` por breakpoint) no se aplicaba en ninguna página, por lo que el contenido de `Movies`, `Favorites`, `Admin` y `MovieDetail` se estiraba sin límite en pantallas grandes; ahora se aplica en las cuatro
- El selector global `main { min-height: 100vh; ... }` en `_estructura.scss` se aplicaba a todos los `<main>` de página (cada página tiene el suyo), forzando altura completa de viewport también en `Movies`, `Favorites`, `Admin` y `MovieDetail` donde no correspondía; se elimina (Login/Register ya definen su propio `min-height: 100vh`)

## [0.3.0] - 2026-07-02

### Added
- Componente `Card` (póster, título, año) con clase BEM `card`
- Componente `Navbar`, sensible al estado de autenticación y al rol del usuario (enlace Admin solo para `role: admin`)
- Hook `useMovies` y página `Movies`: búsqueda de películas con estados de carga, error y "sin resultados"
- Hook `useMovieDetail` y página `MovieDetail`: detalle de película por `:id` de ruta
- Hook `useFavorites` y página `Favorites`: listar, añadir y quitar películas favoritas
- Hook `useAdminMovies` y página `Admin`: crear y eliminar películas (formulario `multipart/form-data` con subida de póster)
- Rutas `/movies/:id`, `/favorites` y `/admin` (protegida por rol `admin`) en `AppRouter`
- Documentación completa en `docs/` (arquitectura, catálogo de componentes, catálogo de hooks, endpoints de API, sistema de diseño)

### Changed
- `ProtectedRoute` ahora acepta una prop `role` opcional para restringir rutas por rol, además de por sesión activa

### Fixed
- Los mensajes de error en `Favorites` y `MovieDetail` no usaban el color de error del sistema de diseño (se detectó verificando en el navegador); ahora usan `$color-error` de forma consistente con `Login`, `Register` y `Movies`

## [0.2.0] - 2026-07-02

### Added
- Sistema de diseño SCSS completo (`src/styles/`): variables, reset, tipografía, mixins, estructura y elementos base (botones, formularios), con metodología BEM y enfoque Mobile First
- Wrapper de API (`src/services/api.js`) con soporte para JSON y `multipart/form-data`, y extracción de mensajes de error tanto en formato plano (`msg`) como en formato de validación de campos por endpoint (`errors.<campo>.msg`)
- `AuthContext` (`src/context/AuthContext.jsx`) y hook `useAuth` (`src/hooks/useAuth.js`) para gestión de sesión: login, registro, logout y restauración/validación de sesión a partir del token JWT en `localStorage`
- Páginas `Login` y `Register` con validación de formulario, estados de carga y error, y HTML semántico accesible
- `AppRouter` con rutas públicas (`/login`, `/register`) y ruta protegida (`/movies`) que redirige a `/login` si no hay sesión activa

### Changed
- `.env`: `VITE_API_URL` corregido a `https://proyecto-movie-app.onrender.com/api/v1`, verificado contra el spec OpenAPI del backend tras detectar que la URL de ejemplo del AGENTS.md no correspondía al backend real (devolvía 404)
- `AGENTS.md`: referencia de React Router actualizada de v6 a v7, para reflejar la versión realmente instalada

## [0.1.0] - 2026-07-02

### Added
- Configuración inicial del proyecto con Vite 8 + React 19 y React Compiler
- ESLint 10 con Flat Config, reglas de React Hooks y React Refresh
- Vitest + React Testing Library configurados para tests unitarios
- Estructura de carpetas completa definida en AGENTS.md (components, pages, hooks, context, services, routes, styles, utils)
- Documentación base en `docs/` (arquitectura, componentes, hooks, api, diseño)
- Variables de entorno `.env` y `.env.example` con `VITE_API_URL`
