import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'save-btn',
  imports: [TranslateModule],
  templateUrl: './save-btn.html',
  styleUrl: './save-btn.scss'
})
export class SaveBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onSaveClick = () => this.onClick.emit();
}
