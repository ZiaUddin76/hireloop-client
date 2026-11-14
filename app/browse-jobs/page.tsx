import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobSearch } from "@/components/jobs/job-search";
import { JobsPagination } from "@/components/jobs/jobs-pagination";
import { SortSelect } from "@/components/jobs/sort-select";
import { getJobs } from "@/lib/actions/jobs";
import {
    buildJobsQuery,
    JOBS_PAGE_SIZE,
    parseJobFilters,
} from "@/lib/helpers/jobs";
import type { JobListing } from "@/lib/types/job";

const BrowseJobsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const params = await searchParams;

    const filters = parseJobFilters(params);
    const { ok, data, error, total } = await getJobs(buildJobsQuery(filters));

    const jobs: JobListing[] =
        ok && Array.isArray(data) ? (data as JobListing[]) : [];
    const totalCount = total ?? jobs.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PAGE_SIZE));

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                Browse Jobs
            </h1>

            <JobSearch filters={filters} className="mt-6" />

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[260px_1fr]">
                <aside>
                    <JobFilters filters={filters} />
                </aside>

                <section>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Found{" "}
                            <span className="font-medium text-foreground">
                                {totalCount}
                            </span>{" "}
                            jobs
                        </p>
                        <SortSelect filters={filters} />
                    </div>

                    <div className="mt-4 space-y-4">
                        {!ok ? (
                            <p className="rounded-xl border bg-card p-8 text-center text-sm text-destructive">
                                {error ?? "Failed to load jobs."}
                            </p>
                        ) : jobs.length === 0 ? (
                            <p className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
                                No jobs found. Try adjusting your search or
                                filters.
                            </p>
                        ) : (
                            jobs.map((job) => <JobCard key={job.id} job={job} />)
                        )}
                    </div>

                    <JobsPagination
                        page={filters.page}
                        totalPages={totalPages}
                        filters={filters}
                    />
                </section>
            </div>
        </div>
    );
};

export default BrowseJobsPage;
