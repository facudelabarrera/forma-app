"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { AppState } from "@/types"
import { createClient } from "@/lib/supabase/client"

const STORAGE_KEY = "forma-state"

const DEFAULT_STATE: AppState = {
  onboardingComplete: false,
  habit: null,
  entries: [],
  weeklyReflections: [],
}

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Carga rápida desde localStorage para evitar flash
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setState(JSON.parse(stored))
    } catch {
      // ignore
    }

    // Carga autoritativa desde Supabase
    async function loadFromSupabase() {
      // Sin env vars configuradas, usar solo localStorage
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setLoaded(true)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoaded(true)
        return
      }

      setUserId(user.id)

      const { data: habit } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle()

      if (!habit) {
        setState(DEFAULT_STATE)
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
        setLoaded(true)
        return
      }

      const [{ data: entries }, { data: reflections }] = await Promise.all([
        supabase
          .from("daily_entries")
          .select("*")
          .eq("habit_id", habit.id)
          .order("date", { ascending: true }),
        supabase
          .from("weekly_reflections")
          .select("*")
          .eq("habit_id", habit.id)
          .order("week_number", { ascending: true }),
      ])

      const newState: AppState = {
        onboardingComplete: true,
        habit: {
          id: habit.id,
          identity: habit.identity,
          name: habit.name,
          ancla: habit.ancla,
          createdAt: habit.started_at,
        },
        entries: (entries ?? []).map((e) => ({
          date: e.date,
          state: e.state,
          reflection: e.reflection ?? undefined,
        })),
        weeklyReflections: (reflections ?? []).map((r) => ({
          week: r.week_number,
          completedAt: r.completed_at,
          qualitativeResponse: r.qualitative_response,
          freeReflection: r.free_reflection ?? undefined,
        })),
      }

      setState(newState)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      } catch {}
      setLoaded(true)
    }

    loadFromSupabase()
  }, [])

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const seedState = useCallback((seed: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    } catch {}
    setState(seed)
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setState(DEFAULT_STATE)
    setUserId(null)
    router.replace("/login")
  }, [router])

  return { state, updateState, seedState, loaded, userId, signOut }
}
