"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants/job"
import { buildJobsHref, type JobBrowseFilters } from "@/lib/helpers/jobs"
import { cn } from "cn"

// Work mode is derived from the job's `remoteAllowed` (isRemote) field.
const WORK_MODES = ["Remote", "On-site"] as const

type FilterGroupProps = {
    title: string
    options: readonly string[]
    selected: readonly string[]
    onChange: (selected: string[]) => void
    /** Allow several options at once; defaults to picking exactly one. */
    multiple?: boolean
}

// A titled list of checkbox options, e.g. "Job Type: Full-time / Part-time".
// Single-select groups behave like radios: picking an option replaces the
// previous pick, clicking it again clears the group.
function FilterGroup({
    title,
    options,
    selected,
    onChange,
    multiple = false,
}: FilterGroupProps) {
    function toggle(option: string) {
        if (!multiple) {
            onChange(selected.includes(option) ? [] : [option])
            return
        }
        onChange(
            selected.includes(option)
                ? selected.filter((item) => item !== option)
                : [...selected, option]
        )
    }

    return (
        <fieldset className="space-y-2.5">
            <legend className="text-sm font-medium">{title}</legend>
            {options.map((option) => {
                const checked = selected.includes(option)
                return (
                    <label
                        key={option}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(option)}
                            className="size-4 rounded border-input accent-primary"
                        />
                        {option}
                    </label>
                )
            })}
        </fieldset>
    )
}

// Sidebar of filter options built from the job's common fields: jobType,
// remoteAllowed (as work mode) and category. Every change is pushed into the
// URL, which re-renders the server page with filtered results.
function JobFilters({
    filters,
    className,
}: {
    filters: JobBrowseFilters
} & React.ComponentProps<"div">) {
    const router = useRouter()

    // Applying a filter always starts a fresh result set.
    function applyFilters(overrides: Partial<JobBrowseFilters>) {
        router.push(buildJobsHref(filters, { ...overrides, page: 1 }))
    }

    return (
        <div
            data-slot="job-filters"
            className={cn("space-y-6 rounded-xl border bg-card p-5", className)}
        >
            <p className="font-heading text-base font-semibold">Filters</p>

            <FilterGroup
                title="Job Type"
                options={JOB_TYPES}
                selected={filters.jobType ? [filters.jobType] : []}
                onChange={(selected) =>
                    applyFilters({ jobType: selected[0] ?? "" })
                }
            />
            <FilterGroup
                title="Work Mode"
                options={WORK_MODES}
                selected={filters.workModes}
                multiple
                onChange={(selected) =>
                    applyFilters({ workModes: selected })
                }
            />
            <FilterGroup
                title="Category"
                options={JOB_CATEGORIES}
                selected={filters.category ? [filters.category] : []}
                onChange={(selected) =>
                    applyFilters({ category: selected[0] ?? "" })
                }
            />
        </div>
    )
}

export { JobFilters }
