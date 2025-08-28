import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cancel-btn',
  imports: [TranslateModule],
  templateUrl: './cancel-btn.html',
  styleUrl: './cancel-btn.scss'
})
export class CancelBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onCancelClick = () => this.onClick.emit();
}
