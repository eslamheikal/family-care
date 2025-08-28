import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Dropdown } from '../../components/dropdown/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { Student } from '../../../../core/models/student.model';
import { DropdownProps } from '../../props/dropdown.props';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../../../core/services/student.service';
import { LoaderService } from '../../services/loader.service';
import { DialogButtons } from "../../components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'students-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Dropdown,
    TranslateModule,
    DialogButtons
],
  templateUrl: './students-dialog.html',
  styleUrl: './students-dialog.scss'
})
export class StudentsDialog {

  @Input() showDialog = false;
  @Input() selectedStudents: Student[] = [];

  @Output() onSave = new EventEmitter<Student[]>();
  @Output() onCancel = new EventEmitter<void>();

  studentsForm!: FormGroup;
  students: Student[] = [];
  studentsOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadStudents();
  }

  initForm() {
    this.studentsForm = this.fb.group({
      students: [[]],
    });
  }

  getFormControl(controlName: string) {
    return this.studentsForm.get(controlName) as FormControl;
  }

  loadStudents() {
    this.loader.show();
    this.studentService.getAll().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.students = items;
      this.studentsOptions = items.map(student => ({ label: student.name, value: student.id }));

      this.cd.detectChanges();
      this.setSelectedStudents();

    }, _ => { }, () => {
      this.loader.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog == true) {
      this.studentsForm.reset();
    }

    this.setSelectedStudents();
  }

  setSelectedStudents() {
    if (this.studentsForm && this.selectedStudents.length > 0) {
      this.getFormControl('students')?.setValue(this.selectedStudents.map(student => student.id));
      this.getFormControl('students')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.studentsForm.valid) {
      this.onSave.emit(this.students.filter(student => this.studentsForm.value.students.includes(student.id)));
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
