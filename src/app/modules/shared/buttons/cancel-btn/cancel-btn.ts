import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cancel-btn',
  templateUrl: './cancel-btn.html',
  styleUrl: './cancel-btn.scss'
})
export class CancelBtn {

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  onCancelClick = () => this.onCancel.emit();
}
