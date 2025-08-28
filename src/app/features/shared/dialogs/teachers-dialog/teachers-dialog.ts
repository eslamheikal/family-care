import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Dropdown } from '../../components/dropdown/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { Teacher } from '../../../../core/models/teacher.model';
import { DropdownProps } from '../../props/dropdown.props';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../services/loader.service';
import { DialogButtons } from "../../components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'teachers-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    Dropdown,
    TranslateModule,
    DialogButtons
],
  templateUrl: './teachers-dialog.html',
  styleUrl: './teachers-dialog.scss'
})
export class TeachersDialog {

  @Input() showDialog = false;
  @Input() selectedTeachers: Teacher[] = [];

  @Output() onSave = new EventEmitter<Teacher[]>();
  @Output() onCancel = new EventEmitter<void>();

  teachersForm!: FormGroup;
  teachers: Teacher[] = [];
  teachersOptions: DropdownProps[] = [];
  destroy$ = new Subject<void>();

  private teacherService = inject(TeacherService);
  private fb = inject(FormBuilder);
  private loader = inject(LoaderService);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadTeachers();
  }

  initForm() {
    this.teachersForm = this.fb.group({
      teachers: [[]],
    });
  }

  getFormControl(controlName: string) {
    return this.teachersForm?.get(controlName) as FormControl;
  }

  loadTeachers() {
    this.loader.show();
    this.teacherService.getAll().pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.teachers = items;
      this.teachersOptions = items.map(teacher => ({ label: teacher.name, value: teacher.id }));

      this.cd.detectChanges();
      this.setSelectedTeachers();
      
    }, _ => { }, () => {
      this.loader.hide();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showDialog'] && this.showDialog == true) {
      this.teachersForm?.reset();
    }

    this.setSelectedTeachers();
  }

  setSelectedTeachers() {
    if (this.teachersForm && this.selectedTeachers.length > 0) {
      this.getFormControl('teachers')?.setValue(this.selectedTeachers.map(teacher => teacher.id));
      this.getFormControl('teachers')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.teachersForm.valid) {
      this.onSave.emit(this.teachers.filter(teacher => this.teachersForm.value.teachers.includes(teacher.id)));
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
