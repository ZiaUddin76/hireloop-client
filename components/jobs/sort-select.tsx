"use client"

import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = ["Most Recent", "Highest Paying", "Oldest"] as const

const DEFAULT_SORT = "Most Recent"

// "Sort by" dropdown for the browse-jobs results header. Selecting an option
// only updates local state for now — syncing it into the URL / search query
// is intentionally left unimplemented.
function SortSelect() {
    const [sort, setSort] = React.useState<string>(DEFAULT_SORT)

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by:
            <Select
                value={sort}
                onValueChange={(value) =>
                    setSort((value ?? DEFAULT_SORT) as string)
                }
            >
                <SelectTrigger className="h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export { SortSelect }
