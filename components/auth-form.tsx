"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"

function GithubIcon({ className }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.72-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

type Mode = "sign-in" | "sign-up"

const ROLES = ["seeker", "recruiter", "admin"] as const
type Role = (typeof ROLES)[number]

const ROLE_LABELS: Record<Role, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

export type AuthFormData = {
  name?: string
  email: string
  password: string
  remember: boolean
  role?: Role
}

type AuthSubmitHandler = (data: AuthFormData) => void | Promise<unknown>

const TITLES: Record<Mode, { title: string; description: string }> = {
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to continue your job search.",
  },
  "sign-up": {
    title: "Create your account",
    description: "Join thousands finding their dream jobs on HireLoop.",
  },
}

export function AuthForm({
  mode,
  className,
  onSubmit,
}: {
  mode: Mode
  className?: string
  onSubmit?: AuthSubmitHandler
}) {
  const router = useRouter()
  const isSignIn = mode === "sign-in"
  const other: Mode = isSignIn ? "sign-up" : "sign-in"
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Auth submit:
  // - if the page provides `onSubmit`, it receives the collected form data and
  //   controls the auth call itself — see app/(auth)/sign-in/page.tsx
  // - otherwise the built-in better-auth calls below run (see lib/auth-client.ts)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget)) as {
        name?: string
        email: string
        password: string
        remember?: string
        role?: Role
      }
      const payload: AuthFormData = {
        name: data.name,
        email: data.email,
        password: data.password,
        remember: data.remember === "on",
        role: isSignIn ? undefined : data.role,
      }

      if (onSubmit) {
        await onSubmit(payload)
        return
      }

      if (isSignIn) {
        const { error } = await authClient.signIn.email({
          email: payload.email,
          password: payload.password,
          rememberMe: payload.remember,
          callbackURL: "/",
        })
        if (error) {
          console.error("sign-in failed:", error.message)
        } else {
          router.push("/")
          router.refresh()
        }
      } else {
        const { error } = await authClient.signUp.email({
          name: payload.name ?? "",
          email: payload.email,
          password: payload.password,
          role: payload.role,
          callbackURL: "/",
        })
        if (error) {
          console.error("sign-up failed:", error.message)
        } else {
          router.push("/")
          router.refresh()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {/* Mode toggle */}
      <div
        data-slot="auth-toggle"
        role="navigation"
        aria-label="Authentication mode"
        className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-[#141418] p-1"
      >
        {(["sign-in", "sign-up"] as const).map((m) => (
          <Link
            key={m}
            href={m === "sign-in" ? "/sign-in" : "/sign-up"}
            aria-current={m === mode ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: m === mode ? "default" : "ghost",
                className: "rounded-full",
              })
            )}
          >
            {m === "sign-in" ? "Sign In" : "Sign Up"}
          </Link>
        ))}
      </div>
      <h1 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
        {TITLES[mode].title}
      </h1>
      <p className="mt-2 text-center text-sm text-white/70 sm:text-base">
        {TITLES[mode].description}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#141418] p-6 sm:p-8"
      >
        {!isSignIn && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Appleseed"
              className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>
        )}

        {!isSignIn && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="role" className="text-white">
              I am a
            </Label>
            <div
              data-slot="role-picker"
              id="role"
              className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/5 p-1"
            >
              {ROLES.map((role) => (
                <label key={role} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    defaultChecked={role === "seeker"}
                    className="peer sr-only"
                  />
                  <span className="flex h-9 items-center justify-center rounded-lg text-sm text-white/60 transition-colors hover:text-white peer-checked:bg-[#5c53fe] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-ring">
                    {ROLE_LABELS[role]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="email@example.com"
            className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            {isSignIn && (
              <Link
                href="/forgot-password"
                className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              placeholder="••••••••"
              className="h-11 rounded-xl border-white/10 bg-white/5 pr-10 text-white placeholder:text-white/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-ring"
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        </div>

        {isSignIn && (
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="size-4 accent-[#5c53fe]"
              defaultChecked
            />
            <Label htmlFor="remember" className="text-white/80">
              Remember me
            </Label>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl"
        >
          {isSubmitting
            ? isSignIn
              ? "Signing In..."
              : "Creating Account..."
            : isSignIn
              ? "Sign In"
              : "Create Account"}
        </Button>

        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="h-px flex-1 bg-white/10" />
          OR
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled
          className="h-11 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          <GithubIcon />
          Continue with GitHub
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={other === "sign-in" ? "/sign-in" : "/sign-up"}
          className="font-semibold text-white underline underline-offset-4"
        >
          {isSignIn ? "Get Started" : "Sign In"}
        </Link>
      </p>
    </div>
  )
}
