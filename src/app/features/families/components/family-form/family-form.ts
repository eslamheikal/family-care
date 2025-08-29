import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

// Shared Components
import { InputLabel } from '../../../shared/components/input-label/input-label';
import { LabelDatePicker } from '../../../shared/components/label-date-picker/label-date-picker';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { DialogButtons } from '../../../shared/components/dialog-buttons/dialog-buttons';

// Translation
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Models
import { Family } from '../../../../core/models/family.model';
import { FamilyMember } from '../../../../core/models/family-member.model';

// Services
import { FamilyService } from '../../../../core/services/family.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';

// Helpers & Props
import { DateHelper } from '../../../../core/helpers/date.helper';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';
import { GenderEnum, GenderService } from '../../../../core/enums/gender.enum';
import { PermissionService } from '../../../../core/authorization/permission.service';

// Constants
const FORM_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_MIN_LENGTH: 5
} as const;

@Component({
  selector: 'app-family-form',
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    InputLabel,
    LabelDatePicker,
    Dropdown,
    TranslateModule,
    DialogButtons,
    InputNumberModule
  ],
  templateUrl: './family-form.html',
  styleUrl: './family-form.scss'
})
export class FamilyForm implements OnInit, OnChanges, OnDestroy {

  //#region Inputs & Outputs
  @Input() showDialog = false;
  @Input() family: Family = {} as Family;
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  
  //#region Services
  private readonly familyService = inject(FamilyService);
  private readonly loader = inject(LoaderService);
  private readonly toaster = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly genderService = inject(GenderService);
  public readonly permissionService = inject(PermissionService);
  //#endregion

  //#region Properties
  familyForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;
  passwordMismatch = false;
  genderOptions: DropdownProps[] = this.genderService.getOptions();
  //#endregion


  //#region Lifecycle Methods
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.familyForm) {
      this.handleFormChanges(changes);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Form Initialization
  private initializeForm(): void {
    this.familyForm = this.createFormGroup();
    this.setupDynamicFamilyName();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      familyName: ['', [Validators.required, Validators.minLength(FORM_CONFIG.NAME_MIN_LENGTH)]],
      familyResponsible: ['', [Validators.required, Validators.minLength(FORM_CONFIG.NAME_MIN_LENGTH)]],
      gender: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(FORM_CONFIG.PHONE_MIN_LENGTH)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]],
      isActive: [true]
    });
  }

  private setupDynamicFamilyName(): void {
    if (this.familyForm) {
      this.familyForm.get('familyResponsible')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          const familyName = value ? this.generateFamilyName(value) : '';
          this.familyForm?.get('familyName')?.setValue(familyName, { emitEvent: false });
        });
    }
  }
  //#endregion

  //#region Form Change Handlers
  private handleFormChanges(changes: SimpleChanges): void {
    if (this.shouldHandleShowDialogChange(changes)) {
      this.handleShowDialogChange();
      return;
    }

    if (this.shouldHandleFamilyChange(changes)) {
      this.handleFamilyChange();
    }

    this.patchFormValues();
    this.setupPasswordValidation();
  }

  private shouldHandleShowDialogChange(changes: SimpleChanges): boolean {
    return changes['showDialog'] && !this.family.id;
  }

  private shouldHandleFamilyChange(changes: SimpleChanges): boolean {
    return !!this.familyForm && changes['family'] && this.family.id > 0;
  }

  private handleShowDialogChange(): void {
    this.requiredPassword = true;
    this.setPasswordValidators(true);
    this.familyForm?.reset();
    this.clearPasswordMismatch();
  }

  private handleFamilyChange(): void {
    this.requiredPassword = false;
    this.setPasswordValidators(false);
    this.familyForm?.markAllAsTouched();
  }

  private setPasswordValidators(required: boolean): void {
    const passwordValidators = required
      ? [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]
      : [];

    this.familyForm?.get('password')?.setValidators(passwordValidators);
    this.familyForm?.get('confirmPassword')?.setValidators(passwordValidators);

    this.familyForm?.get('password')?.updateValueAndValidity();
    this.familyForm?.get('confirmPassword')?.updateValueAndValidity();
  }

  private patchFormValues(): void {
    if (this.familyForm && this.family) {
      // Map Family model to form structure
      const formData = {
        id: this.family.id,
        familyName: this.family.familyName,
        familyResponsible: this.family.familyResponsible?.name || '',
        gender: this.family.familyResponsible?.gender as GenderEnum,
        birthDate: this.family.familyResponsible?.birthDate ? new Date(this.family.familyResponsible.birthDate) : null,
        phoneNumber: this.family.familyResponsible?.phoneNumber || '',
        email: this.family.familyResponsible?.email || '',
        password: '',
        confirmPassword: '',
        isActive: this.family.isActive
      };
      
      this.familyForm.patchValue(formData);
      this.setJoinedDate();
      this.generateFamilyNameFromExisting();
    }
  }

  private setJoinedDate(): void {
    const joinedDate = this.family.joinedDate ? new Date(this.family.joinedDate) : null;
    this.familyForm?.get('joinedDate')?.setValue(joinedDate);
  }

  private generateFamilyNameFromExisting(): void {
    if (this.family.id > 0 && this.family.familyResponsible?.name && this.familyForm) {
      const familyName = this.generateFamilyName(this.family.familyResponsible.name);
      this.familyForm.get('familyName')?.setValue(familyName, { emitEvent: false });
    }
  }

  private setupPasswordValidation(): void {
    if (this.familyForm && this.family.id > 0) {
      this.familyForm.get('password')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          // Only set required password for new records, not for edit mode
          if (this.family.id === 0) {
            this.requiredPassword = value?.length > 0;
          }
          this.checkPasswordMatch();
        });

      this.familyForm.get('confirmPassword')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          // Only set required password for new records, not for edit mode
          if (this.family.id === 0) {
            this.requiredPassword = value?.length > 0;
          }
          this.checkPasswordMatch();
        });
    } else {
      this.requiredPassword = false;
      this.setPasswordValidators(false);
    }
  }

  private checkPasswordMatch(): void {
    const password = this.familyForm?.get('password')?.value;
    const confirmPassword = this.familyForm?.get('confirmPassword')?.value;

    // For edit mode, only check mismatch if both fields have values
    if (this.family.id > 0) {
      if (password && confirmPassword) {
        this.passwordMismatch = password !== confirmPassword;
      } else if ((password && !confirmPassword) || (!password && confirmPassword)) {
        this.passwordMismatch = true;
      } else {
        this.passwordMismatch = false;
      }
    } else {
      // For new records, check as before
      if (password && confirmPassword) {
        this.passwordMismatch = password !== confirmPassword;
      } else {
        this.passwordMismatch = false;
      }
    }
  }
  //#endregion

  //#region Utility Methods
  private generateFamilyName(fullName: string): string {
    if (!fullName || typeof fullName !== 'string') {
      return '';
    }

    const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);

    if (nameParts.length === 0) {
      return '';
    }

    if (nameParts.length === 1) { 
      return nameParts[0];
    }

    if (nameParts.length === 2) {
      return `${nameParts[0]} ${nameParts[1]}`;
    }

    return `${nameParts[0]} ${nameParts[1]} ${nameParts[nameParts.length - 1]}`;
  }

  private createFamilyMember(formValue: any): FamilyMember {
    return {
      id: 0,
      name: formValue.familyResponsible,
      gender: formValue.gender,
      relation: formValue.relation,
      birthDate: DateHelper.toDateOnly(formValue.birthDate),
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      password: formValue.password,
      isActive: formValue.isActive,
      role: UserRoleEnum.FamilyParent
    };
  }

  private createFamilyData(formValue: any, isUpdate = false): Family {
    const familyMember = isUpdate
      ? { ...this.family.familyResponsible, ...this.createFamilyMember(formValue) }
      : this.createFamilyMember(formValue);

    // For edit mode, preserve existing password if no new password is provided
    if (isUpdate && (!formValue.password || formValue.password.trim() === '')) {
      familyMember.password = this.family.familyResponsible?.password || '';
    }

    return {
      id: isUpdate ? this.family.id : 0,
      familyName: formValue.familyName,
      familyResponsible: familyMember,
      isActive: isUpdate ? formValue.isActive : true, 
      joinedDate: isUpdate ? this.family.joinedDate : DateHelper.getCurrentDate(),
      code: isUpdate ? this.family.code : '',
      membersNumber: isUpdate ? this.family.membersNumber : 0
    } as Family;
  }

  private validatePasswords(): boolean {
    const password = this.familyForm?.get('password')?.value;
    const confirmPassword = this.familyForm?.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  private validatePasswordsForEdit(): boolean {
    const password = this.familyForm?.get('password')?.value;
    const confirmPassword = this.familyForm?.get('confirmPassword')?.value;

    // If both password fields are empty, no validation needed (keeping existing password)
    if (!password && !confirmPassword) {
      return true;
    }

    // If only one field is filled, validation fails
    if ((password && !confirmPassword) || (!password && confirmPassword)) {
      return false;
    }

    // If both fields are filled, they must match
    return password === confirmPassword;
  }

  private handleSuccess(messageKey: string): void {
    this.onSave.emit();
    this.familyForm?.reset();
    this.toaster.showSuccess(this.translate.instant(messageKey));
  }
  //#endregion

  //#region Public Methods
  hasId(): boolean {
    return this.familyForm?.get('id')?.value;
  }

  getFormControl(name: string): FormControl {
    return this.familyForm?.get(name) as FormControl;
  }

  save(): void {
    if (!this.familyForm?.valid) {
      return;
    }

    if (!this.validatePasswords()) {
      this.passwordMismatch = true;
      return;
    }

    this.loader.show();
    const formValue = this.familyForm.value;
    const familyData = this.createFamilyData(formValue, false);

    this.familyService.add(familyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.handleSuccess('familys.saveSuccess');
          }
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }

  update(): void {
    if (!this.familyForm?.valid) {
      return;
    }

    // Skip password validation for edit mode
    if (this.family.id > 0 && !this.validatePasswordsForEdit()) {
      this.passwordMismatch = true;
      return;
    }

    this.loader.show();
    const formValue = this.familyForm.value;
    const familyData = this.createFamilyData(formValue, true);

    this.familyService.update(familyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.handleSuccess('familys.updateSuccess');
          }
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }

  cancel(): void {
    this.familyForm?.reset();
    this.onCancel.emit();
    this.clearFamilyName();
    this.clearPasswordMismatch();
  }

  onAdd(): void {
    this.familyForm?.reset();
    this.familyForm?.get('id')?.setValue(0);
    this.showDialog = true;
    this.familyForm?.updateValueAndValidity();
    this.clearFamilyName();
    this.clearPasswordMismatch();
  }

  onEdit(event: Family): void {
    this.familyForm?.patchValue(event);
    this.showDialog = true;
    this.familyForm?.updateValueAndValidity();

    if (event.familyResponsible?.name) {
      const familyName = this.generateFamilyName(event.familyResponsible.name);
      this.familyForm?.get('familyName')?.setValue(familyName, { emitEvent: false });
    }
  }

  private clearFamilyName(): void {
    this.familyForm?.get('familyName')?.setValue('', { emitEvent: false });
  }

  private clearPasswordMismatch(): void {
    this.passwordMismatch = false;
  }
  //#endregion
}
