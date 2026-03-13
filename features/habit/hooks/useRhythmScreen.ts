import type { AppState, CheckState } from "@/types"
import {
  CRITICAL_RETURN_WEEK,
  LONG_ABSENCE_DAYS,
  SHORT_ABSENCE_DAYS,
} from "@/lib/constants"
import { daysBetween } from "@/lib/utils"

export type ReturnVariant = "A" | "B" | "C"

export interface DayCell {
  date: string
  state: CheckState | "future" | "empty"
}

export interface RhythmScreenData {
  hasCheckedToday: boolean
  /** Show opacity grid — false for first 3 days */
  showGrid: boolean
  showReturnBlock: boolean
  returnVariant: ReturnVariant | null
  absenceDays: number
  currentWeek: number
  todayStr: string
  weeksData: DayCell[][]
  thisWeekCount: number
  totalDays: number
  /** True when the previous week has no reflection recorded */
  showWeeklyReflection: boolean
  /** Which week number to reflect on (currentWeek - 1) */
  weekToReflect: number
  /** Cells for the week being reflected on */
  lastWeekCells: DayCell[]
  /** Number of checked days in the week being reflected on */
  lastWeekCount: number
}

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Returns the Monday of the week containing `date` */
function getWeekMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(12, 0, 0, 0)
  const dow = d.getDay() // 0=Sun, 1=Mon, …
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d
}

function buildWeeksGrid(
  createdAt: string,
  todayStr: string,
  entryMap: Map<string, CheckState>
): DayCell[][] {
  const startMonday = getWeekMonday(new Date(createdAt + "T12:00:00"))
  const endMonday = getWeekMonday(new Date(todayStr + "T12:00:00"))
  // Complete the current week (show all 7 days)
  const end = new Date(endMonday)
  end.setDate(end.getDate() + 6)

  const weeks: DayCell[][] = []
  const cursor = new Date(startMonday)

  while (cursor <= end) {
    const week: DayCell[] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = toDateStr(cursor)
      const isBeforeCreation = dateStr < createdAt
      const isFuture = dateStr > todayStr
      const entryState = entryMap.get(dateStr)

      let state: CheckState | "future" | "empty"
      if (isBeforeCreation || (!isFuture && !entryState)) {
        state = "empty"
      } else if (isFuture) {
        state = "future"
      } else {
        state = entryState as CheckState
      }

      week.push({ date: dateStr, state })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

function hasReflectionForWeek(week: number, reflections: AppState["weeklyReflections"]): boolean {
  return reflections.some(r => r.week === week)
}

export function useRhythmScreen(state: AppState): RhythmScreenData {
  const today = new Date()
  const todayStr = toDateStr(today)

  const { habit, entries } = state

  if (!habit) {
    return {
      hasCheckedToday: false,
      showGrid: false,
      showReturnBlock: false,
      returnVariant: null,
      absenceDays: 0,
      currentWeek: 1,
      todayStr,
      weeksData: [],
      thisWeekCount: 0,
      totalDays: 0,
      showWeeklyReflection: false,
      weekToReflect: 0,
      lastWeekCells: [],
      lastWeekCount: 0,
    }
  }

  const createdAt = habit.createdAt.split("T")[0]
  const daysSinceCreation = daysBetween(createdAt, todayStr)
  const currentWeek = Math.floor(daysSinceCreation / 7) + 1

  const entryMap = new Map(entries.map(e => [e.date, e.state]))
  const hasCheckedToday = entryMap.has(todayStr)
  const totalDays = entries.length

  // Absence detection
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const lastEntryDate = sortedEntries[0]?.date

  let absenceDays = 0
  let showReturnBlock = false
  let returnVariant: ReturnVariant | null = null

  if (!hasCheckedToday && lastEntryDate) {
    absenceDays = daysBetween(lastEntryDate, todayStr)
    if (absenceDays >= SHORT_ABSENCE_DAYS) {
      showReturnBlock = true
      // Variante C takes priority: week 3 regardless of absence length
      if (currentWeek === CRITICAL_RETURN_WEEK) {
        returnVariant = "C"
      } else if (absenceDays >= LONG_ABSENCE_DAYS) {
        returnVariant = "B"
      } else {
        returnVariant = "A"
      }
    }
  }

  const showGrid = daysSinceCreation >= 3

  const weeksData = buildWeeksGrid(createdAt, todayStr, entryMap)

  // This week's checked days
  const monday = getWeekMonday(today)
  const mondayStr = toDateStr(monday)
  const thisWeekCount = entries.filter(e => e.date >= mondayStr && e.date <= todayStr).length

  // Weekly reflection trigger: available once a new week starts (currentWeek >= 2)
  // and no reflection has been recorded for the previous week
  const weekToReflect = currentWeek - 1
  const showWeeklyReflection =
    currentWeek >= 2 && !hasReflectionForWeek(weekToReflect, state.weeklyReflections)

  // Cells for the week being reflected on (second-to-last row in weeksData)
  const lastWeekCells = weeksData.length >= 2 ? weeksData[weeksData.length - 2] : []
  const lastWeekCount = lastWeekCells.filter(
    c => c.state === "lo-hice" || c.state === "dia-dificil"
  ).length

  return {
    hasCheckedToday,
    showGrid,
    showReturnBlock,
    returnVariant,
    absenceDays,
    currentWeek,
    todayStr,
    weeksData,
    thisWeekCount,
    totalDays,
    showWeeklyReflection,
    weekToReflect,
    lastWeekCells,
    lastWeekCount,
  }
}
