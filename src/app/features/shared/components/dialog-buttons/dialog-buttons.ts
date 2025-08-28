import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { SaveBtn } from "../../buttons/save-btn/save-btn";
import { CancelBtn } from "../../buttons/cancel-btn/cancel-btn";
import { SearchBtn } from "../../buttons/search-btn/search-btn";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dialog-buttons',
  imports: [
    Dialog,
    SaveBtn,
    CancelBtn,
    SearchBtn,
    CommonModule
],
  templateUrl: './dialog-buttons.html',
  styleUrl: './dialog-buttons.scss'
})
export class DialogButtons {

  @Input() showDialog = false;
  @Input() header: string = '';
  @Input() width: string = '40rem';
  
  @Input() showSearchButton: boolean = false;
  @Input() searchDisabled: boolean = false;
  @Output() onSearch = new EventEmitter<void>();
  
  @Input() showSaveButton: boolean = false;
  @Input() saveDisabled: boolean = false;
  @Output() onSave = new EventEmitter<void>();
  
  @Input() showCancelButton: boolean = true;
  @Output() onCancel = new EventEmitter<void>();

  onSaveClick = () => this.onSave.emit();
  onCancelClick = () => this.onCancel.emit();
  onSearchClick = () => this.onSearch.emit();
}

