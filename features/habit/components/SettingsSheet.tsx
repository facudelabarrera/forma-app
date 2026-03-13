"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SectionLabel } from "@/components/core"

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  habitName: string
  identity: string
  onSignOut: () => void
}

export function SettingsSheet({ open, onClose, habitName, identity, onSignOut }: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-0 bg-background px-6 pb-10 pt-6 focus:outline-none"
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

          <div className="h-px bg-border" />

          <button
            onClick={onSignOut}
            className="font-body text-sm text-muted-foreground text-left hover:text-foreground transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
