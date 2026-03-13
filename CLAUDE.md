# CLAUDE.md — Guía de desarrollo para FORMA

Este archivo define cómo Claude debe comportarse al generar código para el proyecto FORMA.
Leé esto antes de modificar o crear cualquier archivo.

---

## Qué es FORMA

FORMA es una aplicación móvil de construcción de identidad a través de hábitos.
No es un tracker de rachas. No gamifica. No juzga.

Su propósito es ayudar a las personas a convertirse en quienes quieren ser,
un día a la vez, sin presión de perfección.

El producto parte de una premisa simple: **la identidad cambia el comportamiento,
no al revés.** Primero definís quién sos, después construís evidencia de eso.

---

## Principios centrales del producto

Estos principios no son opcionales. Afectan todas las decisiones de UI, copy y lógica:

1. **Identidad primero.** Siempre referenciar `{identidad}` del usuario, no solo `{hábito}`.
2. **Sin rachas.** Nunca mostrar streaks, contadores de días consecutivos ni gamificación.
3. **Tristate sin jerarquía.** "Lo hice" / "Día difícil" / "Hoy no" tienen el mismo peso visual y semántico.
4. **Tono de apoyo.** Sin "felicitaciones", sin signos de exclamación emocionales, sin "fallaste".
5. **Retorno > consistencia.** Volver después de ausencia es tan válido como no haberse ido.
6. **Un solo hábito.** MVP: 1 hábito por usuario. No extender esta restricción sin discutirlo.

---

## Cómo debe comportarse Claude al generar código

### Arquitectura
- Seguir la estructura de carpetas existente: `features/`, `components/core/`, `hooks/`, `types/`, `lib/`
- Nuevas pantallas van en `app/` como rutas o como componentes en `features/`
- No crear archivos en la raíz del proyecto salvo configuración

### Componentes
- **Primero buscar** si ya existe un componente core reutilizable antes de crear uno nuevo
- Usar siempre los componentes en `components/core/`: `AppShell`, `ScreenContainer`, `TopBar`, `PrimaryButton`, etc.
- Los componentes de shadcn/ui están en `components/ui/` — no modificarlos directamente
- Crear componentes nuevos solo si la lógica es específica de una feature
- Componentes de feature van en `features/{nombre}/components/`

### Tipos
- Todos los tipos del dominio están en `types/index.ts`
- No duplicar tipos. Si falta uno, agregarlo ahí
- Usar los tipos existentes: `CheckState`, `Habit`, `DailyEntry`, `WeeklyReflection`, `AppState`

### Estilos
- Usar solo clases de Tailwind. No escribir CSS custom salvo tokens en `globals.css`
- Usar los tokens de FORMA: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `bg-forma-gold`, `text-forma-green`
- No hardcodear colores hex en componentes
- Tipografía: `font-display` para h1/h2, `font-body` (default) para todo lo demás

### Copy y microcopy
- Nunca escribir copy que implique jerarquía entre los estados del check
- Nunca usar "racha", "streak", "días consecutivos", "felicitaciones", "lo lograste"
- Usar el tono definido en `ai-context/ux-principles.md`

### Simplicidad
- Evitar abstracciones prematuras
- No agregar props opcionales que no se usan todavía
- No crear helpers para lógica que solo se usa en un lugar
- Si algo se puede hacer en 3 líneas, no crear una función para eso

### No hacer sin consultar
- Cambiar la restricción de 1 hábito por usuario
- Agregar gamificación, puntos, niveles o rankings
- Cambiar la estructura de carpetas significativamente
- Instalar dependencias nuevas que no estén en `AI_RULES.md`

---

## Referencias de arquitectura

Ver `ai-context/architecture.md` para la estructura completa del proyecto.
Ver `ai-context/tech-stack.md` para reglas de uso de cada librería.
Ver `ai-context/ux-principles.md` para principios de UI y copy.
