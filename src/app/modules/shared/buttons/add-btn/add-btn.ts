import { Component, EventEmitter, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'add-btn',
  imports: [TooltipModule],
  templateUrl: './add-btn.html',
  styleUrl: './add-btn.scss'
})
export class AddBtn {

  @Output() OnAdd: EventEmitter<void> = new EventEmitter<void>();
  onAddClick = () => this.OnAdd.emit();

}
