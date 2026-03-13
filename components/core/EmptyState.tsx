import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description?: string
  /** Optional action element (e.g. a button) */
  action?: React.ReactNode
  /** Optional icon element */
  icon?: React.ReactNode
  className?: string
}

/**
 * EmptyState — zero-state component.
 * Used when there's no content to display yet.
 * Tone: neutral and supportive, never apologetic.
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "px-6 py-12 gap-4",
        className
      )}
    >
      {icon && (
        <div className="text-muted-foreground/40 mb-2">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <p className="font-body font-medium text-foreground">
          {title}
        </p>
        {description && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="mt-2 w-full">
          {action}
        </div>
      )}
    </div>
  )
}
