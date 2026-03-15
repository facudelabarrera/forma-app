"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Settings, Anchor, ArrowRight } from "lucide-react"

import { AppShell, ScreenContainer, PrimaryButton, ErrorBlock } from "@/components/core"
import { cn } from "@/lib/utils"
import { useAppState } from "@/hooks/useAppState"
import { useRhythmScreen } from "../hooks/useRhythmScreen"
import { RhythmGrid } from "./RhythmGrid"
import { ReturnBlock } from "./ReturnBlock"
import { SettingsSheet } from "./SettingsSheet"
import { EditHabitSheet } from "./EditHabitSheet"
import { DailyCheckSheet } from "@/features/reflection/components/DailyCheckSheet"
import { WeeklyReflectionOverlay } from "@/features/reflection/components/WeeklyReflectionOverlay"
import { saveEntry, saveReflection } from "@/lib/supabase/actions"
import type { CheckState, Habit } from "@/types"
import type { WeeklyOptionKey } from "@/lib/constants"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } },
}

export function RhythmScreen() {
  const { state, updateState, loaded, fetchError, retryFetch, userId, signOut } = useAppState()
  const [checkSheetOpen, setCheckSheetOpen] = useState(false)
  const [weeklyOverlayOpen, setWeeklyOverlayOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editHabitOpen, setEditHabitOpen] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [pendingRetry, setPendingRetry] = useState<
    | { type: "entry"; entry: { date: string; state: CheckState } }
    | { type: "reflection"; reflection: { week: number; completedAt: string; qualitativeResponse: string } }
    | null
  >(null)

  const router = useRouter()
  const screen = useRhythmScreen(state)
  const { habit } = state

  if (!loaded) return null

  if (fetchError) {
    return (
      <AppShell>
        <ScreenContainer className="items-center justify-center">
          <ErrorBlock
            message="No pudimos cargar tus datos. Revisá tu conexión."
            onRetry={retryFetch}
            onDismiss={retryFetch}
          />
        </ScreenContainer>
      </AppShell>
    )
  }

  if (!habit) {
    if (!userId) {
      router.replace("/login")
    } else {
      router.replace("/onboarding")
    }
    return null
  }

  async function handleCheck(checkState: CheckState) {
    const entry = { date: screen.todayStr, state: checkState }
    setSyncError(null)
    setPendingRetry(null)

    updateState((prev) => ({
      ...prev,
      entries: [
        ...prev.entries.filter((e) => e.date !== screen.todayStr),
        entry,
      ],
    }))

    if (userId && habit) {
      const { error } = await saveEntry(userId, habit.id, entry)
      if (error) {
        setSyncError("No se pudo guardar. Revisá tu conexión.")
        setPendingRetry({ type: "entry", entry })
      }
    }
  }

  async function handleWeeklyReflection(response: WeeklyOptionKey) {
    const reflection = {
      week: screen.weekToReflect,
      completedAt: new Date().toISOString(),
      qualitativeResponse: response,
    }
    setSyncError(null)
    setPendingRetry(null)

    updateState((prev) => ({
      ...prev,
      weeklyReflections: [...prev.weeklyReflections, reflection],
    }))

    if (userId && habit) {
      const { error } = await saveReflection(userId, habit.id, reflection)
      if (error) {
        setSyncError("No se pudo guardar la reflexión. Revisá tu conexión.")
        setPendingRetry({ type: "reflection", reflection })
      }
    }
  }

  async function handleRetry() {
    if (!userId || !habit || !pendingRetry) return
    setSyncError(null)
    if (pendingRetry.type === "entry") {
      const { error } = await saveEntry(userId, habit.id, pendingRetry.entry)
      if (error) setSyncError("No se pudo guardar. Revisá tu conexión.")
      else setPendingRetry(null)
    } else {
      const { error } = await saveReflection(userId, habit.id, pendingRetry.reflection)
      if (error) setSyncError("No se pudo guardar la reflexión. Revisá tu conexión.")
      else setPendingRetry(null)
    }
  }

  function handleHabitSaved(updated: Habit) {
    updateState((prev) => ({ ...prev, habit: updated }))
  }

  const showReturnBlockActive =
    screen.showReturnBlock && screen.returnVariant && !screen.hasCheckedToday

  const ctaLabel = screen.hasCheckedToday
    ? "Registrado — Hasta mañana"
    : showReturnBlockActive
    ? "Retomar hoy"
    : "Registrar hoy"

  return (
    <AppShell>
      <ScreenContainer className="pt-8 pb-32">

        {syncError && (
          <div className="mb-5">
            <ErrorBlock
              message={syncError}
              onRetry={pendingRetry ? handleRetry : undefined}
              onDismiss={() => { setSyncError(null); setPendingRetry(null) }}
            />
          </div>
        )}

        <motion.div
          className="flex flex-col gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >

          {/* ── Hero: Identity card ─────────────────────────────────────── */}
          <motion.div variants={item}>
            <div className="bg-card rounded-2xl border border-border shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Semana {screen.currentWeek}
                </span>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="text-muted-foreground p-1.5 -mr-1 rounded-full hover:bg-accent hover:text-foreground transition-colors duration-200"
                  aria-label="Ajustes"
                >
                  <Settings size={16} strokeWidth={1.5} />
                </button>
              </div>

              <h1 className="font-display text-[1.7rem] leading-[1.18] text-foreground mb-3">
                Soy alguien que{" "}
                <span className="italic">{habit.identity}</span>
              </h1>

              <p className="font-body text-sm text-muted-foreground leading-snug">
                {habit.name}
              </p>
            </div>
          </motion.div>

          {/* ── Return block (absence) ──────────────────────────────────── */}
          {showReturnBlockActive && (
            <motion.div variants={item}>
              <ReturnBlock
                variant={screen.returnVariant!}
                identity={habit.identity}
                habitName={habit.name}
                totalDays={screen.totalDays}
              />
            </motion.div>
          )}

          {/* ── Weekly reflection prompt ────────────────────────────────── */}
          {screen.showWeeklyReflection && (
            <motion.div variants={item}>
              <button
                onClick={() => setWeeklyOverlayOpen(true)}
                className="w-full bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center justify-between group hover:shadow-md transition-shadow duration-200 text-left"
              >
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    Semana {screen.weekToReflect} completa
                  </p>
                  <p className="font-body text-sm font-medium text-foreground">
                    Reflexión semanal
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                />
              </button>
            </motion.div>
          )}

          {/* ── Rhythm grid card ────────────────────────────────────────── */}
          <motion.div variants={item}>
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Mi ritmo
                </p>
                {screen.showGrid && (
                  <p className="font-body text-[10px] text-muted-foreground">
                    {screen.totalDays}{" "}
                    {screen.totalDays === 1 ? "día" : "días"} de evidencia
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {screen.showGrid ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RhythmGrid weeks={screen.weeksData} todayStr={screen.todayStr} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-7 text-center"
                  >
                    <p className="font-display text-xl italic text-foreground/70 leading-relaxed">
                      Tu ritmo se construye<br />día a día.
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-2">
                      La grilla aparece a partir del tercer día.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Stats + Ancla card ──────────────────────────────────────── */}
          <motion.div variants={item}>
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5">

              {/* Numbers row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 text-center">
                  <p className="font-display text-[2.2rem] leading-none text-foreground mb-1">
                    {screen.thisWeekCount}
                  </p>
                  <p className="font-body text-[11px] text-muted-foreground">
                    Esta semana
                  </p>
                </div>

                <div className="w-px h-10 bg-border" />

                <div className="flex-1 text-center">
                  <p className="font-display text-[2.2rem] leading-none text-foreground mb-1">
                    {screen.totalDays}
                  </p>
                  <p className="font-body text-[11px] text-muted-foreground">
                    Total evidencia
                  </p>
                </div>
              </div>

              {/* Ancla */}
              {habit.ancla && (
                <>
                  <div className="w-full h-px bg-border mb-4" />
                  <div className="flex items-start gap-2.5">
                    <Anchor
                      size={13}
                      strokeWidth={1.5}
                      className="text-muted-foreground mt-0.5 shrink-0"
                    />
                    <p className="font-body text-sm text-muted-foreground leading-snug">
                      {habit.ancla}
                    </p>
                  </div>
                </>
              )}

              {/* Ver proceso link */}
              <button
                onClick={() => router.push("/progress")}
                className={cn(
                  "flex items-center gap-1 font-body text-xs text-muted-foreground",
                  "hover:text-foreground transition-colors duration-200 group",
                  habit.ancla ? "mt-4" : "mt-0"
                )}
              >
                <span>Ver tu proceso</span>
                <ArrowRight
                  size={11}
                  strokeWidth={1.5}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </button>

            </div>
          </motion.div>

        </motion.div>
      </ScreenContainer>

      {/* ── Fixed bottom CTA ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pb-8 pt-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <PrimaryButton
            disabled={screen.hasCheckedToday}
            onClick={() => { if (!screen.hasCheckedToday) setCheckSheetOpen(true) }}
            className={cn(screen.hasCheckedToday && "opacity-50")}
          >
            {ctaLabel}
          </PrimaryButton>
        </div>
      </div>

      <DailyCheckSheet
        open={checkSheetOpen}
        onClose={() => setCheckSheetOpen(false)}
        identity={habit.identity}
        habitName={habit.name}
        onCheck={handleCheck}
        isReturn={!!showReturnBlockActive}
      />

      <AnimatePresence>
        {weeklyOverlayOpen && (
          <WeeklyReflectionOverlay
            open={weeklyOverlayOpen}
            onClose={() => setWeeklyOverlayOpen(false)}
            identity={habit.identity}
            habitName={habit.name}
            weekNumber={screen.weekToReflect}
            lastWeekCells={screen.lastWeekCells}
            lastWeekCount={screen.lastWeekCount}
            totalDays={screen.totalDays}
            onSave={handleWeeklyReflection}
          />
        )}
      </AnimatePresence>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        identity={habit.identity}
        habitName={habit.name}
        onSignOut={signOut}
        onEditHabit={() => setEditHabitOpen(true)}
      />

      {userId && (
        <EditHabitSheet
          open={editHabitOpen}
          onClose={() => setEditHabitOpen(false)}
          habit={habit}
          userId={userId}
          onSave={handleHabitSaved}
        />
      )}

    </AppShell>
  )
}
