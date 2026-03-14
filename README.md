# FORMA

**FORMA** es una aplicación móvil centrada en la construcción de identidad a través de hábitos.
No es un tracker de rachas. Es un espacio para convertirte en la persona que querés ser.

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| Next.js (App Router) | Framework base |
| React + TypeScript | UI y tipado |
| Tailwind CSS v4 | Estilos utilitarios |
| shadcn/ui | Componentes base (Sheet, Dialog, Card) |
| Framer Motion | Animaciones |
| React Hook Form + Zod | Formularios y validación |
| Supabase | Base de datos (PostgreSQL) + Autenticación |
| Vercel | Deploy |

**Tipografía:** DM Serif Display (títulos) + DM Sans (cuerpo)

---

## Setup local

### 1. Clonar y instalar

```bash
cd forma-app
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Completá `.env.local` con los valores de tu proyecto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Configurar Supabase

**a. Crear proyecto en [supabase.com](https://supabase.com)**

**b. Ejecutar el schema en SQL Editor:**

```
Supabase Dashboard → SQL Editor → New query
```

Copiá y ejecutá el contenido de `lib/supabase/schema.sql`.

**c. Habilitar Email + Password:**

```
Supabase Dashboard → Authentication → Providers → Email
```

- Activar "Enable Email provider"
- **Desactivar** "Confirm email" (recomendado para MVP: permite login inmediato sin verificar mail)
- Si querés verificación de email estricta, dejalo activado y el usuario deberá confirmar por mail antes de poder ingresar

**d. Ejecutar migración de profiles:**

```
Supabase Dashboard → SQL Editor → New query
```

Copiá y ejecutá el contenido de `lib/supabase/migration-profiles.sql`. Esto crea:
- Tabla `profiles` con `onboarding_completed`
- RLS para que cada usuario solo vea su profile
- Trigger que crea automáticamente un profile al registrarse
- Backfill de usuarios existentes que ya tienen hábito activo

**e. Agregar URLs de redirección (para recovery y callbacks):**

```
Supabase Dashboard → Authentication → URL Configuration
```

- **Site URL (dev):** `http://localhost:3000`
- **Redirect URLs (dev):** `http://localhost:3000/auth/callback`

Para producción en Vercel:
- **Site URL (prod):** `https://tu-app.vercel.app`
- **Redirect URLs (prod):** `https://tu-app.vercel.app/auth/callback`

### 4. Correr el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Deploy en Vercel

### 1. Subir repo a GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/tu-usuario/forma-app.git
git push -u origin main
```

### 2. Conectar a Vercel

1. [vercel.com](https://vercel.com) → Import Project → seleccionar repo
2. Framework preset: **Next.js** (detectado automáticamente)
3. Root directory: `forma-app`

### 3. Agregar variables de entorno en Vercel

```
Vercel Dashboard → Project → Settings → Environment Variables
```

Agregar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Deploy

Vercel hace deploy automático en cada push a `main`.

### 5. Actualizar URLs en Supabase

Una vez que tengas la URL de producción de Vercel, actualizá en Supabase:

```
Authentication → URL Configuration → Site URL → https://tu-app.vercel.app
Authentication → URL Configuration → Redirect URLs → https://tu-app.vercel.app/auth/callback
```

### 6. Usar forma.vercel.app como dominio

1. **Vercel Dashboard** → tu proyecto → **Settings** → **Domains**
2. Agregá `forma.vercel.app` (Vercel lo asigna si está disponible)
3. **Supabase** → Authentication → URL Configuration:
   - Site URL: `https://forma.vercel.app`
   - Redirect URLs: `https://forma.vercel.app/auth/callback`
4. Si tenés la URL anterior (ej. forma-app-three.vercel.app), mantenela también en Redirect URLs hasta confirmar que la nueva funciona.

---

## Troubleshooting

### "Email o contraseña incorrectos"
- Verificá que estés usando el email con el que te registraste.
- La contraseña distingue mayúsculas/minúsculas.

### "Este email ya tiene una cuenta"
- Intentá "Iniciar sesión" en vez de "Crear cuenta".

### No puedo registrarme
1. **Supabase proyecto pausado:** En el plan free, los proyectos se pausan tras inactividad. Entrá al dashboard y reactivalo.
2. **Email provider:** Authentication → Providers → Email → "Enable Email provider" activado.
3. **Rate limit:** Demasiados intentos en poco tiempo. Esperá unos minutos.
4. **Confirm email:** Si tenés "Confirm email" activado en Supabase, revisá tu bandeja de entrada (y spam) para el link de confirmación.

### El onboarding no se guarda
- Asegurate de haber ejecutado `lib/supabase/migration-profiles.sql` en el SQL Editor de Supabase.
- Verificá que la tabla `profiles` exista con RLS habilitado.

---

## Estructura del repositorio

```
forma-app/
├── app/                        # App Router — rutas y layouts
│   ├── layout.tsx
│   ├── page.tsx                # Home (RhythmScreen o redirect)
│   ├── login/
│   │   └── page.tsx            # Pantalla de acceso (email + password)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # Handler de callback OAuth/magic link
│   ├── onboarding/
│   │   └── page.tsx            # Flujo de onboarding (S-01 → S-05)
│   └── globals.css             # Design tokens FORMA + shadcn
│
├── components/
│   ├── ui/                     # Componentes shadcn/ui (auto-generados)
│   └── core/                   # Componentes base del sistema UI FORMA
│
├── features/                   # Módulos por dominio
│   ├── habit/                  # Hábito — S-03, S-06, S-06a
│   ├── reflection/             # Check diario y semanal — S-07, S-08
│   └── progress/               # Visualización
│
├── hooks/
│   └── useAppState.ts          # Estado global (Supabase + localStorage cache)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   ├── actions.ts          # Helpers de persistencia (saveHabit, saveEntry, saveReflection, markOnboardingComplete)
│   │   ├── schema.sql          # Schema SQL completo (habits, entries, reflections, profiles)
│   │   └── migration-profiles.sql  # Migración para agregar tabla profiles (ejecutar una vez)
│   ├── utils.ts
│   └── constants.ts
│
├── middleware.ts                # Auth session refresh + protección de rutas
├── types/
│   └── index.ts                # Tipos TypeScript del dominio
└── .env.local.example          # Template de variables de entorno
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
- [x] Base técnica — Supabase + Auth (email+password) + Persistencia + Deploy
- [x] Auth rebuild — flujo separado crear cuenta / iniciar sesión
- [x] Profiles table — onboarding_completed como source of truth
- [ ] Fase C — High-fi + Design System
- [ ] Push notifications
- [ ] Onboarding de permisos (S-05)

---

## Próximos pasos técnicos

1. **Generar tipos de Supabase** con Supabase CLI para tipado fuerte del cliente
2. **Testing** — jest + testing-library para hooks y componentes críticos
3. **Error boundary** — manejo de errores de red en persistencia
4. **Offline support** — la app ya funciona offline con localStorage, considerar sync manual
5. **Push notifications** — Web Push API o servicio externo
