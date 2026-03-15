"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReturnVariant } from "../hooks/useRhythmScreen"

interface ReturnBlockProps {
  variant: ReturnVariant
  identity: string
  habitName: string
  totalDays: number
}

export function ReturnBlock({ variant, identity, habitName, totalDays }: ReturnBlockProps) {
  const copy = getReturnCopy(variant, identity, habitName, totalDays)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-xl px-4 py-3 shadow-sm",
        variant === "C"
          ? "bg-forma-gold/8 border border-forma-gold/20"
          : "bg-card border border-border"
      )}
    >
      <p className="font-body text-sm text-foreground leading-relaxed">{copy}</p>
    </motion.div>
  )
}

function getReturnCopy(
  variant: ReturnVariant,
  identity: string,
  habitName: string,
  totalDays: number
): string {
  const evidence = `${totalDays} ${totalDays === 1 ? "día" : "días"} de evidencia`
  switch (variant) {
    case "A":
      return `Estás acá. Tu ritmo de ${habitName} tiene ${evidence}. ¿Retomamos hoy?`
    case "B":
      return `Hace unos días que no nos vemos. Lo que construiste sigue acá: ${evidence} como alguien que ${identity}.`
    case "C":
      return "Este momento es parte del proceso. La mayoría de las personas pasan por acá."
  }
}
