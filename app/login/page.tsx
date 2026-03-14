"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AppShell, ScreenContainer, PrimaryButton, FormInput, SecondaryButton } from "@/components/core"

type AuthMode = "choose" | "login" | "signup" | "forgot" | "forgot-sent"

function getAuthErrorMessage(error: string): string {
  const lower = error.toLowerCase()
  if (lower.includes("invalid login credentials") || lower.includes("invalid_credentials")) {
    return "Email o contraseña incorrectos."
  }
  if (lower.includes("email not confirmed")) {
    return "Tu email aún no fue confirmado. Revisá tu bandeja de entrada."
  }
  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "Este email ya tiene una cuenta. Intentá iniciar sesión."
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo."
  }
  if (lower.includes("password") && (lower.includes("short") || lower.includes("weak"))) {
    return "La contraseña debe tener al menos 6 caracteres."
  }
  if (lower.includes("signup") && lower.includes("disabled")) {
    return "El registro no está habilitado en este momento."
  }
  if (lower.includes("user not found") || lower.includes("email") && lower.includes("not found")) {
    return "No encontramos una cuenta con ese email."
  }
  return "Ocurrió un error. Intentá de nuevo."
}

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("choose")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    // Si llega un código de Supabase directamente a /login (ej. desde el email de reset password),
    // lo reenviamos al callback para que lo procese correctamente.
    const code = searchParams.get("code")
    if (code) {
      router.replace(`/auth/callback?code=${code}&type=recovery`)
      return
    }

    const err = searchParams.get("error")
    const msg = searchParams.get("message")
    if (err === "session") {
      setError("Tu sesión expiró. Ingresá de nuevo.")
    } else if (err === "config") {
      setError("La app no está configurada correctamente. Contactá al administrador.")
    } else if (err === "expired") {
      setError("El link expiró o ya fue usado. Podés pedir uno nuevo.")
      setMode("forgot")
    } else if (msg === "password-updated") {
      setNotice("Contraseña actualizada. Podés ingresar con tu nueva contraseña.")
      setMode("login")
    }
  }, [searchParams, router])

  function resetForm() {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setError(null)
  }

  function switchMode(newMode: AuthMode) {
    resetForm()
    setMode(newMode)
  }

  function validateEmail(val: string): string | null {
    if (!val) return "El email es obligatorio."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Ingresá un email válido."
    return null
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) { setError(emailErr); return }
    if (!password) { setError("La contraseña es obligatoria."); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(getAuthErrorMessage(error.message))
      setLoading(false)
      return
    }

    router.replace("/")
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) { setError(emailErr); return }
    if (!password) { setError("La contraseña es obligatoria."); return }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(getAuthErrorMessage(error.message))
      setLoading(false)
      return
    }

    router.replace("/onboarding")
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const emailErr = validateEmail(email)
    if (emailErr) { setError(emailErr); return }

    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?type=recovery`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    setLoading(false)

    if (error) {
      // Always show success to avoid user enumeration
      if (process.env.NODE_ENV === "development") {
        console.error("[forma] resetPasswordForEmail:", error.message)
      }
    }

    // Siempre mostramos el estado de éxito (seguridad: no revelar si el email existe)
    setMode("forgot-sent")
  }

  // ─── Pantalla: elegir modo ────────────────────────────────────────────────
  if (mode === "choose") {
    return (
      <AppShell>
        <ScreenContainer>
          <div className="flex flex-col gap-8 justify-center min-h-screen pb-12">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-4xl text-foreground leading-tight">FORMA</h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Construí tu identidad, un hábito a la vez.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="font-body text-sm text-destructive">{error}</p>
              </div>
            )}

            {notice && (
              <div className="p-3 rounded-xl bg-foreground/5 border border-border">
                <p className="font-body text-sm text-foreground">{notice}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <PrimaryButton onClick={() => switchMode("signup")}>
                Crear cuenta
              </PrimaryButton>
              <SecondaryButton variant="outline" onClick={() => switchMode("login")}>
                Iniciar sesión
              </SecondaryButton>
            </div>
          </div>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Pantalla: iniciar sesión ─────────────────────────────────────────────
  if (mode === "login") {
    return (
      <AppShell>
        <ScreenContainer>
          <form onSubmit={handleLogin} className="flex flex-col gap-8 justify-center min-h-screen pb-12" noValidate>
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-foreground leading-tight">Iniciar sesión</h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Ingresá con tu email y contraseña.
              </p>
            </div>

            {notice && (
              <div className="p-3 rounded-xl bg-foreground/5 border border-border">
                <p className="font-body text-sm text-foreground">{notice}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
              />

              <FormInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="font-body text-sm text-destructive">{error}</p>
                </div>
              )}

              <PrimaryButton type="submit" loading={loading} disabled={loading}>
                {loading ? "Ingresando…" : "Ingresar"}
              </PrimaryButton>

              <button
                type="button"
                onClick={() => { setError(null); switchMode("forgot") }}
                className="font-body text-sm text-muted-foreground text-center hover:text-foreground transition-colors"
              >
                Olvidé mi contraseña
              </button>
            </div>

            <button
              type="button"
              onClick={() => switchMode("choose")}
              className="font-body text-sm text-muted-foreground self-start hover:text-foreground transition-colors"
            >
              ← Volver
            </button>
          </form>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Pantalla: crear cuenta ───────────────────────────────────────────────
  if (mode === "signup") {
    return (
      <AppShell>
        <ScreenContainer>
          <form onSubmit={handleSignup} className="flex flex-col gap-8 justify-center min-h-screen pb-12" noValidate>
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-foreground leading-tight">Crear cuenta</h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Elegí un email y una contraseña para empezar.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
              />

              <FormInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                hint="Mínimo 6 caracteres"
              />

              <FormInput
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
              />

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="font-body text-sm text-destructive">{error}</p>
                </div>
              )}

              <PrimaryButton type="submit" loading={loading} disabled={loading}>
                {loading ? "Creando cuenta…" : "Crear cuenta"}
              </PrimaryButton>
            </div>

            <button
              type="button"
              onClick={() => switchMode("choose")}
              className="font-body text-sm text-muted-foreground self-start hover:text-foreground transition-colors"
            >
              ← Volver
            </button>
          </form>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Pantalla: olvidé mi contraseña ──────────────────────────────────────
  if (mode === "forgot") {
    return (
      <AppShell>
        <ScreenContainer>
          <form onSubmit={handleForgot} className="flex flex-col gap-8 justify-center min-h-screen pb-12" noValidate>
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-3xl text-foreground leading-tight">Recuperar contraseña</h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Ingresá tu email y te enviamos un link para crear una nueva contraseña.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
              />

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="font-body text-sm text-destructive">{error}</p>
                </div>
              )}

              <PrimaryButton type="submit" loading={loading} disabled={loading}>
                {loading ? "Enviando…" : "Enviar link"}
              </PrimaryButton>
            </div>

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-body text-sm text-muted-foreground self-start hover:text-foreground transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </form>
        </ScreenContainer>
      </AppShell>
    )
  }

  // ─── Pantalla: link de recuperación enviado ───────────────────────────────
  return (
    <AppShell>
      <ScreenContainer>
        <div className="flex flex-col gap-8 justify-center min-h-screen pb-12">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl text-foreground leading-tight">Revisá tu email</h1>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Si existe una cuenta asociada a{" "}
              <span className="text-foreground font-medium">{email}</span>, vas a recibir un link para
              crear una nueva contraseña.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Si no aparece en unos minutos, revisá tu carpeta de spam.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <SecondaryButton variant="outline" onClick={() => { resetForm(); setMode("forgot") }}>
              Reenviar link
            </SecondaryButton>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="font-body text-sm text-muted-foreground text-center hover:text-foreground transition-colors"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </ScreenContainer>
    </AppShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <ScreenContainer className="items-center justify-center min-h-screen">
            <p className="font-body text-sm text-muted-foreground">Cargando…</p>
          </ScreenContainer>
        </AppShell>
      }
    >
      <AuthForm />
    </Suspense>
  )
}
