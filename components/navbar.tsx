"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import type { SessionUser } from "@/lib/types/auth"
import { cn } from "cn"
import { ChevronDownIcon, LogOutIcon, MenuIcon } from "lucide-react"

import logo from "@/app/images/logo.png"






const COMPANY_LINKS = [
  { label: "About", href: "/company/about" },
  { label: "Careers", href: "/company/careers" },
  { label: "Blog", href: "/company/blog" },
  { label: "Contact", href: "/company/contact" },
] as const



// SessionUser is the better-auth session user shape, shared via lib/types/auth.



// Built per render: the Dashboard href depends on the signed-in user's role,
// which is only known inside components via `useSession()`.
function navLinks(user?: SessionUser | null) {
  return [
    { label: "Browse Jobs", href: "/browse-jobs" },
    { label: "Company", href: "/company" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: `/dashboard/${user?.role || "seeker"}` },
  ] as const
}


// Shared between the desktop user menu and the mobile sheet:
// clears the better-auth session and refreshes the page/section cache.
function useSignOut() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return { isSigningOut, handleSignOut }
}

function getInitials(user: SessionUser) {
  const source = user.name || user.email
  return (source[0] ?? "?").toUpperCase()
}

function UserMenu({ user }: { user: SessionUser }) {
  const { isSigningOut, handleSignOut } = useSignOut()
  const displayName = user.name || user.email
  const roleLabel = user.role ? `Logged in as ${user.role}` : user.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="nav-user-trigger"
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "rounded-full pl-1.5 pr-3",
          }),
          "gap-2 text-white"
        )}
        aria-label="Open user menu"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[#5c53fe] text-xs font-semibold uppercase text-white">
          {getInitials(user)}
        </span>
        <span className="max-w-28 truncate text-sm">{displayName}</span>
        <ChevronDownIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="px-1.5 py-1">
          <p className="truncate text-sm font-medium text-white">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {roleLabel}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOutIcon />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AuthActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        nativeButton={false}
        className="bg-white text-primary hover:bg-white/80"
        render={<Link href="/sign-in" />}
      >
        Sign In
      </Button>
      <Button nativeButton={false} render={<Link href="/sign-up" />}>
        Get Started
      </Button>
    </div>
  )
}

function CompanyMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="nav-link"
        className={buttonVariants({
          variant: "ghost",
          className: "[&_svg]:size-4 [&_svg:not([class*='size-'])]:size-4",
        })}
      >
        Company
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        {COMPANY_LINKS.map((link) => (
          <DropdownMenuItem key={link.label} render={<Link href={link.href} />}>
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SessionActions({ className }: { className?: string }) {
  // `useSession` only returns the signed-in user after it finishes loading, so
  // render a small placeholder while pending to avoid flashing the auth CTAs.
  const { data: session, isPending } = useSession()
  const user = session?.user

  return (
    <div className={cn("flex items-center", className)}>
      {isPending ? (
        <div
          aria-hidden="true"
          className="h-9 w-32 animate-pulse rounded-full bg-white/10"
        />
      ) : user ? (
        <UserMenu user={user} />
      ) : (
        <AuthActions />
      )}
    </div>
  )
}

function MobileMenu({ user }: { user?: SessionUser | null }) {
  const { isSigningOut, handleSignOut } = useSignOut()

  return (
    <Sheet>
      <SheetTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        aria-label="Open navigation menu"
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            <Image src={logo} alt="HireLoop" className="h-6 w-auto" />
          </SheetTitle>
          <SheetDescription>Returns to the HireLoop homepage</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          <Link
            href="/"
            className="rounded-lg px-2 py-2 text-lg font-medium transition-colors hover:bg-muted"
          >
            Home
          </Link>
          {navLinks(user).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-2 py-2 text-lg font-medium transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {user ? (
              <>
                <div className="rounded-lg bg-muted/40 px-2 py-2">
                  <p className="truncate text-sm font-medium">
                    {user.name || user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.role ? `Logged in as ${user.role}` : user.email}
                  </p>
                </div>
                <SheetClose
                  className={cn(
                    buttonVariants({ variant: "outline", className: "w-full" })
                  )}
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <LogOutIcon />
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </SheetClose>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                >
                  Sign In
                </Button>
                <Button nativeButton={false} render={<Link href="/sign-up" />}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar({ className }: React.ComponentProps<"header">) {
  // Manages the shared signed-in state used by the mobile menu and desktop menus
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className={cn("sticky top-0 z-50 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <nav
          data-slot="navbar"
          className="flex h-16 items-center justify-between gap-4 rounded-xl border bg-popover/85 px-4 shadow-sm backdrop-blur-md sm:px-6"
        >
          <Link href="/" aria-label="HireLoop home">
            <Image src={logo} alt="HireLoop" className="h-8 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks(user).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                data-slot="nav-link"
                className={buttonVariants({ variant: "ghost" })}
              >
                {link.label}
              </Link>
            ))}
            <CompanyMenu />
          </div>

          <div className="hidden md:flex">
            <SessionActions />
          </div>

          <div className="md:hidden">
            <MobileMenu user={user} />
          </div>
        </nav>
      </div>
    </header>
  )
}
