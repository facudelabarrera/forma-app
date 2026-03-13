"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AppShell, ScreenContainer, PrimaryButton, FormInput } from "@/components/core"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError("No pudimos enviar el link. Verificá el email e intentá de nuevo.")
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <AppShell>
      <ScreenContainer>
        {sent ? (
          <div className="flex flex-col justify-center min-h-screen gap-6 pb-12">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-4xl text-foreground leading-tight">
                Revisá tu email
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Enviamos un link a{" "}
                <span className="text-foreground font-medium">{email}</span>.
                Tocalo para entrar a FORMA.
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mt-2">
                Si no aparece en unos minutos, revisá tu carpeta de spam.
              </p>
            </div>

            <button
              onClick={() => { setSent(false); setEmail("") }}
              className="font-body text-sm text-muted-foreground self-start hover:text-foreground transition-colors"
            >
              Usar otro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 justify-center min-h-screen pb-12">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-4xl text-foreground leading-tight">
                Bienvenido a FORMA
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Ingresá tu email para continuar. Sin contraseña.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                autoFocus
              />

              {error && (
                <p className="font-body text-sm text-destructive">{error}</p>
              )}

              <PrimaryButton type="submit" disabled={loading || !email}>
                {loading ? "Enviando link…" : "Continuar"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </ScreenContainer>
    </AppShell>
  )
}
