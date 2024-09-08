export interface PaginatedResponse<T> {
    data: T;
    current_page: number;
    nextLink: string | null;
    previousLink: string | null;
    totalRows: number;
    per_page: number;
}
