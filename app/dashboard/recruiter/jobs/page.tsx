"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BriefcaseIcon,
    Code2Icon,
    MapPinIcon,
    MegaphoneIcon,
    MoreHorizontalIcon,
    PaletteIcon,
    PencilIcon,
    PlusIcon,
    ScaleIcon,
    Trash2Icon,
    TrendingUpIcon,
} from "lucide-react"
import type { JobListing } from "@/lib/types/job"

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

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    "Engineering & Tech": Code2Icon,
    "Design & Creative": PaletteIcon,
    Marketing: MegaphoneIcon,
    Sales: TrendingUpIcon,
    "Finance & Legal": ScaleIcon,
}

function CategoryIcon({ category }: { category: string }) {
    const Icon = CATEGORY_ICONS[category] ?? BriefcaseIcon
    return <Icon className="size-4" />
}

// ---------------------------------------------------------------------------
// Dummy data — mirrors what is stored from the "Post a New Job" form (JobForm)
// plus listing metadata the backend would add (id, applicants, status, dated).
// ---------------------------------------------------------------------------

const DUMMY_JOBS: JobListing[] = [
    {
        id: "job-001",
        title: "Frontend Developer",
        company: "HirePulse Network",
        category: "Engineering & Tech",
        jobType: "Full-time",
        remoteAllowed: true,
        location: "New York, USA",
        deadline: "2026-05-30",
        minSalary: "25",
        maxSalary: "40",
        frequency: "per hour",
        responsibilities: "",
        qualifications: "",
        applicants: 24,
        status: "Active",
        createdAt: "2026-11-06",
    },
    {
        id: "job-002",
        title: "Senior Product Designer",
        company: "HireLabs Labs",
        category: "Design & Creative",
        jobType: "Full-time",
        remoteAllowed: false,
        location: "London, UK (Hybrid)",
        deadline: "2026-06-14",
        minSalary: "90000",
        maxSalary: "110000",
        frequency: "per year",
        responsibilities: "",
        qualifications: "",
        applicants: 18,
        status: "Active",
        createdAt: "2026-11-04",
    },
    {
        id: "job-003",
        title: "DevOps Specialist",
        company: "HirePulse Platform",
        category: "Engineering & Tech",
        jobType: "Full-time",
        remoteAllowed: false,
        location: "Berlin, Germany",
        deadline: "2026-06-30",
        minSalary: "80000",
        maxSalary: "120000",
        frequency: "per year",
        responsibilities: "",
        qualifications: "",
        applicants: 12,
        status: "Active",
        createdAt: "2026-10-28",
    },
    {
        id: "job-004",
        title: "Product Marketing Lead",
        company: "HirePulse Network",
        category: "Marketing",
        jobType: "Full-time",
        remoteAllowed: true,
        location: "Remote, Europe",
        deadline: "2026-07-15",
        minSalary: "60000",
        maxSalary: "110000",
        frequency: "per year",
        responsibilities: "",
        qualifications: "",
        applicants: 27,
        status: "Active",
        createdAt: "2026-11-02",
    },
    {
        id: "job-005",
        title: "QA Automation Engineer",
        company: "HireLoop Backend",
        category: "Engineering & Tech",
        jobType: "Part-time",
        remoteAllowed: false,
        location: "Berlin, Germany (Hybrid)",
        deadline: "2026-05-05",
        minSalary: "35",
        maxSalary: "60",
        frequency: "per hour",
        responsibilities: "",
        qualifications: "",
        applicants: 6,
        status: "Expired",
        createdAt: "2026-09-21",
    },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ManageJobsPage() {
    const [jobs, setJobs] = React.useState<JobListing[]>(DUMMY_JOBS)

    function deleteJob(id: string) {
        setJobs((previous) => previous.filter((job) => job.id !== id))
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <p className="text-xs text-muted-foreground">
                <span>Manage Jobs</span>
                <span aria-hidden> &gt; </span>
                <span>Job Listings &amp; Postings</span>
            </p>

            {/* Header */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Manage Job Posts
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Review listings, monitor applicants, and update job details across
                        your organization.
                    </p>
                </div>
                <Button render={<Link href="/dashboard/recruiter/jobs/new" />}>
                    <PlusIcon data-icon="inline-start" />
                    New Job Post
                </Button>
            </div>

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
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs ${
                                                job.status === "Active"
                                                    ? "border-primary/20 bg-primary/10 text-primary"
                                                    : "border-border bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {job.status}
                                        </span>
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

                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Delete ${job.title}`}
                                                onClick={() => deleteJob(job.id)}
                                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2Icon />
                                            </Button>

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
                                                    <DropdownMenuItem
                                                        onClick={() => deleteJob(job.id)}
                                                    >
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
