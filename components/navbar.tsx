"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"
import { ChevronDownIcon, MenuIcon } from "lucide-react"

import logo from "@/app/images/logo.png"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Pricing", href: "/pricing" },
] as const

const COMPANY_LINKS = [
  { label: "About", href: "/company/about" },
  { label: "Careers", href: "/company/careers" },
  { label: "Blog", href: "/company/blog" },
  { label: "Contact", href: "/company/contact" },
] as const

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

function MobileMenu() {
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-2 py-2 text-lg font-medium transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
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
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar({ className }: React.ComponentProps<"header">) {
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
            {NAV_LINKS.map((link) => (
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

          <div className="hidden items-center gap-2 md:flex">
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

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  )
}
