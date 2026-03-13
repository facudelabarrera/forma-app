"use client"

import { AppShell, ScreenContainer, PrimaryButton, Card, SectionLabel, Divider, SecondaryButton } from "@/components/core"
import type { HabitFormData } from "../schemas"
import type { AnclaFormData } from "../schemas"

interface SummaryStepProps {
  habitData: HabitFormData
  anclaData: AnclaFormData
  onComplete: () => void
  onBack: () => void
}

export function SummaryStep({ habitData, anclaData, onComplete, onBack }: SummaryStepProps) {
  return (
    <AppShell>
      <ScreenContainer className="gap-0 pt-5">

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          <div className="h-1 w-6 rounded-full bg-foreground" />
          <div className="h-1 w-6 rounded-full bg-foreground" />
          <div className="h-1 w-6 rounded-full bg-foreground" />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-display text-2xl text-foreground leading-tight">
            Así empieza tu ritmo
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Esto es lo que vas a construir, un día a la vez.
          </p>
        </div>

        {/* Summary card */}
        <Card>
          <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <SectionLabel>Tu identidad</SectionLabel>
              <p className="font-body text-base text-foreground leading-snug">
                Soy alguien que {habitData.identity}
              </p>
            </div>

            <Divider />

            <div className="flex flex-col gap-1">
              <SectionLabel>El hábito</SectionLabel>
              <p className="font-body text-base text-foreground leading-snug">
                {habitData.name}
              </p>
            </div>

            <Divider />

            <div className="flex flex-col gap-1">
              <SectionLabel>Cuándo</SectionLabel>
              <p className="font-body text-base text-foreground leading-snug">
                {anclaData.ancla}
              </p>
            </div>

          </div>
        </Card>

        {/* CTAs */}
        <div className="mt-auto pt-8 flex flex-col gap-3">
          <PrimaryButton onClick={onComplete}>
            Empezar hoy
          </PrimaryButton>
          <SecondaryButton variant="ghost" onClick={onBack}>
            Volver
          </SecondaryButton>
        </div>

      </ScreenContainer>
    </AppShell>
  )
}
