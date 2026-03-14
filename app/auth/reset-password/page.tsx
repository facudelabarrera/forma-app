"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppShell, ScreenContainer, PrimaryButton, FormInput } from "@/components/core"

type PageState = "loading" | "form" | "success" | "invalid"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar que hay una sesión válida (debería estar si vino del callback de recovery)
    const supabase = createClient()

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setPageState("invalid")
        return
      }

      // Verificar que el tipo de sesión sea recovery o que el usuario esté logueado
      setPageState("form")
    }

    void checkSession()

    // Escuchar el evento PASSWORD_RECOVERY de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("form")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!password) {
      setError("La contraseña es obligatoria.")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      const lower = error.message.toLowerCase()
      if (lower.includes("same password") || lower.includes("should be different")) {
        setError("La nueva contraseña debe ser diferente a la actual.")
      } else if (lower.includes("weak") || lower.includes("short")) {
        setError("La contraseña debe tener al menos 6 caracteres.")
      } else {
        setError("No pudimos actualizar la contraseña. Intentá de nuevo.")
        if (process.env.NODE_ENV === "development") {
          console.error("[forma] updateUser:", error.message)
        }
      }
      setLoading(false)
      return
    }

    setPageState("success")
    setLoading(false)
  }

  // ─── Cargando ─────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <AppShell>
        <ScreenContainer className="items-center justify-center min-h-screen">
          <p className="font-body text-sm text-muted-foreground">Verificando…</p>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Link inválido o expirado ─────────────────────────────────────────────
  if (pageState === "invalid") {
    return (
      <AppShell>
        <ScreenContainer>
          <div className="flex flex-col gap-8 justify-center min-h-screen pb-12">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-foreground leading-tight">
                Link inválido o expirado
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Este link ya fue usado o expiró. Los links de recuperación son de un solo uso y
                tienen validez limitada.
              </p>
            </div>

            <PrimaryButton onClick={() => router.push("/login?error=expired")}>
              Pedir un nuevo link
            </PrimaryButton>
          </div>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Contraseña actualizada correctamente ─────────────────────────────────
  if (pageState === "success") {
    return (
      <AppShell>
        <ScreenContainer>
          <div className="flex flex-col gap-8 justify-center min-h-screen pb-12">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-foreground leading-tight">
                Contraseña actualizada
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Tu contraseña se cambió correctamente. Podés ingresar con tu nueva contraseña.
              </p>
            </div>

            <PrimaryButton onClick={() => router.push("/login?message=password-updated")}>
              Ir al inicio de sesión
            </PrimaryButton>
          </div>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Formulario de nueva contraseña ──────────────────────────────────────
  return (
    <AppShell>
      <ScreenContainer>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 justify-center min-h-screen pb-12" noValidate>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl text-foreground leading-tight">
              Nueva contraseña
            </h1>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Elegí una contraseña nueva para tu cuenta.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <FormInput
              label="Nueva contraseña"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              autoFocus
              hint="Mínimo 6 caracteres"
            />

            <FormInput
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
              placeholder="Repetí tu nueva contraseña"
              autoComplete="new-password"
            />

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="font-body text-sm text-destructive">{error}</p>
              </div>
            )}

            <PrimaryButton type="submit" loading={loading} disabled={loading}>
              {loading ? "Guardando…" : "Guardar contraseña"}
            </PrimaryButton>
          </div>
        </form>
      </ScreenContainer>
    </AppShell>
  )
}
