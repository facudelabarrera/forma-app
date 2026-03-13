"use client"

import { createClient } from "./client"
import type { Habit, DailyEntry, WeeklyReflection } from "@/types"

/** Guarda un hábito nuevo en Supabase. Desactiva el anterior si existía. */
export async function saveHabit(userId: string, habit: Habit): Promise<void> {
  const supabase = createClient()

  await supabase
    .from("habits")
    .update({ is_active: false })
    .eq("user_id", userId)

  const { error } = await supabase.from("habits").upsert({
    id: habit.id,
    user_id: userId,
    identity: habit.identity,
    name: habit.name,
    ancla: habit.ancla,
    started_at: habit.createdAt,
    is_active: true,
  })

  if (error) console.error("[forma] saveHabit:", error.message)
}

/** Guarda (o actualiza) un registro diario. Upsert por (user_id, habit_id, date). */
export async function saveEntry(
  userId: string,
  habitId: string,
  entry: DailyEntry
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("daily_entries").upsert(
    {
      user_id: userId,
      habit_id: habitId,
      date: entry.date,
      state: entry.state,
      reflection: entry.reflection ?? null,
    },
    { onConflict: "user_id,habit_id,date" }
  )

  if (error) console.error("[forma] saveEntry:", error.message)
}

/** Guarda (o actualiza) una reflexión semanal. Upsert por (user_id, habit_id, week_number). */
export async function saveReflection(
  userId: string,
  habitId: string,
  reflection: WeeklyReflection
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("weekly_reflections").upsert(
    {
      user_id: userId,
      habit_id: habitId,
      week_number: reflection.week,
      qualitative_response: reflection.qualitativeResponse,
      free_reflection: reflection.freeReflection ?? null,
      completed_at: reflection.completedAt,
    },
    { onConflict: "user_id,habit_id,week_number" }
  )

  if (error) console.error("[forma] saveReflection:", error.message)
}
