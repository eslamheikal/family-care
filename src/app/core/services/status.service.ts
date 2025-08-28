import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ClassSessionStatus } from "../enums/class-session-status.enum";
import { DropdownProps } from "../../features/shared/props/dropdown.props";
import { ClassScheduleStatus } from "../enums/class-schedule-status.enum";
import { AttendanceStatus } from "../enums/attendance-status.enum";
import { DailyAttendanceModel } from "../models/daily-attendance.model";
import { MonthlyAttendanceModel } from "../models/monthly-attendance.model";

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private translateService = inject(TranslateService);

  getSessionStatusName(status: ClassSessionStatus): string {
    return this.getSessionStatusOptions().find(r => r.value == status)?.label || '';
  }

  getSessionStatusOptions(): DropdownProps[] {
    return [
      { value: ClassSessionStatus.Scheduled, label: this.translateService.instant('sessionStatus.scheduled') },
      { value: ClassSessionStatus.Completed, label: this.translateService.instant('sessionStatus.completed') },
      { value: ClassSessionStatus.Cancelled, label: this.translateService.instant('sessionStatus.cancelled') }
    ];
  }

  getSessionStatusBadge(status: ClassSessionStatus): { value: string; severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' } {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return { value: 'sessionStatus.scheduled', severity: 'info' };
      case ClassSessionStatus.Completed:
        return { value: 'sessionStatus.completed', severity: 'success' };
      case ClassSessionStatus.Cancelled:
        return { value: 'sessionStatus.cancelled', severity: 'danger' };
      default:
    }
    return { value: 'sessionStatus.unknown', severity: 'secondary' };
  }

  getScheduleStatusName(status: ClassScheduleStatus): string {
    const statusNames: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: this.translateService.instant('scheduleStatus.new'),
      [ClassScheduleStatus.Active]: this.translateService.instant('scheduleStatus.active'),
      [ClassScheduleStatus.Paused]: this.translateService.instant('scheduleStatus.paused'),
      [ClassScheduleStatus.Completed]: this.translateService.instant('scheduleStatus.completed'),
      [ClassScheduleStatus.Cancelled]: this.translateService.instant('scheduleStatus.cancelled')
    };
    return statusNames[status] || '';
  }

  getScheduleStatusClassName(status: ClassScheduleStatus): string {
    const statusClasses: { [key in ClassScheduleStatus]: string } = {
      [ClassScheduleStatus.New]: 'status-new',
      [ClassScheduleStatus.Active]: 'status-active',
      [ClassScheduleStatus.Paused]: 'status-paused',
      [ClassScheduleStatus.Completed]: 'status-completed',
      [ClassScheduleStatus.Cancelled]: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  checkAttendanceStatus(status: AttendanceStatus): { isPresent: boolean, isLate: boolean, isAbsent: boolean } {
    return {
      isPresent : status == AttendanceStatus.Present,
      isLate : status == AttendanceStatus.Late,
      isAbsent : status == AttendanceStatus.Absent
    }
  }

  getAttendanceDailyStatistics(dailyAttendanceData: DailyAttendanceModel[]): { present: number, late: number, absent: number, total: number, percentage: string } {
    const present = dailyAttendanceData.filter(r => r.status == AttendanceStatus.Present).length;
    const late = dailyAttendanceData.filter(r => r.status == AttendanceStatus.Late).length;
    const absent = dailyAttendanceData.filter(r => r.status == AttendanceStatus.Absent).length;
    const total = present + late + absent;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';

    return {
      present,
      late,
      absent,
      total,
      percentage
    }
  }

  getAttendanceMonthlyStatistics(monthlyAttendanceData: MonthlyAttendanceModel[]): { present: number, late: number, absent: number, total: number, percentage: string } {
    const present = monthlyAttendanceData.reduce((acc, curr) => acc + curr.present, 0);
    const late = monthlyAttendanceData.reduce((acc, curr) => acc + curr.late, 0);
    const absent = monthlyAttendanceData.reduce((acc, curr) => acc + curr.absent, 0);
    const total = present + late + absent;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';

    return {
      present,
      late,
      absent,
      total,
      percentage
    }
  }
}
