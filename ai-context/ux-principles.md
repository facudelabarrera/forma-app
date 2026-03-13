# Principios UX — FORMA

Estos principios guían todas las decisiones de interfaz, interacción y microcopy.
No son aspiracionales. Son restricciones concretas.

---

## P1 — Identidad > comportamiento

**Qué significa:** La UI siempre referencia quién es el usuario, no solo qué hizo.

**En la práctica:**
- El check diario muestra: *"Como alguien que cuida su cuerpo..."* — no *"¿Hiciste tu hábito?"*
- La pantalla de ritmo (S-06) muestra la identidad del usuario en el header
- El microcopy usa `{identidad}` como ancla emocional

**Incorrecto:**
> "Completaste 12 días de ejercicio"

**Correcto:**
> "12 días siendo alguien que cuida su cuerpo"

---

## P2 — Proceso > perfección

**Qué significa:** Ningún estado del check es mejor que otro. Los tres son válidos.

**En la práctica:**
- "Lo hice", "Día difícil" y "Hoy no" tienen **idéntico peso visual**: mismo tamaño, mismo peso tipográfico, mismo color de fondo
- La grilla de opacidad (S-06) usa 3 niveles: 1.0 / 0.55 / 0.22 — nunca celdas vacías
- No hay animación de celebración cuando el usuario marca "Lo hice"
- No hay animación de penalización cuando marca "Hoy no"

**Incorrecto:**
- Checkmark verde prominente para "Lo hice", X roja para "Hoy no"
- Mensajes distintos de refuerzo según el estado seleccionado

**Correcto:**
- Los tres botones visualmente equivalentes
- El mensaje de cierre del check es neutro y consistente independiente del estado

---

## P3 — Retorno > consistencia

**Qué significa:** Volver después de una ausencia es una acción que merece acompañamiento especial.

**En la práctica:**
- Cuando el usuario vuelve tras 2+ días, se muestra el bloque S-06a antes del check normal
- El bloque S-06a tiene 3 variantes:
  - **Variante A (2–4 días):** tono tranquilo, sin drama
  - **Variante B (5+ días):** tono de bienvenida, más cálido
  - **Variante C (Semana 3):** prioridad máxima — es el momento crítico de abandono
- La app no "señala" la ausencia como algo negativo. Solo acompaña el retorno.

**Incorrecto:**
> "Hace 5 días que no registrás tu hábito"

**Correcto:**
> "Bienvenido de vuelta. Cada vez que volvés, construís algo."

---

## P4 — Acompañamiento > control

**Qué significa:** La app no presiona, no empuja, no juzga. Está ahí cuando el usuario la abre.

**En la práctica:**
- Push notifications: máximo 2 por semana
- La notificación de semana 3 es proactiva pero no urgente
- El check-in semanal (S-08) es un espacio de reflexión, no un examen
- Las 3 opciones del check-in semanal son cualitativas, no métricas

**Incorrecto:**
> "¡No te olvides de registrar tu hábito hoy! Llevás 3 días sin abrir la app."

**Correcto:**
> "Cuando tengas un momento, tu semana te espera."

---

## Reglas de microcopy

### Palabras y frases PROHIBIDAS
- Racha / streak / días consecutivos
- Felicitaciones / ¡Lo lograste! / ¡Excelente!
- Fallaste / No cumpliste / Perdiste
- Objetivo / Meta / % completado
- Puntos / Logros / Niveles
- Signo de exclamación después de emojis o en mensajes de refuerzo

### Tono permitido
- Directo y adulto
- Cálido sin ser efusivo
- Observacional: "Esto es lo que estás construyendo"
- Afirmativo sin ser condescendiente

### Estructura del microcopy
1. Anclar en identidad: *"Como alguien que {identidad}..."*
2. Observación neutra del estado: *"Esta semana hubo momentos difíciles."*
3. Refuerzo del proceso: *"Seguir intentando es suficiente."*

---

## Jerarquía visual

### Tipografía
- **DM Serif Display** → títulos de pantalla (h1), frases de identidad
- **DM Sans Regular (400)** → cuerpo, descripciones, microcopy
- **DM Sans Medium (500)** → labels de botones, datos clave
- **DM Sans SemiBold (600)** → énfasis puntual, nunca en párrafos

### Color semántico
- `--primary (#5C4FE5)` → acción principal, CTA único por pantalla
- `--foreground (#0F0E17)` → texto principal
- `--muted-foreground` → texto secundario, fechas, metadata
- `--forma-gold (#C9973A)` → momentos de reconocimiento (no celebración)
- `--forma-green (#3A9E7A)` → estado de continuidad (no logro)
- `--destructive (#E05A5A)` → errores técnicos únicamente, nunca para "Hoy no"

### Espaciado
- Pantallas usan `px-6` horizontal, `pb-10` inferior
- Entre secciones: `gap-6` o `space-y-6`
- CTA siempre al fondo con `mt-auto`

---

## Patrones de interacción

### Bottom sheet (S-07)
- Se abre sobre la Pantalla de Ritmo, no navega a nueva pantalla
- El fondo (S-06) permanece visible debajo, levemente opaco
- Cierre: swipe down o botón X. No se cierra al tocar el fondo (previene accidentes)

### Overlay semanal (S-08)
- Full screen, no bottom sheet
- 3 opciones cualitativas con igual peso visual
- Campo de texto opcional debajo de las opciones (no obligatorio)

### Onboarding
- Un input por pantalla. Sin formularios multi-campo.
- Back navigation: definir antes de implementar (abierto en Fase B)
- Progress indicator: minimalista, no distrae

### Animaciones
- Transiciones de entrada: `opacity 0→1` + `y: 12→0`, 250ms ease-out
- No animar colores ni estados del check
- El bloque S-06a aparece con una animación suave de entrada vertical
