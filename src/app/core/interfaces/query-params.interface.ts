export interface QueryParams {
    cols?: string,
    orderBy?: string,
    limitBy?: number,
    sortByAsc?: boolean,
    eq?: {
        column?: string,
        value?: any
    }
}