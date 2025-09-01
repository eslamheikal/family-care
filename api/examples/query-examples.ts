import { DbQueries } from '../lib/db-queries';
import { WhereCondition } from '../utils/query-option';

// Example usage of the new AND/OR query functionality

export class QueryExamples {
    private userQueries = new DbQueries('users', 'id');

    /**
     * Example 1: Simple AND conditions
     * Find users who are active AND have role 'admin'
     */
    async findActiveAdmins() {
        const whereClause = DbQueries.and(
            DbQueries.condition('isActive', '==', true),
            DbQueries.condition('role', '==', 'admin')
        );

        return await this.userQueries.query({
            where: whereClause
        });
    }

    /**
     * Example 2: Multiple AND conditions
     * Find users who are active, have role 'user', and joined after 2023
     */
    async findRecentActiveUsers() {
        const whereClause = DbQueries.and(
            DbQueries.condition('isActive', '==', true),
            DbQueries.condition('role', '==', 'user'),
            DbQueries.condition('joinedDate', '>=', '2023-01-01')
        );

        return await this.userQueries.query({
            where: whereClause,
            orderBy: { field: 'joinedDate', direction: 'desc' }
        });
    }

    /**
     * Example 3: OR conditions (same field)
     * Find users with role 'admin' OR 'moderator'
     */
    async findAdminsOrModerators() {
        // Note: Firestore OR queries must be on the same field
        // This is a simplified example - in practice, you might need multiple queries
        const whereClause = DbQueries.or(
            DbQueries.and(DbQueries.condition('role', '==', 'admin')),
            DbQueries.and(DbQueries.condition('role', '==', 'moderator'))
        );

        return await this.userQueries.query({
            where: whereClause
        });
    }

    /**
     * Example 4: Complex conditions with different operators
     * Find users who are active, have email ending with '@company.com', and joined in the last year
     */
    async findCompanyUsers() {
        const whereClause = DbQueries.and(
            DbQueries.condition('isActive', '==', true),
            DbQueries.condition('email', '>=', '@company.com'),
            DbQueries.condition('email', '<=', '@company.com\uf8ff'),
            DbQueries.condition('joinedDate', '>=', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        );

        return await this.userQueries.query({
            where: whereClause,
            orderBy: { field: 'joinedDate', direction: 'desc' }
        });
    }

    /**
     * Example 5: NOT conditions
     * Find users who are NOT inactive
     */
    async findNonInactiveUsers() {
        const whereClause = DbQueries.not(
            DbQueries.and(DbQueries.condition('isActive', '==', false))
        );

        return await this.userQueries.query({
            where: whereClause
        });
    }

    /**
     * Example 6: Backward compatibility - simple where clause
     * This still works with the old format
     */
    async findUsersByRole(role: string) {
        return await this.userQueries.query({
            where: { role: role }
        });
    }

    /**
     * Example 7: Using with pagination
     */
    async findActiveUsersPaginated(page: number = 1, pageSize: number = 10) {
        const whereClause = DbQueries.and(
            DbQueries.condition('isActive', '==', true)
        );

        return await this.userQueries.getPaged({
            page,
            pageSize,
            filters: whereClause,
            sortBy: 'name',
            sortOrder: 'asc'
        });
    }

    /**
     * Example 8: Array contains queries
     * Find users who have specific permissions
     */
    async findUsersWithPermission(permission: string) {
        const whereClause = DbQueries.and(
            DbQueries.condition('permissions', 'array-contains', permission)
        );

        return await this.userQueries.query({
            where: whereClause
        });
    }

    /**
     * Example 9: Range queries
     * Find users who joined between two dates
     */
    async findUsersByDateRange(startDate: string, endDate: string) {
        const whereClause = DbQueries.and(
            DbQueries.condition('joinedDate', '>=', startDate),
            DbQueries.condition('joinedDate', '<=', endDate)
        );

        return await this.userQueries.query({
            where: whereClause,
            orderBy: { field: 'joinedDate', direction: 'asc' }
        });
    }
}
