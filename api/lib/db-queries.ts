import { DbClient } from './db-client';
import { PagedList } from '../utils/paged-list.model';
import { QueryParamsModel } from '../utils/query-params.model';
import { QueryFilterParamsModel, FilterOperators } from '../utils/query-filter-params.model';
import { QuerySortParamsModel, SortDirection } from '../utils/query-sort-params.model';
import { QueryOptions, WhereClause, WhereCondition } from './db-builder';

export class DbQueries {

    protected collectionName: string;
    protected idField: string;

    constructor(collectionName: string, idField: string = 'id') {
        this.collectionName = collectionName;
        this.idField = idField;
    }

    protected getCollection() {
        return DbClient.collection(this.collectionName);
    }

    async getAll(): Promise<any[]> {
        try {
            const snapshot = await this.getCollection().get();
            return snapshot.docs.map(doc => ({ ...doc.data(), [this.idField]: doc.id }));
        } catch (error) {
            console.error(`Error getting all ${this.collectionName}:`, error);
            throw error;
        }
    }

    async getById(id: string | number): Promise<any | null> {
        try {
            const doc = await this.getCollection().doc(id.toString()).get();
            if (!doc.exists) {
                return null;
            }
            return { ...doc.data(), [this.idField]: doc.id };
        } catch (error) {
            console.error(`Error getting ${this.collectionName} by ID ${id}:`, error);
            throw error;
        }
    }

    async query(options: QueryOptions = {}): Promise<any[]> {
        try {
            // Handle OR conditions separately since they require multiple queries
            if (options.where && this.isComplexWhereClause(options.where) && (options.where as WhereClause).or) {
                return await this.handleOrQuery(options);
            }

            let query: FirebaseFirestore.Query = this.getCollection();

            // Apply where conditions
            if (options.where) {
                query = this.applyWhereConditions(query, options.where);
            }

            // Apply ordering
            if (options.orderBy) {
                const { field, direction } = options.orderBy;
                query = query.orderBy(field, direction);
            }

            // Apply limit
            if (options.limit && options.limit > 0) {
                query = query.limit(options.limit);
            }

            const snapshot = await query.get();

            return snapshot.docs.map(
                (doc) => ({ ...doc.data(), [this.idField]: doc.id })
            );

        } catch (error) {
            console.error(
                `Error querying collection "${this.collectionName}":`,
                error
            );
            throw error;
        }
    }

    private async handleOrQuery(options: QueryOptions): Promise<any[]> {
        const whereClause = options.where as WhereClause;
        if (!whereClause.or) return [];

        // Execute multiple queries for OR conditions
        const queryPromises = whereClause.or.map(async (clause) => {
            let subQuery: FirebaseFirestore.Query = this.getCollection();
            
            if (clause.and) {
                subQuery = this.applyAndConditions(subQuery, clause.and);
            }
            
            // Apply ordering if specified
            if (options.orderBy) {
                const { field, direction } = options.orderBy;
                subQuery = subQuery.orderBy(field, direction);
            }
            
            // Apply limit if specified
            if (options.limit && options.limit > 0) {
                subQuery = subQuery.limit(options.limit);
            }
            
            const snapshot = await subQuery.get();
            return snapshot.docs.map(doc => ({ ...doc.data(), [this.idField]: doc.id }));
        });
        
        const results = await Promise.all(queryPromises);
        
        // Merge and deduplicate results
        const mergedResults = new Map();
        results.flat().forEach(doc => {
            mergedResults.set(doc[this.idField], doc);
        });
        
        let finalResults = Array.from(mergedResults.values());
        
        // Apply limit to final merged results if specified
        if (options.limit && options.limit > 0) {
            finalResults = finalResults.slice(0, options.limit);
        }
        
        return finalResults;
    }

    private applyWhereConditions(query: FirebaseFirestore.Query, whereClause: Record<string, any> | WhereClause): FirebaseFirestore.Query {
        // Handle simple where clause (backward compatibility)
        if (!this.isComplexWhereClause(whereClause)) {
            for (const [field, value] of Object.entries(whereClause)) {
                query = query.where(field, '==', value);
            }
            return query;
        }

        // Handle complex where clause
        const complexClause = whereClause as WhereClause;
        
        if (complexClause.and) {
            return this.applyAndConditions(query, complexClause.and);
        }
        
        if (complexClause.not) {
            return this.applyNotConditions(query, complexClause.not);
        }

        return query;
    }

    private isComplexWhereClause(whereClause: Record<string, any> | WhereClause): whereClause is WhereClause {
        return typeof whereClause === 'object' && 
               (whereClause.hasOwnProperty('and') || 
                whereClause.hasOwnProperty('or') || 
                whereClause.hasOwnProperty('not'));
    }

    private applyAndConditions(query: FirebaseFirestore.Query, conditions: WhereCondition[]): FirebaseFirestore.Query {
        for (const condition of conditions) {
            query = query.where(condition.field, condition.operator, condition.value);
        }
        return query;
    }

    private applyNotConditions(query: FirebaseFirestore.Query, clause: WhereClause): FirebaseFirestore.Query {
        // Firestore doesn't have direct NOT support, but we can use != operator
        // This is a simplified implementation
        if (clause.and && clause.and.length > 0) {
            const firstCondition = clause.and[0];
            return query.where(firstCondition.field, '!=', firstCondition.value);
        }
        
        return query;
    }

    static createQueryParams(
        page: number = 1,
        pageSize: number = 20,
        sortColumn?: string,
        sortDirection: SortDirection = SortDirection.asc,
        filters: QueryFilterParamsModel[] = []
    ): QueryParamsModel {
        const sort = sortColumn ? new QuerySortParamsModel(sortColumn, sortDirection) : undefined;
        return new QueryParamsModel(page, pageSize, sort, filters);
    }

    static createFilter(
        columnName: string,
        columnValue: number | string | boolean,
        operator: FilterOperators = FilterOperators.equal,
        isGlobal: boolean = false
    ): QueryFilterParamsModel {
        return new QueryFilterParamsModel(columnName, columnValue, operator, isGlobal);
    }

    async getPaged(queryParams: QueryParamsModel): Promise<PagedList<any>> {
        const { page = 1, pageSize = 20, sort, filters = [] } = queryParams;

        let query: FirebaseFirestore.Query = this.getCollection();

        // Apply filters
        if (filters && filters.length > 0) {
            query = this.applyQueryFilters(query, filters);
        }

        // Apply sorting
        if (sort) {
            const direction = sort.direction === SortDirection.asc ? 'asc' : 'desc';
            query = query.orderBy(sort.columnName, direction);
        }

        // Apply pagination
        const offset = (page - 1) * pageSize;
        query = query.limit(pageSize);

        // If not first page, we need to use cursor-based pagination
        if (page > 1) {
            // For cursor-based pagination, we need to get the last document from previous page
            // This is a simplified implementation - in production you might want to store cursors
            const previousPageQuery = this.getCollection().limit(offset);
            if (sort) {
                const direction = sort.direction === SortDirection.asc ? 'asc' : 'desc';
                previousPageQuery.orderBy(sort.columnName, direction);
            }
            const previousSnapshot = await previousPageQuery.get();
            const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];
            if (lastDoc) {
                query = query.startAfter(lastDoc);
            }
        }

        const snapshot = await query.get();
        const documents = snapshot.docs.map(doc => ({ ...doc.data(), [this.idField]: doc.id }));
        
        // Count total documents
        let totalCount = 0;
        try {
            let countQuery: FirebaseFirestore.Query = this.getCollection();
            
            // Apply the same filters for counting
            if (filters && filters.length > 0) {
                countQuery = this.applyQueryFilters(countQuery, filters);
            }
            
            const countSnapshot = await countQuery.count().get();
            totalCount = countSnapshot.data().count;
        } catch (error) {
            console.error('Error counting documents:', error);
            // Fallback: estimate based on current page
            totalCount = documents.length;
        }

        // Calculate page count
        const pageCount = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;

        return {
            items: documents,
            totalCount,
            pageCount
        };
    }

    private applyQueryFilters(query: FirebaseFirestore.Query, filters: QueryFilterParamsModel[]): FirebaseFirestore.Query {
        filters.forEach(filter => {
            const operator = this.mapFilterOperator(filter.operator);
            query = query.where(filter.columnName, operator, filter.columnValue);
        });
        return query;
    }

    private mapFilterOperator(operator: FilterOperators): FirebaseFirestore.WhereFilterOp {
        switch (operator) {
            case FilterOperators.equal:
                return '==';
            case FilterOperators.contain:
            case FilterOperators.containsWithComma:
                return 'array-contains';
            case FilterOperators.in:
                return 'in';
            case FilterOperators.lessThan:
                return '<';
            case FilterOperators.lessThanOrEqual:
                return '<=';
            case FilterOperators.greaterThan:
                return '>';
            case FilterOperators.greaterThanOrEqual:
                return '>=';
            default:
                return '==';
        }
    }

    async count(filters: Record<string, any> = {}): Promise<number> {
        try {
            let query: FirebaseFirestore.Query = this.getCollection();

            // Apply filters if provided
            for (const [field, value] of Object.entries(filters)) {
                query = query.where(field, '==', value);
            }

            // Try native count aggregation (Firestore Admin SDK v11+)
            if (typeof query.count === 'function') {
                const countSnapshot = await query.count().get();
                return countSnapshot.data().count;
            }

            // Fallback: traditional fetch + count
            const snapshot = await query.count().get();
            return snapshot.data().count;

        } catch (error) {
            console.error(`Error counting documents in ${this.collectionName}:`, error);
            throw error;
        }
    }

    async exists(id: string | number): Promise<boolean> {
        try {
            const docRef = this.getCollection().doc(String(id));
            const docSnapshot = await docRef.get();
            return docSnapshot.exists;
        } catch (error) {
            console.error(
                `Error checking existence in collection "${this.collectionName}" with ID "${id}":`,
                error
            );
            throw error;
        }
    }

}
