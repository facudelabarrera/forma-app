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
  const [fetchError, setFetchError] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let active = true

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setState(JSON.parse(stored))
    } catch {
      // ignore
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setLoaded(true)
      return
    }

    const supabase = createClient()

    async function syncFromUser(user: { id: string } | null) {
      if (!active) return

      if (!user) {
        setUserId(null)
        setState(DEFAULT_STATE)
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
        setLoaded(true)
        return
      }

      setUserId(user.id)

      const [
        { data: profile, error: profileError },
        { data: habit, error: habitError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle(),
      ])

      if (!active) return

      if (profileError || habitError) {
        console.error("[forma] useAppState fetch:", profileError?.message ?? habitError?.message)
        setFetchError(true)
        setLoaded(true)
        return
      }

      const onboardingComplete = profile?.onboarding_completed ?? !!habit

      if (!onboardingComplete || !habit) {
        const noHabitState: AppState = {
          ...DEFAULT_STATE,
          onboardingComplete,
        }
        setState(noHabitState)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(noHabitState)) } catch {}
        setLoaded(true)
        return
      }

      const [
        { data: entries, error: entriesError },
        { data: reflections, error: reflectionsError },
      ] = await Promise.all([
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

      if (!active) return

      if (entriesError || reflectionsError) {
        console.error("[forma] useAppState fetch:", entriesError?.message ?? reflectionsError?.message)
        setFetchError(true)
        setLoaded(true)
        return
      }

      if (!active) return

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
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)) } catch {}
      setLoaded(true)
    }

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      await syncFromUser(user ? { id: user.id } : null)
    }

    void init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncFromUser(session?.user ? { id: session.user.id } : null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
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

  const retryFetch = useCallback(() => {
    setFetchError(false)
    setLoaded(false)
    setState(DEFAULT_STATE)
    // Re-run by unmounting/remounting is not needed — reset loaded triggers re-init
    // Instead, we just reload the page for simplicity
    window.location.reload()
  }, [])

  return { state, updateState, seedState, loaded, fetchError, retryFetch, userId, signOut }
}
