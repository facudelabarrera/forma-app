"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"

import { AppShell, ScreenContainer, TopBar, Card, SectionLabel, Divider, SupportMessage } from "@/components/core"
import { useAppState } from "@/hooks/useAppState"
import { useRhythmScreen } from "@/features/habit/hooks/useRhythmScreen"
import { RhythmGrid } from "@/features/habit/components/RhythmGrid"
import { SHORT_ABSENCE_DAYS } from "@/lib/constants"
import { daysBetween } from "@/lib/utils"
import type { DailyEntry } from "@/types"

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ]
  return `${d} de ${months[m - 1]} de ${y}`
}

function getWeekOfHabit(entryDate: string, createdAt: string): number {
  const diff = daysBetween(createdAt, entryDate)
  return Math.floor(diff / 7) + 1
}

interface Milestone {
  id: string
  date: string
  label: string
  description: string
}

function computeMilestones(entries: DailyEntry[], createdAt: string): {
  milestones: Milestone[]
  returnCount: number
  activeWeeks: number
} {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const milestones: Milestone[] = []

  if (sorted.length > 0) {
    milestones.push({
      id: "first-day",
      date: sorted[0].date,
      label: "Primer día",
      description: "Empezaste a construir evidencia de quien querés ser.",
    })
  }

  let returnCount = 0
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1].date, sorted[i].date)
    if (gap >= SHORT_ABSENCE_DAYS) {
      returnCount++
      if (returnCount === 1) {
        milestones.push({
          id: "first-return",
          date: sorted[i].date,
          label: "Primera pausa superada",
          description: "Volviste después de una pausa. Eso también es parte del proceso.",
        })
      }
    }
  }

  const weekSet = new Set(sorted.map(e => getWeekOfHabit(e.date, createdAt)))
  const activeWeeks = weekSet.size

  return { milestones, returnCount, activeWeeks }
}

export function ProgressScreen() {
  const router = useRouter()
  const { state, loaded } = useAppState()
  const screen = useRhythmScreen(state)

  useEffect(() => {
    if (loaded && !state.habit) {
      router.replace("/")
    }
  }, [loaded, state.habit, router])

  if (!loaded) return null

  const { habit, entries } = state

  if (!habit) return null

  const createdAt = habit.createdAt.split("T")[0]
  const { milestones, returnCount, activeWeeks } = computeMilestones(entries, createdAt)

  const totalDays = entries.length

  return (
    <AppShell>
      <motion.div
        className="flex flex-col flex-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <TopBar
          title="Tu proceso"
          showBack
          onBack={() => router.push("/")}
        />

        <ScreenContainer className="gap-0 pt-2">

          {/* Identity */}
          <div className="mb-6">
            <span className="font-body text-sm font-medium text-foreground bg-accent rounded-full px-3 py-1 leading-snug">
              Soy alguien que {habit.identity}
            </span>
            <p className="font-body text-xs text-muted-foreground mt-3">
              {habit.name} · desde el {formatDate(createdAt)}
            </p>
          </div>

          <Divider className="mb-6" />

          {/* Full history grid */}
          <SectionLabel className="mb-3">Tu ritmo completo</SectionLabel>

          {screen.showGrid ? (
            <RhythmGrid weeks={screen.weeksData} todayStr={screen.todayStr} />
          ) : (
            <SupportMessage message="Tu ritmo se construye día a día." />
          )}

          <Divider className="mt-6 mb-6" />

          {/* Evidence stats */}
          <SectionLabel className="mb-3">Tu evidencia</SectionLabel>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card>
              <p className="font-body text-2xl font-medium text-foreground leading-none mb-1">
                {totalDays}
              </p>
              <p className="font-body text-xs text-muted-foreground leading-snug">
                {totalDays === 1 ? "día registrado" : "días registrados"}
              </p>
            </Card>

            <Card>
              <p className="font-body text-2xl font-medium text-foreground leading-none mb-1">
                {activeWeeks}
              </p>
              <p className="font-body text-xs text-muted-foreground leading-snug">
                {activeWeeks === 1 ? "semana activa" : "semanas activas"}
              </p>
            </Card>

            {returnCount > 0 && (
              <Card className="col-span-2">
                <p className="font-body text-2xl font-medium text-foreground leading-none mb-1">
                  {returnCount}
                </p>
                <p className="font-body text-xs text-muted-foreground leading-snug">
                  {returnCount === 1
                    ? "vez que retomaste después de una pausa"
                    : "veces que retomaste después de una pausa"}
                </p>
              </Card>
            )}
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <>
              <Divider className="mb-6" />

              <SectionLabel className="mb-3">Momentos del proceso</SectionLabel>

              <div className="flex flex-col gap-3 mb-6">
                {milestones.map(m => (
                  <div key={m.id} className="flex flex-col gap-0.5">
                    <p className="font-body text-xs text-muted-foreground">
                      {formatDate(m.date)}
                    </p>
                    <p className="font-body text-sm font-medium text-foreground">
                      {m.label}
                    </p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <Divider className="mb-6" />

          {/* Identity connection */}
          <SupportMessage
            message="Cada práctica es evidencia de quien estás construyendo ser."
            className="text-center px-4 pb-4"
          />

        </ScreenContainer>
      </motion.div>
    </AppShell>
  )
}
