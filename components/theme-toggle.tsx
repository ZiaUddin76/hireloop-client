"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    // Avoid hydration mismatch while next-themes resolves the system theme.
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    const isDark = mounted ? resolvedTheme === "dark" : false

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
    )
}

export { ThemeToggle }
