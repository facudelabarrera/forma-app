import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")

  if (!code) {
    const url = new URL("/login", origin)
    url.searchParams.set("error", "session")
    return NextResponse.redirect(url.toString())
  }

  // Para recovery, el destino final es la pantalla de reset de contraseña
  const defaultDestination = type === "recovery"
    ? `${origin}/auth/reset-password`
    : `${origin}/`

  const redirectResponse = NextResponse.redirect(defaultDestination)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectResponse.cookies.set(name, value, options)
          )
        },
      }
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const url = new URL("/login", origin)
    url.searchParams.set("error", type === "recovery" ? "expired" : "session")
    return NextResponse.redirect(url.toString())
  }

  // Si es recovery, mandamos directo a reset-password (la sesión ya está lista)
  if (type === "recovery") {
    return redirectResponse
  }

  // Si es login normal, determinamos destino según onboarding
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()

    const onboardingDone = profile?.onboarding_completed ?? false

    redirectResponse.headers.set(
      "Location",
      onboardingDone ? `${origin}/` : `${origin}/onboarding`
    )
  }

  return redirectResponse
}
