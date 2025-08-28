import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { ClassSession } from '../../../../core/models/class-session.model';
import { SessionService } from '../../../../core/services/session.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ConfirmService } from '../../../shared/services/confirm.serivce';

// Shared Components
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { LabelTimePicker } from '../../../shared/components/label-time-picker/label-time-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { ToastService } from '../../../shared/services/toast.service';
import { StatusService } from '../../../../core/services/status.service';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';

@Component({
  selector: 'session-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LabelDatePicker,
    LabelTimePicker,
    DialogButtons,
    Dropdown
  ],
  templateUrl: './session-form.html',
  styleUrl: './session-form.scss'
})
export class SessionForm implements OnInit, OnDestroy {
  @Input() showDialog = false;
  @Input() session: ClassSession | null = null;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();



  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private loader = inject(LoaderService);
  private confirmService = inject(ConfirmService);
  private translateService = inject(TranslateService);
  private cd = inject(ChangeDetectorRef);
  private toaster = inject(ToastService);
  private statusService = inject(StatusService);

  sessionForm!: FormGroup;
  teachersOptions: DropdownProps[] = [];
  roomsOptions: DropdownProps[] = [];
  coursesOptions: DropdownProps[] = [];
  groupsOptions: DropdownProps[] = [];
  statusOptions: DropdownProps[] = this.statusService.getSessionStatusOptions();
  destroy$ = new Subject<void>();

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadLookups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog) {
      this.sessionForm.reset();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.sessionForm = this.fb.group({
      id: [0],
      date: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      teacherId: [0, Validators.required],
      roomId: [0, Validators.required],
    });
  }


  private loadLookups() {
    this.loader.show();

    this.sessionService.getLookups(this.session!.courseId!).pipe(takeUntil(this.destroy$)).subscribe(lookups => {
      this.teachersOptions = lookups.teachers.map(teacher => ({ label: teacher.name, value: teacher.id }));
      this.roomsOptions = lookups.rooms.map(room => ({ label: room.name, value: room.id }));

      this.cd.detectChanges();

      const sessionForForm = { ...this.session } as any;
      sessionForForm.startTime = TimeHelper.toTimePicker(sessionForForm.startTime);
      sessionForForm.endTime = TimeHelper.toTimePicker(sessionForForm.endTime);
      sessionForForm.date = DateHelper.toDatePicker(sessionForForm.date);

      this.sessionForm.patchValue(sessionForForm);

    }, error => { }, () => this.loader.hide());

  }

  getFormControl(controlName: string): FormControl {
    return this.sessionForm.get(controlName) as FormControl;
  }

  hasId(): boolean {
    return this.sessionForm.get('id')?.value > 0;
  }

  save() {
    if (this.sessionForm.valid) {
      const sessionData: ClassSession = { ...this.sessionForm.value };

      sessionData.scheduleId = this.session!.scheduleId;
      sessionData.date = DateHelper.toDateOnly(sessionData.date);
      sessionData.startTime = TimeHelper.toTimeOnly(sessionData.startTime);
      sessionData.endTime = TimeHelper.toTimeOnly(sessionData.endTime);

      this.loader.show();
      this.sessionService.updateSession(sessionData).pipe(
        takeUntil(this.destroy$)
      ).subscribe(res => {
        if (res) {
          this.toaster.showSuccess(this.translateService.instant('sessions.updatedSuccessfully'));
          this.onSave.emit();
        }
      }, error => { }, () => this.loader.hide());
    }
  }

  cancel() {
    if (this.sessionForm.dirty) {
      this.confirmService.confirm(
        this.translateService.instant('shared.dialogs.unsavedChanges'),
        () => {
          this.onCancel.emit();
        }
      );
    } else {
      this.onCancel.emit();
    }
  }
}
