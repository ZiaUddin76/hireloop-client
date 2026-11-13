import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"
import { AuthBackdrop } from "@/components/auth-backdrop"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your HireLoop account.",
}

export default function SignUpPage() {
  return (
    <main
      data-slot="auth-page"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#08080a] px-4 py-16"
    >
      {/* Backdrop glow */}
      <AuthBackdrop />

      <AuthForm mode="sign-up" className="relative" />
    </main>
  )
}
