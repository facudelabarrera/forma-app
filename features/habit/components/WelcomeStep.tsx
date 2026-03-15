"use client"

import { AppShell, ScreenContainer, PrimaryButton } from "@/components/core"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <AppShell>
      <ScreenContainer className="justify-between pt-16 pb-10">

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
              FORMA
            </p>
            <h1 className="font-display text-4xl text-foreground leading-tight">
              La identidad cambia el comportamiento.
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Primero definís quién sos. Después construís evidencia de eso, un día a la vez.
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Sin rachas. Sin presión. Solo tu ritmo.
            </p>
          </div>
        </div>

        <PrimaryButton onClick={onNext}>
          Empezar
        </PrimaryButton>

      </ScreenContainer>
    </AppShell>
  )
}
