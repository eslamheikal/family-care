export class QueryFilterParamsModel {
    constructor(
        public columnName: string,
        public columnValue: number | string | boolean,
        public operator: FilterOperators,
        public isGlobal?: boolean
    ) { }
}
export enum FilterOperators {
    equal,
    contain,
    containsWithComma,
    in,
    iS,
    lessThan,
    lessThanOrEqual,
    greaterThan,
    greaterThanOrEqual
}