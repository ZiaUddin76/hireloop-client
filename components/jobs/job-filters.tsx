"use client"

import * as React from "react"

import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants/job"
import { cn } from "cn"

// Work mode is derived from the job's `remoteAllowed` field.
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
// remoteAllowed (as work mode) and category. Toggling an option only updates
// local state for now — applying the filters (e.g. syncing them into the URL /
// search query) is intentionally left unimplemented.
function JobFilters({ className }: React.ComponentProps<"div">) {
    const [selectedJobTypes, setSelectedJobTypes] = React.useState<string[]>([])
    const [selectedWorkModes, setSelectedWorkModes] = React.useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])

    return (
        <div
            data-slot="job-filters"
            className={cn("space-y-6 rounded-xl border bg-card p-5", className)}
        >
            <p className="font-heading text-base font-semibold">Filters</p>

            <FilterGroup
                title="Job Type"
                options={JOB_TYPES}
                selected={selectedJobTypes}
                onChange={setSelectedJobTypes}
            />
            <FilterGroup
                title="Work Mode"
                options={WORK_MODES}
                selected={selectedWorkModes}
                onChange={setSelectedWorkModes}
                multiple
            />
            <FilterGroup
                title="Category"
                options={JOB_CATEGORIES}
                selected={selectedCategories}
                onChange={setSelectedCategories}
            />
        </div>
    )
}

export { JobFilters }
