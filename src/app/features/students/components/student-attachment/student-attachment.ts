import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DeleteIconButton } from '../../../shared/buttons/delete-icon-button/delete-icon-button';
import { DownloadIconButton } from '../../../shared/buttons/download-icon-button/download-icon-button';
import { ViewIconButton } from '../../../shared/buttons/view-icon-button/view-icon-button';
import { Student } from '../../../../core/models/student.model';
import { Attachment } from '../../../../core/models/attachment.model';
import { StudentService } from '../../../../core/services/student.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AttachmentHelper } from '../../../../core/helpers/attachmet-helper';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

@Component({
  selector: 'app-student-attachment',
  imports: [CommonModule, DeleteIconButton, DownloadIconButton, ViewIconButton],
  templateUrl: './student-attachment.html',
  styleUrl: './student-attachment.scss'
})
export class StudentAttachmentComponent {

  @Input() student!: Student;

  deleteAttachment!: Attachment;
  $destroy$ = new Subject<void>();
  
  //#region Services
  private studentService = inject(StudentService);
  private loaderService = inject(LoaderService);
  private toastr = inject(ToastService);
  private translateService = inject(TranslateService);
  private confirmService = inject(ConfirmService);
  public permissionService = inject(PermissionAccessService);
  //#endregion
  
  deleteMessage: string = this.translateService.instant('shared.dialogs.deleteConfirmation');

  ngOnDestroy(): void {
    this.$destroy$.next();
    this.$destroy$.complete();
  }

  onDownloadAttachment(attachment: Attachment): void {

    this.confirmService.confirmDownload(() => {
      const url = this.studentService.getDownloadAttachment(attachment.fileName);
      window.open(url, '_blank');
    });

  }  

  onViewAttachment(attachment: Attachment) {

    this.confirmService.confirmView(() => {

      let url = this.studentService.getViewAttachmentUrl(attachment.fileName);
    
      window.open(url, '_blank');

    });

  }

  getAttachmentIcon(attachment: Attachment) {
    return AttachmentHelper.getIcon(attachment.fileName);
  }

  onDeleteAttachment(attachment: Attachment) {
    this.deleteAttachment = attachment;
    this.confirmService.confirmDelete(() => {
      this.onDeleteConfirm();
    });
  }

  onDeleteConfirm() {
    this.loaderService.show();
    this.studentService.deleteAttachment(this.deleteAttachment.id).pipe(takeUntil(this.$destroy$)).subscribe(res => {
      if (res) {
        this.student.attachments = this.student.attachments.filter(a => a.id !== this.deleteAttachment.id);
        this.toastr.showSuccess(this.translateService.instant('shared.messages.deletedSuccessfully'));
      }
    },_ => {},
    () => this.loaderService.hide());
  }


  displayDate(date: string) {
    return DateHelper.displayDate(date);
  }

}
