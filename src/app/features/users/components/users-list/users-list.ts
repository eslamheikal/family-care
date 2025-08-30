import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '../../../../core/models/user.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { UserService } from '../../../../core/services/user.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { FilterOperators } from '../../../shared/models/query-filter-params.model';
import { UserForm } from "../user-form/user-form";
import { PermissionService } from '../../../../core/authorization/permission.service';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    Grid,
    CardContainer,
    DialogModule,
    TranslateModule,
    UserForm
],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss'
})
export class UsersList implements OnDestroy {

  //#region Properties
  showDialog = false;
  user: User = {} as User;
  userToDelete: User = {} as User;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  users: PagedList<User> = {} as PagedList<User>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private userService = inject(UserService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  public permissionService = inject(PermissionService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', apiField: 'name', title: this.translate.instant('shared.labels.name'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'email', apiField: 'email', title: this.translate.instant('shared.labels.email'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'phone', apiField: 'phone', title: this.translate.instant('shared.labels.phoneNumber'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'joinedDate', apiField: 'joinedDate', title: this.translate.instant('shared.labels.joinedDate'), columnType: ColumnTypeEnum.date, sortable: true, filterType: ColumnFilterTypeEnum.date, filterOperator: FilterOperators.equal },
    { field: 'isActive', apiField: 'isActive', title: this.translate.instant('shared.labels.status'), columnType: ColumnTypeEnum.badge, badgeConfig: { getValue: (item: User) => item.isActive ? this.translate.instant('shared.badges.active') : this.translate.instant('shared.badges.inactive'), getColor: (item: User) => item.isActive ? 'green' : 'red' }   },
  ];
  //#endregion

  
  //#region Methods

  loadUsers(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.userService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: PagedList<User>) => {
        this.users = users;
      },
      error: () => { },
      complete: () => this.loader.hide()
    });
  }

  onAdd() {
    this.user = {} as User;
    this.showDialog = true;
  }

  onEdit(event: User) {
    this.confirmService.confirmEdit(() => {
      this.user = event;
      this.showDialog = true;
    });
  }

  onActivate(event: User) {
    this.confirmService.confirmActivate(() => {
      // TODO: Implement user activation
      // this.userService.activate(event.id)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(res => {
      //     if (res) {
      //       this.loadUsers(this.queryParams);
      //       this.toaster.showSuccess(this.translate.instant('users.activateSuccess'));
      //     }
      //   }, _ => { }, () => this.loader.hide());
    });
  }

  onDeactivate(event: User) {
    this.confirmService.confirmDeactivate(() => {
      // TODO: Implement user deactivation
      // this.userService.deactivate(event.id)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(res => {
      //     if (res) {
      //       this.loadUsers(this.queryParams);
      //       this.toaster.showSuccess(this.translate.instant('users.deactivateSuccess'));
      //     }
      //   }, _ => { }, () => this.loader.hide());
    });
  }

  onView(event: User) {
    this.confirmService.confirmView(() => {
      this.router.navigate(['/users', event.id]);
    });
  }

  onDelete(event: User) {
    this.confirmService.confirmDelete(() => {
      this.userToDelete = event;
      this.onConfirmDelete();
    });
  }

  onConfirmDelete() {
    this.loader.show();

    this.userService.delete(this.userToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.loadUsers(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('users.deleteSuccess'));
          }
          this.userToDelete = {} as User;
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
