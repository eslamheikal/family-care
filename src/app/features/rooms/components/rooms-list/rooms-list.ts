import { Component, inject } from '@angular/core';
import { Room } from '../../../../core/models/room.model';
import { PagedList } from '../../../shared/models/paged-list.model';
import { QueryParamsModel } from '../../../shared/models/query-params.model';
import { Subject, takeUntil } from 'rxjs';
import { RoomService } from '../../../../core/services/room.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ColumnTypeEnum } from '../../../shared/enums/column.type.enum';
import { GridColumn } from '../../../shared/props/grid-column.props';
import { ColumnFilterTypeEnum } from '../../../shared/enums/column.filter.type.enum';
import { CommonModule } from '@angular/common';
import { Grid } from '../../../shared/components/grid/grid';
import { CardContainer } from '../../../shared/components/card-container/card-container';
import { DialogModule } from 'primeng/dialog';
import { RoomFormComponent } from '../room-form/room-form';
import { FilterOperators } from '../../../shared/props/query-filter-params.props';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'app-rooms-list',
  imports: [
    CommonModule,
    Grid,
    CardContainer,
    DialogModule,
    RoomFormComponent,
    TranslateModule
  ],
  templateUrl: './rooms-list.html',
  styleUrl: './rooms-list.scss'
})
export class RoomsList {

  //#region Properties
  showDialog = false;
  room: Room = {} as Room;
  roomToDelete: Room = {} as Room;
  queryParams: QueryParamsModel = {} as QueryParamsModel;
  rooms: PagedList<Room> = {} as PagedList<Room>;
  destroy$ = new Subject<void>();
  //#endregion

  //#region Services
  private roomService = inject(RoomService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Columns
  columns: GridColumn[] = [
    { field: 'name', title: this.translate.instant('shared.labels.name'), columnType: ColumnTypeEnum.text, sortable: true, filterType: ColumnFilterTypeEnum.text },
    { field: 'capacity', title: this.translate.instant('shared.labels.capacity'), columnType: ColumnTypeEnum.number, sortable: true, filterType: ColumnFilterTypeEnum.number, filterOperator: FilterOperators.equal },
  ];
  //#endregion

  //#region Methods

  loadRooms(params: QueryParamsModel) {
    this.showDialog = false;
    this.queryParams = params;

    this.loader.show();
    this.roomService.getPaged(params).pipe(takeUntil(this.destroy$)).subscribe(rooms => {
      this.rooms = rooms;
    }, _ => { }, () => this.loader.hide());
  }

  onAdd() {
    this.room = {} as Room;
    this.showDialog = true;
  }

  onEdit(event: Room) {

    this.confirmService.confirmEdit(() => {

      this.room = { ...event };
      this.showDialog = true;

    });
  }

  onActivate(event: Room) {

    this.confirmService.confirmActivate(() => {

      this.roomService.activate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadRooms(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('rooms.activateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });

  }

  onDeactivate(event: Room) {

    this.confirmService.confirmDeactivate(() => {

      this.roomService.deactivate(event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.loadRooms(this.queryParams);
            this.toaster.showSuccess(this.translate.instant('rooms.deactivateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());

    });
  }

  onDelete(event: Room) {
    this.roomToDelete = event;

    this.confirmService.confirmDelete(() => {
      this.onConfirmDelete();
    });
  }

  onConfirmDelete() {
    this.loader.show();

    this.roomService.delete(this.roomToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadRooms(this.queryParams);
          this.toaster.showSuccess(this.translate.instant('rooms.deleteSuccess'));
        }
      }, _ => { }, () => this.loader.hide());

    this.roomToDelete = {} as Room;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
