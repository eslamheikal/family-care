import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../../core/services/course.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Course } from '../../../../core/models/course.model';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';

@Component({
  selector: 'app-course-form',
  imports: [
    CommonModule, 
    DialogModule, 
    InputTextModule, 
    ReactiveFormsModule, 
    InputLabel, 
    TranslateModule, 
    DialogButtons
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss'
})
export class CourseForm {

  //#region Properties
  @Input() showDialog = false;
  @Input() course: Course = {} as Course;
  courseForm!: FormGroup;
  destroy$ = new Subject<void>();

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private courseService = inject(CourseService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  //#endregion

  //#region Methods
  constructor() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['showDialog'] && !this.course.id) {
      this.courseForm?.reset();
    }

    if (changes['course'] && this.course.id > 0) {
      this.cdr.detectChanges();
      this.courseForm?.patchValue(this.course);
    }

  }

  initForm() {
    this.courseForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  hasId() {
    return this.courseForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.courseForm.get(name) as FormControl;
  }

  save() {
    if (this.courseForm.valid) {
      this.loader.show();
      const courseData = this.courseForm.value as Course;
      courseData.id = 0;
      this.courseService.add(courseData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.courseForm.reset();
            this.toaster.showSuccess(this.translate.instant('courses.saveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.courseForm.valid) {
      this.loader.show();
      const courseData = this.courseForm.value as Course;
      this.courseService.update(courseData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.courseForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess(this.translate.instant('courses.updateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.courseForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.courseForm.reset();
    this.courseForm.get('id')?.setValue(0);
    this.showDialog = true;
  }

  onEdit(event: Course) {
    this.courseForm.patchValue(event);
    this.showDialog = true;
  }

  onActivate(event: Course) {
    this.courseService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess(this.translate.instant('courses.activateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Course) {
    this.courseService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess(this.translate.instant('courses.deactivateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion


}
