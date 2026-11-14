import type { JobApplication } from "@/lib/types/application";
import type { ApiResponse } from "@/lib/types/api";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Submit a job application (POST /applications).
 * The caller provides the job snapshot and the applying user; the status and
 * submission date are assigned here so they are always consistent.
 * Returns a predictable { ok, data, error } envelope so callers never crash on
 * network failures or non-JSON error responses.
 */
export const applyToAJob = async (
    data: Omit<JobApplication, "id" | "status" | "appliedAt">
): Promise<ApiResponse<unknown>> => {
    const application: Omit<JobApplication, "id"> = {
        ...data,
        status: "Applied",
        appliedAt: new Date().toISOString(),
    };

    try {
        const res = await fetch(`${BASE_URL}/applications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(application),
        });

        if (!res.ok) {
            return {
                ok: false,
                error:
                    (await res
                        .json()
                        .then((body) => body?.message)
                        .catch(() => null)) ??
                    `Failed to submit application (HTTP ${res.status})`,
            };
        }

        return { ok: true, data: await res.json() };
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? `Could not reach the application service: ${error.message}`
                    : "Could not reach the application service.",
        };
    }
};
