"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/hooks/useAppState"
import { RhythmScreen } from "@/features/habit/components/RhythmScreen"

export default function Home() {
  const { state, loaded } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (!loaded) return
    if (!state.onboardingComplete) {
      router.replace("/onboarding")
    }
  }, [loaded, state.onboardingComplete, router])

  // Prevent flash before localStorage is read
  if (!loaded) return null

  // Still redirecting
  if (!state.onboardingComplete) return null

  return <RhythmScreen />
}
