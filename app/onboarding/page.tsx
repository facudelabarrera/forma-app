"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { useAppState } from "@/hooks/useAppState"
import { WelcomeStep } from "@/features/habit/components/WelcomeStep"
import { HabitStep } from "@/features/habit/components/HabitStep"
import { AnclaStep } from "@/features/habit/components/AnclaStep"
import { SummaryStep } from "@/features/habit/components/SummaryStep"
import { saveHabit } from "@/lib/supabase/actions"
import type { HabitFormData, AnclaFormData } from "@/features/habit/schemas"

type Step = "welcome" | "habit" | "ancla" | "summary"

const STEP_ORDER: Step[] = ["welcome", "habit", "ancla", "summary"]

export default function OnboardingPage() {
  const router = useRouter()
  const { updateState, userId } = useAppState()

  const [step, setStep] = useState<Step>("welcome")
  const [habitData, setHabitData] = useState<HabitFormData | null>(null)
  const [anclaData, setAnclaData] = useState<AnclaFormData | null>(null)

  function goNext(current: Step) {
    const idx = STEP_ORDER.indexOf(current)
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1])
  }

  function goBack(current: Step) {
    const idx = STEP_ORDER.indexOf(current)
    if (idx > 0) setStep(STEP_ORDER[idx - 1])
  }

  function handleHabitNext(data: HabitFormData) {
    setHabitData(data)
    goNext("habit")
  }

  function handleAnclaNext(data: AnclaFormData) {
    setAnclaData(data)
    goNext("ancla")
  }

  async function handleComplete() {
    if (!habitData || !anclaData) return

    const today = new Date()
    const createdAt = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

    const habit = {
      id: crypto.randomUUID(),
      identity: habitData.identity,
      name: habitData.name,
      ancla: anclaData.ancla,
      createdAt,
    }

    // Actualizar estado local optimísticamente
    updateState(() => ({
      onboardingComplete: true,
      habit,
      entries: [],
      weeklyReflections: [],
    }))

    // Persistir en Supabase (fire-and-forget — el usuario ya navegó)
    if (userId) {
      saveHabit(userId, habit).catch((err) =>
        console.error("[forma] onboarding saveHabit:", err)
      )
    }

    router.push("/")
  }

  const stepIndex = STEP_ORDER.indexOf(step)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full min-h-screen"
      >
        {step === "welcome" && (
          <WelcomeStep onNext={() => goNext("welcome")} />
        )}

        {step === "habit" && (
          <HabitStep
            defaultValues={habitData ?? undefined}
            onNext={handleHabitNext}
          />
        )}

        {step === "ancla" && (
          <AnclaStep
            defaultValues={anclaData ?? undefined}
            onNext={handleAnclaNext}
            onBack={() => goBack("ancla")}
          />
        )}

        {step === "summary" && habitData && anclaData && (
          <SummaryStep
            habitData={habitData}
            anclaData={anclaData}
            onComplete={handleComplete}
            onBack={() => goBack("summary")}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
