import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray } from '@angular/forms';
import { StudentAttendanceDisplay } from '../../../../core/models/student-attendance.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { PdfTemplateFooter } from "../pdf-template-footer/pdf-template-footer";
import { PdfTemplateHeader } from "../pdf-template-header/pdf-template-header";
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";
import { NoData } from "../../components/no-data/no-data";

@Component({
  selector: 'attendance-pdf-template',
  standalone: true,
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table, NoData],
  templateUrl: './attendance-pdf-template.component.html',
  styleUrls: ['./attendance-pdf-template.component.scss']
})
export class AttendancePdfTemplateComponent {
  @Input() attendanceDisplay!: StudentAttendanceDisplay;
  @Input() attendancesArray!: FormArray;
  @Input() totalStudents!: number;
  @Input() presentStudents!: number;
  @Input() lateStudents!: number;
  @Input() absentStudents!: number;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  AttendanceStatus = AttendanceStatus;

  attendanceColumns: TableColumn[] = [
    { title: 'attendance.table.studentName', field: 'studentName', type: 'text' },
    { title: 'attendanceStatus.present', field: 'status', type: 'boolean' },
    { title: 'attendanceStatus.late', field: 'status', type: 'boolean' },
    { title: 'attendanceStatus.absent', field: 'status', type: 'boolean' },
    { title: 'shared.labels.notes', field: 'notes', type: 'text' },
  ];

  exportDate = DateHelper.displayDate(new Date().toString());

  getAttendanceData(): any[] {
    return this.attendancesArray.controls.map(control => ({
      studentName: control.get('studentName')?.value,
      status: control.get('status')?.value,
      notes: control.get('note')?.value
    }));
  }

  getFormControlArray(): FormArray {
    return this.attendancesArray;
  }
} 