import { Component, EventEmitter, forwardRef, inject, Input, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownProps } from '../../props/dropdown.props';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormError } from '../form-error/form-error';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dropdown',
  imports: [FormsModule, CommonModule, SelectModule, ReactiveFormsModule, MultiSelectModule, TranslateModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true
    }
  ]
})
export class Dropdown implements ControlValueAccessor {

  //#region Inputs
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() placeholder: string = 'shared.dropdown.selectHere';
  @Input() noResultsMessage: string = 'shared.dropdown.noResults';
  @Input() allowFilter: boolean = false;
  @Input() allowCustomFilter: boolean = false;
  @Input() multi: boolean = false;
  @Input() disabled: boolean = false;
  @Input() options: DropdownProps[] = [];
  @Input() selectedOption?: DropdownProps;
  @Input({ transform: (value: string | object) => (typeof value === 'string' ? JSON.parse(value) : value) }) style!: Record<string, string | number>;
  @Input() formControl: FormControl = new FormControl();
  @Input() isLoading: boolean = false;
  @Input() class: string = "";
  @Input() showLabel: boolean = true;
  //#endregion

  //#region Outputs
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() onLoadOptions: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter<string>();
  //#endregion

  //#region Properties
  private innerValue: any;
  searchValue?: string = '';
  displayAll: boolean = false;
  selectedItems: DropdownProps[] = [];
  formControlSubscription?: Subscription;
  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  private renderer = inject(Renderer2);
  private translate = inject(TranslateService);
  //#endregion

  //#region Lifecycle
  ngOnInit() {
    this.setSelectedItems();
    if (this.formControlSubscription) {
      this.formControlSubscription.unsubscribe();
    }
    this.formControlSubscription = this.formControl.valueChanges.subscribe(value => {
      this.setSelectedItems();
    });

    this.searchSubject$.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(value => {
      this.onSearchChange.emit(value);
    });

    // Handle disabled state
    if (this.disabled) {
      this.formControl.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      if (!this.options.some(r => r.value == null) && !this.multi)
        this.options.unshift({ label: this.translate.instant(this.placeholder), value: null })
    }

    if(changes['selectedOption']) {
      this.formControl.setValue(this.multi ? [this.selectedOption?.value] : this.selectedOption?.value);
      this.setSelectedItems();
    }

    if(changes['formControl']) {
      this.setSelectedItems();
    }

    if(changes['disabled']) {
      if (this.disabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#region Methods
  
  onSelectOption(value: any) {
    this.setSelectedItems();
    this.onSelect.emit(value);
  }

  setSelectedItems() {
    if (Array.isArray(this.formControl.value)) {
      this.selectedItems = this.options.filter(r => this.formControl.value.some((item: any) => item === r.value));
    } else {
      const selectedOption = this.options.find(r => r.value === this.formControl.value);
      this.selectedItems = selectedOption ? [selectedOption] : [];
    }
  }

  onOverlayShow(){
    const overlay = document.querySelector('.p-multiselect-panel .p-checkbox');
    if (overlay && this.options.length == 1) {
      this.renderer.setStyle(overlay, 'display', 'none');
    }
  }

  onLoad() {
    this.onLoadOptions.emit(this.searchValue);
  }

  searchChange(value: any) {
    this.searchSubject$.next(value);
  }

  //#endregion

  //#region Control Value Accessor
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
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
  getDisplayValue(): string {
    if (!this.selectedItems || this.selectedItems.length === 0) {
      return this.translate.instant(this.placeholder);
    }

    if(this.multi && this.options.length == 1){
      return this.options[0].label;
    }

    if (this.selectedItems.length == this.options.length)
      return this.translate.instant('shared.dropdown.all');

    if (this.selectedItems.length > 2)
      return this.translate.instant('shared.dropdown.itemsCount', { count: this.selectedItems.length });

    return this.selectedItems.map(item => item.label).join(', ');
  }

  private onChange: any = () => { };
  private onTouched: any = () => { };
  //#endregion

  getErrorMessage() {
    if (this.formControl.errors?.['required']) {
      return this.translate.instant('shared.validation.requiredDropdown', { field: this.label });
    }

    if (this.formControl.errors?.['minlength']) {
      return this.translate.instant('shared.validation.minLength', { 
        field: this.label, 
        length: this.formControl.errors?.['minlength'].requiredLength 
      });
    }

    if (this.formControl.errors?.['email']) {
      return this.translate.instant('shared.validation.emailInvalid', { field: this.label });
    }

    return '';
  }
}
