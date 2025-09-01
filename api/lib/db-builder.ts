// Define the missing interfaces
export interface QueryOptions {
    where?: Record<string, any> | WhereClause;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
    offset?: number;
}

export interface WhereCondition {
    field: string;
    operator: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
    value: any;
}

export interface WhereClause {
    and?: WhereCondition[];
    or?: WhereClause[];
    not?: WhereClause;
}

export class DbBuilder {

    static and(...conditions: WhereCondition[]): WhereClause {
        return { and: conditions };
    }

    static or(...clauses: WhereClause[]): WhereClause {
        return { or: clauses };
    }

    static not(clause: WhereClause): WhereClause {
        return { not: clause };
    }

    static condition(field: string, operator: WhereCondition['operator'], value: any): WhereCondition {
        return { field, operator, value };
    }
}