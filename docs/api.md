# Endpoints consumidos

Todas las rutas se construyen como `${VITE_API_URL}${endpoint}`. Ver spec completo en
[movie-app-api.yaml](https://raw.githubusercontent.com/carlospmendiola/Proyecto-Movie-App/develop/movie-app-api.yaml).

## Auth (público)

| Método | Endpoint       | Body                        | Respuesta            | Usado en           |
| ------ | -------------- | ---------------------------- | --------------------- | ------------------- |
| POST   | `/auth/login`  | `{ email, password }`        | `{ ok, token }`        | `AuthContext.login`  |
| POST   | `/auth/signup` | `{ name, email, password }`  | `{ ok, msg, token }`   | `AuthContext.signup` |

## Movies (usuario autenticado)

| Método | Endpoint                | Parámetros      | Respuesta             | Usado en                  |
| ------ | ------------------------ | --------------- | ----------------------| --------------------------- |
| GET    | `/movies/search?title=`  | `title` (query) | `{ ok, movies[] }`     | `useMovies.search`          |
| GET    | `/movies/:id`             | `id` (path)     | `{ ok, movie }`        | `useMovieDetail`             |
| GET    | `/movies/favorites`       | —                | `{ ok, favorites[] }`  | `useFavorites`               |
| POST   | `/movies/favorites`       | `{ movieId }`    | `{ ok, msg }`          | `useFavorites.add`           |
| DELETE | `/movies/favorites/:id`   | `id` (path)     | `{ ok, msg }`          | `useFavorites.remove`        |

## Admin (usuario autenticado, rol admin)

| Método | Endpoint            | Body/Params            | Respuesta            | Usado en                    |
| ------ | -------------------- | ------------------------ | --------------------- | ----------------------------- |
| GET    | `/admin/movies`     | —                        | `{ ok, movies[] }`     | `useAdminMovies`               |
| POST   | `/admin/movies`     | `multipart/form-data`    | `{ ok, msg }`          | `useAdminMovies.create`        |
| PATCH  | `/admin/movies/:id` | `multipart/form-data`    | `{ ok, msg, movie }`   | `useAdminMovies.update`        |
| DELETE | `/admin/movies/:id` | `id` (path)              | `{ ok, msg }`          | `useAdminMovies.remove`        |

## Manejo de errores

El wrapper `src/services/api.js` extrae el mensaje de error de dos formatos posibles que devuelve el backend:

- Errores de negocio: `{ ok: false, msg: "..." }` (p. ej. login con usuario inexistente)
- Errores de validación de campos (express-validator): `{ ok: false, errors: { campo: { msg: "..." } } }` (p. ej. contraseña inválida en el registro)

En ambos casos se lanza un `Error` con el mensaje correspondiente, que las páginas muestran directamente al usuario.
