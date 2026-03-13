"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { PrimaryButton, SectionLabel, SupportMessage } from "@/components/core"
import { cn } from "@/lib/utils"
import { WEEKLY_OPTIONS, GRID_OPACITY, DAY_HEADERS, type WeeklyOptionKey } from "@/lib/constants"
import type { DayCell } from "@/features/habit/hooks/useRhythmScreen"
import type { CheckState } from "@/types"

interface WeeklyReflectionOverlayProps {
  open: boolean
  onClose: () => void
  identity: string
  habitName: string
  weekNumber: number
  lastWeekCells: DayCell[]
  lastWeekCount: number
  totalDays: number
  onSave: (response: WeeklyOptionKey) => void
}

type Step = "intro" | "question" | "reflection"

const REFLECTION_COPY: Record<WeeklyOptionKey, (identity: string, habitName: string) => string> = {
  "si": (identity, habitName) =>
    `Esta semana tu ritmo de ${habitName} estuvo presente. No porque hayas sido perfecto — sino porque elegiste ser alguien que ${identity} más días que no. Eso se acumula.`,
  "a-medias": () =>
    `La semana tuvo sus altibajos, y eso también es parte del proceso. Lo que construiste hasta acá sigue siendo tuyo.`,
  "dificil": (identity) =>
    `Las semanas difíciles también forman parte del ritmo. Lo que importa es que seguís acá, reconociendo el proceso como alguien que ${identity}.`,
}

export function WeeklyReflectionOverlay({
  open,
  onClose,
  identity,
  habitName,
  weekNumber,
  lastWeekCells,
  lastWeekCount,
  totalDays,
  onSave,
}: WeeklyReflectionOverlayProps) {
  const [step, setStep] = useState<Step>("intro")
  const [selected, setSelected] = useState<WeeklyOptionKey | null>(null)

  function handleSelect(key: WeeklyOptionKey) {
    setSelected(key)
    onSave(key)
    setStep("reflection")
  }

  function handleClose() {
    setStep("intro")
    setSelected(null)
    onClose()
  }

  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex flex-col flex-1 max-w-[430px] mx-auto w-full px-6 pt-6 pb-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Reflexión · Semana {weekNumber}
          </p>
          <button
            onClick={handleClose}
            className="text-muted-foreground p-1 -mr-1 rounded-full hover:bg-accent transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1"
            >
              <div className="flex flex-col gap-4 flex-1">
                <h2 className="font-display text-3xl text-foreground leading-tight">
                  Tomemos un momento para mirar la semana.
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  No es una evaluación. Es una pausa para reconocer el proceso.
                </p>

                {/* Mini week preview */}
                <div className="mt-4">
                  <SectionLabel className="mb-3">Tu semana {weekNumber}</SectionLabel>
                  <MiniWeekGrid cells={lastWeekCells} />
                </div>
              </div>

              <PrimaryButton onClick={() => setStep("question")}>
                Empezar
              </PrimaryButton>
            </motion.div>
          )}

          {/* ── QUESTION ── */}
          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 gap-6"
            >
              <h2 className="font-display text-2xl text-foreground leading-tight">
                ¿Esta semana actuaste como alguien que {identity}?
              </h2>

              {/* Mini-grid */}
              <div>
                <SectionLabel className="mb-3">Tu semana</SectionLabel>
                <MiniWeekGrid cells={lastWeekCells} />
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {WEEKLY_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={cn(
                      "w-full h-14 rounded-2xl",
                      "border border-border bg-card",
                      "font-body text-base font-medium text-foreground",
                      "hover:bg-accent transition-colors duration-150",
                      "active:scale-[0.98]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Escape — "Ahora no" per wireframe spec */}
              <button
                onClick={handleClose}
                className="font-body text-sm text-muted-foreground text-center py-2 mt-auto"
              >
                Ahora no
              </button>
            </motion.div>
          )}

          {/* ── REFLECTION ── */}
          {step === "reflection" && selected && (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 gap-6"
            >
              {/* Selected response */}
              <div className="flex flex-col gap-2">
                <SectionLabel>Tu respuesta</SectionLabel>
                <div className={cn(
                  "w-full h-14 rounded-2xl px-4 flex items-center",
                  "border border-border bg-accent/10",
                  "font-body text-base font-medium text-foreground"
                )}>
                  {WEEKLY_OPTIONS.find(o => o.key === selected)?.label}
                </div>
              </div>

              {/* Template reflection */}
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2">
                <SectionLabel>Reflexión de la semana</SectionLabel>
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {REFLECTION_COPY[selected](identity, habitName)}
                </p>
              </div>

              {/* Week stats */}
              <div className="flex justify-between">
                <div>
                  <p className="font-body text-[11px] text-muted-foreground mb-0.5">
                    Semana {weekNumber}
                  </p>
                  <p className="font-body text-sm font-medium text-foreground">
                    {lastWeekCount} {lastWeekCount === 1 ? "día" : "días"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-[11px] text-muted-foreground mb-0.5">
                    Acumulado
                  </p>
                  <p className="font-body text-sm font-medium text-foreground">
                    {totalDays} {totalDays === 1 ? "día" : "días"} de evidencia
                  </p>
                </div>
              </div>

              {/* Reconnection message */}
              <SupportMessage
                message="Esta práctica no se trata de hacerlo perfecto. Se trata de seguir construyendo."
                className="text-center px-4"
              />

              <div className="mt-auto">
                <PrimaryButton onClick={handleClose}>
                  Sigamos construyendo
                </PrimaryButton>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function MiniWeekGrid({ cells }: { cells: DayCell[] }) {
  if (cells.length === 0) return null

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {DAY_HEADERS.map((d, i) => (
          <div key={i} className="text-center font-body text-[10px] text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, state }) => {
          if (state === "future") {
            return <div key={date} className="aspect-square rounded-sm border border-border" />
          }
          const opacity =
            state === "empty" ? GRID_OPACITY["empty"] : GRID_OPACITY[state as CheckState]
          return (
            <div
              key={date}
              className="aspect-square rounded-sm bg-foreground"
              style={{ opacity }}
            />
          )
        })}
      </div>
    </div>
  )
}
