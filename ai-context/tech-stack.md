# Tech Stack — FORMA

Cómo usar cada librería dentro del proyecto. No solo qué es, sino cómo debe usarse acá.

---

## Next.js 15 — App Router

**Uso:** Framework principal. Routing, layouts, optimización de fuentes.

**Reglas:**
- Usar App Router. No mezclar con Pages Router.
- Los archivos `layout.tsx` solo contienen layout, fonts, metadata y providers. Sin lógica de negocio.
- `page.tsx` en `app/` decide el estado inicial (onboarding completo o no) y redirige.
- Usar `"use client"` solo cuando sea necesario (hooks, eventos, estado). Por default, los componentes son Server Components.
- Metadata en `layout.tsx` o con `generateMetadata()` en cada page.

```tsx
// page.tsx raíz — lógica de routing de onboarding
import { redirect } from "next/navigation"

export default function Home() {
  // En MVP: leer localStorage en cliente. En producción: server-side session.
  return <HomeClient />
}
```

---

## React 19

**Uso:** UI. Hooks. Estado local.

**Reglas:**
- Hooks de estado: `useState`, `useEffect`, `useCallback`, `useMemo` — solo cuando son necesarios.
- No usar `useEffect` para lógica que puede ser síncrona.
- Preferir derivar estado en lugar de duplicarlo con `useEffect`.
- Componentes funcionales siempre. Sin class components.

```tsx
// ✅ Derivar estado
const isComplete = entries.filter(e => e.state === "lo-hice").length >= 5

// ❌ Duplicar con useEffect
const [isComplete, setIsComplete] = useState(false)
useEffect(() => {
  setIsComplete(entries.filter(e => e.state === "lo-hice").length >= 5)
}, [entries])
```

---

## TypeScript 5

**Uso:** Tipado estático. Todos los archivos son `.ts` o `.tsx`.

**Reglas:**
- Nunca usar `any`. Usar `unknown` y type guards si el tipo es incierto.
- Interfaces para props de componentes, types para uniones y tipos del dominio.
- Importar los tipos del dominio desde `@/types`.
- Usar `satisfies` para validar objetos contra tipos sin perder inferencia.

```ts
// Tipos del dominio en types/index.ts
import type { CheckState, Habit } from "@/types"

// Props de componentes con interface
interface HabitCardProps {
  habit: Habit
  onCheck: (state: CheckState) => void
}
```

---

## Tailwind CSS v4

**Uso:** Todos los estilos visuales. Sin CSS custom salvo tokens en `globals.css`.

**Reglas:**
- Usar `cn()` de `@/lib/utils` para clases condicionales o merges.
- No escribir `style={{}}` para cosas que Tailwind puede cubrir.
- Los tokens de FORMA están disponibles como utilidades Tailwind:
  `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`,
  `bg-forma-gold`, `text-forma-green`, `border-border`
- `font-display` para DM Serif Display, sin clase (o `font-body`) para DM Sans.
- No agregar valores al theme en `globals.css` sin necesidad real.

```tsx
// ✅ Uso correcto
<div className={cn("flex flex-col gap-4", isActive && "opacity-100", className)}>

// ❌ No hacer esto
<div style={{ color: "#5C4FE5", fontFamily: "DM Serif Display" }}>
```

---

## shadcn/ui

**Uso:** Componentes base: `Button`, `Sheet`, `Dialog`, `Card`.
Los componentes están en `components/ui/` — generados por shadcn CLI.

**Reglas:**
- **No modificar** los archivos en `components/ui/`. Si necesitás un comportamiento distinto, wrapearlo en `components/core/`.
- Para instalar un nuevo componente: `npx shadcn@latest add {nombre}`
- Los componentes de FORMA en `components/core/` pueden usar los de shadcn internamente.
- El `Button` de shadcn se usa internamente. Al exterior, exponer `PrimaryButton` y `SecondaryButton`.

```tsx
// ✅ Usar Sheet de shadcn dentro de un componente FORMA
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function DailyCheckSheet({ open, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom">
        {/* contenido */}
      </SheetContent>
    </Sheet>
  )
}
```

---

## lucide-react

**Uso:** Iconos. Solo iconos.

**Reglas:**
- Importar solo el ícono que se necesita (no importar el paquete entero).
- Tamaño default recomendado: `size={20}` para UI, `size={24}` para navegación, `size={32}` para empty states.
- Siempre pasar `strokeWidth={1.5}` para un look más liviano (más acorde al estilo FORMA).

```tsx
import { ChevronLeft, BookOpen, Check } from "lucide-react"

<ChevronLeft size={24} strokeWidth={1.5} />
```

---

## Framer Motion

**Uso:** Animaciones de entrada de pantallas, transiciones de estado, aparición de elementos.

**Reglas:**
- No animar colores, sombras ni bordes (caro en mobile).
- Preferir `opacity` + `y` (transforms). Duración máxima 300ms.
- Usar `AnimatePresence` para animar salida de elementos.
- No wrappear todo en `motion.div`. Solo los elementos que realmente animan.

```tsx
import { motion, AnimatePresence } from "framer-motion"

// Entrada estándar de pantalla
const screenVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}

<motion.div variants={screenVariants} initial="hidden" animate="visible">
  {/* pantalla */}
</motion.div>

// Entrada con AnimatePresence (para elementos que aparecen/desaparecen)
<AnimatePresence>
  {showBlock && (
    <motion.div
      key="return-block"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <ReturnBlock />
    </motion.div>
  )}
</AnimatePresence>
```

---

## React Hook Form + Zod

**Uso:** Formularios del onboarding (S-02, S-03, S-04). Validación de inputs.

**Reglas:**
- Siempre usar `zodResolver`. No validar manualmente con `if`.
- Definir el schema Zod primero, inferir el tipo desde él con `z.infer`.
- Usar `register`, `handleSubmit`, `formState.errors` del hook.
- Los schemas van en `features/{nombre}/schemas.ts`.

```ts
// features/habit/schemas.ts
import { z } from "zod"

export const identitySchema = z.object({
  identity: z
    .string()
    .min(3, "Necesita al menos 3 caracteres")
    .max(80, "Máximo 80 caracteres"),
})

export type IdentityFormData = z.infer<typeof identitySchema>
```

```tsx
// En el componente
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { identitySchema, type IdentityFormData } from "../schemas"

const { register, handleSubmit, formState: { errors } } = useForm<IdentityFormData>({
  resolver: zodResolver(identitySchema),
})

const onSubmit = (data: IdentityFormData) => {
  // data está tipado y validado
}
```

---

## Resumen rápido de imports

```ts
// Framework
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// Formularios
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Iconos
import { ChevronLeft } from "lucide-react"

// shadcn
import { Sheet, SheetContent } from "@/components/ui/sheet"

// Core UI de FORMA
import { AppShell, ScreenContainer, TopBar, PrimaryButton } from "@/components/core"

// Dominio
import { cn } from "@/lib/utils"
import { CHECK_OPTIONS, GRID_OPACITY } from "@/lib/constants"
import type { CheckState, Habit } from "@/types"
```
