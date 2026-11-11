// Shared job types used by both the "new job" form and the manager pages.
// Kept out of any "use client" file so server modules can import them safely.

export type JobForm = {
    title: string
    company: string
    category: string
    jobType: string
    remoteAllowed: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    frequency: string
    responsibilities: string
    qualifications: string
}

export type JobStatus = "Active" | "Expired"

// What the Manage Jobs table displays: a stored job plus listing metadata.
export type JobListing = JobForm & {
    id: string
    applicants: number
    status: JobStatus
    /** ISO date the listing was published, e.g. "2026-11-06". */
    createdAt: string
}
