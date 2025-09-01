import { QueryFilterParamsModel } from "./query-filter-params.model";
import { QuerySortParamsModel } from "./query-sort-params.model";

export class QueryParamsModel {
    constructor(
        public page?: number,
        public pageSize?: number,
        public sort?: QuerySortParamsModel,
        public filters?: QueryFilterParamsModel[]
    ) {
        this.page = 1;
        this.pageSize = 20;
        this.filters = [];
    }

}