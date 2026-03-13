import { cn } from "@/lib/utils"

type SupportVariant = "neutral" | "affirm" | "support"

interface SupportMessageProps {
  message: string
  variant?: SupportVariant
  className?: string
}

const variantStyles: Record<SupportVariant, string> = {
  neutral: "text-muted-foreground",
  affirm:  "text-primary",
  support: "text-foreground/70",
}

/**
 * SupportMessage — identity-first supportive text block.
 * Used throughout FORMA for tone-aligned messaging.
 *
 * Rules (from FORMA microcopy brief):
 * - No exclamation marks
 * - No "felicitaciones" or streak language
 * - Always reference identity, not just the habit
 */
export function SupportMessage({
  message,
  variant = "neutral",
  className,
}: SupportMessageProps) {
  return (
    <p
      className={cn(
        "font-body text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
    >
      {message}
    </p>
  )
}
