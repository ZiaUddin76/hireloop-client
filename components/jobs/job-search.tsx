"use client"

import * as React from "react"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "cn"

// Search bar for the browse-jobs page: keyword input + submit button.
// The query stays in local state; navigating to the results (e.g. updating the
// URL with ?q=...) is intentionally left unimplemented.
function JobSearch({ className }: React.ComponentProps<"form">) {
    const [query, setQuery] = React.useState("")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
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
