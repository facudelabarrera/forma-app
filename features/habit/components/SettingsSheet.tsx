"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SectionLabel, Divider } from "@/components/core"

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  habitName: string
  identity: string
  onSignOut: () => void
  onEditHabit: () => void
}

export function SettingsSheet({ open, onClose, habitName, identity, onSignOut, onEditHabit }: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-t border-border bg-card px-6 pb-10 pt-6 focus:outline-none shadow-lg"
      >
        <div className="flex flex-col gap-5">
          <SectionLabel>Tu hábito</SectionLabel>

          <div className="flex flex-col gap-1">
            <p className="font-body text-xs text-muted-foreground">Identidad</p>
            <p className="font-body text-sm text-foreground">Soy alguien que {identity}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-body text-xs text-muted-foreground">Hábito</p>
            <p className="font-body text-sm text-foreground">{habitName}</p>
          </div>

          <Divider />

          <button
            onClick={() => { onClose(); onEditHabit() }}
            className="font-body text-sm text-muted-foreground text-left hover:text-foreground transition-colors duration-200"
          >
            Editar hábito
          </button>

          <button
            onClick={onSignOut}
            className="font-body text-sm text-muted-foreground text-left hover:text-foreground transition-colors duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
