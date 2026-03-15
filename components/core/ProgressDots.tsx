import { cn } from "@/lib/utils"

interface ProgressDotsProps {
  total: number
  current: number
  className?: string
}

export function ProgressDots({ total, current, className }: ProgressDotsProps) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 w-6 rounded-full transition-colors duration-200",
            i < current ? "bg-foreground" : "bg-border"
          )}
        />
      ))}
    </div>
  )
}
