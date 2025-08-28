import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSession } from '../../../../core/models/class-session.model';
import { StudentAttendance, StudentAttendanceDisplay } from '../../../../core/models/student-attendance.model';
import { AttendanceStatus } from '../../../../core/enums/attendance-status.enum';
import { LoaderService } from '../../../shared/services/loader.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { CanDeactivateComponent } from '../../../../core/guards/form-deactivate.guard';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { AttendancePdfTemplateComponent } from '../../../shared/pdf-template/attendance-pdf-template/attendance-pdf-template.component';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { PdfIconBtn } from "../../../shared/buttons/pdf-icon-btn/pdf-icon-btn";
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-session-attendance',
  imports: [
    CardContainer,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    SaveBtn,
    CancelBtn,
    RouterLink,
    AttendancePdfTemplateComponent,
    PdfIconBtn
  ],
  templateUrl: './session-attendance.html',
  styleUrl: './session-attendance.scss'
})
export class SessionAttendance implements CanDeactivateComponent {

  //#region Properties
  session: ClassSession = {} as ClassSession;
  attendanceDisplay: StudentAttendanceDisplay = {} as StudentAttendanceDisplay;
  attendanceForm!: FormGroup;
  AttendanceStatus = AttendanceStatus;
  ClassSessionStatus = ClassSessionStatus;
  $destroy = new Subject<void>();
  @ViewChild(AttendancePdfTemplateComponent, { static: false }) pdfTemplate!: AttendancePdfTemplateComponent;
  //#endregion

  //#region Services
  private attendanceService: AttendanceService = inject(AttendanceService);
  private loaderService: LoaderService = inject(LoaderService);
  private sessionService: SessionService = inject(SessionService);
  private translateService: TranslateService = inject(TranslateService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmService: ConfirmService = inject(ConfirmService);
  private fb: FormBuilder = inject(FormBuilder);
  private pdfExportService: PdfExportService = inject(PdfExportService);
  private weekDaysService: WeekDaysService = inject(WeekDaysService);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);
  //#endregion

  //#region Methods 

  constructor() {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.session.id = +params['sessionId'];
      this.loadSessions();
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  initializeForm() {
    this.attendanceForm = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  loadSessions() {
    this.loaderService.show();

    this.attendanceService.getAttendances(this.session.id).pipe(takeUntil(this.$destroy)).subscribe(res => {

      this.attendanceDisplay = res;
      this.attendanceDisplay.dayName = this.weekDaysService.getDayName(new Date(res.sessionDate!).getDay());
      this.attendanceDisplay.sessionDate = DateHelper.displayDate(res.sessionDate);
      this.attendanceDisplay.startTime = TimeHelper.displayTime(res.startTime);
      this.attendanceDisplay.endTime = TimeHelper.displayTime(res.endTime);

      this.buildAttendanceForm(res.attendances);

    }, err => {
    }, () => this.loaderService.hide());
  }

  buildAttendanceForm(attendances: StudentAttendance[]) {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.clear();

    attendances.forEach(attendance => {
      const attendanceGroup = this.fb.group({
        id: [attendance.id],
        sessionId: [attendance.sessionId],
        studentId: [attendance.studentId],
        studentName: [attendance.studentName],
        status: [attendance.status],
        note: [attendance.note || '']
      });
      attendancesArray.push(attendanceGroup);
    });

    this.attendanceForm.markAsPristine();
  }

  onSave() {
    this.confirmService.confirm(
      this.translateService.instant('attendance.confirm.save'),
      () => {

        this.loaderService.show();
        const formValue = this.attendanceForm.value;
        this.attendanceService.updateAttendances(this.session.id, formValue.attendances).pipe(takeUntil(this.$destroy)).subscribe(res => {

          if (res) {
            this.toastService.showSuccess(this.translateService.instant('attendance.updateSuccess'));
            this.attendanceForm.markAsPristine();
            this.loadSessions();
          }

        }, err => { }, () => this.loaderService.hide());

      }
    );
  }

  onCancel() {

    if (this.attendanceForm.dirty) {
      window.history.back();
    } else {
      
      this.confirmService.confirmBack(() => {
        window.history.back();
      });
    }
  }

  async exportToPdf() {

    this.confirmService.confirmPrint(async () => {

      try {
        this.loaderService.show();

        if (!this.pdfTemplate) {
          this.toastService.showError(this.translateService.instant('shared.pdf.error.noContent'));
          return;
        }

        await this.pdfExportService.exportToPdf(
          this.pdfTemplate.pdfContent.nativeElement,
          `${this.translateService.instant('attendance.recordAttendance')}_${this.attendanceDisplay.groupName}_${this.attendanceDisplay.sessionDate}`
        );

        this.toastService.showSuccess(this.translateService.instant('shared.pdf.success'));
      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.toastService.showError(this.translateService.instant('shared.pdf.error.general'));
      } finally {
        this.loaderService.hide();
      }

    });


  }

  getFormControlArray() {
    return this.attendanceForm.get('attendances') as FormArray;
  }

  //#endregion

  //#region Mark All Attendances

  markAllPresent() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Present });
    });
    this.attendanceForm.markAsDirty();
  }

  markAllAbsent() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Absent });
    });
    this.attendanceForm.markAsDirty();
  }

  markAllLate() {
    const attendancesArray = this.attendanceForm.get('attendances') as FormArray;
    attendancesArray.controls.forEach(control => {
      control.patchValue({ status: AttendanceStatus.Late });
    });
    this.attendanceForm.markAsDirty();
  }

  //#endregion

  //#region Permissions

  get canExportPdf(): boolean {
    return this.permissionService.canExport.exportAttendancePdf;
  }

  get canRecordAttendance(): boolean {
    return this.permissionService.canEdit.recordStudentAttendance && this.attendanceDisplay.sessionStatus === ClassSessionStatus.Scheduled;
  }

  get dirty(): boolean {
    return this.attendanceForm?.dirty || false;
  }

  //#endregion

  //#region Summary Computed Properties

  get attendancesArray(): FormArray {
    return this.attendanceForm?.get('attendances') as FormArray || this.fb.array([]);
  }

  get totalStudents(): number {
    return this.attendancesArray?.length || 0;
  }

  get presentStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control =>
      control.get('status')?.value === AttendanceStatus.Present
    ).length;
  }

  get lateStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control =>
      control.get('status')?.value === AttendanceStatus.Late
    ).length;
  }

  get absentStudents(): number {
    if (!this.attendancesArray?.controls) return 0;
    return this.attendancesArray.controls.filter(control =>
      control.get('status')?.value === AttendanceStatus.Absent
    ).length;
  }


  onMarkCompleted(): void {
    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.markCompleted'),
      () => {
        this.loaderService.show();
        this.sessionService.updateStatus(this.session.id!, ClassSessionStatus.Completed).pipe(takeUntil(this.$destroy)).subscribe((success) => {
          this.loadSessions();
          this.toastService.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
        }, err => { }, () => this.loaderService.hide());
      },
      undefined,
      'pi pi-check confirm-icon-completed'
    );
  }

  rescheduleSession() {

    this.confirmService.confirm(
      this.translateService.instant('sessions.confirm.reschedule'),
      () => {

        this.loaderService.show();

        this.sessionService.updateStatus(this.session.id!, ClassSessionStatus.Scheduled).pipe(takeUntil(this.$destroy)).subscribe((success) => {
          if (success) {
            this.loadSessions();
            this.toastService.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
          }
        }, err => { }, () => this.loaderService.hide());

      },
      undefined,
      'fa fa-calendar-plus confirm-icon-reschedule'
    );
  }

  get permission() {

    let hasUnRecord = this.attendanceDisplay.attendances.some(r => r.status == AttendanceStatus.None);

    return {
      canReschedule: this.permissionService.canEdit.studentAttendanceToBeRescheduled &&
        this.attendanceDisplay.sessionStatus === ClassSessionStatus.Completed,

      canMarkCompleted: this.permissionService.canEdit.studentAttendanceToBeCompleted &&
        !hasUnRecord &&
        this.attendanceDisplay.sessionStatus === ClassSessionStatus.Scheduled,
    }
  }
  //#endregion
}
