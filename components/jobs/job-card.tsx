import Link from "next/link";

import { BookmarkIcon, BanknoteIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "cn"
import type { JobListing } from "@/lib/types/job"

// "120K - 180K" style label; null when the job has no pay range.
function formatSalary(job: JobListing) {
    const { minSalary, maxSalary } = job
    if (!minSalary && !maxSalary) return null
    return minSalary && maxSalary
        ? `${minSalary} - ${maxSalary}`
        : (minSalary || maxSalary)
}

// Compact job listing card for the browse-jobs results list.
function JobCard({ job, className }: { job: JobListing; className?: string }) {
    const salary = formatSalary(job)

    return (
        <article
            data-slot="job-card"
            className={cn("rounded-xl border bg-card p-5", className)}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="font-heading text-base font-semibold">
                        <Link
                            href={`/browse-jobs/${job.id}`}
                            className="transition-colors hover:text-primary"
                        >
                            {job.title}
                        </Link>
                    </h2>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        {job.company} • {job.location}
                        {job.remoteAllowed && " (Remote)"}
                    </p>
                </div>
                <button
                    type="button"
                    aria-label={`Save ${job.title}`}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <BookmarkIcon className="size-4" />
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                {salary && (
                    <Badge variant="outline">
                        <BanknoteIcon className="size-3.5" />
                        {salary}
                    </Badge>
                )}
                <Badge variant="outline">{job.jobType}</Badge>
                {job.remoteAllowed && <Badge variant="outline">Remote</Badge>}
            </div>
        </article>
    )
}

export { JobCard }
