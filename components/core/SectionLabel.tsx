import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

/**
 * SectionLabel — small uppercase label for content sections.
 * Standardizes the recurring `text-[11px] uppercase tracking-widest` pattern.
 */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-body text-[11px] uppercase tracking-widest text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  )
}
