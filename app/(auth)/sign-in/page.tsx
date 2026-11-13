"use client"

import { AuthForm, type AuthFormData } from "@/components/auth-form"
import { AuthBackdrop } from "@/components/auth-backdrop"
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
      <AuthBackdrop />

      <AuthForm mode="sign-in" className="relative" onSubmit={handleSignIn} />
    </main>
  )
}
