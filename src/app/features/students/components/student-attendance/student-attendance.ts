import { Component, OnDestroy, inject, Input, ViewChild, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { MonthlyAttendanceModel } from '../../../../core/models/monthly-attendance.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { LineChart } from "../../../shared/components/line-chart/line-chart";
import { LineChartProps } from '../../../shared/props/line-chart.props';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { Student } from '../../../../core/models/student.model';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { ReportHelper } from '../../../../core/helpers/report.helper';
import { PdfYearMonthBtns } from "../../../shared/buttons/pdf-year-month-btns/pdf-year-month-btns";
import { AttendanceMonthlyPdfTemplate } from '../../../shared/pdf-template/attendance-monthly-pdf-template/attendance-monthly-pdf-template';
import { AttendaceDailyPdfTemplate } from "../../../shared/pdf-template/attendace-daily-pdf-template/attendace-daily-pdf-template";
import { DailyAttendanceModel } from '../../../../core/models/daily-attendance.model';
import { NoData } from "../../../shared/components/no-data/no-data";
import { StatusService } from '../../../../core/services/status.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { Table } from "../../../shared/components/table/table";
import { TableColumn } from '../../../shared/props/table-column.props';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'student-attendance',
  imports: [
    CommonModule,
    CardModule,
    SelectModule,
    ButtonModule,
    TranslateModule,
    FormsModule,
    LineChart,
    AttendanceMonthlyPdfTemplate,
    PdfYearMonthBtns,
    AttendaceDailyPdfTemplate,
    NoData,
    Table
  ],
  templateUrl: './student-attendance.html',
  styleUrl: './student-attendance.scss'
})
export class StudentAttendance implements OnDestroy {

  @Input() student!: Student;

  @Input() monthlyAttendanceData: MonthlyAttendanceModel[] = [];
  @Input() dailyAttendanceData: DailyAttendanceModel[] = [];
  @Input() showDailyAttendance: boolean = false;

  @ViewChild(AttendanceMonthlyPdfTemplate, { static: false }) pdfTemplate!: AttendanceMonthlyPdfTemplate;
  @ViewChild(AttendaceDailyPdfTemplate, { static: false }) dailyPdfTemplate!: AttendaceDailyPdfTemplate;


  //#region Services
  private loader = inject(LoaderService);
  private translateService = inject(TranslateService);
  private pdfExportService = inject(PdfExportService);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);

  public statusService = inject(StatusService);
  public authService = inject(AuthService);
  public permissionService = inject(PermissionAccessService);

  //#endregion

  //#region Properties
  allowExportToPdf: boolean = false;
  dataSet: LineChartProps[] = [];
  dates: string[] = [];

  attendaceColumns: TableColumn[] = [
    {
      field: 'date',
      title: 'shared.labels.date',
      type: 'date',
      onClick: (row: any) => (this.authService.isAdmin ? this.onDateClick(row.sessionId) : null)
    },
    { field: 'time', title: 'shared.labels.time', type: 'time' },
    { field: 'courseName', title: 'courses.one', type: 'text' },
    { field: 'present', title: 'attendanceStatus.present', type: 'boolean' },
    { field: 'late', title: 'attendanceStatus.late', type: 'boolean' },
    { field: 'absent', title: 'attendanceStatus.absent', type: 'boolean' },
  ];

  // Filter options
  selectedYear: number = DateHelper.getCurrentYear();
  selectedMonth: number = 0;

  $destroy = new Subject<void>();

  //#endregion


  @Output() onYearChanged = new EventEmitter<number>();
  @Output() onMonthChanged = new EventEmitter<{ year: number, month: number }>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['monthlyAttendanceData']) {
      this.initializeChart();
    }

    if (changes['dailyAttendanceData']) {
      // this.dates = this.dailyAttendanceData.map(item => item.date);
      // this.initializeChart();
    }
  }

  onDateClick(sessionId: number) {
    this.confirmService.confirmView(() => {
      this.router.navigate(['sessions', sessionId, 'attendance']);
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  getTime(startTime: string | null, endTime: string | null) {
    return `${TimeHelper.displayTime(startTime)} - ${TimeHelper.displayTime(endTime)}`;
  }

  getReportTitle() {
    return ReportHelper.getTitle(this.translateService.instant('shared.labels.attendanceReport'), this.student.name);
  }

  initializeChart() {
    // Create a data array for all 12 months, initialized with 0
    const presentData = new Array(12).fill(0);
    const absentData = new Array(12).fill(0);
    const lateData = new Array(12).fill(0);

    // Map the API data to the correct month positions (month - 1 for array index)
    this.monthlyAttendanceData.forEach(item => {
      const monthIndex = item.month - 1; // Convert month number to array index
      if (monthIndex >= 0 && monthIndex < 12) {
        presentData[monthIndex] = item.present;
        absentData[monthIndex] = item.absent;
        lateData[monthIndex] = item.late;
      }
    });

    this.dataSet = [
      {
        label: this.translateService.instant('attendanceStatus.present'),
        data: presentData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#4CAF50',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: this.translateService.instant('attendanceStatus.absent'),
        data: absentData,
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#F44336',
        pointBorderColor: '#F44336',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: this.translateService.instant('attendanceStatus.late'),
        data: lateData,
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#FF9800',
        pointBorderColor: '#FF9800',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  buildTooltipLabel = (context: any) => {
    const label = context.dataset.label || '';
    const value = context.parsed.y;
    const monthIndex = context.dataIndex;

    // Find the month data for this specific month
    const monthData = this.monthlyAttendanceData?.find(item => item.month === monthIndex + 1);

    // Calculate total from present + absent + late for this month
    const monthTotal = monthData ? (monthData.present + monthData.absent + monthData.late) : 0;
    const percentage = monthTotal > 0 ? ((value / monthTotal) * 100).toFixed(1) : '0.0';

    return `${label}: ${value} (${percentage}%)`;
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.onYearChanged.emit(year);
  }

  onMonthChange(month: number) {
    this.selectedMonth = month;
    this.onMonthChanged.emit({ year: this.selectedYear ?? 0, month: this.selectedMonth ?? 0 });
  }

  get present() {
    if (this.showDailyAttendance) {
      return this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).present;
    }

    return this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).present;
  }

  get absent() {
    if (this.showDailyAttendance) {
      return this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).absent;
    }

    return this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).absent;
  }

  get late() {
    if (this.showDailyAttendance) {
      return this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).late;
    }

    return this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).late;
  }

  get total() {
    if (this.showDailyAttendance) {
      return this.statusService.getAttendanceDailyStatistics(this.dailyAttendanceData).total;
    }

    return this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).total;
  }

  async exportToPdf() {

    this.confirmService.confirmPrint(async () => {
      try {
        this.allowExportToPdf = true;

        this.loader.show();

        if (!this.pdfTemplate) {
          console.error('PDF template not found');
          return;
        }

        const filename = `${this.student.name}_${this.translateService.instant('shared.labels.attendanceReport')}_${this.showDailyAttendance ? this.translateService.instant('shared.labels.daily') : this.translateService.instant('shared.labels.monthly')}_Report_${this.selectedYear}/${this.selectedMonth}.pdf`;

        await this.pdfExportService.exportToPdf(
          this.showDailyAttendance ? this.dailyPdfTemplate.pdfContent.nativeElement : this.pdfTemplate.pdfContent.nativeElement,
          filename,
          { orientation: 'portrait', format: 'a4' }
        );

      } catch (error) {
        console.error('Error exporting PDF:', error);
      } finally {
        this.loader.hide();
        this.allowExportToPdf = false;
      }
    });


  }
}
