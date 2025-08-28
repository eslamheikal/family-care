import { Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfIconBtn } from '../../../shared/buttons/pdf-icon-btn/pdf-icon-btn';
import { DailyScheduleComponent } from '../../../shared/components/daily-schedule/daily-schedule';
import { CommonModule } from '@angular/common';
import { NoData } from '../../../shared/components/no-data/no-data';
import { Teacher } from '../../../../core/models/teacher.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { DailySchedulePdfTemplateComponent } from "../../../shared/pdf-template/daily-schedule-pdf-template/daily-schedule-pdf-template";
import { ReportHelper } from '../../../../core/helpers/report.helper';

@Component({
  selector: 'teacher-daily-schedule',
  imports: [
    TranslateModule,
    PdfIconBtn,
    DailyScheduleComponent,
    CommonModule,
    NoData,
    DailySchedulePdfTemplateComponent
],
  templateUrl: './teacher-daily-schedule.html',
  styleUrl: './teacher-daily-schedule.scss'
})
export class TeacherDailySchedule  {

  @Input() teacher: Teacher = {} as Teacher;
  @ViewChild(DailySchedulePdfTemplateComponent, { static: false }) pdfTemplate!: DailySchedulePdfTemplateComponent;

  readyToExport = false;

  private loader = inject(LoaderService);
  private pdfExportService: PdfExportService = inject(PdfExportService);
  private confirmService = inject(ConfirmService);
  private translate = inject(TranslateService);
  public permissionsService = inject(PermissionAccessService);

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['teacher']) {
      this.teacher = { ...this.teacher };
    }
  }

  getReportTitle() {
    return ReportHelper.getTitle(this.translate.instant('shared.tabs.schedule'), this.teacher.name);
  }

  async exportDailyScheduleToPdf(): Promise<void> {

    this.confirmService.confirmPrint(async () => {
      this.readyToExport = true;
      try {
        this.loader.show();
        if (this.pdfTemplate && this.pdfTemplate.pdfContent) {
          const filename = `${this.teacher.name}_${this.translate.instant('shared.tabs.schedule')}.pdf`;
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

