"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AppShell, ScreenContainer, PrimaryButton, FormInput, ProgressDots, SectionLabel } from "@/components/core"
import { habitSchema, type HabitFormData } from "../schemas"

interface HabitStepProps {
  defaultValues?: Partial<HabitFormData>
  onNext: (data: HabitFormData) => void
}

export function HabitStep({ defaultValues, onNext }: HabitStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues,
  })

  return (
    <AppShell>
      <ScreenContainer className="gap-0 pt-6">

        <ProgressDots total={3} current={1} className="mb-8" />

        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-display text-2xl text-foreground leading-tight">
            ¿Quién querés ser?
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Empezá por la identidad. El hábito es la evidencia de esa persona.
          </p>
        </div>

        <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-1.5">
            <SectionLabel className="mb-1">Tu identidad</SectionLabel>
            <p className="font-body text-sm text-muted-foreground mb-3">
              Completá: &quot;Soy alguien que…&quot;
            </p>
            <FormInput
              label="Identidad"
              placeholder="corre tres veces por semana"
              error={errors.identity?.message}
              {...register("identity")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <SectionLabel className="mb-1">El hábito concreto</SectionLabel>
            <p className="font-body text-sm text-muted-foreground mb-3">
              ¿Qué hacés exactamente?
            </p>
            <FormInput
              label="Hábito"
              placeholder="salir a correr 30 minutos"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <div className="mt-auto pt-4">
            <PrimaryButton type="submit">
              Continuar
            </PrimaryButton>
          </div>
        </form>

      </ScreenContainer>
    </AppShell>
  )
}
