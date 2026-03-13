import type { CheckState } from "@/types"

export const APP_NAME = "FORMA"

// ─── Tristate check options ─────────────────────────────────────────────────
/** All three options carry equal visual weight — no hierarchy. */
export const CHECK_OPTIONS: Record<CheckState, { label: string }> = {
  "lo-hice":    { label: "Lo hice" },
  "dia-dificil": { label: "Día difícil" },
  "hoy-no":     { label: "Hoy no" },
} as const

// ─── Opacity grid visualization ─────────────────────────────────────────────
/** From architecture: opacity grid uses 3 levels + empty state */
export const GRID_OPACITY: Record<CheckState | "empty", number> = {
  "lo-hice":    1.0,
  "dia-dificil": 0.55,
  "hoy-no":     0.22,
  "empty":      0.08,
} as const

// ─── Push notification limits ───────────────────────────────────────────────
/** Max 2 pushes per week (W3 proactive + weekly reminder) */
export const MAX_WEEKLY_PUSHES = 2

// ─── Week 3 critical moment ─────────────────────────────────────────────────
/** Week 3 is the highest-risk dropout moment — use Variante C return block */
export const CRITICAL_RETURN_WEEK = 3
export const LONG_ABSENCE_DAYS = 5   // 5+ days → Variante B return block
export const SHORT_ABSENCE_DAYS = 2  // 2–4 days → Variante A return block
