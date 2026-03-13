// ─── Check tristate ────────────────────────────────────────────────────────────
/** The three equal-weight daily check options. No hierarchy between them. */
export type CheckState = "lo-hice" | "dia-dificil" | "hoy-no"

// ─── Onboarding ────────────────────────────────────────────────────────────────
export type OnboardingStep = "identidad" | "habito" | "ancla" | "resumen"

// ─── Core domain ───────────────────────────────────────────────────────────────
/**
 * A single habit — always identity-first.
 * MVP: only one habit per user.
 */
export interface Habit {
  id: string
  /** "Soy alguien que..." — the identity statement */
  identity: string
  /** The concrete habit action */
  name: string
  /** Anchor activity (the existing routine it attaches to) */
  ancla: string
  createdAt: string // ISO date string
}

/** A single day's check entry */
export interface DailyEntry {
  /** YYYY-MM-DD */
  date: string
  state: CheckState
  /** Optional free-text reflection (S-07) */
  reflection?: string
}

/** Weekly check-in response (S-08 overlay) */
export interface WeeklyReflection {
  /** 1-indexed week number since habit creation */
  week: number
  completedAt: string // ISO date string
  /** One of the 3 qualitative options selected */
  qualitativeResponse: string
  /** Optional free-text from the template prompt */
  freeReflection?: string
}

// ─── App state ─────────────────────────────────────────────────────────────────
export interface AppState {
  onboardingComplete: boolean
  habit: Habit | null
  entries: DailyEntry[]
  weeklyReflections: WeeklyReflection[]
}
