import { Component, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { PdfTemplateFooter } from "../pdf-template-footer/pdf-template-footer";
import { PdfTemplateHeader } from "../pdf-template-header/pdf-template-header";
import { MonthesService } from '../../../../core/services/monthes.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";
import { NoData } from "../../components/no-data/no-data";

@Component({
  selector: 'monthly-schedule-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table, NoData],
  templateUrl: './monthly-schedule-pdf-template.html',
  styleUrls: ['./monthly-schedule-pdf-template.scss']
})
export class MonthlySchedulePdfTemplateComponent {
  @Input() schedules: ClassSchedule[] = [];
  @Input() month: number = DateHelper.getCurrentMonth();
  @Input() year: number = DateHelper.getCurrentYear();
  @Input() title: string = '';

  @Input() showTime = true;
  @Input() showGroup = true;
  @Input() showRoom = true;
  @Input() showSubject = true;
  @Input() showTeacher = true;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  monthlyTableColumns: TableColumn[] = [
    { title: 'shared.labels.time', field: 'time', type: 'time' },
    { title: 'groups.one', field: 'groupName', type: 'text' },
    { title: 'rooms.one', field: 'roomName', type: 'text' },
    { title: 'courses.one', field: 'courseName', type: 'text' },
    { title: 'teachers.one', field: 'teacherName', type: 'text' },
  ];

  weekDaysService = inject(WeekDaysService);
  monthesService = inject(MonthesService);

  getFormattedTime(time: string): string {
    return TimeHelper.displayTime(time) || '-';
  }

  getSchedulesByDay(day: number): ClassSchedule[] {
    return this.schedules.filter(schedule => schedule.day === day);
  }

  getDayName(day: number): string {
    return this.weekDaysService.getDayName(day);
  }

  getMonthName(): string {
    return this.monthesService.getMonthName(this.month + 1);
  }

  getUniqueDays(): number[] {
    const days = this.schedules.map(schedule => schedule.day);
    return [...new Set(days)].sort((a, b) => a - b);
  }

  hasSchedules(): boolean {
    return this.schedules && this.schedules.length > 0;
  }
}
