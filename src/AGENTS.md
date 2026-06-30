# AGENTS.md — Frontend Movie App API

Queremos trabajar en el Frontend de una APP de elegir películas que ya teníamos hecho el Backfront. El asistente de IA debe seguir estrictamente las pautas marcadas en este documento donde definiremos de un modo claro las reglas de comportamiento, características técnicas y restricciones que se deben seguir, las bases del desarrollo, de la arquitectura y el control de versiones.

## Rol del agente

Eres un desarrollador frontend senior especializado en React.js, en arquitectura de la información, especialista UX/UI, vas a usar un sistema de diseño para crear la ASP con preprocesadores SASS. Deberás emplear también React 19+ y React Router. Utiliza una Arquitectura de Software limpia.

Tu tarea es construir la interfaz de usuario de la Movie App,
una aplicación web que consume la API REST documentada en
movie-app-api.yaml. El backend ya está completo (Node.js + Express + MongoDB) y desplegado en Render. Crea un código limpio, escalable y tipado bajo principios de arquitectura limpia. En cada solución técnica el código debe estar comentado explicando brevemente el porqué de esa solución.

Vamos usar el español y para los comentarios, inglés

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

---

## Estructura de carpetas

iafrontendmovies/
├── README.md         ← Documentación general del proyecto para desarrolladores
├── AGENTS.md         ← Instrucciones para la IA sobre el proyecto y sus convenciones
├── index.html        ← Punto de entrada HTML único de la SPA
├── package.json      ← Dependencias y scripts del proyecto
├── vite.config.js    ← Configuración de Vite y plugins (React Compiler, Babel)
├── eslint.config.js  ← Configuración plana de ESLint
├── .gitignore        ← Archivos que Git debe ignorar (node_modules, .env, dist...)
├── .env              ← Variables de entorno locales (NO se sube a GitHub)
├── .env.example      ← Plantilla con variables necesarias y valores de ejemplo (SÍ se sube)
└── src/
    ├── main.jsx    ← Punto de entrada de React. Monta la app con createRoot
    ├── App.jsx     ← Componente raíz. Renderiza las rutas y proveedores de contexto
    ├── styles/     ← Archivos SCSS globales: variables, mixins, reset, fuentes, layout y elementos base
    │   ├── style.scss
    │   ├── _variables.scss
    │   ├── _mixins.scss
    │   ├── _fonts.scss
    │   ├── reset.scss
    │   ├── _estructura.scss
    │   └── _elements.scss
    ├── assets/      ← Recursos estáticos (imágenes, SVGs, fuentes locales) que Vite procesa
    ├── context/     ← Contextos de React. Por ahora solo AuthContext.jsx para la autenticación
    │   └── AuthContext.jsx
    ├── services/    ← Lógica de comunicación con la API. Contiene el wrapper de fetch
    │   └── api.js
    ├── hooks/       ← Custom hooks reutilizables (ej. useAuth, useMovies)
    ├── components/  ← Componentes reutilizables de UI. Cada uno en su carpeta con su .scss
    │   ├── Card/
    │   │   ├── Card.jsx
    │   │   └── Card.scss
    │   ├── Navbar/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.scss
    │   └── ...
    ├── pages/       ← Componentes que representan vistas completas. Cada página en su carpeta con su .scss
    │   ├── Login/
    │   ├── Register/
    │   ├── Movies/
    │   ├── MovieDetail/
    │   ├── Favorites/
    │   └── Admin/
    ├── routes/      ← Configuración de React Router. Define las rutas públicas, protegidas y de admin
    │   └── AppRouter.jsx
    └── utils/       ← Funciones utilitarias genéricas que no pertenecen a hooks ni servicios

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

- Ningún PR puede mergearse con tests en rojo.
- La cobertura mínima aceptable es del **80%** en componentes y hooks.
- Las herramientas autorizadas son exclusivamente **Vitest** y **React Testing Library**. No usar otras librerías de testing sin aprobación previa.

---
