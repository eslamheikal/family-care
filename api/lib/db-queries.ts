import { DbClient } from './db-client';
import { PaginationOptions } from '../utils/pagination-options';
import { PagedResult } from '../utils/paged-result';
import { QueryOptions } from '../utils/query-option';

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

    /**
     * Get all documents from collection
     */
    async getAll(): Promise<any[]> {
        try {
            const snapshot = await this.getCollection().get();
            return snapshot.docs.map(doc => ({ ...doc.data(), [this.idField]: doc.id }));
        } catch (error) {
            console.error(`Error getting all ${this.collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Get document by ID
     */
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

    /**
     * Create new document
     */
    async create(data: Partial<any>): Promise<any> {
        try {
            const docRef = this.getCollection().doc();
            const newData = { ...data, [this.idField]: docRef.id };
            await docRef.set(newData);
            return newData;
        } catch (error) {
            console.error(`Error creating ${this.collectionName}:`, error);
            throw error;
        }
    }

    /**
     * Update document by ID
     */
    async update(id: string | number, data: Partial<any>): Promise<any | null> {
        try {
            const docRef = this.getCollection().doc(String(id));
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                return null;
            }

            await docRef.update(data);
            const updatedSnapshot = await docRef.get();

            return {
                ...updatedSnapshot.data(),
                [this.idField]: updatedSnapshot.id,
            };

        } catch (error) {
            console.error(
                `Error updating document in collection "${this.collectionName}" with ID "${id}":`,
                error
            );
            throw error;
        }
    }


    /**
     * Delete document by ID
     */
    async delete(id: string | number): Promise<boolean> {
        try {
            const docRef = this.getCollection().doc(String(id));
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                return false;
            }

            await docRef.delete();
            return true;
        } catch (error) {
            console.error(
                `Error deleting document in collection "${this.collectionName}" with ID "${id}":`,
                error
            );
            throw error;
        }
    }


    /**
     * Query documents with filters
     */
    async query(options: QueryOptions = {}): Promise<any[]> {
        try {
            let query: FirebaseFirestore.Query = this.getCollection();

            // Apply where conditions
            if (options.where) {
                for (const [field, value] of Object.entries(options.where)) {
                    query = query.where(field, '==', value);
                }
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


    /**
     * Get paginated results with search and filtering
     */
    async getPaged(options: PaginationOptions): Promise<PagedResult<any>> {
        const { page, pageSize, search, searchFields = [], sortBy, sortOrder = 'asc', filters = {}, lastDoc } = options;

        let query: FirebaseFirestore.Query = this.getCollection();

        // Filters
        for (const [field, value] of Object.entries(filters)) {
            query = query.where(field, '==', value);
        }

        // Search (on first field only)
        if (search && searchFields.length > 0) {
            const primarySearchField = searchFields[0];
            // Use a more flexible search approach
            query = query
                .where(primarySearchField, '>=', search)
                .where(primarySearchField, '<=', search + '\uf8ff');
        }
        // If no search fields are available, skip search functionality

        // Sort
        if (sortBy) {
            query = query.orderBy(sortBy, sortOrder);
        }

        // Pagination cursor
        if (page > 1 && lastDoc) {
            query = query.startAfter(lastDoc);
        }

        // Limit
        query = query.limit(pageSize);

        const snapshot = await query.get();
        const documents = snapshot.docs.map(doc => ({ ...doc.data(), [this.idField]: doc.id }));
        
        // Count total documents (always count for accurate pagination)
        let totalCount = 0;
        try {
            // Create a separate query for counting without pagination
            let countQuery: FirebaseFirestore.Query = this.getCollection();
            
            // Apply the same filters
            for (const [field, value] of Object.entries(filters)) {
                countQuery = countQuery.where(field, '==', value);
            }
            
            // Apply the same search
            if (search && searchFields.length > 0) {
                const primarySearchField = searchFields[0];
                countQuery = countQuery
                    .where(primarySearchField, '>=', search)
                    .where(primarySearchField, '<=', search + '\uf8ff');
            }
            // If no search fields are available, skip search functionality
            
            // Get all documents and count (more reliable than count aggregation)
            const countSnapshot = await countQuery.count().get();
            totalCount = countSnapshot.data().count;
        } catch (error) {
            console.error('Error counting documents:', error);
            // Fallback: estimate based on current page
            totalCount = documents.length;
        }

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        // Calculate pagination metadata
        const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            data: documents,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
            search: search || null,
            filters: Object.keys(filters).length > 0 ? filters : null,
            lastDoc: lastVisible || null,
        };
    }


    /**
     * Count documents using Firebase's native counting
     */
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


    /**
     * Check if document exists
     */
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
