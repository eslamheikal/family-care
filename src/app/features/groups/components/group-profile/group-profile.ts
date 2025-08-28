import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Group, GroupAttendance } from '../../../../core/models/group.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BadgeHelper } from '../../../shared/helpers/badge.helper';
import { GroupService } from '../../../../core/services/group.service';
import { TooltipModule } from 'primeng/tooltip';
import { GroupFromComponent } from '../group-from/group-from';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { StudentsDialog } from '../../../shared/dialogs/students-dialog/students-dialog';
import { Student } from '../../../../core/models/student.model';
import { EditIconButton } from '../../../shared/buttons/edit-icon-button/edit-icon-button';
import { Card } from "primeng/card";
import { NoData } from "../../../shared/components/no-data/no-data";
import { WeekDaysService } from '../../../../core/services/week-days.service';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { GroupDailySchedule } from "../group-daily-schedule/group-daily-schedule";
import { PersonalTab, PersonalTabs } from '../../../shared/profile/personal-tabs/personal-tabs';
import { TableColumn } from '../../../shared/props/table-column.props';
import { Table } from "../../../shared/components/table/table";
import { PdfYearMonthBtns } from "../../../shared/buttons/pdf-year-month-btns/pdf-year-month-btns";
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'app-group-profile',
  imports: [CommonModule, TabsModule, TableModule, TranslateModule, TooltipModule, GroupFromComponent, StudentsDialog, EditIconButton, Card, NoData, GroupDailySchedule, PersonalTabs, Table, PdfYearMonthBtns],
  templateUrl: './group-profile.html',
  styleUrl: './group-profile.scss'
})
export class GroupProfile implements OnInit {

  //#region Properties
  showDialog = false;
  showStudentsDialog = false;
  group: Group = {} as Group;
  selectedYear = DateHelper.getCurrentYear();
  selectedMonth = DateHelper.getCurrentMonth();
  destroy$ = new Subject<void>();

  activeTab = 'groups.profile.groupData';
  //#endregion

  //#region Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private translate = inject(TranslateService);
  private badgeHelper = BadgeHelper.createCapacityBadge(this.translate);
  private confirmService = inject(ConfirmService);

  public weekDays = inject(WeekDaysService);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Tabs
  tabs: PersonalTab[] = [
    { label: 'groups.profile.groupData', icon: 'fas fa-users' },
    { label: 'shared.tabs.schedule', icon: 'fas fa-calendar-alt', onClick: () => this.onScheduleClick() },
    { label: 'shared.tabs.attendance', icon: 'fas fa-clipboard-check', onClick: () => this.loadAttendances(this.selectedYear, this.selectedMonth) },
    { label: 'students.all', icon: 'fas fa-solid fa-user-graduate' },
  ];

  studentTableColumns: TableColumn[] = [
    { field: 'name', title: 'students.one', type: 'text', onClick: (this.permissionAccess.canView.studentProfile ? (row: Student) => this.onStudentClick(row.id) : null) },
  ];

  attendaceTableColumns: TableColumn[] = [
    { field: 'date', title: 'shared.labels.date', type: 'date', onClick: (this.permissionAccess.canEdit.recordStudentAttendance ?(row: GroupAttendance) => this.onAttendanceClick(row.sessionId) : null) },
    { field: 'present', title: 'attendanceStatus.present', type: 'number' },
    { field: 'late', title: 'attendanceStatus.late', type: 'number' },
    { field: 'absent', title: 'attendanceStatus.absent', type: 'number' },
    { field: 'total', title: 'shared.labels.total', type: 'number' },
  ];

  //#endregion

  //#region Methods

  ngOnInit() {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    if (groupId) {
      this.loadGroup(groupId);
    } else {
      this.toaster.showError(this.translate.instant('groups.notFound'));
    }
  }

  onActiveTabChange(tab: string) {
    this.activeTab = tab;
  }

  loadGroup(groupId: number) {
    this.loader.show();
    this.groupService.get(groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(group => {
        this.group = group;
        this.group.students = this.group.students?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      }, error => { }, () => {
        this.loader.hide();
        this.showDialog = false;
      });
  }

  getTimeFormat(time: string | null): string {
    return TimeHelper.displayTime(time);
  }

  getCapacityPercentage(): number {
    if (!this.group.capacity || this.group.capacity === 0) return 0;

    return Math.round((this.group.numberOfStudents / this.group.capacity) * 100);
  }

  getCapacityStatus(): string {
    if (this.group.capacity === 0) return '-';

    return this.badgeHelper.getValue(this.group);
  }

  getCapacityStatusColor(): string {
    return this.badgeHelper.getColor(this.group);
  }

  onTeacherClick() {
    if (this.group && this.group.teacher?.id) {

      this.confirmService.confirmView(() => {
        this.router.navigate(['/teachers', this.group.teacher!.id]);
      });

    }
  }

  onStudentClick(studentId: number) {
    if (studentId) {
      this.confirmService.confirmView(() => {
        this.router.navigate(['/students', studentId]);
      });
    }
  }

  onEditGroup() {
    this.confirmService.confirmEdit(() => {
      this.showDialog = true;
    });
  }

  onAddStudent() {
    this.confirmService.confirmEdit(() => {
      this.showStudentsDialog = true;
    });
  }

  onSaveStudents(students: Student[]) {
    this.group.students = students;

    this.loader.show();
    this.groupService.updateStudents(this.group.id, students.map(student => student.id)).pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.toaster.showSuccess(this.translate.instant('groups.studentsUpdated'));
        this.loadGroup(this.group.id);
      }
    }, error => { }, () => {
      this.loader.hide();
      this.showStudentsDialog = false;
    });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAttendanceClick(sessionId: number) {
    if (sessionId) {
      this.confirmService.confirmView(() => {
        this.router.navigate(['/sessions', sessionId, 'attendance']);
      });
    }
  }


  onScheduleClick() {
    this.loader.show();
    this.groupService.getGroupSchedules(this.group.id).pipe(takeUntil(this.destroy$)).subscribe(schedules => {
      this.group = { ...this.group, dailySchedules: schedules };
    }, _ => { }, () => this.loader.hide());
  }

  loadAttendances(year: number, month: number) {
    this.loader.show();
    this.groupService.getAttendances(this.group.id, year, month).pipe(takeUntil(this.destroy$)).subscribe(attendances => {
      this.group.attendces = attendances;
      this.group.attendces?.forEach(attendance => {
        attendance.total = attendance.present + attendance.late + attendance.absent;
      });
    }, error => { }, () => {
      this.loader.hide();
    });
  }
  //#endregion
} 