export interface PaginationOptions {
    page: number;
    pageSize: number;
    search?: string;
    searchFields?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
    lastDoc?: any; // Firebase document snapshot for cursor-based pagination
}