import type { JobForm, JobListing } from "@/lib/types/job";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type ApiResponse<T> = {
    ok: boolean;
    data?: T;
    error?: string;
};

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

export const getJobs = async (): Promise<ApiResponse<JobListing[] | unknown[]>> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" });

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
