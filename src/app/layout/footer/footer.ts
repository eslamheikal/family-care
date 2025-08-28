import { Component } from '@angular/core';
import { DateHelper } from '../../core/helpers/date.helper';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  year = DateHelper.getCurrentYear();
}
