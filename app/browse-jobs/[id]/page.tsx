import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeftIcon,
    BadgeCheckIcon,
    BanknoteIcon,
    BookmarkIcon,
    CalendarIcon,
    BriefcaseIcon,
    MapPinIcon,
    type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplyNowButton } from "@/app/components/ApplyNowButton";
import { getJob } from "@/lib/actions/jobs";
import { cn } from "cn";
import type { JobListing } from "@/lib/types/job";

// "140K - 180K" style label; null when the job has no pay range.
function formatSalary(job: JobListing) {
    const { minSalary, maxSalary } = job;
    if (!minSalary && !maxSalary) return null;
    return minSalary && maxSalary
        ? `${minSalary} - ${maxSalary}`
        : (minSalary || maxSalary);
}

// "3 days ago" style label for the listing date.
function formatPosted(iso: string) {
    const date = new Date(iso);
    if (!iso || Number.isNaN(date.getTime())) return null;

    const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Split a multi-line textarea value ("one item per line") into list items.
function toListItems(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

// Square company avatar showing the company's initial, as in the design.
function CompanyLogo({
    company,
    className,
}: {
    company: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl border bg-secondary font-heading text-xl font-bold text-foreground",
                className,
            )}
        >
            {company?.charAt(0)?.toUpperCase() || "?"}
        </div>
    );
}

// Icon + uppercase label + value card, as in the design's stats row.
function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border bg-card p-4">
            <Icon className="size-4 text-muted-foreground" />
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 font-heading text-sm font-semibold">
                {value}
            </p>
        </div>
    );
}

// Titled section with a divider, used inside the details card.
function DetailsSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="py-6 first:pt-0 last:pb-0">
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            {children}
        </div>
    );
}

// Bulleted list rendered from a multi-line string ("one item per line").
function BulletList({ text }: { text: string }) {
    const items = toListItems(text);

    return (
        <ul className="mt-4 space-y-2.5">
            {items.map((item) => (
                <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

// Company sidebar card, as in the design's "Company Overview" column.
function CompanyOverview({ job }: { job: JobListing }) {
    return (
        <aside
            data-slot="company-overview"
            className="rounded-xl border bg-card p-6"
        >
            <h2 className="font-heading text-lg font-semibold">
                Company Overview
            </h2>

            <CompanyLogo company={job.company} className="mt-5 size-16 text-2xl" />
            <p className="mt-4 font-heading font-semibold">{job.company}</p>

            <dl className="mt-4 divide-y divide-border text-sm">
                <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Industry
                    </dt>
                    <dd className="text-right font-medium">{job.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                        Remote Policy
                    </dt>
                    <dd className="text-right font-medium">
                        {job.remoteAllowed ? "Remote friendly" : "On-site"}
                    </dd>
                </div>
            </dl>

            <Button
                variant="outline"
                nativeButton={false}
                render={
                    <Link
                        href={`/browse-jobs?q=${encodeURIComponent(job.company)}`}
                    />
                }
                className="mt-6 w-full"
            >
                View all jobs
            </Button>
        </aside>
    );
}

const JobDetailsPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const { ok, data, error } = await getJob(id);

    if (!ok) {
        // Distinguish a missing job (404 page) from a service failure.
        if (error === "Job not found.") {
            notFound();
        }
        return (
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
                <p className="rounded-xl border bg-card p-8 text-center text-sm text-destructive">
                    {error ?? "Failed to load job."}
                </p>
            </div>
        );
    }

    const job = data as JobListing;
    const salary = formatSalary(job);
    const posted = formatPosted(job.createdAt);
    const hasDetails =
        job.responsibilities.trim().length > 0 ||
        job.qualifications.trim().length > 0;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/browse-jobs" />}
                className="-ml-2 text-muted-foreground"
            >
                <ArrowLeftIcon data-icon="inline-start" />
                Back to jobs
            </Button>

            {/* Job header: logo, title, verified employer, save + apply */}
            <div className="mt-4 rounded-xl border bg-card p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <CompanyLogo company={job.company} />
                        <div className="min-w-0">
                            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                                {job.title}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>{job.company}</span>
                                <span aria-hidden="true">•</span>
                                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                                    <BadgeCheckIcon className="size-4" />
                                    Verified Employer
                                </span>
                                {job.status === "Expired" && (
                                    <Badge variant="muted">Expired</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            aria-label={`Save ${job.title}`}
                        >
                            <BookmarkIcon />
                        </Button>
                        {/* Applying requires an account; the button handles
                            redirecting visitors and submitting the application
                            for signed-in seekers. */}
                        <ApplyNowButton
                            jobId={job.id}
                            jobTitle={job.title}
                            companyName={job.company}
                            jobType={job.jobType}
                            location={job.location}
                            remoteAllowed={job.remoteAllowed}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
                <div className="min-w-0 space-y-6">
                    {/* Stats row: salary, location, job type, posted */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard
                            icon={BanknoteIcon}
                            label="Salary Range"
                            value={salary ?? "—"}
                        />
                        <StatCard
                            icon={MapPinIcon}
                            label="Location"
                            value={
                                job.location
                                    ? `${job.location}${job.remoteAllowed ? " (Remote)" : ""}`
                                    : job.remoteAllowed
                                      ? "Remote"
                                      : "—"
                            }
                        />
                        <StatCard
                            icon={BriefcaseIcon}
                            label="Job Type"
                            value={job.jobType || "—"}
                        />
                        <StatCard
                            icon={CalendarIcon}
                            label="Posted"
                            value={posted ?? "—"}
                        />
                    </div>

                    {/* Details card: responsibilities & requirements */}
                    <section
                        data-slot="job-details"
                        className="rounded-xl border bg-card p-6 sm:p-8"
                    >
                        {hasDetails ? (
                            <div className="divide-y divide-border">
                                {job.responsibilities.trim() && (
                                    <DetailsSection title="Responsibilities">
                                        <BulletList
                                            text={job.responsibilities}
                                        />
                                    </DetailsSection>
                                )}
                                {job.qualifications.trim() && (
                                    <DetailsSection title="Requirements">
                                        <BulletList
                                            text={job.qualifications}
                                        />
                                    </DetailsSection>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                The employer hasn&apos;t added a description
                                for this role yet.
                            </p>
                        )}
                    </section>
                </div>

                <CompanyOverview job={job} />
            </div>
        </div>
    );
};

export default JobDetailsPage;
