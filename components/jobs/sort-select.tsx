"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { buildJobsHref, SORT_OPTIONS, type JobBrowseFilters } from "@/lib/helpers/jobs"

// "Sort by" dropdown for the browse-jobs results header. Changing the sort
// pushes it into the URL (and resets to the first page).
function SortSelect({ filters }: { filters: JobBrowseFilters }) {
    const router = useRouter()

    function handleSortChange(value: string | null) {
        router.push(buildJobsHref(filters, { sort: value ?? "recent", page: 1 }))
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by:
            <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export { SortSelect }
