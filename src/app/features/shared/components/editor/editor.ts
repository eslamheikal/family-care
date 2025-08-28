import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { registerCustomSizes } from './quill-size-extension';

@Component({
  selector: 'editor',
  imports: [CommonModule, EditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Editor),
      multi: true
    }
  ]
})
export class Editor {

  @Input() formControl: FormControl = new FormControl();

  constructor() {
    registerCustomSizes();
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
    // this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.innerValue = event.target.value;
    this.onChange(this.innerValue);
  }

  onChange: any = () => { };
  onTouched: any = () => { };
  //#endregion

}
