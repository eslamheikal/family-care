import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'label-date-picker',
  imports: [DatePickerModule, CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './label-date-picker.html',
  styleUrl: './label-date-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelDatePicker),
      multi: true
    }
  ]
})
export class LabelDatePicker implements ControlValueAccessor {
  
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'shared.datePicker.selectDate';
  @Input() formControl: FormControl = new FormControl();
  
  
  private translate = inject(TranslateService);

  date: Date | null = null;

  //#region Control Value Accessor
  writeValue(value: any): void {
    if (value) {
      this.date = new Date(value);
    } else {
      this.date = null;
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }

  onDateChange(event: any): void {
    if (event) {
      this.onChange(event);
    } else {
      this.onChange(null);
    }
    this.onTouched();
  }

  onClear(): void {
    this.date = null;
    this.onChange(null);
    this.onTouched();
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

}
