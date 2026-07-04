export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: unknown;
}

export function successResponse<T>(data: T, meta?: unknown): ApiResponse<T> {
    return {
        success: true,
        data,
        meta
    }
}