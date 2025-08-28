import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-data',
  imports: [],
  templateUrl: './no-data.html',
  styleUrl: './no-data.scss'
})
export class NoData {

  @Input() icon: string = 'fas fa-user-plus';
  @Input() text: string = '';

}
