# Sistema de diseño

Todos los tokens viven en `src/styles/_variables.scss`. Nunca hardcodear estos valores en componentes.

## Colores

| Token                | Valor     | Uso                              |
| --------------------- | --------- | ---------------------------------- |
| `$color-primary`      | `#E50914` | Acciones principales (botones, marca) |
| `$color-primary-dark` | `#B20710` | Hover de `$color-primary`         |
| `$color-bg`           | `#141414` | Fondo general                     |
| `$color-surface`      | `#1F1F1F` | Tarjetas, paneles, inputs         |
| `$color-text`         | `#FFFFFF` | Texto principal                   |
| `$color-text-muted`   | `#A3A3A3` | Texto secundario                  |
| `$color-error`        | `#CF6679` | Mensajes de error                 |
| `$color-success`      | `#4CAF50` | Mensajes de éxito                 |
| `$color-border`       | `#2C2C2C` | Bordes y divisores                |

## Tipografía

- **Principal (UI):** `$font-primary` — Inter
- **Secundaria (títulos/marca):** `$font-secondary` — Merriweather (serif), usada en `h1`/`h2` y en la marca del Navbar
- Escala: `$txt-xs` (0.75rem) → `$txt-xl` (2.5rem)

## Espaciado y radios

Escala de `$sp-4` a `$sp-64` (múltiplos de 4px). Radios: `$radius-sm` (4px), `$radius-md` (8px), `$radius-lg` (16px), `$radius-full` (píldora).

## Botones (`.btn`, en `_elements.scss`)

- `.btn--primary` — rojo sólido, acción principal (enviar formulario, crear)
- `.btn--secondary` — transparente con borde, acción secundaria (quitar de favoritos)
- `.btn--danger` — rojo error, acción destructiva (eliminar en Admin)

## Breakpoints (mobile first)

`$bp-768`, `$bp-990`, `$bp-1200`. Los mixins `mixins.bp-768/990/1200` envuelven `min-width` media queries.
