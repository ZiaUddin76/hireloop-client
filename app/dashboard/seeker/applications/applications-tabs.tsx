'use client'

import * as React from "react"
import { cn } from "cn"

// Active / Archived segmented control from the design. Filtering the table
// kicks in once real application data is loaded; for now it tracks selection.
function ApplicationsTabs({ className }: React.ComponentProps<"div">) {
    const [value, setValue] = React.useState<"active" | "archived">("active")

    const options = [
        { value: "active", label: "Active" },
        { value: "archived", label: "Archived" },
    ] as const

    return (
        <div
            role="tablist"
            aria-label="Filter applications"
            className={cn("inline-flex rounded-lg border bg-card p-1", className)}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={value === option.value}
                    onClick={() => setValue(option.value)}
                    className={cn(
                        "rounded-md px-3 py-1.5 text-sm transition-colors",
                        value === option.value
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export { ApplicationsTabs }
