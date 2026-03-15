import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightElement?: React.ReactNode
  className?: string
}

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
        "flex items-center justify-between h-14 px-4 shrink-0 border-b border-border/50",
        className
      )}
    >
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            aria-label="Volver"
            className="flex items-center justify-center w-10 h-10 -ml-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {title && (
        <span className="font-body text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {title}
        </span>
      )}

      <div className="w-10 flex items-center justify-end">
        {rightElement}
      </div>
    </div>
  )
}
