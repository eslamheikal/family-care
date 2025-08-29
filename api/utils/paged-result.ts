export interface PagedResult<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    search?: string | null;
    filters?: Record<string, any> | null;
    lastDoc?: any; // Firebase document snapshot for next page cursor
}
