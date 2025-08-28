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
import { PermissionAccessService } from '../../../../core/services/permission-access.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';

// Helpers & Props
import { DateHelper } from '../../../../core/helpers/date.helper';
import { GenderHelper } from '../../../../core/helpers/gender.helper';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { UserRoleEnum } from '../../../../core/enums/user-role.enum';

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

  //#region Properties
  familyForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;
  genderOptions: DropdownProps[] = GenderHelper.getOptions();
  //#endregion

  //#region Services
  private readonly familyService = inject(FamilyService);
  private readonly loader = inject(LoaderService);
  private readonly toaster = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  public readonly permissionAccess = inject(PermissionAccessService);
  //#endregion

  //#region Lifecycle Methods
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleFormChanges(changes);
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
    this.familyForm.get('familyResponsible')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const familyName = value ? this.generateFamilyName(value) : '';
        this.familyForm.get('familyName')?.setValue(familyName, { emitEvent: false });
      });
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
    return this.familyForm && changes['family'] && this.family.id > 0;
  }

  private handleShowDialogChange(): void {
    this.requiredPassword = true;
    this.setPasswordValidators(true);
    this.familyForm?.reset();
  }

  private handleFamilyChange(): void {
    this.requiredPassword = false;
    this.setPasswordValidators(false);
    this.familyForm.markAllAsTouched();
  }

  private setPasswordValidators(required: boolean): void {
    const passwordValidators = required 
      ? [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]
      : [];
    
    this.familyForm.get('password')?.setValidators(passwordValidators);
    this.familyForm.get('confirmPassword')?.setValidators(passwordValidators);
    
    this.familyForm.get('password')?.updateValueAndValidity();
    this.familyForm.get('confirmPassword')?.updateValueAndValidity();
  }

  private patchFormValues(): void {
    this.familyForm?.patchValue(this.family);
    this.setJoinedDate();
    this.generateFamilyNameFromExisting();
  }

  private setJoinedDate(): void {
    const joinedDate = this.family.joinedDate ? new Date(this.family.joinedDate) : null;
    this.familyForm?.get('joinedDate')?.setValue(joinedDate);
  }

  private generateFamilyNameFromExisting(): void {
    if (this.family.id > 0 && this.family.familyResponsible?.name) {
      const familyName = this.generateFamilyName(this.family.familyResponsible.name);
      this.familyForm?.get('familyName')?.setValue(familyName, { emitEvent: false });
    }
  }

  private setupPasswordValidation(): void {
    this.familyForm?.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.requiredPassword = value?.length > 0;
      });

    this.familyForm?.get('confirmPassword')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.requiredPassword = value?.length > 0;
      });
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
    
    return nameParts.length === 1 ? nameParts[0] : nameParts[nameParts.length - 1];
  }

  private createFamilyMember(formValue: any): FamilyMember {
    return {
      id: 0,
      name: formValue.familyResponsible,
      gender: formValue.gender,
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

    return {
      id: isUpdate ? this.family.id : 0,
      familyName: formValue.familyName,
      familyResponsible: familyMember,
      isActive: formValue.isActive,
      joinedDate: isUpdate ? this.family.joinedDate : null,
      code: isUpdate ? this.family.code : '',
      membersNumber: isUpdate ? this.family.membersNumber : 0
    } as Family;
  }

  private validatePasswords(): boolean {
    const password = this.familyForm.get('password')?.value;
    const confirmPassword = this.familyForm.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      this.toaster.showError(this.translate.instant('shared.validation.passwordMismatch'));
      return false;
    }
    
    return true;
  }

  private handleSuccess(messageKey: string): void {
    this.onSave.emit();
    this.familyForm.reset();
    this.toaster.showSuccess(this.translate.instant(messageKey));
  }
  //#endregion

  //#region Public Methods
  hasId(): boolean {
    return this.familyForm.get('id')?.value;
  }

  getFormControl(name: string): FormControl {
    return this.familyForm.get(name) as FormControl;
  }

  save(): void {
    if (!this.validatePasswords() || !this.familyForm.valid) {
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
        error: () => {},
        complete: () => this.loader.hide()
      });
  }

  update(): void {
    if (!this.familyForm.valid) {
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
        error: () => {},
        complete: () => this.loader.hide()
      });
  }

  cancel(): void {
    this.familyForm.reset();
    this.onCancel.emit();
    this.clearFamilyName();
  }

  onAdd(): void {
    this.familyForm.reset();
    this.familyForm.get('id')?.setValue(0);
    this.showDialog = true;
    this.familyForm.updateValueAndValidity();
    this.clearFamilyName();
  }

  onEdit(event: Family): void {
    this.familyForm.patchValue(event);
    this.showDialog = true;
    this.familyForm.updateValueAndValidity();
    
    if (event.familyResponsible?.name) {
      const familyName = this.generateFamilyName(event.familyResponsible.name);
      this.familyForm.get('familyName')?.setValue(familyName, { emitEvent: false });
    }
  }

  private clearFamilyName(): void {
    this.familyForm.get('familyName')?.setValue('', { emitEvent: false });
  }
  //#endregion
}
