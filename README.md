# FORMA

**FORMA** es una aplicación móvil centrada en la construcción de identidad a través de hábitos.
No es un tracker de rachas. Es un espacio para convertirte en la persona que querés ser.

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| Next.js 15 (App Router) | Framework base |
| React + TypeScript | UI y tipado |
| Tailwind CSS v4 | Estilos utilitarios |
| shadcn/ui | Componentes base (Sheet, Dialog, Card) |
| Framer Motion | Animaciones |
| React Hook Form + Zod | Formularios y validación |
| lucide-react | Iconos |

**Tipografía:** DM Serif Display (títulos) + DM Sans (cuerpo)

---

## Cómo correr el proyecto

```bash
cd forma-app
npm install
npm run dev
```

Abre http://localhost:3000 en tu browser.

---

## Estructura del repositorio

```
forma-app/
├── app/                    # App Router — rutas y layouts
│   ├── layout.tsx          # Root layout (fuentes, metadata)
│   ├── page.tsx            # Home (temporal — estado base)
│   └── globals.css         # Design tokens FORMA + shadcn
│
├── components/
│   ├── ui/                 # Componentes shadcn/ui (auto-generados)
│   └── core/               # Componentes base del sistema UI FORMA
│       ├── AppShell        # Contenedor mobile-first (max 430px)
│       ├── ScreenContainer # Wrapper interno de cada pantalla
│       ├── TopBar          # Barra de navegación superior
│       ├── PrimaryButton   # CTA principal
│       ├── SecondaryButton # Acción secundaria (outline | ghost)
│       ├── Card            # Tarjeta de contenido
│       ├── EmptyState      # Estado vacío / zero state
│       └── SupportMessage  # Mensaje de apoyo (identidad-first)
│
├── features/               # Módulos por dominio
│   ├── habit/              # Hábito — S-03, S-06, S-06a
│   ├── reflection/         # Check diario y semanal — S-07, S-08
│   └── progress/           # Visualización — grilla de opacidad
│
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # cn() helper (shadcn)
│   └── constants.ts        # Constantes FORMA (tristate, opacidad, etc.)
├── types/
│   └── index.ts            # Tipos TypeScript del dominio
└── styles/                 # Estilos globales adicionales
```

---

## Arquitectura de pantallas

| ID | Pantalla | Descripción |
|---|---|---|
| S-01 | Bienvenida | Entrada al onboarding |
| S-02 | Identidad | "¿Quién querés ser?" |
| S-03 | Hábito | Definición del hábito |
| S-04 | Ancla | Actividad ancla |
| S-05 | Resumen + Permisos | Confirmación |
| S-06 | Pantalla de Ritmo | Home — 5 estados |
| S-07 | Check diario | Bottom sheet — tristate |
| S-08 | Check-in semanal | Overlay completo |
| S-09 | Settings | Bottom sheet |
| S-06a | Bloque de retorno | 3 variantes según ausencia |
| S-10 | Notificaciones push | 3 plantillas |

---

## Principios de diseño

- Identidad primero. Siempre referenciar {identidad}, no solo {hábito}.
- Sin rachas. No hay streaks, no hay gamificación.
- Tristate sin jerarquía. "Lo hice" / "Día difícil" / "Hoy no" — todos con mismo peso visual.
- Tono de apoyo. Sin "felicitaciones", sin signos de exclamación emocionales, sin "fallaste".

---

## Estado del proyecto

- [x] Fase A — Arquitectura y decisiones de diseño
- [x] Fase B — Wireframes UX completos
- [ ] Fase C — High-fi + Design System
- [ ] Implementación técnica (en curso)
