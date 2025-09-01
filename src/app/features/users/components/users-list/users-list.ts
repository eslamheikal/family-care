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
import { AuthService } from '../../../../core/authorization/auth.service';
import { Relation, RelationService } from '../../../../core/enums/relation.enum';

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
  private authService = inject(AuthService);
  private relationService = inject(RelationService);
  public permissionService = inject(PermissionService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', apiField: 'name', title: this.translate.instant('shared.labels.name'), columnType: ColumnTypeEnum.text, filterType: ColumnFilterTypeEnum.text },
    { field: 'email', apiField: 'email', title: this.translate.instant('shared.labels.email'), columnType: ColumnTypeEnum.text, filterType: ColumnFilterTypeEnum.text },
    { field: 'phone', apiField: 'phone', title: this.translate.instant('shared.labels.phoneNumber'), columnType: ColumnTypeEnum.text, filterType: ColumnFilterTypeEnum.text },
    { field: 'relationName', apiField: 'relationName', title: this.translate.instant('familyRelations.one'), columnType: ColumnTypeEnum.text, filterType: ColumnFilterTypeEnum.text },
    { field: 'isActive', apiField: 'isActive', title: this.translate.instant('shared.labels.status'), columnType: ColumnTypeEnum.badge, badgeConfig: { getValue: (item: User) => item.isActive ? this.translate.instant('shared.badges.active') : this.translate.instant('shared.badges.inactive'), getColor: (item: User) => item.isActive ? 'green' : 'red' }   },
  ];
  //#endregion

  
  //#region Methods

  loadUsers(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();

    let parentId = this.authService.isFamilyParent ? this.authService.getUser()?.id : null;
    parentId = this.authService.isFamilyMember ? this.authService.getUser()?.parentId : parentId;

    this.userService.loadUsers(parentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: User[]) => {
        users = users.map(user => {
          user.relationName = this.relationService.getRelation(user.relation as Relation);
          return user;
        });
        users = users.sort((a, b) => a.name.localeCompare(b.name));
        this.users = { items: users, totalCount: users.length, pageCount: 1 };
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

      this.loader.show();

      this.userService.activate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadUsers(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('shared.messages.activatedSuccessfully'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onDeactivate(event: User) {
    this.confirmService.confirmDeactivate(() => {

      this.loader.show();
      
      this.userService.deactivate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadUsers(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('shared.messages.deactivatedSuccessfully'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onView(event: User) {
    this.confirmService.confirmView(() => {
      this.router.navigate(['/', event.id]);
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
            this.toaster.showSuccess(this.translate.instant('shared.messages.deletedSuccessfully'));
          }
          this.userToDelete = {} as User;
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }

  getTitle() {
    return this.authService.isFamilyParent || this.authService.isFamilyMember ? 
    this.translate.instant('users.all') :
    this.translate.instant('users.families') ;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
