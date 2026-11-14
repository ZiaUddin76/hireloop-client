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

export const getJobs = async (
    query = ''
): Promise<ApiResponse<JobListing[] | unknown[]> & { total?: number }> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs?${query}`, { cache: "no-store" });

        if (!res.ok) {
            return {
                ok: false,
                error: `Failed to load jobs (HTTP ${res.status})`,
            };
        }

        // When the backend paginates, the total matching count arrives via
        // the X-Total-Count header.
        const total = Number(res.headers.get("X-Total-Count"));

        const raw = await res.json();
        // MongoDB documents carry their id as `_id`; expose it as `id` so
        // consumers get a stable key / identifier as promised by JobListing.
        const data = Array.isArray(raw)
            ? raw.map((doc) => ({ ...doc, id: doc._id ?? doc.id }))
            : raw;

        return { ok: true, data, total: total || undefined };
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


export const getJob = async (jobId: string): Promise<ApiResponse<JobListing>> => {
    try {
        const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { cache: "no-store" });

        if (!res.ok) {
            return {
                ok: false,
                error:
                    res.status === 404
                        ? "Job not found."
                        : `Failed to load job (HTTP ${res.status})`,
            };
        }

        // MongoDB documents carry their id as `_id`; expose it as `id` so
        // consumers get a stable key / identifier as promised by JobListing.
        const doc = await res.json();
        return { ok: true, data: { ...doc, id: doc._id ?? doc.id } };
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
