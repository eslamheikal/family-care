import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'pdf-template-footer',
  imports: [
    TranslateModule
  ],
  templateUrl: './pdf-template-footer.html',
  styleUrl: './pdf-template-footer.scss'
})
export class PdfTemplateFooter {

  exportDate = DateHelper.displayDate(new Date().toString());

  private translate = inject(TranslateService);

  get exportBy() {
    return this.translate.instant('appName');
  }

  get darAlforqan() {
    return this.translate.instant('darAlforqan');
  }

}
