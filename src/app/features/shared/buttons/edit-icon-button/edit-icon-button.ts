import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'edit-icon-button',
  imports: [TooltipModule, TranslateModule, CommonModule],
  templateUrl: './edit-icon-button.html',
  styleUrl: './edit-icon-button.scss'
})
export class EditIconButton {

  @Input() disabled: boolean = false;
  @Input() showText: boolean = false;
  @Input() showOutline: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onEditClick = () => this.onClick.emit();
  
}
