"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  AuthLayout,
  PrimaryButton,
  FormInput,
  ErrorBlock,
  LoadingScreen,
} from "@/components/core"

type PageState = "loading" | "form" | "success" | "invalid"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setPageState("invalid")
        return
      }

      setPageState("form")
    }

    void checkSession()

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

  if (pageState === "loading") {
    return <LoadingScreen message="Verificando…" />
  }

  if (pageState === "invalid") {
    return (
      <AuthLayout
        title="Link inválido o expirado"
        subtitle="Este link ya fue usado o expiró. Los links de recuperación son de un solo uso y tienen validez limitada."
      >
        <PrimaryButton onClick={() => router.push("/login?error=expired")}>
          Pedir un nuevo link
        </PrimaryButton>
      </AuthLayout>
    )
  }

  if (pageState === "success") {
    return (
      <AuthLayout
        title="Contraseña actualizada"
        subtitle="Tu contraseña se cambió correctamente. Podés ingresar con tu nueva contraseña."
      >
        <PrimaryButton onClick={() => router.push("/login?message=password-updated")}>
          Ir al inicio de sesión
        </PrimaryButton>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elegí una contraseña nueva para tu cuenta."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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

        {error && <ErrorBlock message={error} onDismiss={() => setError(null)} />}

        <PrimaryButton type="submit" loading={loading} disabled={loading}>
          {loading ? "Guardando…" : "Guardar contraseña"}
        </PrimaryButton>
      </form>
    </AuthLayout>
  )
}
