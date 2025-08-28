import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CancelBtn } from '../../../shared/buttons/cancel-btn/cancel-btn';
import { SaveBtn } from '../../../shared/buttons/save-btn/save-btn';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Editor } from '../../../shared/components/editor/editor';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teacher-experience',
  imports: [CommonModule, DialogModule, SaveBtn, CancelBtn, ReactiveFormsModule, Editor, TranslateModule],
  templateUrl: './teacher-experience.html',
  styleUrl: './teacher-experience.scss'
})
export class TeacherExperience {

  //#region Properties
  @Input() teacher: Teacher = {} as Teacher;
  @Input() showDialog = false;

  formControl = new FormControl();
  experienceForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private fb = inject(FormBuilder);
  private teacherService = inject(TeacherService);
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
    if (this.experienceForm && (changes['teacher'] || changes['showDialog'])) {
      this.cdr.detectChanges();
      this.experienceForm.get('experience')?.setValue(this.teacher.experience);
    }
  }

  initForm() {
    this.experienceForm = this.fb.group({
      experience: [''],
    });
  }

  getFormControl(controlName: string) {
    return this.experienceForm.get(controlName) as FormControl;
  }

  save() {

    if (this.experienceForm.valid) {

      this.teacher.experience = this.experienceForm.value.experience == '<p class="ql-align-right"></p>' || this.experienceForm.value.experience == '<p></p>'
        ? '' : this.experienceForm.value.experience;

      this.loader.show();
      this.teacherService.update(this.teacher)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.experienceForm.reset();
            this.toaster.showSuccess(this.translate.instant('shared.labels.experienceSaveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.experienceForm.reset();
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
