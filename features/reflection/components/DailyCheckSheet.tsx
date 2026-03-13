"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { PrimaryButton } from "@/components/core"
import { cn } from "@/lib/utils"
import { CHECK_OPTIONS } from "@/lib/constants"
import type { CheckState } from "@/types"

interface DailyCheckSheetProps {
  open: boolean
  onClose: () => void
  identity: string
  habitName: string
  onCheck: (state: CheckState) => void
  /** Pass true when opening from the return block — changes the header copy */
  isReturn?: boolean
}

const POST_CHECK_COPY: Record<CheckState, (identity: string, habitName: string) => string> = {
  "lo-hice": (identity) =>
    `Hoy actuaste como alguien que ${identity}. Eso es evidencia.`,
  "dia-dificil": (_, habitName) =>
    `Los días difíciles son evidencia de que ${habitName} te importa.`,
  "hoy-no": () => "Registrado. Mañana es otro día.",
}

export function DailyCheckSheet({
  open,
  onClose,
  identity,
  habitName,
  onCheck,
  isReturn = false,
}: DailyCheckSheetProps) {
  const [selected, setSelected] = useState<CheckState | null>(null)

  function handleSelect(state: CheckState) {
    setSelected(state)
    onCheck(state)
  }

  function handleClose() {
    setSelected(null)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-0 bg-background px-6 pb-10 pt-6 focus:outline-none"
      >
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <p className="font-body text-sm text-muted-foreground leading-snug">
                  {isReturn
                    ? "Bienvenido de vuelta. ¿Cómo fue hoy?"
                    : `Como alguien que ${identity}…`}
                </p>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground p-1 -mt-0.5 shrink-0"
                  aria-label="Cerrar"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Tristate options — equal visual weight */}
              <div className="flex flex-col gap-3">
                {(Object.keys(CHECK_OPTIONS) as CheckState[]).map(state => (
                  <button
                    key={state}
                    onClick={() => handleSelect(state)}
                    className={cn(
                      "w-full h-14 rounded-2xl",
                      "border border-border bg-card",
                      "font-body text-base font-medium text-foreground",
                      "hover:bg-accent transition-colors duration-150",
                      "active:scale-[0.98]"
                    )}
                  >
                    {CHECK_OPTIONS[state].label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="post-check"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <p className="font-body text-base text-foreground leading-relaxed">
                {POST_CHECK_COPY[selected](identity, habitName)}
              </p>

              <PrimaryButton onClick={handleClose}>
                Listo
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  )
}
