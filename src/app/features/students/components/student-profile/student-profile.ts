import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { StudentFormComponent } from '../student-form/student-form';
import { StudentQualification } from '../student-qualification/student-qualification';
import { CommonModule } from '@angular/common';
import { UserAttachmentDialog } from '../../../shared/dialogs/user-attachment-dialog/user-attachment-dialog';
import { StudentAttachmentComponent } from '../student-attachment/student-attachment';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { StudentService } from '../../../../core/services/student.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { UserAttachment } from '../../../../core/models/user-attachment.model';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { CardModule } from 'primeng/card';
import { EditIconButton } from "../../../shared/buttons/edit-icon-button/edit-icon-button";
import { StudentDailySchedule } from "../student-daily-schedule/student-daily-schedule";
import { StudentFeedback } from "../student-feedback/student-feedback";
import { StudentAttendance } from "../student-attendance/student-attendance";
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { NoData } from "../../../shared/components/no-data/no-data";
import { AttendanceService } from '../../../../core/services/attendance.service';
import { MonthlyAttendanceModel } from '../../../../core/models/monthly-attendance.model';
import { DailyAttendanceModel } from '../../../../core/models/daily-attendance.model';
import { ProfileHeader } from '../../../shared/props/profile.props';
import { PersonalHeader } from "../../../shared/profile/personal-header/personal-header";
import { PersonalTab, PersonalTabs } from '../../../shared/profile/personal-tabs/personal-tabs';
import { TableColumn } from '../../../shared/props/table-column.props';
import { Table } from "../../../shared/components/table/table";

@Component({
  selector: 'app-student-profile',
  imports: [
    TabsModule,
    TooltipModule,
    StudentFormComponent,
    StudentQualification,
    CommonModule,
    UserAttachmentDialog,
    StudentAttachmentComponent,
    TableModule,
    TranslateModule,
    RouterModule,
    CardModule,
    EditIconButton,
    StudentDailySchedule,
    StudentFeedback,
    StudentAttendance,
    NoData,
    PersonalHeader,
    PersonalTabs,
    Table
],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss'
})
export class StudentProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showUserAttachmentDialog = false;
  disablePage = false;
  showDailyAttendance = false;
  profileHeader: ProfileHeader = {} as ProfileHeader;

  student: Student = {} as Student;
  monthlyAttendanceData: MonthlyAttendanceModel[] = [];
  dailyAttendanceData: DailyAttendanceModel[] = [];
  destroy$ = new Subject<void>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  activeTab = 'shared.tabs.personalInfo';
  //#endregion

  //#region Services
  private studentService = inject(StudentService);
  private loader = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);
  private attendanceService = inject(AttendanceService);

  public permissionService = inject(PermissionAccessService);
  //#endregion


  //#region Tabs
  tabs: PersonalTab[] = [
    { label: 'shared.tabs.personalInfo', icon: 'fas fa-user' },
    { label: 'shared.tabs.schedule', icon: 'fas fa-calendar-alt', onClick: () => this.onScheduleClick() },
    { label: 'shared.tabs.attendance', icon: 'fas fa-clipboard-check', onClick: () => this.onAttendanceClick() },
    { label: 'shared.tabs.teacherFeedback', icon: 'fas fa-comments'},
    { label: 'shared.tabs.groups', icon: 'fas fa-users', onClick: () => this.onGroupsClick() },
    { label: 'shared.tabs.qualifications', icon: 'fas fa-graduation-cap' },
    { label: 'shared.tabs.attachments', icon: 'fas fa-paperclip' },
  ];

  groupsColumns: TableColumn[] = [
    { field: 'name', title: 'groups.one', onClick: this.permissionService.canView.groupProfile ? (row: any) => this.onGroupClick(row.id) : null, type: 'text' },
    { field: 'courseName', title: 'courses.one', type: 'text' },
  ];
  //#endregion

  //#region Methods

  onActiveTabChange(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.student.id = Number(params['id']);
      this.loadStudent();
    });

  }

  loadStudent() {
    this.loader.show();
    this.studentService.get(this.student.id).pipe(takeUntil(this.destroy$)).subscribe((student: Student) => {
      this.student = { ...student };
      this.profileHeader = {
        fullName: student.name,
        code: student.code,
        image: this.getImageUrl(student.imagePath),
        dateOfBirth: student.birthDate
      };

      if (student.id == 0) {
        this.toaster.showError(this.translate.instant('students.notFound'));
        this.disablePage = true;
      }

      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showUserAttachmentDialog = false;
    });
  }

  loadMonthlyAttendanceData(year: number) {
    this.showDailyAttendance = false;
    this.loader.show();

    this.attendanceService.getStudentMonthlyAttendance(this.student.id, year)
      .subscribe(res => {
        this.monthlyAttendanceData = res;
      }, err => { }, () => this.loader.hide());
  }

  loadDailyAttendanceData(year: number, month: number = 0) {
    if (month == 0) {
      this.showDailyAttendance = false;
      return;
    }

    this.showDailyAttendance = true;
    this.loader.show();
    this.attendanceService.getStudentDailyAttendance(this.student.id, year, month)
      .subscribe(res => {
        this.dailyAttendanceData = res;
      }, err => { }, () => this.loader.hide());
  }

  getSafeHtml(html: string) {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : '';
  }

  onScheduleClick() {
    this.loader.show();
    this.studentService.getStudentSchedules(this.student.id).pipe(takeUntil(this.destroy$)).subscribe(schedules => {
      this.student = { ...this.student, dailySchedules: schedules };
    }, _ => { }, () => this.loader.hide());
  }

  onAttendanceClick() {
    if (this.monthlyAttendanceData.length == 0) {
      this.loadMonthlyAttendanceData(DateHelper.getCurrentYear());
    }
  }

  onGroupsClick() {
    this.loader.show();
    this.studentService.getStudentGroups(this.student.id).pipe(takeUntil(this.destroy$)).subscribe(groups => {
      this.student = { ...this.student, groups: groups };
    }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Student Info

  getImageUrl(imageUrl: string) {
    return imageUrl ? this.studentService.getViewAttachmentUrl(imageUrl) : 'assets/icons/avatar-student.svg';
  }

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loader.show();
      this.studentService.uploadImage(file, this.student.id).subscribe(res => {
        if (res) {
          this.loadStudent();
          this.toaster.showSuccess(this.translate.instant('students.imageUpdateSuccess'));
        }
      }, _ => { }, () => {
        this.loader.hide();
      },);
    }
  }

  getAge(birthDate: string | null) {
    return birthDate ? DateHelper.getAge(birthDate) : '';
  }

  getGender(gender: GenderEnum) {
    return GenderHelper.get(gender);
  }

  changeImage() {
    this.confirmService.confirmChangeImage(() => {
      this.fileInput.nativeElement.click();
    });
  }

  onEditStudent() {
    this.confirmService.confirmEdit(() => {
      this.student = { ...this.student };
      this.showEditInfoDialog = true;
    });
  }


  onGroupClick(groupId: number) {
    
    this.confirmService.confirmView(() => {
      this.router.navigate(['/groups', groupId]);
    });

  }

  //#endregion

  //#region Student Qualification

  onEditQualification() {
    this.confirmService.confirmEdit(() => {
      this.student = { ...this.student };
      this.showQualificationDialog = true;
    });
  }

  //#endregion

  //#region User Attachment

  onAddUserAttachment() {
    this.showUserAttachmentDialog = true;
  }

  saveUserAttachment(userAttachment: UserAttachment) {
    this.loader.show();
    this.studentService.uploadAttachment(userAttachment).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.loadStudent();
        this.toaster.showSuccess(this.translate.instant('shared.messages.attachmentUploadSuccess'));
      }
    }, _ => { }, () => {
      this.loader.hide();
      this.showUserAttachmentDialog = false;
    });
  }

  //#endregion


}

