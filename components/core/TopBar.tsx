import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightElement?: React.ReactNode
  className?: string
}

/**
 * TopBar — app navigation bar.
 * Sits at the top of each screen. All props optional.
 */
export function TopBar({
  title,
  showBack = false,
  onBack,
  rightElement,
  className,
}: TopBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-14 px-4 shrink-0",
        className
      )}
    >
      {/* Left — back button or spacer */}
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex items-center justify-center w-10 h-10 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Center — title */}
      {title && (
        <span className="font-body text-sm font-medium text-foreground/60 tracking-wide uppercase">
          {title}
        </span>
      )}

      {/* Right — custom element or spacer */}
      <div className="w-10 flex items-center justify-end">
        {rightElement}
      </div>
    </div>
  )
}
