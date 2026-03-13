# Producto — FORMA

## Propósito

FORMA ayuda a las personas a construir una nueva identidad a través de la repetición de un hábito.

No es un tracker de productividad. No mide eficiencia. No juzga ausencias.
Su función es crear un espacio donde el usuario pueda verse como la persona que quiere ser,
y encontrar evidencia de eso en su propio comportamiento.

---

## El problema que resuelve

Las apps de hábitos tradicionales fallan porque:

1. **Gamifican la consistencia.** Hacen que romper una racha se sienta como fracasar.
2. **Miden comportamiento, no identidad.** "Hice 12 días seguidos" no cambia quién sos.
3. **Abandonan al usuario en la ausencia.** Si no abriste la app 3 días, te desapareciste.
4. **Presionan en el momento crítico (semana 3).** Justo cuando el hábito todavía no está integrado.

FORMA invierte la lógica: primero definís quién sos, después construís evidencia de eso.

---

## Tipo de usuario

**Persona en transición activa.** Alguien que está tratando de cambiar un aspecto de su vida
y necesita un espacio para hacerlo sin presión de perfección.

Perfiles del research (ver `Research/sintesis-research.md`):

- **Martín** — profesional que quiere recuperar una práctica física. Abandona apps cuando rompe la racha.
- **Valentina** — estudiante que quiere leer más. Le molesta el tono "logros desbloqueados".
- **Sebastián** — padre con poco tiempo. Necesita que volver después de ausencia sea fácil.

Dolor común: **la app los hace sentir que fallaron en lugar de que están intentando.**

---

## Filosofía del producto

### Identidad > comportamiento

El cambio real empieza cuando la persona internaliza una nueva identidad.
"Soy alguien que lee" es más poderoso que "leí 20 días seguidos".

El hábito es **evidencia** de la identidad. No la identidad en sí.

### Proceso > perfección

Un día difícil no es un fracaso. Es parte del proceso.
Un día sin hacer el hábito tampoco es un fracaso. Es información.

La app no distingue entre estados "buenos" y "malos". Los tres tienen el mismo peso.

### Retorno > consistencia

Volver después de 5 días de ausencia es una acción valiente.
La app lo celebra (sin exclamaciones) y facilita el retorno.

El bloque S-06a está diseñado específicamente para esto.

### Acompañamiento > control

FORMA no empuja ni presiona. Acompaña.
La voz de la app es tranquila, adulta, directa. No es un coach. No es un terapeuta.
Es un espejo que te muestra quién estás siendo.

---

## Restricciones del MVP

- **1 hábito por usuario.** No se puede agregar un segundo hasta que se diseñe ese flujo.
- **Sin social.** No hay comparación entre usuarios, no hay grupos.
- **Sin coaching.** La app no da consejos ni recomendaciones personalizadas.
- **Sin analytics visibles.** No hay porcentajes, promedios ni scores.
- **Push notifications: máx 2 por semana.** W3 proactivo + recordatorio semanal.

---

## Flujo principal

```
Onboarding (1 vez):
  S-01 Bienvenida
  → S-02 Identidad ("Soy alguien que...")
  → S-03 Hábito (la acción concreta)
  → S-04 Ancla (actividad ancla)
  → S-05 Resumen + Permisos

Uso diario:
  S-06 Pantalla de Ritmo (home)
  → S-07 Check diario (bottom sheet, tristate)

Uso semanal:
  S-08 Check-in semanal (overlay, 3 opciones cualitativas)

Retorno tras ausencia:
  S-06a Bloque de retorno (3 variantes según días de ausencia)
```
