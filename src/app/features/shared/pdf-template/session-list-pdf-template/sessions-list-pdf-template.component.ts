import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PdfTemplateFooter } from "../pdf-template-footer/pdf-template-footer";
import { PdfTemplateHeader } from "../pdf-template-header/pdf-template-header";
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";
import { NoData } from "../../components/no-data/no-data";

@Component({
  selector: 'sessions-list-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table, NoData],
  templateUrl: './sessions-list-pdf-template.component.html',
  styleUrls: ['./sessions-list-pdf-template.component.scss']
})
export class SessionsListPdfTemplateComponent {
  @Input() sessions: ClassSession[] = [];
  @Input() title: string = '';
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  ClassSessionStatus = ClassSessionStatus;

  exportDate = DateHelper.displayDate(new Date().toString());

  sessionColumns: TableColumn[] = [
    { title: 'shared.labels.date', field: 'date', type: 'text' },
    { title: 'shared.labels.time', field: 'time', type: 'text' },
    { title: 'courses.one', field: 'courseName', type: 'text' },
    { title: 'groups.one', field: 'groupName', type: 'text' },
    { title: 'rooms.one', field: 'roomName', type: 'text' },
    { title: 'teachers.one', field: 'teacherName', type: 'text' },
    { title: 'shared.labels.status', field: 'status', type: 'boolean' },
  ];


  getFormattedDate(date: string | Date): string {
    return DateHelper.displayDate(date as string) || '-';
  }

  getFormattedTime(time: string): string {
    return TimeHelper.displayTime(time) || '-';
  }

  getStatusText(status: ClassSessionStatus): string {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return 'sessionStatus.scheduled';
      case ClassSessionStatus.Completed:
        return 'sessionStatus.completed';
      case ClassSessionStatus.Cancelled:
        return 'sessionStatus.cancelled';
      default:
        return 'sessionStatus.unknown';
    }
  }

  getStatusColor(status: ClassSessionStatus): string {
    switch (status) {
      case ClassSessionStatus.Scheduled:
        return 'text-primary';
      case ClassSessionStatus.Completed:
        return 'text-success';
      case ClassSessionStatus.Cancelled:
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }
} 