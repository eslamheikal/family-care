import { Component, inject } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { CommonModule } from '@angular/common';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { TeacherFormComponent } from '../teacher-form/teacher-form';
import { FilterOperators } from '../../../shared/props/query-filter-params.props';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'app-teachers-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, TeacherFormComponent, TranslateModule],
  templateUrl: './teachers-list.html',
  styleUrl: './teachers-list.scss'
})
export class TeachersList {

  //#region Properties
  showDialog = false;
  teacher: Teacher = {} as Teacher;
  teacherToDelete: Teacher = {} as Teacher;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  teachers: PagedList<Teacher> = {} as PagedList<Teacher>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  public permissionService = inject(PermissionAccessService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', apiField: 'User.Name', title: this.translate.instant('shared.labels.name'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'phoneNumber', apiField: 'User.PhoneNumber', title: this.translate.instant('shared.labels.phoneNumber'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'email', apiField: 'User.Email.Value', title: this.translate.instant('shared.labels.email'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'joinedDate', apiField: 'User.JoinedDate', title: this.translate.instant('shared.labels.joinedDate'), columnType: ColumnTypeEnum.date, sortable: true, filterType: ColumnFilterTypeEnum.date, filterOperator: FilterOperators.equal },
  ];
  //#endregion

  //#region Methods

  loadTeachers(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.teacherService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(teachers => {
      this.teachers = teachers;
    }, _ => { }, () => this.loader.hide());
  }

  onAdd() {
    this.teacher = {} as Teacher;
    this.showDialog = true;
  }

  onEdit(event: Teacher) {

    this.confirmService.confirmEdit(() => {
      this.teacher = event;
      this.showDialog = true;
    });

  }

  onActivate(event: Teacher) {
    this.confirmService.confirmActivate(() => {

      this.teacherService.activate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadTeachers(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('teachers.activateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });

  }

  onDeactivate(event: Teacher) {
    this.confirmService.confirmDeactivate(() => {

      this.teacherService.deactivate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadTeachers(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('teachers.deactivateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onView(event: Teacher) {

    this.confirmService.confirmView(() => {
      this.router.navigate(['/teachers', event.id]);
    });
  }

  onDelete(event: Teacher) {

    this.confirmService.confirmDelete(() => {
      this.teacherToDelete = event;
      this.onConfirmDelete();
    });
  }

  onConfirmDelete() {
    this.loader.show();

    this.teacherService.delete(this.teacherToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadTeachers(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('teachers.deleteSuccess'));
        }
        this.teacherToDelete = {} as Teacher;

      }, _ => { }, () => this.loader.hide());

  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
