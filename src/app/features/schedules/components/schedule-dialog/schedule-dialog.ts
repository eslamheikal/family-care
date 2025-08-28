import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DayOfWeek } from '../../../../core/enums/day-week.enum';
import { ClassScheduleStatus } from '../../../../core/enums/class-schedule-status.enum';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';
import { StatusService } from '../../../../core/services/status.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { WeekDaysService } from '../../../../core/services/week-days.service';

@Component({
  selector: 'schedule-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    DialogButtons
  ],
  templateUrl: './schedule-dialog.html',
  styleUrl: './schedule-dialog.scss'
})
export class ScheduleDialog {

  @Input() showDialog = false;
  @Input() schedule: ClassSchedule = {} as ClassSchedule;

  @Output() onClose = new EventEmitter<void>();

  destroy$ = new Subject<void>();

  private translate = inject(TranslateService);
  private statusService = inject(StatusService);
  private weekDaysService = inject(WeekDaysService);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit() {
    // Component initialization
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog) {
      this.cdr.detectChanges();
    }
  }

  getDayName(day: DayOfWeek): string {
    return this.weekDaysService.getDayName(day) || '';
  }

  getStatusName(status: ClassScheduleStatus): string {
    return this.statusService.getScheduleStatusName(status);
  }

  getStatusClass(status: ClassScheduleStatus): string {
    return this.statusService.getScheduleStatusClassName(status);
  }

  formatTime(time: string): string {
    return TimeHelper.displayTime(time);
  }

  formatDate(date: string | null): string {
    return DateHelper.displayDate(date) || '';
  }

  close() {
    this.onClose.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 