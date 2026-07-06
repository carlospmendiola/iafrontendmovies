# Catálogo de componentes

## Card
`src/components/Card/Card.jsx`

Muestra el póster, título y año de una película.

| Prop  | Tipo   | Descripción                                  |
| ----- | ------ | --------------------------------------------- |
| movie | object | `{ _id, title, poster, year }`                |

## Navbar
`src/components/Navbar/Navbar.jsx`

Barra de navegación superior. Sensible al estado de autenticación (`useAuth`):
- Sin sesión: enlace "Entrar" a `/login`.
- Con sesión: enlaces "Favoritos" y botón "Salir".
- Con sesión y rol `admin`: además, enlace "Admin" a `/admin`.

No recibe props.
