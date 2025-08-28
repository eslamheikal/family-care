import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { StatusService } from '../../../../core/services/status.service';

@Component({
  selector: 'session-card',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule, TranslateModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss'
})
export class SessionCard {
  @Input() session!: ClassSession;
  @Output() recordAttendance = new EventEmitter<ClassSession>();
  @Output() update = new EventEmitter<ClassSession>();
  @Output() cancel = new EventEmitter<ClassSession>();
  @Output() markCompleted = new EventEmitter<ClassSession>();
  @Output() reschedule = new EventEmitter<ClassSession>();
  @Output() delete = new EventEmitter<ClassSession>();

  private confirmService: ConfirmService = inject(ConfirmService);
  private translateService: TranslateService = inject(TranslateService);
  private statusService: StatusService = inject(StatusService);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);

  getFormattedDate(): string {
    return DateHelper.displayDate(this.session.date) || '-';
  }

  getFormattedTime(): string {
    return `${TimeHelper.displayTime(this.session.startTime!)} - ${TimeHelper.displayTime(this.session.endTime!)}`;
  }

  getStatusBadge(){
    return this.statusService.getSessionStatusBadge(this.session.status);
  }

  onUpdate(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.edit'),
      () => {
        this.update.emit(this.session);
      },
      undefined,
      'fa fa-edit confirm-icon-edit'
    );
  }

  onCancel(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.cancel'),
      () => {
        this.cancel.emit(this.session);
      },
      undefined,
      'pi pi-times confirm-icon-cancel'
    );
  }

  onRecordAttendance(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.recordAttendance'),
      () => {
        this.recordAttendance.emit(this.session);
      },
      undefined,
      'pi pi-check-circle confirm-icon-attendance'
    );
  }

  onMarkCompleted(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.markCompleted'),
      () => {
        this.markCompleted.emit(this.session);
      },
      undefined,
      'pi pi-check confirm-icon-completed'
    );
  }

  onReschedule(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.reschedule'),
      () => {
        this.reschedule.emit(this.session);
      },
      undefined,
      'fa fa-calendar-plus confirm-icon-reschedule'
    );
  }

  onDelete(): void {
    this.confirmService.confirmDelete(() => {
      this.delete.emit(this.session);
    });
  }

  get permission() {
    return {
      canReschedule: this.permissionService.canEdit.studentAttendanceToBeRescheduled && this.session.status !== ClassSessionStatus.Scheduled,
      canUpdate: this.permissionService.canEdit.studentAttendance && this.session.status === ClassSessionStatus.Scheduled && this.validToEditOrCancel(),
      canCancel: this.permissionService.canEdit.studentAttendanceToBeCancelled && this.session.status === ClassSessionStatus.Scheduled && this.validToEditOrCancel(),
      canMarkCompleted: this.permissionService.canEdit.studentAttendanceToBeCompleted && this.session.status === ClassSessionStatus.Scheduled && this.validToMarkCompletedOrRecordAttendance(),
      canRecordAttendance: this.permissionService.canEdit.studentAttendanceToRecord && this.session.status !== ClassSessionStatus.Cancelled && this.validToMarkCompletedOrRecordAttendance(),
      canDelete: this.permissionService.canDelete.session,
    }
  }

  validToEditOrCancel(): boolean {
    if (!this.session?.date || !this.session?.startTime) return false;
  
    const [startHour, startMinute] = this.session.startTime.split(':').map(Number);
    const sessionDateTime = new Date(this.session.date);
    sessionDateTime.setHours(startHour, startMinute, 0, 0);
  
    const oneHourFromNow = new Date(new Date().getTime()); // 1 hour from now  ( + 60 * 60 * 1000)

    return sessionDateTime >= oneHourFromNow;
  }
  
  validToMarkCompletedOrRecordAttendance(): boolean {
    if (!this.session?.date || !this.session?.startTime) return false;

    const [startHour, startMinute] = this.session.startTime.split(':').map(Number);
    const sessionDateTime = new Date(this.session.date);
    sessionDateTime.setHours(startHour, startMinute, 0, 0);
  
    return sessionDateTime <= new Date();
  }

} 