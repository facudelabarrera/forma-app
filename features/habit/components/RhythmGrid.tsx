"use client"

import { cn } from "@/lib/utils"
import { GRID_OPACITY, DAY_HEADERS } from "@/lib/constants"
import type { CheckState } from "@/types"
import type { DayCell } from "../hooks/useRhythmScreen"

interface RhythmGridProps {
  weeks: DayCell[][]
  todayStr: string
}

export function RhythmGrid({ weeks, todayStr }: RhythmGridProps) {
  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_HEADERS.map((day, i) => (
          <div
            key={i}
            className="text-center text-[10px] text-muted-foreground font-body"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map(({ date, state }) => (
              <GridCell key={date} state={state} isToday={date === todayStr} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function GridCell({
  state,
  isToday,
}: {
  state: CheckState | "future" | "empty"
  isToday: boolean
}) {
  const todayRing = isToday
    ? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
    : ""

  if (state === "future") {
    return (
      <div
        className={cn(
          "aspect-square rounded-sm border border-border",
          todayRing
        )}
      />
    )
  }

  const opacity =
    state === "empty" ? GRID_OPACITY["empty"] : GRID_OPACITY[state as CheckState]

  return (
    <div
      className={cn("aspect-square rounded-sm bg-foreground", todayRing)}
      style={{ opacity }}
    />
  )
}
