import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'save-btn',
  templateUrl: './save-btn.html',
  styleUrl: './save-btn.scss'
})
export class SaveBtn {

  @Output() OnSubmit: EventEmitter<void> = new EventEmitter<void>();
  onSubmitClick = () => this.OnSubmit.emit();
}
