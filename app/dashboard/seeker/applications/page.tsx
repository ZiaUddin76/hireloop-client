import * as React from "react"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import type {
    ApplicationStatus,
    JobApplication,
} from "@/lib/types/application"
import { cn } from "cn"

import { ApplicationsTabs } from "./applications-tabs"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// "2 hours ago" style label for the application date.
function appliedLabel(iso: string) {
    const date = new Date(iso)
    if (!iso || Number.isNaN(date.getTime())) return "—"

    const minutes = Math.floor((Date.now() - date.getTime()) / 60_000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`

    const weeks = Math.floor(days / 7)
    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

// "Full-time • Remote" subtitle under the job title.
function jobMetaLabel(application: JobApplication) {
    return [
        application.jobType,
        application.remoteAllowed ? "Remote" : "On-site",
    ]
        .filter(Boolean)
        .join(" • ")
}

// Status pill colors from the design: gray / amber / blue / red / green.
const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
    Applied: "border-border bg-muted text-muted-foreground",
    Review: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    Interview: "border-sky-500/30 bg-sky-500/10 text-sky-500",
    Shortlisted: "border-blue-500/30 bg-blue-500/10 text-blue-500",
    Rejected: "border-destructive/30 bg-destructive/10 text-destructive",
    Offered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
}

// Square company avatar showing the company's initial, as in the design.
function CompanyLogo({ company }: { company: string }) {
    return (
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border bg-secondary font-heading text-sm font-bold text-foreground">
            {company?.charAt(0)?.toUpperCase() || "?"}
        </span>
    )
}

// Summary metric card for the stats row.
function StatCard({
    label,
    value,
    className,
}: {
    label: string
    value: string | number
    className?: string
}) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <p
                className={cn(
                    "mt-2 font-heading text-2xl font-semibold",
                    className
                )}
            >
                {value}
            </p>
        </div>
    )
}

const pageItemClass =
    "flex size-8 items-center justify-center rounded-lg text-sm transition-colors"

// ---------------------------------------------------------------------------
// Dummy data — replaced once real application data is loaded from the backend.
// ---------------------------------------------------------------------------

const hoursAgo = (hours: number) =>
    new Date(Date.now() - hours * 3_600_000).toISOString()

const DUMMY_APPLICATIONS: JobApplication[] = [
    {
        id: "app_1",
        jobId: "job_1",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "Senior Frontend Engineer",
        companyName: "Stark Industries",
        jobType: "Full-time",
        location: "New York, NY",
        remoteAllowed: true,
        status: "Applied",
        appliedAt: hoursAgo(2),
    },
    {
        id: "app_2",
        jobId: "job_2",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "Product Designer",
        companyName: "Cyberdyne Systems",
        jobType: "Contract",
        location: "Austin, TX",
        remoteAllowed: false,
        status: "Review",
        appliedAt: hoursAgo(24),
    },
    {
        id: "app_3",
        jobId: "job_3",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "Lead Data Scientist",
        companyName: "Wayne Enterprises",
        jobType: "Full-time",
        location: "Gotham, NJ",
        remoteAllowed: true,
        status: "Shortlisted",
        appliedAt: hoursAgo(24 * 4),
    },
    {
        id: "app_4",
        jobId: "job_4",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "Cloud Architect",
        companyName: "Oscorp Tech",
        jobType: "Full-time",
        location: "San Francisco, CA",
        remoteAllowed: true,
        status: "Rejected",
        appliedAt: hoursAgo(24 * 7),
    },
    {
        id: "app_5",
        jobId: "job_5",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "AI Research Engineer",
        companyName: "Hooli Corp",
        jobType: "Full-time",
        location: "Palo Alto, CA",
        remoteAllowed: false,
        status: "Offered",
        appliedAt: hoursAgo(24 * 14),
    },
    {
        id: "app_6",
        jobId: "job_6",
        userId: "user_1",
        email: "seeker@example.com",
        jobTitle: "UX Researcher",
        companyName: "Umbrella Health",
        jobType: "Part-time",
        location: "Boston, MA",
        remoteAllowed: true,
        status: "Interview",
        appliedAt: hoursAgo(24 * 10),
    },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function MyApplicationsPage() {
    const applications = DUMMY_APPLICATIONS
    const total = applications.length
    const shortlisted = applications.filter(
        (application) => application.status === "Shortlisted"
    ).length
    const interviews = applications.filter(
        (application) => application.status === "Interview"
    ).length
    const successRate = total ? Math.round((interviews / total) * 100) : 0

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <PageHeader
                breadcrumbs={[
                    { label: "Seeker" },
                    { label: "My Applications" },
                ]}
                title="My Applications"
                description="Track your job applications and interview progress in real-time."
                action={
                    <div className="flex items-center gap-3">
                        <ApplicationsTabs />
                        <Button variant="outline">
                            <DownloadIcon data-icon="inline-start" />
                            Export PDF
                        </Button>
                    </div>
                }
            />

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Total Applied" value={total} />
                <StatCard label="Shortlisted" value={shortlisted} />
                <StatCard
                    label="Interviews"
                    value={interviews}
                    className="text-amber-500"
                />
                <StatCard
                    label="Success Rate"
                    value={`${successRate}%`}
                    className="text-emerald-500"
                />
            </div>

            {/* Applications table */}
            <div className="mt-6 rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                                <th className="px-4 py-3 text-left font-medium">
                                    Job Title
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                                    Company
                                </th>
                                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                                    Applied
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr
                                    key={application.id}
                                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                >
                                    {/* Job title */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <CompanyLogo
                                                company={application.companyName}
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {application.jobTitle}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {jobMetaLabel(application)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company */}
                                    <td className="hidden px-4 py-4 sm:table-cell">
                                        {application.companyName}
                                    </td>

                                    {/* Applied */}
                                    <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground md:table-cell">
                                        {appliedLabel(application.appliedAt)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-4">
                                        <Badge
                                            className={
                                                STATUS_BADGE_CLASS[
                                                    application.status
                                                ]
                                            }
                                        >
                                            {application.status}
                                        </Badge>
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer: count + pagination (static until data is loaded) */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        Showing 1-{total} of {total} applications
                    </p>
                    <nav
                        aria-label="Applications pagination"
                        className="flex items-center gap-1.5"
                    >
                        <button
                            type="button"
                            aria-label="Previous page"
                            disabled
                            className={cn(
                                pageItemClass,
                                "border hover:bg-muted disabled:opacity-50"
                            )}
                        >
                            <ChevronLeftIcon className="size-4" />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                type="button"
                                aria-current={page === 1 ? "page" : undefined}
                                className={cn(
                                    pageItemClass,
                                    page === 1
                                        ? "bg-primary font-medium text-primary-foreground"
                                        : "border text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            type="button"
                            aria-label="Next page"
                            className={cn(
                                pageItemClass,
                                "border hover:bg-muted"
                            )}
                        >
                            <ChevronRightIcon className="size-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default MyApplicationsPage
