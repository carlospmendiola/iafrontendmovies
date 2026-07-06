# Catálogo de hooks

## useAuth
`src/hooks/useAuth.js`

Consume `AuthContext`. Debe usarse dentro de `AuthProvider`.

- **Recibe:** nada.
- **Devuelve:** `{ user, token, loading, error, login(email, password), logout(), signup(name, email, password) }`
- **Cuándo usarlo:** en cualquier componente que necesite leer el estado de sesión o disparar login/logout/registro.

## useMovies
`src/hooks/useMovies.js`

- **Recibe:** nada.
- **Devuelve:** `{ movies, loading, error, search(title) }`
- **Cuándo usarlo:** en la página Movies, para alimentar el buscador y el listado.

## useMovieDetail
`src/hooks/useMovieDetail.js`

- **Recibe:** `movieId` (string).
- **Devuelve:** `{ movie, loading, error }`
- **Cuándo usarlo:** en la página MovieDetail, pasando el parámetro de ruta `:id`. Vuelve a pedir los datos si `movieId` cambia.

## useFavorites
`src/hooks/useFavorites.js`

- **Recibe:** nada.
- **Devuelve:** `{ favorites, loading, error, add(movieId), remove(movieId) }`
- **Cuándo usarlo:** en la página Favorites, para listar, añadir y eliminar favoritos. `add`/`remove` refrescan la lista automáticamente tras completarse.

## useAdminMovies
`src/hooks/useAdminMovies.js`

- **Recibe:** nada.
- **Devuelve:** `{ movies, loading, error, create(formData), update(id, formData), remove(id) }`
- **Cuándo usarlo:** en la página Admin. `create`/`update` reciben un `FormData` (multipart, incluye el póster) y refrescan la lista automáticamente tras completarse.
