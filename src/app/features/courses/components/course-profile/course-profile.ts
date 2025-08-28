import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../../../core/models/course.model';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../../core/services/course.service';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CourseForm } from '../course-form/course-form';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { EditIconButton } from '../../../shared/buttons/edit-icon-button/edit-icon-button';
import { TeachersDialog } from "../../../shared/dialogs/teachers-dialog/teachers-dialog";
import { Teacher } from '../../../../core/models/teacher.model';
import { TabsModule } from 'primeng/tabs';
import { Card } from "primeng/card";
import { NoData } from "../../../shared/components/no-data/no-data";
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { TableColumn } from '../../../shared/props/table-column.props';
import { Table } from "../../../shared/components/table/table";
import { Group } from '../../../../core/models/group.model';
import { PersonalTab, PersonalTabs } from '../../../shared/profile/personal-tabs/personal-tabs';

@Component({
  selector: 'app-course-profile',
  imports: [TabsModule, CommonModule, TranslateModule, TooltipModule, TableModule, CourseForm, EditIconButton, TeachersDialog, Card, NoData, Table, PersonalTabs],
  templateUrl: './course-profile.html',
  styleUrl: './course-profile.scss'
})
export class CourseProfile implements OnInit {

  //#region Properties
  showDialog = false;
  showTeachersDialog = false;
  course: Course = {} as Course;
  destroy$ = new Subject<void>();
  activeTab = 'courses.profile.courseData';

  tabs: PersonalTab[] = [
    { label: 'courses.profile.courseData', icon: 'fas fa-book-reader' },
    { label: 'teachers.all', icon: 'fas fa-chalkboard-teacher' },
    { label: 'groups.all', icon: 'fas fa-users' },
  ];

  teacherTableColumns: TableColumn[] = [
    { field: 'name', title: 'teachers.one', type: 'text', onClick: (row: Teacher) => this.onTeacherClick(row.id) },
  ];

  groupTableColumns: TableColumn[] = [
    { field: 'name', title: 'groups.one', type: 'text', onClick: (row: Group) => this.onGroupClick(row.id) },
  ];
  //#endregion

  //#region Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private translate = inject(TranslateService);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Methods

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadCourse(courseId);
    } else {
      this.toaster.showError(this.translate.instant('courses.notFound'));
    }
  }

  onActiveTabChange(tab: string) {
    this.activeTab = tab;
  }

  loadCourse(courseId: number) {
    this.loader.show();
    this.courseService.get(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(course => {
        this.course = course;
        this.course.teachers = this.course.teachers?.sort((a, b) => a.name.localeCompare(b.name)) || [];
      }, error => {}, () => {
        this.loader.hide();
        this.showDialog = false;
      });
  }

  onTeacherClick(teacherId: number) {
    if (teacherId) {
      this.confirmService.confirmView(() => {
        this.router.navigate(['/teachers', teacherId]);
      });
    }
  }

  onGroupClick(groupId: number) {
    if (groupId) {
      this.confirmService.confirmView(() => {
        this.router.navigate(['/groups', groupId]);
      });
    }
  }

  onEditCourse() {
    this.confirmService.confirmEdit(() => {
      this.showDialog = true;
      this.course = { ...this.course } as Course;
    });
  }

  onAddTeacher() {
    this.confirmService.confirmEdit(() => {
      this.showTeachersDialog = true;
    });
  }

  onSaveTeachers(teachers: Teacher[]) {
    let currentTeachers = this.course.teachers || [];
    this.course.teachers = teachers;

    this.loader.show();

    this.courseService.updateTeachers(this.course.id, teachers.map(teacher => teacher.id))
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.toaster.showSuccess(this.translate.instant('courses.teachersUpdatedSuccess'));
          this.loadCourse(this.course.id);
        } else {
          this.course.teachers = currentTeachers;
        }
      }, error => { }, () => {
        this.loader.hide();
        this.showTeachersDialog = false;
      });


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion
} 