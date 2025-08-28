import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfTemplateFooter } from '../pdf-template-footer/pdf-template-footer';
import { PdfTemplateHeader } from '../pdf-template-header/pdf-template-header';
import { MonthlyAttendanceModel } from '../../../../core/models/monthly-attendance.model';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { MonthesService } from '../../../../core/services/monthes.service';
import { StatusService } from '../../../../core/services/status.service';
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";
import { NoData } from "../../components/no-data/no-data";

@Component({
  selector: 'attendance-monthly-pdf-template',
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table, NoData],
  templateUrl: './attendance-monthly-pdf-template.html',
  styleUrl: './attendance-monthly-pdf-template.scss'
})
export class AttendanceMonthlyPdfTemplate {
  @Input() title: string = '';
  @Input() monthlyAttendanceData: MonthlyAttendanceModel[] = [];
  @Input() selectedYear: number = DateHelper.getCurrentYear();

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  exportDate = DateHelper.displayDate(new Date().toString());

  monthlyTableColumns: TableColumn[] = [
    { title: 'shared.labels.month', field: 'monthName', type: 'text' },
    { title: 'attendanceStatus.present', field: 'present', type: 'number' },
    { title: 'attendanceStatus.late', field: 'late', type: 'number' },
    { title: 'attendanceStatus.absent', field: 'absent', type: 'number' },
    { title: 'shared.labels.total', field: 'total', type: 'number' },
    { title: 'shared.labels.attendancePercentage', field: 'percentage', type: 'number' },
  ];

  private translateService = inject(TranslateService);
  private monthService = inject(MonthesService);
  public statusService = inject(StatusService);


  get monthlyStatistics() {
    return {
      present: this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).present,
      late: this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).late,
      absent: this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).absent,
      total: this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).total,
      percentage: this.statusService.getAttendanceMonthlyStatistics(this.monthlyAttendanceData).percentage
    };
  }


  getMonthlyAttendanceData(): MonthlyAttendanceModel[] {
    return [1,2,3,4,5,6,7,8,9,10,11,12].map(month => ({
      month: month,
      present: this.getMonthData(month)?.present || 0,
      late: this.getMonthData(month)?.late || 0,
      absent: this.getMonthData(month)?.absent || 0,
      total: this.getMonthData(month)?.total || 0,
      monthName: this.getMonthName(month),
      percentage: this.getMonthPercentage(month)
    }));
  }

  getMonthName(monthNumber: number): string {
    const months = this.monthService.getMonthes();
    return months[monthNumber - 1] || '';
  }

  getMonthData(monthNumber: number): MonthlyAttendanceModel | undefined {
    let monthData = this.monthlyAttendanceData.find(item => item.month === monthNumber);
    if (monthData) {
      monthData.total = (monthData.present || 0) + (monthData.late || 0) + (monthData.absent || 0);
    }
    return monthData;
  }

  getMonthPercentage(monthNumber: number): number {
    const monthData = this.getMonthData(monthNumber);
    if (monthData) {
      return parseFloat(((monthData.present / monthData.total) * 100).toFixed(1));
    }

    return 0;
  }

  getBestMonth(): string {
    if (this.monthlyAttendanceData.length === 0) return '-';
    
    // Filter months with actual attendance data
    const monthsWithData = this.monthlyAttendanceData.filter(month => 
      (month.present + month.late + month.absent) > 0
    );
    
    if (monthsWithData.length === 0) return '-';
    
    // If only one month has data, show it as the only month
    if (monthsWithData.length === 1) {
      return this.getMonthName(monthsWithData[0].month);
    }
    
    // Check if all months have the same percentage
    const percentages = monthsWithData.map(month => 
      month.total > 0 ? (month.present / month.total) * 100 : 0
    );
    const allSame = percentages.every(p => Math.abs(p - percentages[0]) < 0.1);
    
    if (allSame) {
      return this.translateService.instant('shared.allMonths');
    }
    
    const bestMonth = monthsWithData.reduce((best, current) => {
      const bestPercentage = best.total > 0 ? (best.present / best.total) * 100 : 0;
      const currentPercentage = current.total > 0 ? (current.present / current.total) * 100 : 0;
      return currentPercentage > bestPercentage ? current : best;
    });
    
    return this.getMonthName(bestMonth.month);
  }

  getWorstMonth(): string {
    if (this.monthlyAttendanceData.length === 0) return '-';
    
    // Filter months with actual attendance data
    const monthsWithData = this.monthlyAttendanceData.filter(month => 
      (month.present + month.late + month.absent) > 0
    );
    
    if (monthsWithData.length === 0) return '-';
    
    // If only one month has data, show it as the only month
    if (monthsWithData.length === 1) {
      return this.getMonthName(monthsWithData[0].month);
    }
    
    // Check if all months have the same percentage
    const percentages = monthsWithData.map(month => 
      month.total > 0 ? (month.present / month.total) * 100 : 0
    );
    const allSame = percentages.every(p => Math.abs(p - percentages[0]) < 0.1);
    
    if (allSame) {
      return this.translateService.instant('shared.allMonths');
    }
    
    const worstMonth = monthsWithData.reduce((worst, current) => {
      const worstPercentage = worst.total > 0 ? (worst.present / worst.total) * 100 : 0;
      const currentPercentage = current.total > 0 ? (current.present / current.total) * 100 : 0;
      return currentPercentage < worstPercentage ? current : worst;
    });
    
    return this.getMonthName(worstMonth.month);
  }

  getPerformanceRating(): string {
    const percentage = parseFloat(this.monthlyStatistics.percentage);
    
    if (percentage >= 90) return this.translateService.instant('performance.excellent');
    if (percentage >= 80) return this.translateService.instant('performance.good');
    if (percentage >= 70) return this.translateService.instant('performance.average');
    if (percentage >= 60) return this.translateService.instant('performance.belowAverage');
    return this.translateService.instant('performance.poor');
  }

  getPerformanceClass(): string {
    const percentage = parseFloat(this.monthlyStatistics.percentage);
    
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'below-average';
    return 'poor';
  }
}
