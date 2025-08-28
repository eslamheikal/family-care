import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { GridColumn } from '../../props/grid-column.props';
import { PagedList } from '../../models/paged-list.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QueryParamsModel } from '../../models/query-params.model';
import { ColumnFilterTypeEnum } from '../../enums/column.filter.type.enum';
import { FilterOperators } from '../../props/query-filter-params.props';
import { QuerySortParamsModel, SortDirection } from '../../models/query-sort-params.model';
import { TooltipModule } from 'primeng/tooltip';
import { DeactivateBtn } from '../../buttons/deactivate-btn/deactivate-btn';
import { ActivateBtn } from '../../buttons/activate-btn/activate-btn';
import { LabelDatePicker } from '../label-date-picker/label-date-picker';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { ColumnTypeEnum } from '../../enums/column.type.enum';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'grid',
  standalone: true,
  imports: [CommonModule, TableModule, ActivateBtn, DeactivateBtn, ButtonModule, TooltipModule, ReactiveFormsModule, LabelDatePicker, TranslateModule],
  templateUrl: './grid.html',
  styleUrl: './grid.scss'
})
export class Grid {

  //#region Inputs
  @Input() columns: GridColumn[] = [];
  @Input() pagedRows: PagedList<any> = {} as PagedList<any>;

  @Input() pageSize: number = 10;
  @Input() paginator: boolean = true;

  @Input() allowDelete: boolean = false;
  @Input() allowEdit: boolean = false;
  @Input() allowView: boolean = false;
  @Input() allowActivate: boolean = false;
  @Input() allowDeactivate: boolean = false;
  @Input() hasIsActive: boolean = false;

  @Input() loading: boolean = false;
  @Input() showFilters: boolean = false;

  @Input() resetPaginator: Subject<void> = new Subject<void>();
  //#endregion

  //#region Outputs
  @Output() onLazyLoad: EventEmitter<QueryParamsModel> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onView: EventEmitter<any> = new EventEmitter();
  @Output() onActivate: EventEmitter<any> = new EventEmitter();
  @Output() onDeactivate: EventEmitter<any> = new EventEmitter();
  //#endregion

  //#region Properties
  public queryparams: QueryParamsModel = new QueryParamsModel();
  items: any[] = [];
  headerSearchForm?: FormGroup;
  hasFilter: boolean = false;
  afterContentInitFired: boolean = false;
  first = 0;

  searchSubject$ = new Subject<{value: string, field: string, type: string}>();
  distroy$: Subject<void> = new Subject<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  //#endregion

  //#region Lifecycle
  ngOnInit() {
    
    this.queryparams.page = 1;
    this.queryparams.pageSize = this.pageSize;
    this.queryparams.filters = [];

    this.resetPaginator.pipe(takeUntil(this.distroy$))
      .subscribe(() => this.resetGridPaginator());

    // Set up search subject subscription with debounce
    this.searchSubject$.pipe(
      debounceTime(700), 
      distinctUntilChanged(), 
      takeUntil(this.distroy$)
    ).subscribe(data => {
      const colField = this.columns.find(r => r.field == data.field);
      this.pushFilter(data.value, colField?.apiField ?? data.field, colField?.filterOperator ?? FilterOperators.contain);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.setHeaderFormGroup();
    }

    if (changes['pagedRows'] && changes['pagedRows'].currentValue) {
      this.items = [...this.pagedRows.items ?? []];
    }
  }

  ngAfterContentInit(): void {
    this.afterContentInitFired = true;
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
  //#endregion

  //#region Methods

  lazyLoad(event?: TableLazyLoadEvent) {
    this.queryparams.pageSize = this.pageSize;

    if (this.queryparams.filters!.length) {
      this.resetGridPaginator();
      this.queryparams.page = 1;
    }

    if (event) {
      this.queryparams.page = event.first! / event.rows! + 1;
      this.queryparams.pageSize = this.pageSize;

      if (event.sortField && event.sortOrder) {
        let sortedColumn = this.columns.find(r => r.field == event.sortField);
        this.queryparams.sort = new QuerySortParamsModel(sortedColumn?.apiField ?? event.sortField?.toString(), (event.sortOrder == 1 ? SortDirection.asc : SortDirection.desc))
      }
    }

    this.onLazyLoad.emit(this.queryparams);
  }

  resetGridPaginator() {
    this.first = 0;
  }

  onEditRow(item: any) {
    this.onEdit.emit(item);
  }

  onViewDetail(item: any) {
    this.onView.emit(item);
  }

  onDeleteRow(index: number, item: any) {
    this.onDelete.emit(item);
  }

  hasBackground(col: GridColumn, item: any) {
    return col.setBackgroundColorTo?.length &&
      (col.setBackgroundColorTo?.includes(item[col.field])) ?
      col?.backgroundColor : '';
  }

  onReset() {
    this.headerSearchForm?.reset();
    this.queryparams.filters = [];
    this.onLazyLoad.emit(this.queryparams);
  }

  onActivateRow(item: any) {
    this.onActivate.emit(item); 
  }

  onDeactivateRow(item: any) {
    this.onDeactivate.emit(item);
  }

  //#endregion

  //#region Private Methods

  setHeaderFormGroup() {
    const filterColumns = this.columns.filter(r => r.filterType && r.filterType != ColumnFilterTypeEnum.none);
    this.hasFilter = filterColumns.length > 0;

    if (this.hasFilter) {
      this.headerSearchForm = this.fb.group({});
      this.columns.forEach(col => {
        const colFilterValue = this.queryparams.filters?.find(r => r.columnName == col.apiField || r.columnName == col.field);
        this.headerSearchForm?.addControl(`${col.field}-${col.filterType}`, this.fb.control(colFilterValue?.columnValue || ''));
      });

      let previousValues = this.headerSearchForm.value;
      this.headerSearchForm.valueChanges.subscribe((currentValues) => {

        const changedControl = Object.keys(currentValues).find(
          key => previousValues[key] !== currentValues[key]
        );

        const [field, type] = changedControl?.split('-')!;
        let filteredColValue = this.getHeaderControl(field!, type!).value;

        if(filteredColValue && type == ColumnFilterTypeEnum.date) {
          filteredColValue = DateHelper.toOldDatePicker(filteredColValue);
        }

        this.searchSubject$.next({
          value: filteredColValue,
          field: field!,
          type: type!
        });

        previousValues = { ...currentValues };
      });

    }
  }

  getHeaderControl(field: string, filterType: string): FormControl {
    return this.headerSearchForm?.get(`${field}-${filterType}`) as FormControl || this.fb.control('');
  }

  pushFilter(value: string, columnName: string, filterMatchMode: any) {
    var _filter = this.queryparams.filters?.find(f => f.columnName == columnName);
    if (_filter != null) {
      this.queryparams.filters?.splice(this.queryparams.filters?.indexOf(_filter), 1);
    }

    if (value !== null && value !== '' && typeof (value) !== 'undefined') {
      this.queryparams.page = 1;

      let col = this.columns.find(r => r.field == columnName);

      this.queryparams.filters?.push({
        columnName: columnName,
        columnValue: this.getFilterValue(value, col!),
        operator: filterMatchMode
      });
    }

    this.lazyLoad();
  }

  getFilterValue(value: string, col: GridColumn) {
    if(col?.columnType == ColumnTypeEnum.number) {
      return Number(value);
    }
    
    return value.toString().trim();
  }

  //#endregion
}
