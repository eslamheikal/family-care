import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'add-btn',
  imports: [TooltipModule, TranslateModule],
  templateUrl: './add-btn.html',
  styleUrl: './add-btn.scss'
})
export class AddBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onAddClick = () => this.onClick.emit();

}
