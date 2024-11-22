export interface QueryParams {
    // You may add `filters` for more complex Supabase queries, for example: eq, gt
    cols?: string,
    orderBy?: string,
    limitBy?: number,
    sortByAsc?: boolean,
}