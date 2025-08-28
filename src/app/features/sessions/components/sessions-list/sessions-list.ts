import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SessionCard } from '../session-card/session-card';
import { SessionForm } from '../session-form/session-form';
import { ClassSession } from '../../../../core/models/class-session.model';
import { SessionService } from '../../../../core/services/session.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { ClassSessionStatus } from '../../../../core/enums/class-session-status.enum';
import { ToastService } from '../../../shared/services/toast.service';
import { SessionSearchDialog } from "../session-search-dialog/session-search-dialog";
import { SessionSearchCriteria } from '../../../../core/models/session-search-criteria.model';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { Subject, takeUntil } from 'rxjs';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { PdfExportService } from '../../../shared/services/pdf-export.service';
import { SessionsListPdfTemplateComponent } from '../../../shared/pdf-template/session-list-pdf-template/sessions-list-pdf-template.component';
import { PdfIconBtn } from "../../../shared/buttons/pdf-icon-btn/pdf-icon-btn";

@Component({
  selector: 'sessions-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SessionCard,
    SessionForm,
    TooltipModule,
    SessionSearchDialog,
    SessionsListPdfTemplateComponent,
    PdfIconBtn
  ],
  templateUrl: './sessions-list.html',
  styleUrl: './sessions-list.scss'
})
export class SessionsList implements OnInit {

  sessions: ClassSession[] = [];
  sessionToEdit: ClassSession | null = null;
  showSessionForm = false;
  showSearchDialog = false;
  currentSearchCriteria: SessionSearchCriteria = {} as SessionSearchCriteria;
  @ViewChild(SessionsListPdfTemplateComponent, { static: false }) pdfTemplate!: SessionsListPdfTemplateComponent;

  private loader = inject(LoaderService);
  private sessionService: SessionService = inject(SessionService);
  private router = inject(Router);
  private toaster = inject(ToastService);
  private translateService = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  private pdfExportService: PdfExportService = inject(PdfExportService);
  public permissionService: PermissionAccessService = inject(PermissionAccessService);

  destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadSessions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSessions() {
    this.loader.show();
    this.sessionService.getUserSessions(this.currentSearchCriteria).pipe(takeUntil(this.destroy$)).subscribe((sessions) => {
      this.sessions = sessions;
    }, err => { }, () => {
      this.showSearchDialog = false;
      this.loader.hide();
    });
  }

  refreshSessions() {
    this.confirmService.confirm(this.translateService.instant('sessions.confirm.refresh'), () => {
      this.loader.show();
      this.sessionService.refreshSessions().pipe(takeUntil(this.destroy$)).subscribe((success) => {
        this.loadSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
      }, err => { }, () => this.loader.hide());
    }, undefined, 'pi pi-sync text-primary mb-4');

  }

  onRecordAttendance(session: ClassSession) {
    this.router.navigate(['sessions', session.id, 'attendance']);
  }

  updateSession(session: ClassSession) {
    this.sessionToEdit = session;
    this.showSessionForm = true;
  }

  onSessionUpdated() {
    this.showSessionForm = false;
    this.sessionToEdit = null;
    this.loadSessions();
  }

  onSessionFormCancelled() {
    this.showSessionForm = false;
    this.sessionToEdit = null;
  }

  cancelSession(session: ClassSession) {
    this.loader.show();

    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Cancelled).pipe(takeUntil(this.destroy$)).subscribe((success) => {
      if (success) {
        this.loadSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.cancelledSuccessfully'));
      }
    }, err => { }, () => this.loader.hide());
  }

  markCompletedSession(session: ClassSession) {
    this.loader.show();
    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Completed).pipe(takeUntil(this.destroy$)).subscribe((success) => {
      this.loadSessions();
      this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
    }, err => { }, () => this.loader.hide());
  }

  rescheduleSession(session: ClassSession) {
    this.loader.show();

    this.sessionService.updateStatus(session.id!, ClassSessionStatus.Scheduled).pipe(takeUntil(this.destroy$)).subscribe((success) => {
      if (success) {
        this.loadSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
      }
    }, err => { }, () => this.loader.hide());
  }

  onSearch(criteria: SessionSearchCriteria) {
    this.currentSearchCriteria = criteria;
    this.loadSessions();
  }

  onSearchCancel() {
    this.showSearchDialog = false;
    this.currentSearchCriteria = {} as SessionSearchCriteria;
  }

  hasActiveSearch(): boolean {
    return Object.keys(this.currentSearchCriteria).length > 0;
  }

  editSearch() {
    this.showSearchDialog = true;
  }

  clearSearchCriteria() {
    this.currentSearchCriteria = {} as SessionSearchCriteria;
    this.loadSessions();
  }

  removeSearchCriteria(key: string) {
    // Map the translated key back to the property name
    const keyMap: { [key: string]: string } = {
      [this.translateService.instant('shared.labels.startDate')]: 'startDate',
      [this.translateService.instant('shared.labels.endDate')]: 'endDate',
      [this.translateService.instant('shared.labels.startTime')]: 'startTime',
      [this.translateService.instant('shared.labels.endTime')]: 'endTime',
      [this.translateService.instant('courses.one')]: 'courseId',
      [this.translateService.instant('groups.one')]: 'groupId',
      [this.translateService.instant('rooms.one')]: 'roomId',
      [this.translateService.instant('shared.labels.status')]: 'status'
    };

    const propertyName = keyMap[key];
    if (propertyName) {
      // Remove the property from the search criteria
      delete (this.currentSearchCriteria as any)[propertyName];

      // Also remove the corresponding name properties
      if (propertyName === 'courseId') {
        delete (this.currentSearchCriteria as any).courseName;
      } else if (propertyName === 'groupId') {
        delete (this.currentSearchCriteria as any).groupName;
      } else if (propertyName === 'roomId') {
        delete (this.currentSearchCriteria as any).roomName;
      } else if (propertyName === 'status' || propertyName == 'statusName') {
        delete (this.currentSearchCriteria as any).statusName;
      }

      // if all criteria are removed, remove the search criteria
      if (Object.values(this.currentSearchCriteria).find(r => r) === undefined) {
        this.currentSearchCriteria = {} as SessionSearchCriteria;
      }

      // Reload sessions with updated criteria
      this.loadSessions();
    }
  }

  getSearchCriteriaText(): string {
    const criteria: string[] = [];

    if (this.currentSearchCriteria.startDate || this.currentSearchCriteria.endDate) {
      if (this.currentSearchCriteria.startDate) {
        criteria.push(`${this.translateService.instant('shared.labels.startDate')} ${this.currentSearchCriteria.startDate}`);
      }

      if (this.currentSearchCriteria.endDate) {
        criteria.push(`${this.translateService.instant('shared.labels.endDate')} ${this.currentSearchCriteria.endDate}`);
      }
    }

    if (this.currentSearchCriteria.startTime || this.currentSearchCriteria.endTime) {
      if (this.currentSearchCriteria.startTime) {
        criteria.push(`${this.translateService.instant('shared.labels.startTime')} ${TimeHelper.displayTime(this.currentSearchCriteria.startTime)}`);
      }

      if (this.currentSearchCriteria.endTime) {
        criteria.push(`${this.translateService.instant('shared.labels.endTime')} ${TimeHelper.displayTime(this.currentSearchCriteria.endTime)}`);
      }
    }

    if (this.currentSearchCriteria.courseId) {
      criteria.push(`${this.translateService.instant('courses.one')}: ${this.currentSearchCriteria.courseName}`);
    }

    if (this.currentSearchCriteria.groupId) {
      criteria.push(`${this.translateService.instant('groups.one')}: ${this.currentSearchCriteria.groupName}`);
    }

    if (this.currentSearchCriteria.roomId) {
      criteria.push(`${this.translateService.instant('rooms.one')}: ${this.currentSearchCriteria.roomName}`);
    }

    if (this.currentSearchCriteria.status) {
      criteria.push(`${this.translateService.instant('shared.labels.status')}: ${this.currentSearchCriteria.statusName}`);
    }

    return criteria.join(', ');
  }

  getSearchCriteriaItems(): Array<{ key: string, value: string }> {
    const items: Array<{ key: string, value: string }> = [];

    if (this.currentSearchCriteria.startDate) {
      items.push({
        key: this.translateService.instant('shared.labels.startDate'),
        value: this.currentSearchCriteria.startDate
      });
    }

    if (this.currentSearchCriteria.endDate) {
      items.push({
        key: this.translateService.instant('shared.labels.endDate'),
        value: this.currentSearchCriteria.endDate
      });
    }

    if (this.currentSearchCriteria.startTime) {
      items.push({
        key: this.translateService.instant('shared.labels.startTime'),
        value: TimeHelper.displayTime(this.currentSearchCriteria.startTime)
      });
    }

    if (this.currentSearchCriteria.endTime) {
      items.push({
        key: this.translateService.instant('shared.labels.endTime'),
        value: TimeHelper.displayTime(this.currentSearchCriteria.endTime)
      });
    }

    if (this.currentSearchCriteria.courseId) {
      items.push({
        key: this.translateService.instant('courses.one'),
        value: this.currentSearchCriteria.courseName || String(this.currentSearchCriteria.courseId)
      });
    }

    if (this.currentSearchCriteria.groupId) {
      items.push({
        key: this.translateService.instant('groups.one'),
        value: this.currentSearchCriteria.groupName || String(this.currentSearchCriteria.groupId)
      });
    }

    if (this.currentSearchCriteria.roomId) {
      items.push({
        key: this.translateService.instant('rooms.one'),
        value: this.currentSearchCriteria.roomName || String(this.currentSearchCriteria.roomId)
      });
    }

    if (this.currentSearchCriteria.statusName) {
      items.push({
        key: this.translateService.instant('shared.labels.status'),
        value: this.currentSearchCriteria.statusName || String(this.currentSearchCriteria.status)
      });
    }

    return items;
  }

  deleteSession(session: ClassSession) {
    this.loader.show();
    this.sessionService.delete(session.id!).pipe(takeUntil(this.destroy$)).subscribe((success) => {

      if (success) {
        this.loadSessions();
        this.toaster.showSuccess(this.translateService.instant('sessions.deletedSuccessfully'));
      }

    }, err => { }, () => this.loader.hide());
  }

  async exportToPdf() {

    this.confirmService.confirmPrint(async () => {

      try {
        this.loader.show();

        if (!this.pdfTemplate) {
          this.toaster.showError(this.translateService.instant('shared.pdf.error.noContent'));
          return;
        }

        const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const title = this.hasActiveSearch() ? 'filtered' : 'all';
        const subtitle = this.hasActiveSearch() ? this.getSearchCriteriaText() : '';

        const exportInfo = {
          title: title,
          subtitle: subtitle,
          date: currentDate,
          sessionCount: this.sessions.length
        };

        await this.pdfExportService.exportToPdf(
          this.pdfTemplate.pdfContent.nativeElement,
          `${this.translateService.instant('sessions.list.title')}_${exportInfo.date}`, {
          orientation: 'landscape'
        }
        );

        this.toaster.showSuccess(this.translateService.instant('shared.pdf.success'));
      } catch (error) {
        console.error('Error exporting PDF:', error);
        this.toaster.showError(this.translateService.instant('shared.pdf.error.general'));
      } finally {
        this.loader.hide();
      }

    });

  }
} 