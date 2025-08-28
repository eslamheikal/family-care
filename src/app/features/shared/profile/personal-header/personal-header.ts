import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { ConfirmService } from '../../services/confirm.serivce';
import { ProfileHeader } from '../../props/profile.props';

@Component({
  selector: 'personal-header',
  imports: [CommonModule, TranslateModule],
  templateUrl: './personal-header.html',
  styleUrl: './personal-header.scss'
})
export class PersonalHeader {

  @Input() profileHeader: ProfileHeader = {} as ProfileHeader;

  @Input() isEditing: boolean = false;
  @Output() uploadImage = new EventEmitter<Event>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileHeader'] && this.profileHeader) {
      this.profileHeader = changes['profileHeader'].currentValue as ProfileHeader;
    } else {
      this.profileHeader = {} as ProfileHeader;
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  private confirmService = inject(ConfirmService);

  onUploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage.emit(event);
    }
  }

  changeImage() {
    this.confirmService.confirmChangeImage(() => {
      this.fileInput.nativeElement.click();
    });
  }

  getImageUrl(imageUrl: string | null | undefined) {
    return imageUrl || '/assets/icons/avatar-teacher.svg';
  }

  getAge(birthDate: string | null) {
    return birthDate ? DateHelper.getAge(birthDate) : '';
  }
}
