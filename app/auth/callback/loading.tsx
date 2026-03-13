import { AppShell, ScreenContainer } from "@/components/core"

export default function AuthCallbackLoading() {
  return (
    <AppShell>
      <ScreenContainer className="items-center justify-center min-h-screen">
        <p className="font-body text-sm text-muted-foreground">Iniciando sesión…</p>
      </ScreenContainer>
    </AppShell>
  )
}
