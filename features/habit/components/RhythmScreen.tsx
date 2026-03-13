"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Settings } from "lucide-react"

import { AppShell, ScreenContainer, PrimaryButton, SectionLabel, Divider } from "@/components/core"
import { cn } from "@/lib/utils"
import { useAppState } from "@/hooks/useAppState"
import { useRhythmScreen } from "../hooks/useRhythmScreen"
import { RhythmGrid } from "./RhythmGrid"
import { ReturnBlock } from "./ReturnBlock"
import { SettingsSheet } from "./SettingsSheet"
import { DailyCheckSheet } from "@/features/reflection/components/DailyCheckSheet"
import { WeeklyReflectionOverlay } from "@/features/reflection/components/WeeklyReflectionOverlay"
import { saveEntry, saveReflection } from "@/lib/supabase/actions"
import type { CheckState } from "@/types"
import type { WeeklyOptionKey } from "@/lib/constants"

export function RhythmScreen() {
  const { state, updateState, loaded, userId, signOut } = useAppState()
  const [checkSheetOpen, setCheckSheetOpen] = useState(false)
  const [weeklyOverlayOpen, setWeeklyOverlayOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const router = useRouter()
  const screen = useRhythmScreen(state)
  const { habit } = state

  if (!loaded) return null

  if (!habit) {
    return (
      <AppShell>
        <ScreenContainer className="items-center justify-center">
          <p className="font-body text-sm text-muted-foreground">Cargando…</p>
        </ScreenContainer>
      </AppShell>
    )
  }

  function handleCheck(checkState: CheckState) {
    const entry = { date: screen.todayStr, state: checkState }

    updateState((prev) => ({
      ...prev,
      entries: [
        ...prev.entries.filter((e) => e.date !== screen.todayStr),
        entry,
      ],
    }))

    if (userId && habit) {
      saveEntry(userId, habit.id, entry).catch((err) =>
        console.error("[forma] saveEntry:", err)
      )
    }
  }

  function handleWeeklyReflection(response: WeeklyOptionKey) {
    const reflection = {
      week: screen.weekToReflect,
      completedAt: new Date().toISOString(),
      qualitativeResponse: response,
    }

    updateState((prev) => ({
      ...prev,
      weeklyReflections: [...prev.weeklyReflections, reflection],
    }))

    if (userId && habit) {
      saveReflection(userId, habit.id, reflection).catch((err) =>
        console.error("[forma] saveReflection:", err)
      )
    }
  }

  const showReturnBlockActive =
    screen.showReturnBlock && screen.returnVariant && !screen.hasCheckedToday

  const ctaLabel = screen.hasCheckedToday
    ? "Registrado — Hasta mañana"
    : screen.showWeeklyReflection
    ? "Reflexión semanal →"
    : screen.showReturnBlock
    ? "Retomar hoy"
    : "Registrar hoy"

  function handleCtaClick() {
    if (screen.hasCheckedToday) return
    if (screen.showWeeklyReflection) {
      setWeeklyOverlayOpen(true)
    } else {
      setCheckSheetOpen(true)
    }
  }

  return (
    <AppShell>
      <motion.div
        className="flex flex-col flex-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <ScreenContainer className="gap-0 pt-5">

          {/* Identity bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-body text-sm font-medium text-foreground bg-accent rounded-full px-3 py-1 leading-snug min-w-0 flex-1 truncate">
              Soy alguien que {habit.identity}
            </span>
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-muted-foreground p-1.5 shrink-0 rounded-full hover:bg-accent transition-colors"
              aria-label="Ajustes"
            >
              <Settings size={18} strokeWidth={1.5} />
            </button>
          </div>

          <Divider className="mb-5" />

          {/* Return block S-06a */}
          {showReturnBlockActive && (
            <div className="mb-5">
              <ReturnBlock
                variant={screen.returnVariant!}
                identity={habit.identity}
                habitName={habit.name}
                totalDays={screen.totalDays}
              />
            </div>
          )}

          {/* Weekly reflection contextual prompt */}
          {screen.showWeeklyReflection && !screen.hasCheckedToday && (
            <p className="font-body text-xs text-muted-foreground mb-5 px-1">
              Es tu momento de la semana.
            </p>
          )}

          {/* Rhythm grid section */}
          <SectionLabel className="mb-3">Mi ritmo</SectionLabel>

          {screen.showGrid ? (
            <RhythmGrid weeks={screen.weeksData} todayStr={screen.todayStr} />
          ) : (
            <p className="font-body text-sm text-muted-foreground text-center py-8 leading-relaxed">
              Tu ritmo se construye día a día.
            </p>
          )}

          {/* Week summary */}
          <div className="flex justify-between mt-5">
            <div>
              <p className="font-body text-[11px] text-muted-foreground mb-0.5">Esta semana</p>
              <p className="font-body text-sm font-medium text-foreground">
                {screen.thisWeekCount}{" "}
                {screen.thisWeekCount === 1 ? "día" : "días"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-[11px] text-muted-foreground mb-0.5">Total</p>
              <p className="font-body text-sm font-medium text-foreground">
                {screen.totalDays}{" "}
                {screen.totalDays === 1 ? "día" : "días"} de evidencia
              </p>
            </div>
          </div>

          {/* Progress link */}
          <button
            onClick={() => router.push("/progress")}
            className="font-body text-xs text-muted-foreground mt-3 self-start hover:text-foreground transition-colors"
          >
            Ver tu proceso →
          </button>

          {/* CTA */}
          <div className="mt-auto pt-8">
            <PrimaryButton
              disabled={screen.hasCheckedToday}
              onClick={handleCtaClick}
              className={cn(screen.hasCheckedToday && "opacity-50")}
            >
              {ctaLabel}
            </PrimaryButton>
          </div>

        </ScreenContainer>
      </motion.div>

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
      />

    </AppShell>
  )
}
