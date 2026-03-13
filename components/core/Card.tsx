import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  /** Make the card pressable/clickable */
  onClick?: () => void
}

/**
 * Card — FORMA content card.
 * Used for habit display, stats blocks, and entry items.
 */
export function Card({ children, className, onClick }: CardProps) {
  const Tag = onClick ? "button" : "div"

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full bg-card rounded-2xl border border-border p-5",
        "text-left",
        onClick && [
          "transition-all duration-150",
          "hover:border-primary/30 hover:shadow-sm",
          "active:scale-[0.99]",
          "cursor-pointer",
        ],
        className
      )}
    >
      {children}
    </Tag>
  )
}
