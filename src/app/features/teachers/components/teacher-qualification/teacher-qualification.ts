import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor } from '../../../shared/components/editor/editor';
import { Subject, takeUntil } from 'rxjs';
import { Teacher } from '../../../../core/models/teacher.model';
import { TeacherService } from '../../../../core/services/teacher.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teacher-qualification',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, ReactiveFormsModule, Editor, TranslateModule],
  templateUrl: './teacher-qualification.html',
  styleUrl: './teacher-qualification.scss'
})
export class TeacherQualification {

  //#region Properties
  @Input() teacher: Teacher = {} as Teacher;
  @Input() showDialog = false;

  formControl = new FormControl();
  qualificationForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  private teacherService = inject(TeacherService);
  private toaster = inject(ToastService);
  private loader = inject(LoaderService);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  //#endregion

  //#region Methods
  
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.qualificationForm && (changes['teacher'] || changes['showDialog'])) {
      this.cdr.detectChanges();
      this.qualificationForm.get('qualification')?.setValue(this.teacher.qualification);
    }
  }

  initForm() {
    this.qualificationForm = this.fb.group({
      qualification: [''],
    });
  }

  getFormControl(controlName: string) {
    return this.qualificationForm.get(controlName) as FormControl;
  }

  save() {

    if (this.qualificationForm.valid) {

      this.teacher.qualification = this.qualificationForm.value.qualification == '<p class="ql-align-right"></p>' || this.qualificationForm.value.qualification == '<p></p>'
        ? '' : this.qualificationForm.value.qualification;

      this.loader.show();
      this.teacherService.update(this.teacher)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.qualificationForm.reset();
            this.toaster.showSuccess(this.translate.instant('shared.messages.qualificationsSaveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.qualificationForm.reset();
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
