import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../../../core/services/student.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { Editor } from '../../../shared/components/editor/editor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogButtons } from "../../../shared/components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'app-student-qualification',
  imports: [CommonModule, DialogModule, ReactiveFormsModule, Editor, TranslateModule, DialogButtons],
  templateUrl: './student-qualification.html',
  styleUrl: './student-qualification.scss'
})
export class StudentQualification {

  //#region Properties
  @Input() student: Student = {} as Student;
  @Input() showDialog = false;

  formControl = new FormControl();
  qualificationForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private toaster = inject(ToastService);
  private loader = inject(LoaderService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  //#endregion

  //#region Methods
  
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.qualificationForm && (changes['student'] || changes['showDialog'])) {
      this.cdr.detectChanges();
      this.qualificationForm.get('qualification')?.setValue(this.student.qualification);
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

      this.student.qualification = this.qualificationForm.value.qualification == '<p class="ql-align-right"></p>' || this.qualificationForm.value.qualification == '<p></p>'
        ? '' : this.qualificationForm.value.qualification;

      this.studentService.update(this.student)
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

