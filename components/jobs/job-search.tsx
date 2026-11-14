"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { buildJobsHref, type JobBrowseFilters } from "@/lib/helpers/jobs"
import { cn } from "cn"

// Search bar for the browse-jobs page: keyword input + submit button.
// Submitting pushes the query into the URL, which re-renders the server page
// with fresh results (preserving any active filters).
function JobSearch({
    filters,
    className,
}: {
    filters: JobBrowseFilters
} & React.ComponentProps<"form">) {
    const router = useRouter()
    const [query, setQuery] = React.useState(filters.q)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        router.push(buildJobsHref(filters, { q: query, page: 1 }))
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={cn("flex items-center gap-2", className)}
        >
            <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by job title, keywords..."
                    aria-label="Search by job title, keywords"
                    className="h-10 pl-9"
                />
            </div>
            <Button type="submit" size="lg">
                Search Jobs
            </Button>
        </form>
    )
}

export { JobSearch }
