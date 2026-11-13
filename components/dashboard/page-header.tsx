import * as React from "react"
import Link from "next/link"
import { cn } from "cn"

type BreadcrumbItem = {
    label: string
    href?: string
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <p className="text-xs text-muted-foreground">
            {items.map((item, index) => (
                <React.Fragment key={item.label}>
                    {index > 0 && <span aria-hidden> &gt; </span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-foreground">
                            {item.label}
                        </Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </p>
    )
}

function PageHeader({
    breadcrumbs,
    title,
    description,
    action,
    className,
}: {
    breadcrumbs?: BreadcrumbItem[]
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}) {
    return (
        <>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
            )}
            <div
                className={cn(
                    "mt-2 flex flex-wrap items-center justify-between gap-3",
                    className
                )}
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {action}
            </div>
        </>
    )
}

export { PageHeader, type BreadcrumbItem }
