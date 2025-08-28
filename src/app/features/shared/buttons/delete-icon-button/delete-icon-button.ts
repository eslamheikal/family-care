import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'delete-icon-button',
  imports: [TooltipModule, TranslateModule],
  templateUrl: './delete-icon-button.html',
  styleUrl: './delete-icon-button.scss'
})
export class DeleteIconButton {
  
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onDeleteClick = () => this.onClick.emit();

}
