// Pure helpers shared by the browse-jobs page (server) and its client
// controls: they turn URL params into a filter object, a /browse-jobs href
// and a query string for GET /jobs on the backend.

export const JOBS_PAGE_SIZE = 6;

export const DEFAULT_SORT = "recent";

// URL filter values the backend understands (see hireloop-server GET /jobs).
export const SORT_OPTIONS = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest" },
] as const;

export type JobBrowseFilters = {
    q: string;
    location: string;
    jobType: string;
    workModes: string[];
    category: string;
    sort: string;
    page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

function firstValue(params: RawParams, key: string) {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
}

// Read the raw searchParams of /browse-jobs into a normalized filter object.
export function parseJobFilters(params: RawParams): JobBrowseFilters {
    const page = Number.parseInt(firstValue(params, "page"), 10);
    const sort = firstValue(params, "sort");

    return {
        q: firstValue(params, "q"),
        location: firstValue(params, "location"),
        jobType: firstValue(params, "jobType"),
        workModes: firstValue(params, "workMode")
            .split(",")
            .filter(Boolean),
        category: firstValue(params, "category"),
        sort: sort || DEFAULT_SORT,
        page: page > 0 ? page : 1,
    };
}

// Build the /browse-jobs href for a (possibly overridden) filter set, keeping
// only non-default values in the URL.
export function buildJobsHref(
    filters: JobBrowseFilters,
    overrides: Partial<JobBrowseFilters> = {}
) {
    const next = { ...filters, ...overrides };
    const params = new URLSearchParams();

    if (next.q) params.set("q", next.q);
    if (next.location) params.set("location", next.location);
    if (next.jobType) params.set("jobType", next.jobType);
    // Selecting both work modes (or none) means "no remote filter".
    if (next.workModes.length === 1) {
        params.set("workMode", next.workModes.join(","));
    }
    if (next.category) params.set("category", next.category);
    if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
    if (next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    return query ? `/browse-jobs?${query}` : "/browse-jobs";
}

// Build the query string for the backend GET /jobs endpoint.
export function buildJobsQuery(filters: JobBrowseFilters) {
    const params = new URLSearchParams();

    if (filters.q) params.set("search", filters.q);
    if (filters.location) params.set("location", filters.location);
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.workModes.length === 1) {
        params.set("isRemote", String(filters.workModes[0] === "Remote"));
    }
    if (filters.category) params.set("category", filters.category);
    params.set("sort", filters.sort);
    params.set("page", String(filters.page));
    params.set("limit", String(JOBS_PAGE_SIZE));

    return params.toString();
}
