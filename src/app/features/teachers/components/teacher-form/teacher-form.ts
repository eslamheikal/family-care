import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject, takeUntil } from 'rxjs';
import { TeacherService } from '../../../../core/services/teacher.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { DialogButtons } from "../../../shared/components/dialog-buttons/dialog-buttons";

@Component({
  selector: 'app-teacher-form',
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, InputLabel, LabelDatePicker, Dropdown, TranslateModule, DialogButtons],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss'
})
export class TeacherFormComponent {

  //#region Properties
  @Input() showDialog = false;
  @Input() teacher: Teacher = {} as Teacher;
  teacherForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  genderOptions: DropdownProps[] = GenderHelper.getOptions();
  //#endregion

  //#region Services
  private teacherService = inject(TeacherService);
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

    if (changes['showDialog'] && !this.teacher.id) {
      this.requiredPassword = true;
      this.teacherForm?.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm?.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm?.reset();

      return;
    }

    else if (this.teacherForm && changes['teacher'] && this.teacher.id > 0) {
      this.requiredPassword = false;

      this.teacherForm.get('password')?.removeValidators([Validators.required, Validators.minLength(8)]);
      this.teacherForm.get('confirmPassword')?.removeValidators([Validators.required, Validators.minLength(8)]);

      // Update validation state after removing validators
      this.teacherForm.get('password')?.updateValueAndValidity();
      this.teacherForm.get('confirmPassword')?.updateValueAndValidity();

      this.teacherForm.markAllAsTouched();
    }

    this.teacherForm?.patchValue(this.teacher);

    this.teacherForm?.get('joinedDate')?.setValue(this.teacher.joinedDate ? new Date(this.teacher.joinedDate) : null);
    this.teacherForm?.get('birthDate')?.setValue(this.teacher.birthDate ? new Date(this.teacher.birthDate) : null);

    this.teacherForm?.get('password')?.valueChanges.subscribe(value => {
      this.requiredPassword = value?.length > 0;
      });

    this.teacherForm?.get('confirmPassword')?.valueChanges.subscribe(value => {
      this.requiredPassword = value?.length > 0;
    });
  }

  initForm() {
    this.teacherForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['', [Validators.required]],
      joinedDate: [''],
      birthDate: ['']
    });
  }

  hasId() {
    return this.teacherForm.get('id')?.value;
  }

  getFormControl(name: string) {
    return this.teacherForm.get(name) as FormControl;
  }

  save() {
    if (this.teacherForm.get('password')?.value !== this.teacherForm.get('confirmPassword')?.value) {
      this.toaster.showError(this.translate.instant('shared.validation.passwordMismatch'));
      return;
    }

    if (this.teacherForm.valid) {
      this.loader.show();

      const teacherData = this.teacherForm.value as Teacher;
      teacherData.id = 0;
      teacherData.role = UserRoleEnum.FamilyParent;
      teacherData.joinedDate = teacherData.joinedDate ? DateHelper.toOldDatePicker(teacherData.joinedDate) : null;
      teacherData.birthDate = teacherData.birthDate ? DateHelper.toOldDatePicker(teacherData.birthDate) : null;

      this.teacherService.add(teacherData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.onSave.emit();
            this.teacherForm.reset();
            this.toaster.showSuccess(this.translate.instant('teachers.saveSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  update() {
    if (this.teacherForm.valid) {
      this.loader.show();
      const teacherData = { ...this.teacher, ...this.teacherForm.value } as Teacher;
      teacherData.joinedDate = teacherData.joinedDate ? DateHelper.toOldDatePicker(teacherData.joinedDate) : null;
      teacherData.birthDate = teacherData.birthDate ? DateHelper.toOldDatePicker(teacherData.birthDate) : null;

      this.teacherService.update(teacherData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.teacherForm.reset();
            this.onSave.emit();
            this.toaster.showSuccess(this.translate.instant('teachers.updateSuccess'));
          }
        }, _ => { }, () => this.loader.hide());
    }
  }

  cancel() {
    this.teacherForm.reset();
    this.onCancel.emit();
  }

  onAdd() {
    this.teacherForm.reset();
    this.teacherForm.get('id')?.setValue(0);
    this.showDialog = true;
    // Ensure form validation is updated
    this.teacherForm.updateValueAndValidity();
  }

  onEdit(event: Teacher) {
    this.teacherForm.patchValue(event);
    this.showDialog = true;
    // Ensure form validation is updated after patching values
    this.teacherForm.updateValueAndValidity();
  }

  onActivate(event: Teacher) {
    this.teacherService.activate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess(this.translate.instant('teachers.activateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  onDeactivate(event: Teacher) {
    this.teacherService.deactivate(event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.onSave.emit();
          this.toaster.showSuccess(this.translate.instant('teachers.deactivateSuccess'));
        }
      }, _ => { }, () => this.loader.hide());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

}
