import type { JobForm, JobListing } from "@/lib/types/job";
import type { ApiResponse } from "@/lib/types/api";

// Re-exported for backwards compatibility; the type now lives in lib/types/api.
export type { ApiResponse };

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Publish a new job posting (POST /jobs).
 * Returns a predictable { ok, data, error } envelope so callers never crash on
 * network failures or non-JSON error responses.
 */
export const createJob = async (data: JobForm): Promise<ApiResponse<unknown>> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            return {
                ok: false,
                error:
                    (await res
                        .json()
                        .then((body) => body?.message)
                        .catch(() => null)) ??
                    `Failed to publish job (HTTP ${res.status})`,
            };
        }

        return { ok: true, data: await res.json() };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? `Could not reach the job service: ${error.message}`
                    : "Could not reach the job service.",
        };
    }
};

export const getJobs = async (query = ''): Promise<ApiResponse<JobListing[] | unknown[]>> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" });

        if (!res.ok) {
            return {
                ok: false,
                error: `Failed to load jobs (HTTP ${res.status})`,
            };
        }

        return { ok: true, data: await res.json() };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? `Could not reach the job service: ${error.message}`
                    : "Could not reach the job service.",
        };
    }
};


export const deleteJob = async (
    jobId: string
): Promise<ApiResponse<unknown>> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            return {
                ok: false,
                error: `Failed to delete job (HTTP ${res.status})`,
            };
        }

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? `Could not reach the job service: ${error.message}`
                    : "Could not reach the job service.",
        };
    }
};
