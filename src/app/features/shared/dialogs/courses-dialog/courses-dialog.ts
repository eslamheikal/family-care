import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownProps } from '../../props/dropdown.props';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../../core/services/course.service';
import { LoaderService } from '../../services/loader.service';
import { Course } from '../../../../core/models/course.model';
import { TranslateModule } from '@ngx-translate/core';
import { Dropdown } from '../../components/dropdown/dropdown';
import { DialogButtons } from "../../components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'courses-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Dropdown,
    TranslateModule,
    DialogButtons
],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss'
})
export class CoursesDialog {

  @Input() showDialog = false;
  @Input() selectedCourses: Course[] = [];

  @Output() onSave = new EventEmitter<Course[]>();
  @Output() onCancel = new EventEmitter<void>();

  coursesForm!: FormGroup;
  courses: Course[] = [];
  coursesOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadCourses();
  }

  initForm() {
    this.coursesForm = this.fb.group({
      courses: [[]],
    });
  }

  getFormControl(controlName: string) {
    return this.coursesForm.get(controlName) as FormControl;
  }

  loadCourses() {
    this.loader.show();
    this.courseService.getAll().pipe(takeUntil(this.destroy$)).subscribe(items => {
      
      this.courses = items;
      this.coursesOptions = items.map(course => ({ label: course.name, value: course.id }));
      
      this.cdr.detectChanges();
      this.setSelectedCourses();

    }, _ => { }, () => {
      this.loader.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.coursesForm && changes['showDialog'] && this.showDialog == true) {
      this.coursesForm.reset();
    }

    this.setSelectedCourses();
  }

  setSelectedCourses() {
    if (this.coursesForm && this.selectedCourses.length > 0) {
      this.getFormControl('courses')?.setValue(this.selectedCourses.map(course => course.id));
      this.getFormControl('courses')?.updateValueAndValidity();
      this.getFormControl('courses')?.markAsTouched();
    }
  }

  save() {
    if (this.coursesForm.valid) {
      this.onSave.emit(this.courses.filter(course => this.coursesForm.value.courses.includes(course.id)));
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
