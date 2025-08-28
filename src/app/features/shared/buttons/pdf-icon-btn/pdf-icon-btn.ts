import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'pdf-icon-btn',
  imports: [
    CommonModule,
    TranslateModule,
    TooltipModule
  ],
  templateUrl: './pdf-icon-btn.html',
  styleUrl: './pdf-icon-btn.scss'
})
export class PdfIconBtn  {

  @Input() disabled: boolean = false;
  @Input() showText: boolean = false;
  @Input() showOutline: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onPdfClick = () => this.onClick.emit();
  
}
