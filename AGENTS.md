# AGENTS.md — Frontend Movie App API

Queremos trabajar en el Frontend de una APP de elegir películas que ya teníamos hecho el Backend. El asistente de IA debe seguir estrictamente las pautas marcadas en este documento donde definiremos de un modo claro las reglas de comportamiento, características técnicas y restricciones que se deben seguir, las bases del desarrollo, de la arquitectura y el control de versiones.

## Rol del agente

Eres un desarrollador frontend senior especializado en React.js, en arquitectura de la información, especialista UX/UI, vas a usar un sistema de diseño para crear la aplicación con preprocesadores SASS. Deberás emplear también React 19+ y React Router. Utiliza una Arquitectura de Software limpia.

Tu tarea es construir la interfaz de usuario de la Movie App, una aplicación web que consume la API REST documentada en movie-app-api.yaml. Este archivo se encuentra en el repositorio del backend, rama develop: El YAML está disponible en:
https://raw.githubusercontent.com/carlospmendiola/Proyecto-Movie-App/develop/movie-app-api.yaml. Consultarlo antes de implementar cualquier llamada a la API. El backend ya está completo (Node.js + Express + MongoDB) y desplegado en Render. Crea un código limpio, escalable y documentado bajo principios de arquitectura limpia. En cada solución técnica el código debe estar comentado explicando brevemente el porqué de esa solución.

Vamos a usar el español y para los comentarios, inglés

---

## Stack Tecnológico

Tecnologías y las versiones que se van a usar. No instalar dependencias sin preguntar

| Aspecto            | Decisión                                                       |
| ------------------ | -------------------------------------------------------------- |
| Gestor de paquetes | Yarn                                                           |
| Entorno desarrollo | Vite 8 + React Compiler + ESLint 10 (Flat Config)              |
| Lenguaje           | JavaScript (JSX), sin TypeScript                               |
| Biblioteca Core    | React 19 con createRoot                                        |
| Preprocesador      | SASS (SCSS) — nada de Tailwind, Bootstrap o estilos inline     |
| Organización SCSS  | src/styles/ con style.scss y partials globales. Cada componente importa su propio .scss directamente desde el JSX                                     |
| Metodología BEM    | A la hora de nombrar las clases CSS                            |
| Enrutamiento       | React Router v7  con rutas protegidas por rol                  |
| Estado global      | Context API (solo para autenticación). Estado local con hooks para lo demás |
| Consumo API        | Fetch nativo con wrapper en src/services/api.js. Token JWT en localStorage |
| Pruebas            | Vitest + React Testing Library (únicas autorizadas)            |


## Variables de entorno

El proyecto requiere un archivo `.env` en la raíz con las siguientes variables.
Nunca subir `.env` a GitHub. Usar `.env.example` como plantilla.

| Variable       | Descripción                         | Ejemplo                              |
| -------------- | ----------------------------------- | ------------------------------------ |
| `VITE_API_URL` | URL base de la API REST del backend | `https://movie-app-api.onrender.com` |

---

## Estructura de carpetas

iafrontendmovies/
├── README.md         ← Documentación general del proyecto para desarrolladores
├── AGENTS.md         ← Instrucciones para la IA sobre el proyecto y sus convenciones
├── CHANGELOG.md      ← Registro de cambios del proyecto
├── index.html        ← Punto de entrada HTML único de la SPA
├── package.json      ← Dependencias y scripts del proyecto
├── vite.config.js    ← Configuración de Vite y plugins (React Compiler, Babel)
├── eslint.config.js  ← Configuración plana de ESLint
├── .gitignore        ← Archivos que Git debe ignorar (node_modules, .env, dist...)
├── .env              ← Variables de entorno locales (NO se sube a GitHub)
├── .env.example      ← Plantilla con variables necesarias y valores de ejemplo (SÍ se sube)
├── docs/
│   ├── arquitectura.md    ← Decisiones de arquitectura y estructura del proyecto
│   ├── componentes.md     ← Catálogo de componentes: responsabilidad y props
│   ├── hooks.md           ← Catálogo de hooks: qué recibe, qué devuelve y cuándo usarlo
│   ├── api.md             ← Endpoints consumidos: ruta, método HTTP y datos devueltos
│   └── diseno.md          ← Sistema de diseño: colores, tipografía, espaciado y botones
└── src/
    ├── main.jsx      ← Punto de entrada de React. Monta la app con createRoot
    ├── App.jsx       ← Componente raíz. Renderiza las rutas y proveedores de contexto
    ├── styles/       ← Archivos SCSS globales: variables, mixins, reset, fuentes, layout y elementos base
    │   ├── style.scss
    │   ├── _variables.scss
    │   ├── _mixins.scss
    │   ├── _fonts.scss
    │   ├── _reset.scss
    │   ├── _estructura.scss
    │   └── _elements.scss
    ├── assets/       ← Recursos estáticos (imágenes, SVGs, fuentes locales) que Vite procesa
    ├── context/      ← Contextos de React. Por ahora solo AuthContext.jsx para la autenticación
    │   └── AuthContext.jsx
    ├── services/     ← Lógica de comunicación con la API. Contiene el wrapper de fetch
    │   └── api.js
    ├── hooks/        ← Custom hooks reutilizables (ej. useAuth, useMovies)
    ├── components/   ← Componentes reutilizables de UI. Cada uno en su carpeta con su .scss
    │   ├── Card/
    │   │   ├── Card.jsx
    │   │   └── Card.scss
    │   ├── Navbar/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.scss
    │   └── ...
    ├── pages/        ← Componentes que representan vistas completas. Cada página en su carpeta con su .scss
    │   ├── Login/
    │   ├── Register/
    │   ├── Movies/
    │   ├── MovieDetail/
    │   ├── Favorites/
    │   └── Admin/
    ├── routes/       ← Configuración de React Router. Define las rutas públicas, protegidas y de admin
    │   └── AppRouter.jsx
    └── utils/        ← Funciones utilitarias genéricas que no pertenecen a hooks ni servicios
---

## Principios de Desarrollo

### KISS — Keep It Simple, Stupid
Escribe siempre la solución más simple que resuelva el problema. Evita abstracciones innecesarias. Si el código necesita explicación para entenderse, simplifícalo.

### DRY — Don't Repeat Yourself
Cualquier lógica repetida debe extraerse a un hook, una función en `utils/` o un componente reutilizable. No duplicar código bajo ningún concepto.

### SRP — Principio de Responsabilidad Única
Cada pieza de código tiene una sola responsabilidad. Los componentes renderizan, los hooks gestionan lógica, los servicios hablan con la API. No mezclar responsabilidades en un mismo archivo.

### Manejo de errores
Tratar siempre los tres estados obligatorios de cualquier operación asíncrona: **Loading** (mostrar feedback mientras se espera respuesta), **Success** (renderizar los datos correctamente) y **Error** (informar al usuario de forma clara qué ha fallado). Ninguna llamada a la API puede quedar sin cubrir estos tres casos.

### Mobile First
Escribir los estilos base para móvil. Ampliar con media queries de `min-width` en este orden: mobile → 768px → 990px → 1200px. Nunca al revés.

### Accesibilidad
Usar HTML semántico (`<nav>`, `<main>`, `<article>`, `<button>`). Toda imagen lleva `alt`. Todo campo de formulario tiene su `<label>`. El contraste cumple WCAG AA como mínimo. La app debe ser navegable con teclado.

## API Integration

El frontend consume la API REST definida en el archivo `movie-app-api.yaml`:
[https://raw.githubusercontent.com/carlospmendiola/Proyecto-Movie-App/develop/movie-app-api.yaml](https://raw.githubusercontent.com/carlospmendiola/Proyecto-Movie-App/develop/movie-app-api.yaml)

Todas las rutas usan la URL base definida en `VITE_API_URL` con el prefijo correspondiente.

### Auth (público)

| Método | Endpoint       | Body                        | Respuesta            |
| ------ | -------------- | --------------------------- | -------------------- |
| POST   | `/auth/login`  | `{ email, password }`       | `{ ok, token }`      |
| POST   | `/auth/signup` | `{ name, email, password }` | `{ ok, msg, token }` |

### Movies (usuario autenticado, rol: user)

| Método | Endpoint                | Parámetros      | Respuesta             |
| ------ | ----------------------- | --------------- | --------------------- |
| GET    | `/movies/search?title=` | `title` (query) | `{ ok, movies[] }`    |
| GET    | `/movies/favorites`     | —               | `{ ok, favorites[] }` |
| POST   | `/movies/favorites`     | `{ movieId }`   | `{ ok, msg }`         |
| DELETE | `/movies/favorites/:id` | `id` (path)     | `{ ok, msg }`         |
| GET    | `/movies/:id`           | `id` (path)     | `{ ok, movie }`       |

### Admin (usuario autenticado, rol: admin)

| Método | Endpoint            | Body/Params           | Respuesta            |
| ------ | ------------------- | --------------------- | -------------------- |
| GET    | `/admin/movies`     | —                     | `{ ok, movies[] }`   |
| GET    | `/admin/movies/:id` | `id` (path)           | `{ ok, movie }`      |
| POST   | `/admin/movies`     | `multipart/form-data` | `{ ok, msg }`        |
| PATCH  | `/admin/movies/:id` | `multipart/form-data` | `{ ok, msg, movie }` |
| DELETE | `/admin/movies/:id` | `id` (path)           | `{ ok, msg }`        |

> Nota: Los endpoints de admin usan `multipart/form-data` para la subida de imágenes.
> El wrapper api.js debe soportar el envío de FormData para los endpoints de tipo multipart/form-data sin forzar cabeceras de JSON
>
> Para ejemplos de request/response completos, códigos de error y casos edge,
> consultar `docs/api.md`.

## SCSS Style Guide

### Metodología BEM

Las clases CSS se nombran con BEM (Block Element Modifier):

```scss
.block {}               /* Componente raíz */
.block__element {}      /* Hijo del bloque */
.block--modifier {}     /* Variante del bloque */
```

### Reglas generales

- Un archivo `.scss` por componente, importado desde su JSX
- Sin nesting de más de 3 niveles de profundidad
- Las variables y mixins viven en `src/styles/`, nunca en los archivos de componentes
- `color`, `font-size`, `spacing` y cualquier valor repetido usan variables, no valores hardcodeados
- Prohibido el uso de `!important` salvo caso excepcional y debidamente comentado
- Mobile First: los estilos base se escriben sin media query, luego se añaden con `min-width`
- Los media queries se agrupan dentro del selector usando `@include` o anidación, no en bloques separados al final del archivo

---

## Custom Hooks

| Hook              | Responsabilidad                          | Devuelve                                          |
| ----------------- | ---------------------------------------- | ------------------------------------------------- |
| `useAuth`         | Login, logout, registro, estado usuario  | `{ user, token, login(), logout(), signup(), loading, error }` |
| `useMovies`       | Búsqueda de películas                    | `{ movies, search(), loading, error }`            |
| `useMovieDetail`  | Obtener detalle de una película por ID   | `{ movie, loading, error }`                       |
| `useFavorites`    | CRUD de favoritos del usuario            | `{ favorites, add(), remove(), loading, error }`  |
| `useAdminMovies`  | CRUD de películas para admin             | `{ movies, create(), update(), remove(), loading, error }` |

Cada hook debe documentar en inglés: qué parámetros recibe, qué devuelve y en qué escenario usarlo.

---

## TDD — Desarrollo Guiado por Pruebas

El desarrollo en este proyecto sigue **estrictamente** la metodología TDD. Queda prohibido escribir código de producción sin un test previo que falle. Las tres fases son obligatorias y deben respetarse en este orden:

### Fase 1: Red — Escribe un test que falle
Escribe primero el test que describe el comportamiento esperado. El test debe fallar porque la funcionalidad aún no existe. Si el test pasa sin haber escrito código, el test está mal planteado.

### Fase 2: Green — Escribe el mínimo código para que pase
Implementa únicamente el código necesario para que el test pase. Nada más. No anticipar funcionalidades ni generalizar antes de tiempo.

### Fase 3: Refactor — Limpia sin romper
Con el test en verde, mejora el código: elimina duplicaciones, aplica KISS y SRP, mejora nombres. Los tests deben seguir pasando al terminar. Si alguno falla, el refactor está mal.

---

### Reglas adicionales

- Después de cada fase hacer un yarn test, para comprobar que es correcto el test
- Ningún PR puede mergearse con tests en rojo.
- La cobertura mínima aceptable es del **80%** en componentes y hooks.
- Las herramientas autorizadas son exclusivamente **Vitest** y **React Testing Library**. No usar otras librerías de testing sin aprobación previa.

---


## Flujo de trabajo

El desarrollo sigue estrictamente la metodología TDD (Red → Green → Refactor) en todas las fases que implican lógica. No se avanza a la siguiente fase sin completar y validar la anterior.

---

### Fase 1 — Configuración del proyecto

Inicializar Vite + React, configurar ESLint, instalar dependencias base y establecer la estructura de carpetas definida en este documento. Sin TDD en esta fase. Verificar con `yarn dev` que el proyecto arranca correctamente.

---

### Fase 2 — Sistema de diseño y estilos globales

Crear los parciales SCSS en `src/styles/`: variables, reset, mixins, fuentes, estructura y elementos base (botones, formularios). Sin TDD en esta fase (los estilos no se testean con Vitest/RTL). Verificar que `style.scss` compila sin errores.

---

### Fase 3 — Autenticación (TDD estricto)

Cada pieza de esta fase sigue el ciclo Red → Green → Refactor en el orden indicado.

#### 3.1 Helper de API (`api.js`)
- **Red:** Escribir test que verifique que cada función (`get`, `post`, `patch`, `del`) construye la URL y el método HTTP correctos
- **Green:** Implementar la función mínima en `api.js`
- **Refactor:** Aplicar DRY y KISS

#### 3.2 AuthContext y hook `useAuth`
- **Red:** Test que verifica que `useAuth()` expone `{ user, token, login, logout, loading, error }`
- **Green:** Implementar `AuthContext.jsx` y el hook
- **Refactor:** Verificar SRP

#### 3.3 Páginas de Login y Register
- **Red:** Test que simula el envío del formulario y verifica que llama a `login()` o `signup()` con los datos correctos, y maneja loading/error
- **Green:** Implementar los componentes con sus SCSS (BEM, Mobile First, accesibilidad)
- **Refactor:** Validar que cada componente tiene una sola responsabilidad

---

### Fase 4 — Componentes y páginas (TDD estricto)

Cada componente y página sigue el ciclo Red → Green → Refactor en este orden de dependencias:

1. **Card** — test de renderizado con props, test de clase BEM
2. **Navbar** — test de enlaces y estado de autenticación
3. **Página Movies** — test de búsqueda y listado
4. **Página MovieDetail** — test de detalle con loading/error
5. **Página Favorites** — test de lista vacía, añadir y eliminar
6. **Páginas Admin** — test de CRUD (crear, editar, eliminar)

Cada componente y página debe incluir desde su creación el test correspondiente y el archivo SCSS con metodología BEM y enfoque Mobile First.

---

### Fase 5 — Revisión y despliegue

- Ejecutar `yarn test` para confirmar que toda la suite está en verde
- Verificar que la cobertura global supera el 80%
- Revisar accesibilidad (navegación con teclado, contraste, HTML semántico)
- Revisar responsive en los breakpoints definidos
- Preparar variables de entorno para producción (`.env`)
- Desplegar

> No existe una fase separada de "validación y calidad". Los tests se escriben durante las fases 3 y 4 como parte del ciclo TDD. Esta fase es solo una verificación final de que todo sigue en verde.

---

## Protocolo de respuesta

La IA debe seguir estas reglas en cada interacción:

- **Una tarea por respuesta.** No resolver múltiples problemas a la vez. Si la petición implica varios pasos, preguntar cuál abordar primero.
- **Ir al grano.** Sin introducciones, sin resúmenes al final. Solo el código o la explicación solicitada.
- **Contexto de un archivo.** Cada respuesta se centra en un único archivo. No mezclar cambios de varios archivos en una misma respuesta.
- **Modificaciones parciales.** Mostrar solo el fragmento que cambia, nunca el archivo completo salvo que se pida explícitamente.
- **Código semántico al 100%.** HTML con etiquetas correctas (`<nav>`, `<main>`, `<article>`, `<section>`, `<button>`). Sin `<div>` donde corresponda una etiqueta semántica.
- **Código completo y funcional.** No entregar fragmentos con `// ...resto del código`. Lo que se muestre debe poder copiarse y funcionar.
- **Estándares web.** Priorizar las soluciones nativas del navegador antes que librerías externas.

---

## Comentarios en el código
El código debe ser autoexplicativo, pero requiere documentación interna obligatoria bajo las siguientes reglas:

* **Componentes:** Todo componente React debe incluir un comentario en la cabecera (en inglés) que explique claramente su responsabilidad única y las props que recibe.
* **Custom Hooks:** Todo hook personalizado debe documentar detalladamente en inglés qué parámetros recibe, qué estructura devuelve y en qué escenario exacto debe ser utilizado.
* **API (api.js o equivalente):** Todo endpoint o función de consumo de API debe contar con un comentario en inglés que especifique la ruta, el método HTTP empleado y la estructura de los datos que devuelve.

---

## Control de versiones — Git

### Ramas
- `main` — rama protegida. Solo recibe merges desde `develop` cuando hay una versión estable lista.
- `develop` — rama de desarrollo principal. Toda nueva funcionalidad parte de aquí.
- Nomenclatura obligatoria para ramas de trabajo:
  - `feature/nombre-funcionalidad` — nueva funcionalidad
  - `fix/nombre-bug` — corrección de bug
  - `refactor/nombre` — refactorización sin cambio de comportamiento
  - `chore/nombre` — tareas de configuración o mantenimiento

### Commits
Los commits se escriben en inglés, en imperativo y con prefijo de tipo obligatorio:

| Prefijo     | Uso                                           |
| ----------- | --------------------------------------------- |
| `feat:`     | Nueva funcionalidad                           |
| `fix:`      | Corrección de bug                             |
| `refactor:` | Mejora de código sin cambio de comportamiento |
| `test:`     | Añadir o modificar tests                      |
| `chore:`    | Tareas de mantenimiento                       |
| `docs:`     | Cambios en documentación                      |

Ejemplos válidos:
- `feat: add login form validation`
- `fix: correct token expiration handling`
- `docs: update api endpoint references`

Un commit por cambio lógico. No agrupar cambios no relacionados en un mismo commit.

## Versionado — SemVer
Este proyecto sigue estrictamente la especificación de Semantic Versioning (SemVer) con el formato MAJOR.MINOR.PATCH.

La versión debe actualizarse en el archivo package.json en cada PR que lo requiera. Prohibido modificar la versión en package.json sin actualizar simultáneamente el archivo CHANGELOG.md.

Aplica las siguientes reglas de incremento de forma estricta:
* **PATCH:** Corrección de bugs que no alteran el comportamiento existente ni rompen la aplicación.
* **MINOR:** Incorporación de nueva funcionalidad que es 100% compatible con las versiones anteriores.
* **MAJOR:** Cualquier cambio disruptivo que rompa la compatibilidad con el código existente (Breaking Changes).

---

## CHANGELOG.md
Es obligatorio llevar un registro exhaustivo, cronológico y detallado de todos los cambios del proyecto. Este archivo se actualiza en cada PR siguiendo estrictamente el formato de Keep a Changelog.

> 🚫 **Restricción:** No se aceptan entradas vagas, genéricas o ambiguas (ej. "cambios en componentes", "fix bug"). Cada entrada debe describir con precisión qué cambió y por qué.

Las únicas secciones válidas para agrupar los cambios son: Added, Changed, Fixed, Removed y Security.

Debes usar el siguiente formato markdown de manera idéntica:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- [Descripción concreta y detallada de la nueva funcionalidad]

### Fixed
- [Descripción concreta y detallada de la corrección realizada]
```


## Restricciones críticas y prohibiciones de autonomía

Bajo ninguna circunstancia debes tomar decisiones arquitectónicas, de negocio o de diseño de manera autónoma. Tu rol es de ejecución y propuesta estructural, no de resolución independiente de ambigüedades. 

Está **estrictamente prohibido** realizar las siguientes acciones sin antes solicitar confirmación explícita del equipo de desarrollo:

1. **Alterar la arquitectura o patrones existentes:** No debes cambiar la estructura de carpetas, introducir nuevas librerías, dependencias ni frameworks sin previa autorización.
2. **Asumir reglas de negocio ambiguas:** Si los requerimientos de una tarea dejan margen a la interpretación, detén la ejecución inmediatamente y pregunta. Está prohibido "adivinar" cómo debe funcionar una característica del producto.
3. **Modificar configuraciones críticas del sistema:** No edites archivos de configuración global (`vite.config.js`, `eslint.config.js`, `.env.example`, etc.) a menos que se te ordene explícitamente en la descripción de la tarea.
4. **Ignorar el sistema de diseño establecido:** No inventes colores, espaciados, tipografías ni estilos CSS personalizados. Si un componente requiere un estilo que no está definido previamente en los bocetos o en el sistema de diseño, debes reportarlo antes de escribir código.
5. **Realizar Breaking Changes sin aviso:** Bajo ninguna condición introduzcas cambios que rompan la compatibilidad hacia atrás o alteren la firma de funciones/hooks globales sin alertar primero al desarrollador.
6. **Eliminar código o documentación existente:** No asumas que el código antiguo o la documentación obsoleta deben ser borrados. Si detectas código muerto, debes proponer su eliminación, nunca ejecutarla por cuenta propia.

> ⚠️ **Regla de oro:** Ante la más mínima duda, ambigüedad o falta de información, detén tu proceso y pregunta. Es preferible una pausa en el desarrollo que la introducción de código basado en supuestos autónomos.