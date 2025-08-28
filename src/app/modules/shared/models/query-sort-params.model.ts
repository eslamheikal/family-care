export class QuerySortParamsModel {
    constructor(
        public columnName: string, 
        public direction: SortDirection
    ) { }
}
export enum SortDirection {
    asc,
    desc
}