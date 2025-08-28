import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { StudentFormComponent } from '../student-form/student-form';
import { Student } from '../../../../core/models/student.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { StudentService } from '../../../../core/services/student.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { FilterOperators } from '../../../shared/props/query-filter-params.props';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'app-students-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, StudentFormComponent, TranslateModule],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss'
})
export class StudentsList {

  //#region Properties
  showDialog = false;
  student: Student = {} as Student;
  studentToDelete: Student = {} as Student;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  students: PagedList<Student> = {} as PagedList<Student>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private studentService = inject(StudentService);
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

  loadStudents(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.studentService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(students => {
      this.students = students;
    }, _ => { }, () => this.loader.hide());
  }

  onAdd() {
    this.student = {} as Student;
    this.showDialog = true;
  }

  onEdit(event: Student) {

    this.confirmService.confirmEdit(() => {

      this.student = event;
      this.showDialog = true;
    });
  }

  onActivate(event: Student) {

    this.confirmService.confirmActivate(() => {

      this.studentService.activate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadStudents(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('students.activateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onDeactivate(event: Student) {

    this.confirmService.confirmDeactivate(() => {

      this.studentService.deactivate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadStudents(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('students.deactivateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onView(event: Student) {

    this.confirmService.confirmView(() => {

      this.router.navigate(['/students', event.id]);
    });

  }

  onDelete(event: Student) {
    this.studentToDelete = event;
    this.confirmService.confirmDelete(() => {
      this.onConfirmDelete();
    });

  }

  onConfirmDelete() {
    this.loader.show();

    this.studentService.delete(this.studentToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadStudents(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('students.deleteSuccess'));
        }

        this.studentToDelete = {} as Student;
      }, _ => { }, () => this.loader.hide());

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
