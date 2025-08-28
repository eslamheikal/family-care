import { TranslateService } from '@ngx-translate/core';

export interface BadgeConfig {
    getValue: (item: any) => string;
    getColor: (item: any) => string;
    getClass?: (item: any) => string;
}

export class BadgeHelper {
    
    /**
     * Creates a capacity status badge configuration
     * @param translate - TranslateService instance
     * @param capacityField - Field name for capacity (default: 'capacity')
     * @param currentField - Field name for current count (default: 'numberOfStudents')
     * @returns BadgeConfig
     */
    static createCapacityBadge(translate: TranslateService, capacityField: string = 'capacity', currentField: string = 'numberOfStudents'): BadgeConfig {
        return {
            getValue: (item: any) => {
                const percentage = (item[currentField] / item[capacityField]) * 100;
                if (percentage >= 90) return translate.instant('shared.badges.full');
                if (percentage >= 70) return translate.instant('shared.badges.almostFull');
                if (percentage >= 50) return translate.instant('shared.badges.halfFull');
                return translate.instant('shared.badges.available');
            },
            getColor: (item: any) => {
                const percentage = (item[currentField] / item[capacityField]) * 100;
                if (percentage >= 90) return '#dc3545'; // Red for full
                if (percentage >= 70) return '#fd7e14'; // Orange for almost full
                if (percentage >= 50) return '#ffc107'; // Yellow for half full
                return '#28a745'; // Green for available
            },
            getClass: (item: any) => {
                const percentage = (item[currentField] / item[capacityField]) * 100;
                if (percentage >= 90) return 'text-white';
                if (percentage >= 70) return 'text-white';
                if (percentage >= 50) return 'text-dark';
                return 'text-white';
            }
        };
    }

    /**
     * Creates a status badge configuration
     * @param translate - TranslateService instance
     * @param statusField - Field name for status (default: 'isActive')
     * @returns BadgeConfig
     */
    static createStatusBadge(translate: TranslateService, statusField: string = 'isActive'): BadgeConfig {
        return {
            getValue: (item: any) => {
                return item[statusField] 
                    ? translate.instant('shared.badges.active')
                    : translate.instant('shared.badges.inactive');
            },
            getColor: (item: any) => {
                return item[statusField] ? '#28a745' : '#6c757d'; // Green for active, Gray for inactive
            },
            getClass: (item: any) => {
                return 'text-white';
            }
        };
    }

    /**
     * Creates a custom badge configuration
     * @param translate - TranslateService instance
     * @param getValueFn - Function to get the display value
     * @param getColorFn - Function to get the background color
     * @param getClassFn - Optional function to get CSS classes
     * @returns BadgeConfig
     */
    static createCustomBadge(
        translate: TranslateService,
        getValueFn: (item: any) => string,
        getColorFn: (item: any) => string,
        getClassFn?: (item: any) => string
    ): BadgeConfig {
        return {
            getValue: getValueFn,
            getColor: getColorFn,
            getClass: getClassFn
        };
    }
} 