# iafrontendmovies

Frontend de una aplicación de películas: búsqueda, detalle, favoritos y un panel de administración para gestionar el catálogo. Consume la API REST documentada en [movie-app-api.yaml](https://raw.githubusercontent.com/carlospmendiola/Proyecto-Movie-App/develop/movie-app-api.yaml).

Ver [AGENTS.md](./AGENTS.md) para las convenciones del proyecto (stack, arquitectura, TDD, estilo de commits) y [plan-desarrollo.md](./plan-desarrollo.md) para el plan de desarrollo por fases.

## Stack

Vite 8 + React 19 (React Compiler) · React Router 7 · SASS (BEM, Mobile First) · Context API (auth) · Vitest + React Testing Library

## Requisitos

- Node.js y Yarn
- Backend en marcha (ver `VITE_API_URL` más abajo)

## Puesta en marcha

```bash
yarn install
cp .env.example .env   # y ajustar VITE_API_URL si hace falta
yarn dev
```

## Variables de entorno

| Variable       | Descripción                          |
| -------------- | ------------------------------------- |
| `VITE_API_URL` | URL base de la API (incluye `/api/v1`, ver el bloque `servers` del spec OpenAPI) |

## Scripts

| Comando               | Descripción                        |
| ---------------------- | ------------------------------------ |
| `yarn dev`             | Servidor de desarrollo               |
| `yarn build`           | Build de producción en `dist/`       |
| `yarn preview`         | Sirve el build de producción en local |
| `yarn lint`            | ESLint                                |
| `yarn test`            | Tests (Vitest)                        |
| `yarn test:coverage`   | Tests con reporte de cobertura        |

## Estructura

Ver la sección "Estructura de carpetas" en [AGENTS.md](./AGENTS.md) y el detalle de arquitectura en [docs/arquitectura.md](./docs/arquitectura.md).

## Documentación

- [docs/arquitectura.md](./docs/arquitectura.md) — decisiones de arquitectura
- [docs/componentes.md](./docs/componentes.md) — catálogo de componentes
- [docs/hooks.md](./docs/hooks.md) — catálogo de custom hooks
- [docs/api.md](./docs/api.md) — endpoints consumidos
- [docs/diseno.md](./docs/diseno.md) — sistema de diseño (colores, tipografía, espaciado, botones)
- [CHANGELOG.md](./CHANGELOG.md) — historial de cambios

## Despliegue

Configurado para Render como sitio estático vía [render.yaml](./render.yaml):

1. Conectar este repositorio en Render (New → Blueprint, detecta `render.yaml` automáticamente)
2. Build command: `yarn build` — Publish directory: `dist`
3. Variable de entorno `VITE_API_URL` ya viene definida en `render.yaml`; ajustar si el backend cambia de URL
