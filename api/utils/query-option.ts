export interface QueryOptions {
    where?: Record<string, any>;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
    offset?: number;
}