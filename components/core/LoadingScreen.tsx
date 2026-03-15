import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingScreenProps {
  message?: string
  className?: string
}

export function LoadingScreen({ message = "Cargando…", className }: LoadingScreenProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen gap-4", className)}>
      <Loader2 size={24} className="animate-spin text-muted-foreground" />
      <p className="font-body text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
