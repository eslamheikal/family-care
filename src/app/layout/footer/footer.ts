import { Component, inject } from '@angular/core';
import { DateHelper } from '../../core/helpers/date.helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  year = DateHelper.getCurrentYear();
  private translateService = inject(TranslateService);
}
