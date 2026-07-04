export interface PaginationOptions {
    page: number; 
    limit: number;
    total: number;
    itemCount: number;
}

export function buildPaginationMeta({ page, limit, total, itemCount }: PaginationOptions) {
    return {
        page,
        limit, 
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: (page - 1) * limit + itemCount < total,
        hasPreviousPage: page > 1
    }
}