import {
  AppShell,
  ScreenContainer,
  TopBar,
  PrimaryButton,
  SecondaryButton,
  Card,
  EmptyState,
  SupportMessage,
} from "@/components/core"
import { BookOpen } from "lucide-react"

/**
 * Temporary home — confirms the base system is working.
 * Will be replaced by S-01 (Bienvenida) or S-06 (Pantalla de Ritmo)
 * depending on onboarding state.
 */
export default function Home() {
  return (
    <AppShell>
      <TopBar title="FORMA" />

      <ScreenContainer className="gap-6 pt-4">
        <div className="space-y-2">
          <h1 className="font-display text-4xl text-foreground leading-tight">
            Sistema base listo.
          </h1>
          <SupportMessage
            message="Stack inicializado. Componentes core disponibles."
            variant="neutral"
          />
        </div>

        <Card>
          <p className="font-body text-sm font-medium text-foreground mb-1">
            Card component
          </p>
          <SupportMessage
            message="DM Serif Display para títulos. DM Sans para cuerpo de texto."
            variant="support"
          />
        </Card>

        <EmptyState
          icon={<BookOpen size={32} />}
          title="Sin hábitos todavía"
          description="Cuando el onboarding esté listo, aquí aparecerá tu ritmo diario."
        />

        <div className="space-y-3 mt-auto">
          <PrimaryButton>Comenzar</PrimaryButton>
          <SecondaryButton variant="outline">Ahora no</SecondaryButton>
          <SecondaryButton variant="ghost">Ver más adelante</SecondaryButton>
        </div>
      </ScreenContainer>
    </AppShell>
  )
}
