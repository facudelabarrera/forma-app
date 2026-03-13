# Arquitectura — FORMA

## Estructura del proyecto

```
forma-app/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fuentes, metadata, providers (futuro)
│   ├── page.tsx                # Entry point: decide onboarding vs home
│   ├── globals.css             # Design tokens FORMA + shadcn base
│   ├── onboarding/             # Flujo S-01 → S-05 (por crear)
│   │   └── page.tsx
│   └── (home)/                 # Pantalla de Ritmo S-06 (por crear)
│       └── page.tsx
│
├── components/
│   ├── ui/                     # shadcn/ui — NO MODIFICAR
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── sheet.tsx
│   │   └── dialog.tsx
│   └── core/                   # Sistema UI base de FORMA
│       ├── AppShell.tsx        # Contenedor mobile-first (max 430px)
│       ├── ScreenContainer.tsx # Wrapper de pantalla con padding
│       ├── TopBar.tsx          # Barra de navegación superior
│       ├── PrimaryButton.tsx   # CTA principal
│       ├── SecondaryButton.tsx # Acción secundaria (outline | ghost)
│       ├── Card.tsx            # Tarjeta de contenido
│       ├── EmptyState.tsx      # Estado vacío / zero state
│       ├── SupportMessage.tsx  # Mensaje de apoyo identidad-first
│       └── index.ts            # Barrel export
│
├── features/                   # Módulos por dominio
│   ├── habit/
│   │   ├── components/         # HabitCard, RhythmGrid, etc.
│   │   ├── hooks/              # useHabit()
│   │   └── schemas.ts          # Zod schemas del dominio
│   ├── reflection/
│   │   ├── components/         # CheckSheet, WeeklyOverlay, etc.
│   │   ├── hooks/              # useDailyEntry(), useWeeklyReflection()
│   │   └── schemas.ts
│   └── progress/
│       ├── components/         # OpacityGrid, WeekSummary, etc.
│       └── hooks/              # useProgress()
│
├── hooks/                      # Hooks globales o cross-feature
│   └── index.ts
│
├── lib/
│   ├── utils.ts                # cn() — no agregar lógica de negocio acá
│   └── constants.ts            # Constantes del dominio (CHECK_OPTIONS, GRID_OPACITY, etc.)
│
├── types/
│   └── index.ts                # Todos los tipos TypeScript del dominio
│
└── styles/                     # Estilos globales adicionales (vacío por ahora)
```

---

## Decisiones de arquitectura

### App Router sobre Pages Router
Next.js App Router. Layouts anidados. Server Components donde sea posible.
Los componentes de UI que usan hooks o eventos del cliente llevan `"use client"`.

### Organización por features, no por tipo
Las carpetas `features/habit/`, `features/reflection/`, `features/progress/` agrupan
todo lo que pertenece a ese dominio: componentes, hooks, schemas.

No organizar por tipo (`hooks/useHabit.ts` en la raíz) sino por feature
(`features/habit/hooks/useHabit.ts`). Excepción: hooks cross-feature van en `hooks/`.

### Estado de la app
MVP: estado local con `useState` + `localStorage` para persistencia.
No hay backend, no hay autenticación en esta etapa.
Cuando se escale, migrar a Zustand o Context según complejidad.

### Datos del usuario
Toda la AppState se persiste en `localStorage` bajo la key `forma-state`.
Tipos en `types/index.ts`: `AppState`, `Habit`, `DailyEntry`, `WeeklyReflection`.

---

## Cómo crear una nueva pantalla

1. **Determinar si es una ruta o un componente modal.**
   - Ruta nueva → crear `app/{nombre}/page.tsx`
   - Modal/sheet → crear en `features/{dominio}/components/`

2. **Estructura mínima de una pantalla:**

```tsx
"use client" // solo si necesita interactividad

import { AppShell, ScreenContainer, TopBar } from "@/components/core"

export default function NombrePage() {
  return (
    <AppShell>
      <TopBar title="Título" showBack onBack={() => router.back()} />
      <ScreenContainer>
        {/* contenido */}
      </ScreenContainer>
    </AppShell>
  )
}
```

3. **Animación de entrada:**
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
```

---

## Cómo crear un nuevo componente

**Antes de crear:** verificar si `components/core/` ya tiene algo reutilizable.

**Si es un componente de feature:**
```
features/{nombre}/components/{NombreComponente}.tsx
```

**Si es reutilizable entre features:**
```
components/core/{NombreComponente}.tsx
+ agregar export en components/core/index.ts
```

**Template mínimo:**
```tsx
import { cn } from "@/lib/utils"

interface ComponenteProps {
  // props explícitas
}

export function Componente({ }: ComponenteProps) {
  return (
    <div className={cn("...")}>
    </div>
  )
}
```

---

## Patrones de reutilización

### Composición sobre configuración
Preferir componentes que se componen con children sobre componentes
con múltiples props booleanas que cambian el render internamente.

```tsx
// ✅ Composición
<Card>
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
</Card>

// ❌ Configuración excesiva
<Card hasHeader headerTitle="..." hasFooter footerAction={...} />
```

### Variantes con cn()
Para componentes con variantes de estilo, usar el patrón `variant`:

```tsx
const variants = {
  outline: "border border-border text-foreground",
  ghost: "text-muted-foreground",
}

<button className={cn(baseStyles, variants[variant], className)} />
```

### Hooks para lógica de estado
Si un componente necesita más de 3 `useState`, extraer la lógica a un hook:

```
features/habit/hooks/useHabitForm.ts
```

---

## Mapa de pantallas → archivos

| Pantalla | Ubicación esperada |
|---|---|
| S-01 Bienvenida | `features/habit/components/WelcomeScreen.tsx` o `app/onboarding/page.tsx` |
| S-02 Identidad | `features/habit/components/IdentityStep.tsx` |
| S-03 Hábito | `features/habit/components/HabitStep.tsx` |
| S-04 Ancla | `features/habit/components/AnclaStep.tsx` |
| S-05 Resumen | `features/habit/components/SummaryStep.tsx` |
| S-06 Pantalla de Ritmo | `app/(home)/page.tsx` o `features/habit/components/RhythmScreen.tsx` |
| S-07 Check diario | `features/reflection/components/DailyCheckSheet.tsx` |
| S-08 Check-in semanal | `features/reflection/components/WeeklyCheckOverlay.tsx` |
| S-09 Settings | `features/habit/components/SettingsSheet.tsx` |
| S-06a Bloque retorno | `features/habit/components/ReturnBlock.tsx` |
