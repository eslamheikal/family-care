import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'download-icon-button',
  imports: [TooltipModule, TranslateModule],
  templateUrl: './download-icon-button.html',
  styleUrl: './download-icon-button.scss'
})
export class DownloadIconButton {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onDownloadClick = () => this.onClick.emit();

}
