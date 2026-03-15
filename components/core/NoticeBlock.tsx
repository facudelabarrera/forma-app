import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

interface NoticeBlockProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function NoticeBlock({ message, onDismiss, className }: NoticeBlockProps) {
  return (
    <div className={cn("p-4 rounded-xl bg-accent border border-border", className)}>
      <div className="flex gap-3">
        <Info size={18} className="text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2 min-w-0">
          <p className="font-body text-sm text-foreground leading-relaxed">{message}</p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="font-body text-xs text-muted-foreground hover:text-foreground self-start transition-colors duration-200"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
