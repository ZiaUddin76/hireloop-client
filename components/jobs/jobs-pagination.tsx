"use client"

import { useRouter } from "next/navigation"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { buildJobsHref, type JobBrowseFilters } from "@/lib/helpers/jobs"
import { cn } from "cn"

// Compact page list like "‹ 1 2 3 … 12 ›" — current page with its neighbours,
// first and last page, and "…" wherever numbers are skipped.
function getPageItems(current: number, totalPages: number): (number | "gap")[] {
    const pages = [
        1,
        current - 1,
        current,
        current + 1,
        totalPages,
    ].filter((page) => page >= 1 && page <= totalPages)

    const items: (number | "gap")[] = []
    let previous = 0
    for (const page of [...new Set(pages)].sort((a, b) => a - b)) {
        if (page - previous > 1) items.push("gap")
        items.push(page)
        previous = page
    }
    return items
}

const itemClass =
    "flex size-8 items-center justify-center rounded-lg text-sm transition-colors"

// Pagination for the browse-jobs results. Navigating pushes the target page
// into the URL, preserving the active search and filters.
function JobsPagination({
    page,
    totalPages,
    filters,
}: {
    page: number
    totalPages: number
    filters: JobBrowseFilters
}) {
    const router = useRouter()

    if (totalPages <= 1) return null

    function goTo(target: number) {
        router.push(buildJobsHref(filters, { page: target }))
    }

    return (
        <nav
            aria-label="Jobs pagination"
            className="mt-8 flex items-center justify-center gap-1.5"
        >
            <button
                type="button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => goTo(page - 1)}
                className={cn(itemClass, "hover:bg-muted disabled:opacity-50")}
            >
                <ChevronLeftIcon className="size-4" />
            </button>

            {getPageItems(page, totalPages).map((item, index) =>
                item === "gap" ? (
                    <span key={`gap-${index}`} className="text-sm text-muted-foreground">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === page ? "page" : undefined}
                        onClick={() => goTo(item)}
                        className={cn(
                            itemClass,
                            item === page
                                ? "bg-primary font-medium text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={page === totalPages}
                onClick={() => goTo(page + 1)}
                className={cn(itemClass, "hover:bg-muted disabled:opacity-50")}
            >
                <ChevronRightIcon className="size-4" />
            </button>
        </nav>
    )
}

export { JobsPagination }
