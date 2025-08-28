import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { Student } from '../../../../core/models/student.model';
import { Subject, takeUntil } from 'rxjs';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { StudentService } from '../../../../core/services/student.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { DialogButtons } from "../../../shared/components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, DialogModule, InputTextModule, ReactiveFormsModule, InputLabel, LabelDatePicker, Dropdown, TranslateModule, DialogButtons],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentFormComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() student: Student = {} as Student;
  studentForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;
  groupsOptions: DropdownProps[] = [];

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  genderOptions: DropdownProps[] = GenderHelper.getOptions();
  //#endregion

  //#region Services
  private studentService = inject(StudentService);
  private loader = inject(LoaderService);
  private toaster = inject(ToastService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  public permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Methods
  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['showDialog'] && (!this.student.id || this.student.id === 0)) {
      this.requiredPassword = true;
      this.studentForm?.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm?.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm?.reset();
    }
    
    if (this.studentForm && changes['student'] && this.student.id > 0) {
      this.requiredPassword = false;
      
      this.studentForm.get('password')?.removeValidators([Validators.required, Validators.minLength(8)]);
      this.studentForm.get('confirmPassword')?.removeValidators([Validators.required, Validators.minLength(8)]);
      
      // Update validation state after removing validators
      this.studentForm.get('password')?.updateValueAndValidity();
      this.studentForm.get('confirmPassword')?.updateValueAndValidity();
      
      this.studentForm.patchValue(this.student);

      this.studentForm.get('joinedDate')?.setValue(DateHelper.toDatePicker(this.student.joinedDate));
      this.studentForm.get('birthDate')?.setValue(DateHelper.toDatePicker(this.student.birthDate));

      this.studentForm.markAllAsTouched();
    }

  }

  initForm() {
    this.studentForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', [Validators.required]],
      joinedDate: [''],
      birthDate: [''],
      groups: [[]]
    });
  }

  hasId() {
    return this.studentForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.studentForm.get(name) as FormControl;
  }

  save() {
    if (this.studentForm.get('password')?.value !== this.studentForm.get('confirmPassword')?.value) {
      this.toaster.showError(this.translate.instant('shared.validation.passwordMismatch'));
      return;
    }

    if (this.studentForm.valid) {
      this.loader.show();

      const studentData = this.studentForm.value as Student;
      studentData.id = 0;
      studentData.role = UserRoleEnum.FamilyParent;
      studentData.joinedDate = DateHelper.toDateOnly(studentData.joinedDate);
      studentData.birthDate = DateHelper.toDateOnly(studentData.birthDate);

      studentData.dailySchedules = [];

      this.studentService.add(studentData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.studentForm.reset();
            this.toaster.showSuccess(this.translate.instant('students.saveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.studentForm.valid) {
      this.loader.show();
      const studentData = { ...this.student, ...this.studentForm.value } as Student;
      studentData.joinedDate = DateHelper.toDateOnly(studentData.joinedDate);
      studentData.birthDate = DateHelper.toDateOnly(studentData.birthDate);

      studentData.dailySchedules = [];
      this.studentService.update(studentData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.studentForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess(this.translate.instant('students.updateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.studentForm.reset();
    this.onCancel.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
