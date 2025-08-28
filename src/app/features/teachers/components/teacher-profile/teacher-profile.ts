import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { TeacherFormComponent } from '../teacher-form/teacher-form';
import { TeacherQualification } from '../teacher-qualification/teacher-qualification';
import { CommonModule } from '@angular/common';
import { UserAttachmentDialog } from '../../../shared/dialogs/user-attachment-dialog/user-attachment-dialog';
import { TeacherAttachmentComponent } from '../teacher-attachment/teacher-attachment';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { TeacherService } from '../../../../core/services/teacher.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderEnum } from '../../../../core/enums/gender.enum';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { UserAttachment } from '../../../../core/models/user-attachment.model';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { CardModule } from 'primeng/card';
import { EditIconButton } from "../../../shared/buttons/edit-icon-button/edit-icon-button";
import { TeacherExperience } from '../teacher-experience/teacher-experience';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { NoData } from "../../../shared/components/no-data/no-data";
import { AuthService } from '../../../../core/services/auth.service';
import { CoursesDialog } from "../../../shared/dialogs/courses-dialog/courses-dialog";
import { Course } from '../../../../core/models/course.model';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { TeacherDailySchedule } from "../teacher-daily-schedule/teacher-daily-schedule";
import { TableColumn } from '../../../shared/props/table-column.props';
import { Table } from "../../../shared/components/table/table";
import { ProfileHeader } from '../../../shared/props/profile.props';
import { PersonalHeader } from "../../../shared/profile/personal-header/personal-header";
import { PersonalTab, PersonalTabs } from '../../../shared/profile/personal-tabs/personal-tabs';
import { DailySchedule } from '../../../../core/models/daily-schedule.model';
import { Group } from '../../../../core/models/group.model';

@Component({
  selector: 'app-teacher-profile',
  imports: [
    TabsModule,
    TooltipModule,
    TeacherFormComponent,
    TeacherQualification,
    CommonModule,
    UserAttachmentDialog,
    TeacherAttachmentComponent,
    TableModule,
    TranslateModule,
    RouterModule,
    CardModule,
    EditIconButton,
    TeacherExperience,
    NoData,
    CoursesDialog,
    TeacherDailySchedule,
    Table,
    PersonalHeader,
    PersonalTabs,
],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.scss'
})
export class TeacherProfile {

  //#region Properties
  showEditInfoDialog = false;
  showQualificationDialog = false;
  showExperienceDialog = false;
  showUserAttachmentDialog = false;
  showEditCourseDialog = false;
  disablePage = false;
  profileHeader: ProfileHeader = {} as ProfileHeader;

  teacher: Teacher = {} as Teacher;
  destroy$ = new Subject<void>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  activeTab = 'shared.tabs.personalInfo';

  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
  private loader = inject(LoaderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  private router = inject(Router);
  
  public weekDays = inject(WeekDaysService);
  public authService = inject(AuthService);
  public permissionService = inject(PermissionAccessService);
  //#endregion


  //#region Tabs
  tabs: PersonalTab[] = [
    { label: 'shared.tabs.personalInfo', icon: 'fas fa-user' },
    { label: 'shared.tabs.schedule', icon: 'fas fa-calendar-alt', onClick: () => this.onScheduleClick() },
    { label: 'shared.tabs.groups', icon: 'fas fa-users', onClick: () => this.onGroupsClick() },
    { label: 'shared.tabs.courses', icon: 'fas fa-book-reader' },
    { label: 'shared.tabs.finances', icon: 'fas fa-money-bill' },
    { label: 'shared.tabs.qualifications', icon: 'fas fa-certificate' },
    { label: 'shared.tabs.attachments', icon: 'fas fa-paperclip' },
  ];
  
  groupsColumns: TableColumn[] = [
    { field: 'name', title: 'groups.one', type: 'text', onClick: (this.permissionService.canView.groupProfile ? (row: any) =>  this.onGroupClick(row.id) : null) },
    { field: 'courseName', title: 'courses.one', type: 'text' },
    { field: 'numberOfStudents', title: 'shared.labels.numberOfStudents', type: 'number' },
  ];

  coursesColumns: TableColumn[] = [
    { field: 'name', title: 'courses.one', type: 'text', onClick: (this.permissionService.canView.courseProfile ? (row: Course) => this.onCourseClick(row.id) : null) },
  ];

  //#endregion


  //#region Methods

  onActiveTabChange(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.teacher.id = Number(params['id']);
      this.loadTeacher();
    });

  }

  loadTeacher() {
    this.loader.show();
    this.teacherService.get(this.teacher.id).pipe(takeUntil(this.destroy$)).subscribe((teacher: Teacher) => {
      this.teacher = { ...teacher };
      this.profileHeader = {
        fullName: teacher.name,
        code: teacher.code,
        image: this.getImageUrl(teacher.imagePath),
        dateOfBirth: teacher.birthDate
      };

      this.teacher.courses = this.teacher.courses?.sort((a, b) => a.name.localeCompare(b.name)) || [];

      if (teacher.id == 0) {
        this.toaster.showError(this.translate.instant('teachers.notFound'));
        this.disablePage = true;
      }

      this.cdr.detectChanges();
    }, _ => { }, () => {
      this.loader.hide();
      this.showEditInfoDialog = false;
      this.showQualificationDialog = false;
      this.showExperienceDialog = false;
      this.showUserAttachmentDialog = false;
    });
  }

  getSafeHtml(html: string) {
    return html ? this.sanitizer.bypassSecurityTrustHtml(html) : '';
  }

  getTimeFormat(time: string) {
    return time ? TimeHelper.displayTime(time) : '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Teacher Info

  onScheduleClick() {
    this.loader.show();

    this.teacherService.getTeacherSchedules(this.teacher.id).pipe(takeUntil(this.destroy$)).subscribe((schedules: DailySchedule[]) => {
      this.teacher = { ...this.teacher, dailySchedules: schedules };
    }, _ => { }, () => this.loader.hide());
  }

  onGroupsClick() {
    this.loader.show();

    this.teacherService.getTeacherGroups(this.teacher.id).pipe(takeUntil(this.destroy$)).subscribe((groups: Group[]) => {
      this.teacher = { ...this.teacher, groups: groups };
    }, _ => { }, () => this.loader.hide());
  }

  getImageUrl(imageUrl: string) {
    return imageUrl ? this.teacherService.getViewAttachmentUrl(imageUrl) : 'assets/icons/avatar-teacher.svg';
  }

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loader.show();
      this.teacherService.uploadImage(file, this.teacher.id).subscribe(res => {
        if (res) {
          this.loadTeacher();
          this.toaster.showSuccess(this.translate.instant('teachers.imageUpdateSuccess'));
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

  onEditTeacher() {
    this.confirmService.confirmEdit(() => {
      this.teacher = { ...this.teacher };
      this.showEditInfoDialog = true;
    });
  }

  //#endregion

  //#region Teacher Qualification and Experience

  onEditQualification() {

    this.confirmService.confirmEdit(() => {
      this.teacher = { ...this.teacher };
      this.showQualificationDialog = true;
    });
  }

  onEditExperience() {

    this.confirmService.confirmEdit(() => {
      this.teacher = { ...this.teacher };
      this.showExperienceDialog = true;
    });
  }

  //#endregion

  //#region User Attachment

  onAddUserAttachment() {
    this.showUserAttachmentDialog = true;
  }

  saveUserAttachment(userAttachment: UserAttachment) {
    this.loader.show();
    this.teacherService.uploadAttachment(userAttachment).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.loadTeacher();
        this.toaster.showSuccess(this.translate.instant('shared.messages.attachmentUploadSuccess'));
      }
    }, _ => { }, () => {
      this.loader.hide();
      this.showUserAttachmentDialog = false;
    });
  }

  //#endregion

  //#region Course

  onCourseClick(courseId: number) {
    this.confirmService.confirmView(() => {
      this.router.navigate(['/courses', courseId]);
    });
  }

  onEditCourse() {

    this.confirmService.confirmEdit(() => {
      this.showEditCourseDialog = true;
    });

  }

  onSaveCourses(courses: Course[]) {
    let currentCourses = this.teacher.courses || [];
    this.teacher.courses = courses;

    this.teacherService.update(this.teacher)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.loadTeacher();
          this.toaster.showSuccess(this.translate.instant('teachers.coursesUpdatedSuccess'));
          this.showEditCourseDialog = false;
        } else {
          this.teacher.courses = currentCourses;
        }
      }, _ => { }, () => this.loader.hide());
  }

  //#endregion

  //#region Group

  onGroupClick(groupId: number) {
    this.confirmService.confirmView(() => {
      this.router.navigate(['/groups', groupId]);
    });
  }

  //#endregion

}
