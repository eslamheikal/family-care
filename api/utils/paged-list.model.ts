export interface PagedList<T> {
    items: T[];
    totalCount: number;
    pageCount: number;
}