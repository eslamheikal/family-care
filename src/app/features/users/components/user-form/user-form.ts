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
import { User } from '../../../../core/models/user.model';

// Services
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoaderService } from '../../../shared/services/loader.service';

// Helpers & Props
import { DateHelper } from '../../../../core/helpers/date.helper';
import { DropdownProps } from '../../../shared/props/dropdown.props';
import { UserRoleEnum, UserRoleService } from '../../../../core/enums/user-role.enum';
import { GenderEnum, GenderService } from '../../../../core/enums/gender.enum';
import { PermissionService } from '../../../../core/authorization/permission.service';
import { Relation, RelationService } from '../../../../core/enums/relation.enum';
import { AuthService } from '../../../../core/authorization/auth.service';

// Constants
const FORM_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  PHONE_MIN_LENGTH: 5
} as const;

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit, OnChanges, OnDestroy {

  //#region Inputs & Outputs
  @Input() showDialog = true;
  @Input() user: User = {} as User;
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  //#endregion

  //#region Services
  private readonly userService = inject(UserService);
  private readonly loader = inject(LoaderService);
  private readonly toaster = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly genderService = inject(GenderService);
  private readonly relationService = inject(RelationService);
  private readonly roleService = inject(UserRoleService);
  public readonly authService = inject(AuthService);
  public readonly permissionService = inject(PermissionService);
  //#endregion

  //#region Properties
  userForm!: FormGroup;
  destroy$ = new Subject<void>();
  requiredPassword = false;
  passwordMismatch = false;
  genderOptions: DropdownProps[] = this.genderService.getOptions();
  relationOptions: DropdownProps[] = this.authService.isFamilyParent ? 
    this.relationService.getParentOptions(this.authService.getUser()?.relation as Relation) : this.relationService.getOptions();
  roleOptions: DropdownProps[] = this.authService.isFamilyParent ? this.roleService.getParentOptions() : this.roleService.getOptions();
  //#endregion


  //#region Lifecycle Methods
  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.initializeForm();

    if (changes['user'] && this.user.id > 0) {
      this.handleFormChanges(changes);
    }
   
    if (this.authService.isFamilyParent) {
      this.userForm.get('role')?.setValue(UserRoleEnum.FamilyMember);
    }
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Form Initialization
  private initializeForm(): void {
    this.userForm = this.userForm || this.createFormGroup();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(FORM_CONFIG.NAME_MIN_LENGTH)]],
      email: [''],
      phone: [''],
      password: [''],
      confirmPassword: [''],

      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      relation: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  //#endregion

  //#region Form Change Handlers
  private handleFormChanges(changes: SimpleChanges): void {
    if (this.shouldHandleShowDialogChange(changes)) {
      this.handleShowDialogChange();
      return;
    }

    if (this.shouldHandleUserChange(changes)) {
      this.handleUserChange();
    }

    this.patchFormValues();
    this.setupPasswordValidation();
  }

  private shouldHandleShowDialogChange(changes: SimpleChanges): boolean {
    return changes['showDialog'] && !this.user.id;
  }

  private shouldHandleUserChange(changes: SimpleChanges): boolean {
    return !!this.userForm && changes['user'] && this.user.id > 0;
  }

  private handleShowDialogChange(): void {
    // For create mode, password is mandatory
    this.requiredPassword = true;
    this.setPasswordValidators(true);
    this.userForm?.reset();
    this.clearPasswordMismatch();
  }

  private handleUserChange(): void {
    // For edit mode, password is optional
    this.requiredPassword = false;
    this.setPasswordValidators(false);
    this.userForm?.markAllAsTouched();
  }

  private setPasswordValidators(required: boolean): void {
    // const passwordValidators = required
    //   ? [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]
    //   : [Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)];

    // const confirmPasswordValidators = required
    //   ? [Validators.required, Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)]
    //   : [Validators.minLength(FORM_CONFIG.PASSWORD_MIN_LENGTH)];

    // this.userForm?.get('password')?.setValidators(passwordValidators);
    // this.userForm?.get('confirmPassword')?.setValidators(confirmPasswordValidators);

    this.userForm?.get('password')?.updateValueAndValidity();
    this.userForm?.get('confirmPassword')?.updateValueAndValidity();
    
    // Trigger form validation check
    this.userForm?.updateValueAndValidity();
  }

  private patchFormValues(): void {
    if (this.userForm && this.user) {
      // Map User model to form structure
      const formData = {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email || '',
        phone: this.user.phone || '',
        password: '',
        confirmPassword: '',

        birthDate: this.user.birthDate ? DateHelper.toDatePicker(this.user.birthDate) : null,
        gender: this.user.gender as GenderEnum,
        relation: this.user.relation as Relation,
        role: this.user.role as UserRoleEnum
      };
      
      this.userForm.patchValue(formData);
      this.generateUserNameFromExisting();
    }
  }

  private generateUserNameFromExisting(): void {
    if (this.user.id > 0 && this.user.name && this.userForm) {
      const userName = this.generateUserName(this.user.name);
      this.userForm.get('name')?.setValue(userName, { emitEvent: false });
    }
  }

  private setupPasswordValidation(): void {
    if (this.userForm) {
      // Set up password validation for both create and edit modes
      this.userForm.get('password')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.checkPasswordMatch();
        });

      this.userForm.get('confirmPassword')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.checkPasswordMatch();
        });

      // Set initial password requirements based on mode
      if (this.user.id > 0) {
        // Edit mode - password is optional
        this.requiredPassword = false;
        this.setPasswordValidators(false);
      } else {
        // Create mode - password is mandatory
        this.requiredPassword = true;
        this.setPasswordValidators(true);
      }
    }
  }

  private checkPasswordMatch(): void {
    const password = this.userForm?.get('password')?.value;
    const confirmPassword = this.userForm?.get('confirmPassword')?.value;

    if (this.user.id > 0) {
      // Edit mode - only check mismatch if both fields have values
      if (password && confirmPassword) {
        this.passwordMismatch = password !== confirmPassword;
      } else if ((password && !confirmPassword) || (!password && confirmPassword)) {
        this.passwordMismatch = true;
      } else {
        this.passwordMismatch = false;
      }
    } else {
      // Create mode - both fields are required, check if they match
      if (password && confirmPassword) {
        this.passwordMismatch = password !== confirmPassword;
      } else {
        this.passwordMismatch = false;
      }
    }
  }
  //#endregion

  //#region Utility Methods
  private generateUserName(fullName: string): string {
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

  private createUserData(formValue: any, isUpdate = false): User {
    // For edit mode, preserve existing password if no new password is provided
    const password = isUpdate && (!formValue.password || formValue.password.trim() === '')
      ? this.user.password || ''
      : formValue.password;

    return {
      id: isUpdate ? this.user.id : 0,
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: password,

      birthDate: DateHelper.toDateOnly(formValue.birthDate),
      gender: formValue.gender,
      relation: formValue.relation,

      isActive: true,
      joinedDate: DateHelper.getCurrentDate(),
      role: formValue.role as UserRoleEnum
    } as User;
  }

  private validatePasswords(): boolean {
    const password = this.userForm?.get('password')?.value;
    const confirmPassword = this.userForm?.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  private validatePasswordsForEdit(): boolean {
    const password = this.userForm?.get('password')?.value;
    const confirmPassword = this.userForm?.get('confirmPassword')?.value;

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
    this.userForm?.reset();
    this.clearPasswordMismatch();
    // Reset password requirements based on current mode
    if (this.user.id > 0) {
      this.requiredPassword = false;
      this.setPasswordValidators(false);
    } else {
      this.requiredPassword = true;
      this.setPasswordValidators(true);
    }
    this.toaster.showSuccess(this.translate.instant(messageKey));
  }
  //#endregion

  //#region Public Methods
  hasId(): boolean {
    return this.userForm?.get('id')?.value;
  }

  getFormControl(name: string): FormControl {
    return this.userForm?.get(name) as FormControl;
  }

  save(): void {
    // Mark all fields as touched to show validation errors
    this.userForm?.markAllAsTouched();
    
    if (!this.userForm?.valid) {
      return;
    }

    // For create mode, validate that passwords match
    if (!this.validatePasswords()) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    this.loader.show();
    const formValue = this.userForm.value;
    const userData = this.createUserData(formValue, false);

    this.userService.add(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.handleSuccess('shared.messages.savedSuccessfully');
          }
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }

  update(): void {
    // Mark all fields as touched to show validation errors
    this.userForm?.markAllAsTouched();
    
    if (!this.userForm?.valid) {
      return;
    }

    // For edit mode, validate passwords only if provided
    if (!this.validatePasswordsForEdit()) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    
    this.loader.show();
    const formValue = this.userForm.value;
    const userData = this.createUserData(formValue, true);

    this.userService.update(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.handleSuccess('shared.messages.updatedSuccessfully');
          }
        },
        error: () => { },
        complete: () => this.loader.hide()
      });
  }

  cancel(): void {
    this.userForm?.reset();
    this.onCancel.emit();
    this.clearPasswordMismatch();
    // Reset password requirements based on current mode
    if (this.user.id > 0) {
      this.requiredPassword = false;
      this.setPasswordValidators(false);
    } else {
      this.requiredPassword = true;
      this.setPasswordValidators(true);
    }
  }

  onAdd(): void {
    this.userForm?.reset();
    this.userForm?.get('id')?.setValue(0);
    this.showDialog = true;
    // Set password as mandatory for create mode
    this.requiredPassword = true;
    this.setPasswordValidators(true);
    this.userForm?.updateValueAndValidity();
    this.clearPasswordMismatch();
  }

  onEdit(event: User): void {
    this.userForm?.patchValue(event);
    this.showDialog = true;
    // Set password as optional for edit mode
    this.requiredPassword = false;
    this.setPasswordValidators(false);
    this.userForm?.updateValueAndValidity();

    if (event.name) {
      const userName = this.generateUserName(event.name);
      this.userForm?.get('name')?.setValue(userName, { emitEvent: false });
    }
  }

  private clearPasswordMismatch(): void {
    this.passwordMismatch = false;
  }
  //#endregion
}
