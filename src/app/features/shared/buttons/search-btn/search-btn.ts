import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'search-btn',
  imports: [TranslateModule],
  templateUrl: './search-btn.html',
  styleUrl: './search-btn.scss'
})
export class SearchBtn {

  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  onSaveClick = () => this.onClick.emit();

}
