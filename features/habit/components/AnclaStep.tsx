"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AppShell, ScreenContainer, PrimaryButton, SecondaryButton, FormInput, ProgressDots } from "@/components/core"
import { anclaSchema, type AnclaFormData } from "../schemas"

const SUGGESTIONS = [
  "Después de desayunar",
  "Antes de dormir",
  "Al llegar a casa",
  "Después del trabajo",
]

interface AnclaStepProps {
  defaultValues?: Partial<AnclaFormData>
  onNext: (data: AnclaFormData) => void
  onBack: () => void
}

export function AnclaStep({ defaultValues, onNext, onBack }: AnclaStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnclaFormData>({
    resolver: zodResolver(anclaSchema),
    defaultValues,
  })

  const anclaValue = watch("ancla") ?? ""

  return (
    <AppShell>
      <ScreenContainer className="gap-0 pt-6">

        <ProgressDots total={3} current={2} className="mb-8" />

        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-display text-2xl text-foreground leading-tight">
            ¿Cuándo lo hacés?
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Anclar el hábito a una rutina existente hace que sea más fácil sostenerlo.
          </p>
        </div>

        <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6 flex-1">
          <FormInput
            label="Contexto"
            placeholder="Después de desayunar · En el parque · A las 8am"
            hint="Podés combinar momento, lugar y hora"
            error={errors.ancla?.message}
            {...register("ancla")}
          />

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const current = anclaValue.trim()
                  setValue("ancla", current ? `${current} · ${s}` : s, { shouldValidate: true })
                }}
                className="font-body text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:bg-accent hover:text-foreground transition-colors duration-200"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-3">
            <PrimaryButton type="submit">
              Continuar
            </PrimaryButton>
            <SecondaryButton type="button" variant="ghost" onClick={onBack}>
              Volver
            </SecondaryButton>
          </div>
        </form>

      </ScreenContainer>
    </AppShell>
  )
}
