// Shared job application types, used by the apply flow on the job details
// page and the "My Applications" page of the seeker dashboard. Kept out of any
// "use client" file so server modules can import them safely.

export type ApplicationStatus =
    | "Applied"
    | "Review"
    | "Interview"
    | "Shortlisted"
    | "Rejected"
    | "Offered"

// One saved job application. The job fields are snapshotted at apply time so
// the My Applications table can render without joining the jobs collection.
export type JobApplication = {
    id: string
    /** The applied job. */
    jobId: string
    /** The applying user. */
    userId: string
    email: string
    jobTitle: string
    companyName: string
    jobType: string
    location: string
    remoteAllowed: boolean
    status: ApplicationStatus
    /** ISO datetime the application was submitted. */
    appliedAt: string
}
