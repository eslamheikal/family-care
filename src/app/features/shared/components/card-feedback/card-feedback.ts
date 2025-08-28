import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Feedback } from '../../../../core/models/feedback.model';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'card-feedback',
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './card-feedback.html',
  styleUrl: './card-feedback.scss'
})
export class CardFeedback {

  @Input() feedback: Feedback = {} as Feedback;

  
  formatDate(date: string): string {
    return DateHelper.displayDate(date!) || '-';
  }
}
