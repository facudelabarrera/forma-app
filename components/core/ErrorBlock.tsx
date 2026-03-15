import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface ErrorBlockProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ErrorBlock({ message, onRetry, onDismiss, className }: ErrorBlockProps) {
  return (
    <div className={cn("p-4 rounded-xl bg-destructive/5 border border-destructive/15", className)}>
      <div className="flex gap-3">
        <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2 min-w-0">
          <p className="font-body text-sm text-destructive leading-relaxed">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="font-body text-xs font-medium text-foreground hover:underline"
                >
                  Reintentar
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Cerrar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
