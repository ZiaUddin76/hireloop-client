import * as React from "react"
import { cn } from "cn"

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {children}
        </h2>
    )
}

// Card section shell: "rounded-xl border bg-card p-6" with an optional title.
function SectionCard({
    title,
    children,
    className,
}: {
    title?: React.ReactNode
    children: React.ReactNode
    className?: string
}) {
    return (
        <section className={cn("space-y-4 rounded-xl border bg-card p-6", className)}>
            {title && <SectionTitle>{title}</SectionTitle>}
            {children}
        </section>
    )
}

export { SectionCard, SectionTitle }
