import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormError } from '../form-error/form-error';

@Component({
  selector: 'label-time-picker',
  imports: [DatePickerModule, CommonModule, ReactiveFormsModule, TranslateModule, FormError],
  templateUrl: './label-time-picker.html',
  styleUrl: './label-time-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelTimePicker),
      multi: true
    }
  ]
})
export class LabelTimePicker implements ControlValueAccessor {
  
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'shared.timePicker.selectTime';
  @Input() formControl: FormControl = new FormControl();
  

  private translate = inject(TranslateService);
  
  time: Date | null = null;

  //#region Control Value Accessor
  writeValue(value: any): void {
    if (value) {
      this.time = new Date(value);
    } else {
      this.time = null;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  onTimeChange(event: any): void {
    if (event) {
      this.time = event;
      // Update the form control value directly
      this.formControl.setValue(event);
      this.formControl.markAsTouched();
      this.onChange(event);
    } else {
      this.time = null;
      this.formControl.setValue(null);
      this.onChange(null);
    }
    this.onTouched();
  }

  onClear(): void {
    this.time = null;
    this.formControl.setValue(null);
    this.formControl.markAsTouched();
    this.onChange(null);
    this.onTouched();
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

  shouldShowError(): boolean {
    return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
  }

  getErrorMessage(): string {
    if (this.formControl.errors?.['required']) {
      return this.translate.instant('shared.validation.required', { field: this.label });
    }
    return '';
  }

}
