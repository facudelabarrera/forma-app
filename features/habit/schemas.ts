import { z } from "zod"

export const habitSchema = z.object({
  identity: z
    .string()
    .min(3, "Contá un poco más sobre tu identidad")
    .max(80, "Tratá de ser más conciso"),
  name: z
    .string()
    .min(3, "Describí el hábito concreto")
    .max(100, "Tratá de ser más conciso"),
})

export const anclaSchema = z.object({
  ancla: z
    .string()
    .min(3, "Agregá un poco de contexto")
    .max(120, "Tratá de ser más conciso"),
})

export type HabitFormData = z.infer<typeof habitSchema>
export type AnclaFormData = z.infer<typeof anclaSchema>
