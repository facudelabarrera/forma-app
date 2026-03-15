"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { FormInput, PrimaryButton, SecondaryButton, SectionLabel, ErrorBlock } from "@/components/core"
import { saveHabit } from "@/lib/supabase/actions"
import type { Habit } from "@/types"

const editHabitSchema = z.object({
  identity: z
    .string()
    .min(3, "Contá un poco más sobre tu identidad")
    .max(80, "Tratá de ser más conciso"),
  name: z
    .string()
    .min(3, "Describí el hábito concreto")
    .max(100, "Tratá de ser más conciso"),
  ancla: z
    .string()
    .min(3, "Agregá un poco de contexto")
    .max(120, "Tratá de ser más conciso"),
})

type EditHabitFormData = z.infer<typeof editHabitSchema>

interface EditHabitSheetProps {
  open: boolean
  onClose: () => void
  habit: Habit
  userId: string
  onSave: (updated: Habit) => void
}

export function EditHabitSheet({
  open,
  onClose,
  habit,
  userId,
  onSave,
}: EditHabitSheetProps) {
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditHabitFormData>({
    resolver: zodResolver(editHabitSchema),
    defaultValues: {
      identity: habit.identity,
      name: habit.name,
      ancla: habit.ancla,
    },
  })

  async function onSubmit(data: EditHabitFormData) {
    setSaving(true)
    setSaveError(null)

    const updated: Habit = {
      ...habit,
      identity: data.identity,
      name: data.name,
      ancla: data.ancla,
    }

    const { error } = await saveHabit(userId, updated)

    if (error) {
      setSaveError("No se pudo guardar. Revisá tu conexión e intentá de nuevo.")
      setSaving(false)
      return
    }

    onSave(updated)
    setSaving(false)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-t border-border bg-card px-6 pb-10 pt-6 focus:outline-none shadow-lg max-h-[90dvh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <SectionLabel>Editar hábito</SectionLabel>

          <FormInput
            label="Identidad"
            hint='Completá: "Soy alguien que…"'
            error={errors.identity?.message}
            {...register("identity")}
          />

          <FormInput
            label="Hábito concreto"
            error={errors.name?.message}
            {...register("name")}
          />

          <FormInput
            label="Contexto / ancla"
            hint="Cuándo y dónde lo hacés"
            error={errors.ancla?.message}
            {...register("ancla")}
          />

          {saveError && <ErrorBlock message={saveError} onDismiss={() => setSaveError(null)} />}

          <div className="flex flex-col gap-3 pt-2">
            <PrimaryButton type="submit" loading={saving} disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </PrimaryButton>
            <SecondaryButton type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </SecondaryButton>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
