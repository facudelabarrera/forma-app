# AI_RULES.md — Reglas técnicas de desarrollo para FORMA

Reglas concretas para generar código consistente en este proyecto.
Estas reglas tienen precedencia sobre convenciones generales de Next.js o React.

---

## Stack permitido

| Librería | Versión | Uso |
|---|---|---|
| next | 15.x | Framework, App Router |
| react | 19.x | UI |
| typescript | 5.x | Tipado estático |
| tailwindcss | 4.x | Estilos |
| shadcn/ui | 4.x | Componentes base |
| lucide-react | latest | Iconos únicamente |
| framer-motion | latest | Animaciones de UI |
| react-hook-form | latest | Formularios |
| @hookform/resolvers | latest | Integración con Zod |
| zod | latest | Validación de esquemas |

**No instalar dependencias fuera de esta lista sin justificación explícita.**
Casos válidos para agregar una librería: funcionalidad que no existe en el stack actual,
y que agregarla no contradice los principios del producto.

---

## Convenciones de TypeScript

```ts
// Usar tipos del dominio de types/index.ts
import type { Habit, CheckState, DailyEntry } from "@/types"

// Tipar siempre los props de componentes con interface
interface MyComponentProps {
  title: string
  onAction: () => void
  optional?: boolean
}

// Nunca usar `any`. Usar `unknown` si es necesario.
// Preferir tipos discriminados sobre booleanos cuando hay más de 2 estados
type LoadState = "idle" | "loading" | "success" | "error"
```

---

## Convenciones de componentes

### Estructura de un componente

```tsx
// 1. Imports externos
import { useState } from "react"
import { motion } from "framer-motion"

// 2. Imports internos (tipos, utils, componentes)
import { cn } from "@/lib/utils"
import type { CheckState } from "@/types"

// 3. Interface de props (siempre explícita)
interface CheckButtonProps {
  state: CheckState
  onSelect: (state: CheckState) => void
}

// 4. Componente nombrado (nunca default export anónimo)
export function CheckButton({ state, onSelect }: CheckButtonProps) {
  return (...)
}
```

### Reglas de componentes

- **Named exports** siempre. No usar `export default` en componentes de features/core.
- `export default` solo en page components de Next.js (`app/*/page.tsx`).
- Un archivo = un componente principal. Helpers pequeños pueden coexistir en el mismo archivo.
- No pasar más de 6 props a un componente. Si se necesitan más, agrupar en un objeto.
- Componentes de presentación (sin lógica) van en `components/core/`.
- Componentes con lógica de negocio van en `features/{nombre}/components/`.

---

## Organización de imports

```ts
// Orden correcto:
// 1. React y Next.js
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Librerías externas
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"

// 3. Componentes internos (core y features)
import { AppShell, ScreenContainer, PrimaryButton } from "@/components/core"

// 4. Hooks, lib, types
import { useHabit } from "@/hooks/useHabit"
import { cn } from "@/lib/utils"
import type { Habit } from "@/types"
```

---

## Reglas de Tailwind

- Usar clases de Tailwind. No escribir `style={{}}` para estilos que Tailwind puede cubrir.
- Usar `cn()` de `@/lib/utils` para clases condicionales.
- Paleta de FORMA (no usar valores hex directos):

```
bg-background       → canvas (#F7F6F3)
text-foreground     → ink (#0F0E17)
bg-primary          → accent (#5C4FE5)
text-primary-foreground → blanco
bg-accent           → accent-light (#EAE8FB)
text-muted-foreground → gris medio
bg-forma-gold       → gold (#C9973A)
text-forma-green    → green (#3A9E7A)
border-border       → borde (#E2E0D8)
```

- Tipografía:
  - `font-display` → DM Serif Display (h1, h2, títulos de pantalla)
  - `font-body` o sin clase → DM Sans (todo lo demás)

---

## Reglas de formularios

- Siempre usar `react-hook-form` con `zodResolver`.
- Definir el schema Zod primero, inferir el tipo desde él.

```ts
const habitSchema = z.object({
  identity: z.string().min(3).max(80),
  name: z.string().min(3).max(80),
  ancla: z.string().min(3).max(80),
})

type HabitFormData = z.infer<typeof habitSchema>
```

- No validar manualmente con `if` lo que Zod puede validar.

---

## Reglas de animaciones

- Usar `framer-motion` para transiciones entre pantallas y aparición de elementos.
- Mantener duraciones cortas: entrada `0.2s–0.3s`, salida `0.15s`.
- No animar colores ni sombras (caro en mobile).
- Preferir `opacity` y `y` (transform) sobre otras propiedades.

```tsx
// Patrón base de entrada de pantalla
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
```

---

## Estructura de carpetas — reglas

```
app/
  layout.tsx          → solo layout, fonts, metadata
  page.tsx            → router: decide si mostrar onboarding o home
  onboarding/
    page.tsx          → flujo S-01 → S-05
  (home)/
    page.tsx          → S-06 Pantalla de Ritmo

features/
  habit/
    components/       → componentes específicos del hábito
    hooks/            → useHabit, etc.
    schemas.ts        → schemas Zod del dominio habit
  reflection/
    components/
    hooks/
  progress/
    components/
    hooks/

components/
  core/               → sistema UI base (no modificar sin necesidad)
  ui/                 → shadcn/ui (no modificar nunca)

hooks/                → hooks globales o cross-feature
lib/
  utils.ts            → cn() y helpers puros
  constants.ts        → constantes del dominio
types/
  index.ts            → todos los tipos del dominio
```

---

## Anti-patterns prohibidos

```tsx
// ❌ No hardcodear colores
<div style={{ color: "#5C4FE5" }}>

// ✅ Usar tokens
<div className="text-primary">

// ❌ No duplicar lógica que ya existe en constants.ts
const opacity = state === "lo-hice" ? 1 : state === "dia-dificil" ? 0.55 : 0.22

// ✅ Usar GRID_OPACITY de constants
import { GRID_OPACITY } from "@/lib/constants"
const opacity = GRID_OPACITY[state]

// ❌ No crear componentes para uso único trivial
function TitleWrapper({ children }) { return <div className="mt-4">{children}</div> }

// ✅ Inline cuando es simple
<div className="mt-4">{children}</div>

// ❌ No usar `any`
const data: any = await fetch(...)

// ✅ Tipar explícitamente
const data: Habit = await fetchHabit()
```
