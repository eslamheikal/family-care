import { Component, inject, Input } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { CommonModule } from '@angular/common';
import { ViewIconButton } from '../../../shared/buttons/view-icon-button/view-icon-button';
import { DownloadIconButton } from '../../../shared/buttons/download-icon-button/download-icon-button';
import { DeleteIconButton } from '../../../shared/buttons/delete-icon-button/delete-icon-button';
import { Attachment } from '../../../../core/models/attachment.model';
import { TeacherService } from '../../../../core/services/teacher.service';
import { AttachmentHelper } from '../../../../core/helpers/attachmet-helper';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teacher-attachment',
  imports: [CommonModule, DeleteIconButton, DownloadIconButton, ViewIconButton],
  templateUrl: './teacher-attachment.html',
  styleUrl: './teacher-attachment.scss'
})
export class TeacherAttachmentComponent {

  @Input() teacher!: Teacher;

  deleteAttachment!: Attachment;
  showDelete: boolean = false;

  //#region Services
  private teacherService = inject(TeacherService);
  private loaderService = inject(LoaderService);
  private toastr = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private translate = inject(TranslateService);
  public permissionService = inject(PermissionAccessService);
  //#endregion


  onDownloadAttachment(attachment: Attachment): void {

    this.confirmService.confirmDownload(() => {
      const url = this.teacherService.getDownloadAttachment(attachment.fileName);
      window.open(url, '_blank');
    });

  }  

  onViewAttachment(attachment: Attachment) {

    this.confirmService.confirmView(() => {
      let url = this.teacherService.getViewAttachmentUrl(attachment.fileName);
      window.open(url, '_blank');
    });

  }

  getAttachmentIcon(attachment: Attachment) {
    return AttachmentHelper.getIcon(attachment.fileName);
  }

  onDeleteAttachment(attachment: Attachment) {

    this.confirmService.confirmDelete(() => {
      this.deleteAttachment = attachment;
      this.onDeleteConfirm();
    });

  }

  onDeleteConfirm() {
    this.loaderService.show();
    this.teacherService.deleteAttachment(this.deleteAttachment.id).subscribe(res => {
      if (res) {
        this.showDelete = false;
        this.teacher.attachments = this.teacher.attachments.filter(a => a.id !== this.deleteAttachment.id);
        this.toastr.showSuccess(this.translate.instant('shared.messages.deletedSuccessfully'));
      }
    },_ => {},
    () => this.loaderService.hide());
  }

  displayDate(date: string) {
    return DateHelper.displayDate(date);
  }

}
