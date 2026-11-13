
import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/dashboard/page-header"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BriefcaseIcon,
    MapPinIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
} from "lucide-react"
import type { JobListing } from "@/lib/types/job"
import { CATEGORY_ICONS } from "@/lib/constants/job"
import { getJobs } from "@/lib/actions/jobs"
import { DeleteJobDialogue } from "@/app/components/DeleteJobDialogue"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
    if (!iso) return "—"
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function postedLabel(iso: string) {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
    if (isNaN(days) || days < 1) return "Posted today"
    if (days < 30) return `Posted ${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `Posted ${months}mo ago`
    return `Posted ${Math.floor(months / 12)}y ago`
}

function compensationLabel(job: JobListing) {
    const min = Number(job.minSalary) || 0
    const max = Number(job.maxSalary) || 0
    if (!min && !max) return "Negotiable"

    if (job.frequency.includes("year")) {
        return min >= 1000 || max >= 1000
            ? `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k / yr`
            : `$${min} - $${max} / yr`
    }
    if (job.frequency.includes("month")) return `$${min} - $${max} / mo`
    if (job.frequency.includes("day")) return `$${min} - $${max} / day`
    return `$${min} - $${max} / hr`
}

function locationLabel(job: JobListing) {
    return job.remoteAllowed ? `Remote (${job.location})` : job.location
}

function CategoryIcon({ category }: { category: string }) {
    const Icon = CATEGORY_ICONS[category] ?? BriefcaseIcon
    return <Icon className="size-4" />
}

// ---------------------------------------------------------------------------
// Dummy data — mirrors what is stored from the "Post a New Job" form (JobForm)
// plus listing metadata the backend would add (id, applicants, status, dated).
// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

async function ManageJobsPage() {

    const { ok, data } = await getJobs();
    const jobs: JobListing[] =
        ok && Array.isArray(data) ? (data as JobListing[]) : []

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <PageHeader
                breadcrumbs={[
                    { label: "Manage Jobs" },
                    { label: "Job Listings & Postings" },
                ]}
                title="Manage Job Posts"
                description="Review listings, monitor applicants, and update job details across your organization."
                action={
                    <Button render={<Link href="/dashboard/recruiter/jobs/new" />}>
                        <PlusIcon data-icon="inline-start" />
                        New Job Post
                    </Button>
                }
            />

            {/* Listings table */}
            <div className="mt-6 rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                                <th className="px-3 py-3 text-left font-medium">
                                    Job Title &amp; Dept
                                </th>
                                <th className="px-3 py-3 text-left font-medium">
                                    Company &amp; Location
                                </th>
                                <th className="hidden px-3 py-3 text-left font-medium md:table-cell">
                                    Type
                                </th>
                                <th className="hidden px-3 py-3 text-left font-medium lg:table-cell">
                                    Compensation
                                </th>
                                <th className="hidden px-3 py-3 text-left font-medium lg:table-cell">
                                    Applicants
                                </th>
                                <th className="px-3 py-3 text-left font-medium">
                                    Status
                                </th>
                                <th className="px-3 py-3 text-left font-medium">
                                    Deadline
                                </th>
                                <th className="px-3 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-3 py-10 text-center text-muted-foreground"
                                    >
                                        No job posts yet. Click “New Job Post” to create
                                        your first listing.
                                    </td>
                                </tr>
                            )}

                            {jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                >
                                    {/* Job title & dept */}
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                                                <CategoryIcon category={job.category} />
                                            </span>
                                            <div>
                                                <p className="font-medium">
                                                    {job.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {job.category}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company & location */}
                                    <td className="px-3 py-4">
                                        <p className="font-medium">
                                            {job.company}
                                        </p>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPinIcon className="size-3 shrink-0" />
                                            {locationLabel(job)}
                                        </p>
                                    </td>

                                    {/* Type */}
                                    <td className="hidden px-3 py-4 md:table-cell">
                                        {job.jobType}
                                    </td>

                                    {/* Compensation */}
                                    <td className="hidden px-3 py-4 whitespace-nowrap lg:table-cell">
                                        {compensationLabel(job)}
                                    </td>

                                    {/* Applicants */}
                                    <td className="hidden px-3 py-4 lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium">
                                                {job.applicants}
                                            </span>
                                            <span>
                                                {job.applicants}{" "}
                                                {job.applicants === 1
                                                    ? "Candidate"
                                                    : "Candidates"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-4">
                                        <Badge
                                            variant={
                                                job.status === "Active" ? "default" : "muted"
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                    </td>

                                    {/* Deadline */}
                                    <td className="px-3 py-4">
                                        <p className="whitespace-nowrap">
                                            {formatDate(job.deadline)}
                                        </p>
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {postedLabel(job.createdAt)}
                                        </p>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-3 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                aria-label={`Update ${job.title}`}
                                            >
                                                <PencilIcon data-icon="inline-start" />
                                                <span className="hidden md:inline">
                                                    Update
                                                </span>
                                            </Button>

                                            <DeleteJobDialogue job={job} />

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            aria-label={`More actions for ${job.title}`}
                                                            className="text-muted-foreground"
                                                        />
                                                    }
                                                >
                                                    <MoreHorizontalIcon />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        View Applicants (
                                                        {job.applicants})
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Mark as Expired
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive">
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageJobsPage
