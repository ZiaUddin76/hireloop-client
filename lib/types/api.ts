// Standard response envelope returned by the fetchers in lib/actions/*,
// so callers never crash on network failures or non-JSON error responses.
export type ApiResponse<T> = {
    ok: boolean;
    data?: T;
    error?: string;
}
