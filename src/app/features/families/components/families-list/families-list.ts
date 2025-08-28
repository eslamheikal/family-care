import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Family } from '../../../../core/models/family.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { FamilyService } from '../../../../core/services/family.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { FilterOperators } from '../../../shared/models/query-filter-params.model';
import { FamilyForm } from "../family-form/family-form";

@Component({
  selector: 'app-families-list',
  imports: [
    CommonModule,
    Grid,
    CardContainer,
    DialogModule,
    TranslateModule,
    FamilyForm
],
  templateUrl: './families-list.html',
  styleUrl: './families-list.scss'
})
export class FamiliesList {

  //#region Properties
  showDialog = false;
  family: Family = {} as Family;
  familyToDelete: Family = {} as Family;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  families: PagedList<Family> = {} as PagedList<Family>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private familyService = inject(FamilyService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  public permissionService = inject(PermissionAccessService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', apiField: 'name', title: this.translate.instant('families.familyName'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'membersNumber', apiField: 'membersNumber', title: this.translate.instant('families.membersNumber'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'joinedDate', apiField: 'joinedDate', title: this.translate.instant('shared.labels.joinedDate'), columnType: ColumnTypeEnum.date, sortable: true, filterType: ColumnFilterTypeEnum.date, filterOperator: FilterOperators.equal },
    { field: 'isActive', apiField: 'isActive', title: this.translate.instant('shared.labels.status'), columnType: ColumnTypeEnum.badge, badgeConfig: { getValue: (item: Family) => item.isActive ? this.translate.instant('shared.badges.active') : this.translate.instant('shared.badges.inactive'), getColor: (item: Family) => item.isActive ? 'green' : 'red' }   },
  ];
  //#endregion

  
  //#region Methods

  loadFamilies(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.familyService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(families => {
      this.families = families;
    }, _ => { }, () => this.loader.hide());
  }

  onAdd() {
    this.family = {} as Family;
    this.showDialog = true;
  }

  onEdit(event: Family) {

    this.confirmService.confirmEdit(() => {
      this.family = event;
      this.showDialog = true;
    });

  }

  onActivate(event: Family) {
    this.confirmService.confirmActivate(() => {

      // this.familieservice.activate(event.id)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(res => {
      //     if (res) {
      //       this.loadfamilies(this.queryParams);
      //       this.toaster.showSuccess(this.translate.instant('families.activateSuccess'));
      //     }
      //   }, _ => { }, () => this.loader.hide());

    });

  }

  onDeactivate(event: Family) {
    this.confirmService.confirmDeactivate(() => {

      // this.familieservice.deactivate(event.id)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(res => {
      //     if (res) {
      //       this.loadfamilies(this.queryParams);
      //       this.toaster.showSuccess(this.translate.instant('families.deactivateSuccess'));
      //     }
      //   }, _ => { }, () => this.loader.hide());

    });
  }

  onView(event: Family) {

    this.confirmService.confirmView(() => {
      this.router.navigate(['/families', event.id]);
    });
  }

  onDelete(event: Family) {

    this.confirmService.confirmDelete(() => {
      this.familyToDelete = event;
      this.onConfirmDelete();
    });
  }

  onConfirmDelete() {
    this.loader.show();

    // this.familieservice.delete(this.familyToDelete.id)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     if (res) {
    //       this.loadfamilies(this.queryParams);
    //       this.toaster.showSuccess(this.translate.instant('families.deleteSuccess'));
    //     }
    //     this.familyToDelete = {} as Family;

    //   }, _ => { }, () => this.loader.hide());

  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
