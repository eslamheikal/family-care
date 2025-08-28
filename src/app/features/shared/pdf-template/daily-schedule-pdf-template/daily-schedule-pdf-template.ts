import { Component, Input, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DailySchedule } from '../../../../core/models/daily-schedule.model';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { PdfTemplateFooter } from "../pdf-template-footer/pdf-template-footer";
import { PdfTemplateHeader } from "../pdf-template-header/pdf-template-header";
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";

@Component({
  selector: 'daily-schedule-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table],
  templateUrl: './daily-schedule-pdf-template.html',
  styleUrls: ['./daily-schedule-pdf-template.scss']
})
export class DailySchedulePdfTemplateComponent {
  @Input() dailySchedules: DailySchedule[] = [];
  @Input() name: string = '';
  @Input() title: string = '';

  @Input() showTime = true;
  @Input() showGroup = true;
  @Input() showRoom = true;
  @Input() showSubject = true;
  @Input() showTeacher = true;

  columns: TableColumn[] = [
    { title: 'shared.labels.time', field: 'startTime', type: 'time' },
    { title: 'groups.one', field: 'groupName', type: 'text' },
    { title: 'rooms.one', field: 'roomName', type: 'text' },
    { title: 'courses.one', field: 'courseName', type: 'text' }
  ];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  weekDaysService = inject(WeekDaysService);

  getFormattedTime(time: string): string {
    return TimeHelper.displayTime(time) || '-';
  }

  getSchedulesByDay(day: string): DailySchedule[] {
    return this.dailySchedules.filter(schedule => schedule.dayName === day);
  }

  getUniqueDays(): string[] {
    let days = this.dailySchedules.filter(schedule => schedule.dayName !== '').map(schedule => schedule.dayName);
    return this.weekDaysService.getDayOptions().filter(day => days.includes(day.label)).map(day => day.label);
  }
}
