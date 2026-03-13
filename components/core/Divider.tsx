import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
}

/**
 * Divider — 1px horizontal separator using the border token.
 */
export function Divider({ className }: DividerProps) {
  return <div className={cn("h-px bg-border", className)} />
}
