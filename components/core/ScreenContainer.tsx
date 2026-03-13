import { cn } from "@/lib/utils"

interface ScreenContainerProps {
  children: React.ReactNode
  className?: string
  /** Remove horizontal padding (useful for full-bleed layouts) */
  noPadding?: boolean
}

/**
 * ScreenContainer — inner wrapper for each screen.
 * Provides consistent horizontal padding and vertical spacing.
 */
export function ScreenContainer({
  children,
  className,
  noPadding = false,
}: ScreenContainerProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1",
        !noPadding && "px-6",
        "pb-10",
        className
      )}
    >
      {children}
    </div>
  )
}
