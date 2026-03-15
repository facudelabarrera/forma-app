import { cn } from "@/lib/utils"
import { AppShell } from "./AppShell"
import { ScreenContainer } from "./ScreenContainer"

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  backLabel?: string
  onBack?: () => void
  className?: string
}

export function AuthLayout({
  title,
  subtitle,
  children,
  backLabel = "← Volver",
  onBack,
  className,
}: AuthLayoutProps) {
  return (
    <AppShell>
      <ScreenContainer>
        <div className={cn("flex flex-col gap-8 justify-center min-h-screen pb-12", className)}>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl text-foreground leading-tight">{title}</h1>
            {subtitle && (
              <p className="font-body text-base text-muted-foreground leading-relaxed">{subtitle}</p>
            )}
          </div>

          {children}

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="font-body text-sm text-muted-foreground self-start hover:text-foreground transition-colors duration-200"
            >
              {backLabel}
            </button>
          )}
        </div>
      </ScreenContainer>
    </AppShell>
  )
}
