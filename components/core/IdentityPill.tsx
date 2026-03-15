import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface IdentityPillProps {
  identity: string
  onSettingsClick?: () => void
  className?: string
}

export function IdentityPill({ identity, onSettingsClick, className }: IdentityPillProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-body text-sm font-medium text-foreground bg-accent border border-border rounded-full px-4 py-1.5 leading-snug min-w-0 flex-1 truncate">
        Soy alguien que {identity}
      </span>
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="text-muted-foreground p-2 shrink-0 rounded-full hover:bg-accent hover:text-foreground transition-colors duration-200"
          aria-label="Ajustes"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
