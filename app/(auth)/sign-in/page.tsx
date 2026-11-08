"use client"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

async function handleSignIn(data: AuthFormData) {
  const { error } = await authClient.signIn.email({
    email: data.email, // required, The email address of the user.
    password: data.password, // required, The password of the user.
    rememberMe: data.remember, // follows the "Remember me" checkbox
    callbackURL: "/", // An optional URL to redirect to after the user signs in.
  })
  if (error) console.error("sign-in failed:", error.message)
}

export default function SignInPage() {
  return (
    <main
      data-slot="auth-page"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#08080a] px-4 py-16"
    >
      {/* Backdrop glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-fuchsia-500/25 via-fuchsia-500/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(92,83,254,0.35),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08080a] to-transparent" />
      </div>

      <AuthForm mode="sign-in" className="relative" onSubmit={handleSignIn} />
    </main>
  )
}
