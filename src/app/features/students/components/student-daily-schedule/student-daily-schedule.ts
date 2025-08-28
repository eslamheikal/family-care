import { Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DailySchedulePdfTemplateComponent } from "../../../shared/pdf-template/daily-schedule-pdf-template/daily-schedule-pdf-template";
import { Student } from '../../../../core/models/student.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfIconBtn } from "../../../shared/buttons/pdf-icon-btn/pdf-icon-btn";
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { DailyScheduleComponent } from "../../../shared/components/daily-schedule/daily-schedule";
import { CommonModule } from '@angular/common';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { NoData } from "../../../shared/components/no-data/no-data";
import { ReportHelper } from '../../../../core/helpers/report.helper';

@Component({
  selector: 'student-daily-schedule',
  imports: [
    DailySchedulePdfTemplateComponent,
    TranslateModule,
    PdfIconBtn,
    DailyScheduleComponent,
    CommonModule,
    NoData
],
  templateUrl: './student-daily-schedule.html',
  styleUrl: './student-daily-schedule.scss'
})
export class StudentDailySchedule {

  @Input() student: Student = {} as Student;
  @ViewChild(DailySchedulePdfTemplateComponent, { static: false }) pdfTemplate!: DailySchedulePdfTemplateComponent;

  readyToExport = false;

  private loader = inject(LoaderService);
  private pdfExportService: PdfExportService = inject(PdfExportService);
  private confirmService = inject(ConfirmService);
  private translate = inject(TranslateService);
  public permissionsService = inject(PermissionAccessService);

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['student']) {
      this.student = { ...this.student };
    }
  }

  getReportTitle() {
    return ReportHelper.getTitle(this.translate.instant('shared.tabs.schedule'), this.student.name);
  }

  async exportDailyScheduleToPdf(): Promise<void> {

    this.confirmService.confirmPrint(async () => {
      this.readyToExport = true;
      try {
        this.loader.show();
        if (this.pdfTemplate && this.pdfTemplate.pdfContent) {
          const filename = `${this.student.name}_${this.translate.instant('shared.tabs.schedule')}.pdf`;
          await this.pdfExportService.exportToPdf(
            this.pdfTemplate.pdfContent.nativeElement,
            filename,
            { orientation: 'portrait', format: 'a4' }
          );
        }

        this.loader.hide();
      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.loader.hide();
      }
    });

  }

}
