import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { GroupFromComponent } from '../group-from/group-from';
import { Group } from '../../../../core/models/group.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../../../core/services/group.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BadgeHelper } from '../../../shared/helpers/badge.helper';
import { Router } from '@angular/router';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'app-groups-list',
  imports: [CommonModule, Grid, CardContainer, DialogModule, GroupFromComponent, TranslateModule],
  templateUrl: './groups-list.html',
  styleUrl: './groups-list.scss'
})
export class GroupsList {

  //#region Properties
  showDialog = false;
  deleteMessage = '';

  group: Group = {} as Group;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  groups: PagedList<Group> = {} as PagedList<Group>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private confirmService = inject(ConfirmService);

  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    {
      field: 'name',
      title: this.translate.instant('shared.labels.name'),
      columnType: ColumnTypeEnum.text,
      sortable: true,
      filterType: ColumnFilterTypeEnum.text
    },
    {
      field: 'courseName',
      apiField: 'course.name',
      title: this.translate.instant('courses.one'),
      columnType: ColumnTypeEnum.text,
      sortable: true,
      filterType: ColumnFilterTypeEnum.text
    },
    ...(this.permissionAccess.canViewPagedAdminColumns.family ? [{
      field: 'teacherName',
      apiField: 'teacher.user.name',
      title: this.translate.instant('teachers.one'),
      columnType: ColumnTypeEnum.text,
      sortable: true,
      filterType: ColumnFilterTypeEnum.text
    }] : []),
    {
      field: 'numberOfStudents',
      title: this.translate.instant('shared.labels.numberOfStudents'),
      columnType: ColumnTypeEnum.number,
    },
    ...(this.permissionAccess.canViewPagedAdminColumns.family ? [{
      field: 'capacityStatus',
      title: this.translate.instant('shared.labels.capacityStatus'),
      columnType: ColumnTypeEnum.badge,
      badgeConfig: BadgeHelper.createCapacityBadge(this.translate, 'capacity', 'numberOfStudents')
    }] : []),
  ];
  //#endregion

  //#region Methods

  loadGroups(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.groupService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(groups => {
      // Transform the data to include course and teacher names
      if (groups.items) {
        groups.items = groups.items.map(group => ({
          ...group,
          courseName: group.course?.name || 'N/A',
          teacherName: group.teacher?.name || 'N/A'
        }));
      }
      this.groups = groups;
    }, _ => { }, () => this.loader.hide());
  }

  onEdit(event: Group) {

    this.confirmService.confirmEdit(() => {

      this.group = event;
      this.showDialog = true;

    });
  }

  onView(event: Group) {

    this.confirmService.confirmView(() => {

      this.router.navigate(['/groups', event.id]);

    });
  }

  deletedGroup: Group = {} as Group;
  onDelete(event: Group) {
    this.deletedGroup = event;
    this.confirmService.confirmDelete(() => {
      this.onDeleteConfirm();
    });
  }

  onDeleteConfirm() {
    this.loader.show();
    this.groupService.delete(this.deletedGroup.id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.toaster.showSuccess(this.translate.instant('groups.deleteSuccess'));
        this.loadGroups(this.queryParams);
      }

    }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
