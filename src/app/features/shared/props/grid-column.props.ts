import { FormControl } from "@angular/forms";
import { ColumnFilterTypeEnum } from "../../../features/shared/enums/column.filter.type.enum";
import { TemplateRef } from "@angular/core";
import { ColumnTypeEnum } from "../../../features/shared/enums/column.type.enum";
import { DropdownProps } from "./dropdown.props";
import { FilterOperators } from "./query-filter-params.props";

export class GridColumn {
    title!: string;
    field!: string;
    apiField?: string;
    sortable?: boolean;

    filterType?: ColumnFilterTypeEnum;
    filterOptions?: DropdownProps[] = [];
    filterOperator?: FilterOperators;

    columnType?: ColumnTypeEnum;
    editOptions?: DropdownProps[];

    allowDropdownClear? = false;

    control?: FormControl;
    isRequired? = false;

    backgroundColor?: string;
    setBackgroundColorTo?: any[];
    validate?: (value: string) => boolean;
    disabled?: boolean;

    customTemplate?: TemplateRef<any>;
    mapper?: (value: any) => string;
    
    // Badge configuration
    badgeConfig?: {
        getValue: (item: any) => string;
        getColor: (item: any) => string;
        getClass?: (item: any) => string;
    };

    booleanConfig?: {
        trueValue: string;
        falseValue: string;
    };
}
