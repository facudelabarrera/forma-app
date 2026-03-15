"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  AuthLayout,
  PrimaryButton,
  SecondaryButton,
  FormInput,
  ErrorBlock,
  NoticeBlock,
  LoadingScreen,
} from "@/components/core"

type AuthMode = "choose" | "login" | "signup" | "forgot" | "forgot-sent" | "confirm-email"

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
  if (lower.includes("user not found") || (lower.includes("email") && lower.includes("not found"))) {
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
    setNotice(null)
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(getAuthErrorMessage(error.message))
      setLoading(false)
      return
    }

    const userId = data.user?.id
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", userId)
        .maybeSingle()

      if (!profile?.onboarding_completed) {
        router.replace("/onboarding")
        return
      }
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
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(getAuthErrorMessage(error.message))
      setLoading(false)
      return
    }

    // If no session, Supabase requires email confirmation before proceeding
    if (!data.session) {
      setLoading(false)
      setMode("confirm-email")
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
      if (process.env.NODE_ENV === "development") {
        console.error("[forma] resetPasswordForEmail:", error.message)
      }
    }

    setMode("forgot-sent")
  }

  if (mode === "choose") {
    return (
      <AuthLayout
        title="FORMA"
        subtitle="Construí tu identidad, un hábito a la vez."
      >
        {error && <ErrorBlock message={error} onDismiss={() => setError(null)} />}
        {notice && <NoticeBlock message={notice} onDismiss={() => setNotice(null)} />}

        <div className="flex flex-col gap-3">
          <PrimaryButton onClick={() => switchMode("signup")}>
            Crear cuenta
          </PrimaryButton>
          <SecondaryButton variant="outline" onClick={() => switchMode("login")}>
            Iniciar sesión
          </SecondaryButton>
        </div>
      </AuthLayout>
    )
  }

  if (mode === "login") {
    return (
      <AuthLayout
        title="Iniciar sesión"
        subtitle="Ingresá con tu email y contraseña."
        onBack={() => switchMode("choose")}
      >
        {notice && <NoticeBlock message={notice} onDismiss={() => setNotice(null)} />}

        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
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

          {error && <ErrorBlock message={error} onDismiss={() => setError(null)} />}

          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar"}
          </PrimaryButton>

          <button
            type="button"
            onClick={() => { setError(null); switchMode("forgot") }}
            className="font-body text-sm text-muted-foreground text-center hover:text-foreground transition-colors duration-200"
          >
            Olvidé mi contraseña
          </button>
        </form>
      </AuthLayout>
    )
  }

  if (mode === "signup") {
    return (
      <AuthLayout
        title="Crear cuenta"
        subtitle="Elegí un email y una contraseña para empezar."
        onBack={() => switchMode("choose")}
      >
        <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>
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

          {error && <ErrorBlock message={error} onDismiss={() => setError(null)} />}

          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </PrimaryButton>
        </form>
      </AuthLayout>
    )
  }

  if (mode === "forgot") {
    return (
      <AuthLayout
        title="Recuperar contraseña"
        subtitle="Ingresá tu email y te enviamos un link para crear una nueva contraseña."
        backLabel="← Volver al inicio de sesión"
        onBack={() => switchMode("login")}
      >
        <form onSubmit={handleForgot} className="flex flex-col gap-4" noValidate>
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
            placeholder="tu@email.com"
            autoComplete="email"
            autoFocus
          />

          {error && <ErrorBlock message={error} onDismiss={() => setError(null)} />}

          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? "Enviando…" : "Enviar link"}
          </PrimaryButton>
        </form>
      </AuthLayout>
    )
  }

  if (mode === "confirm-email") {
    return (
      <AuthLayout
        title="Confirmá tu email"
        subtitle={`Te enviamos un link de confirmación a ${email}. Hacé clic en el link para activar tu cuenta y empezar el proceso.`}
      >
        <p className="font-body text-sm text-muted-foreground leading-relaxed -mt-4">
          Si no aparece en unos minutos, revisá tu carpeta de spam.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => switchMode("choose")}
            className="font-body text-sm text-muted-foreground text-center hover:text-foreground transition-colors duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Revisá tu email"
      subtitle={`Si existe una cuenta asociada a ${email}, vas a recibir un link para crear una nueva contraseña.`}
    >
      <p className="font-body text-sm text-muted-foreground leading-relaxed -mt-4">
        Si no aparece en unos minutos, revisá tu carpeta de spam.
      </p>

      <div className="flex flex-col gap-3">
        <SecondaryButton variant="outline" onClick={() => { resetForm(); setMode("forgot") }}>
          Reenviar link
        </SecondaryButton>
        <button
          type="button"
          onClick={() => switchMode("login")}
          className="font-body text-sm text-muted-foreground text-center hover:text-foreground transition-colors duration-200"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthForm />
    </Suspense>
  )
}
