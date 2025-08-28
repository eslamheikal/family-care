import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormError } from '../form-error/form-error';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'input-label',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FormError, TranslateModule],
  templateUrl: './input-label.html',
  styleUrl: './input-label.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLabel),
      multi: true
    }
  ]
})
export class InputLabel implements ControlValueAccessor{

  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() formControl: FormControl = new FormControl();

  private translate = inject(TranslateService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }


  //#region Control Value Accessor
  innerValue: any;
  writeValue(value: any): void {
    this.innerValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn ?? this.onChange;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn ?? this.onTouched;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.innerValue = event.target.value;
    this.onChange(this.innerValue);
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion


  shouldShowError(): boolean {
    return this.formControl.invalid && (this.formControl.touched || this.formControl.dirty) && this.required;
  }

  getErrorMessage() {
    if (this.formControl.errors?.['required']) {
      return `${this.translate.instant('shared.validation.required', { field: this.label })}`;
    }

    if (this.formControl.errors?.['minlength']) {
      const length = this.formControl.errors?.['minlength'].requiredLength;
      return `${this.translate.instant('shared.validation.minLength', { field: this.label, length })}`;
    }

    if (this.formControl.errors?.['email']) {
      return `${this.translate.instant('shared.validation.emailInvalid', { field: this.label })}`;
    }

    return '';
  }
}
