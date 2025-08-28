import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'activate-btn',
  imports: [TooltipModule, TranslateModule],
  templateUrl: './activate-btn.html',
  styleUrl: './activate-btn.scss'
})
export class ActivateBtn {
  
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onActivateClick = () => this.onClick.emit();

}
