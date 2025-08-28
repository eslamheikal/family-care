import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PdfTemplateFooter } from '../pdf-template-footer/pdf-template-footer';
import { TranslateModule } from '@ngx-translate/core';
import { PdfTemplateHeader } from '../pdf-template-header/pdf-template-header';
import { Feedback } from '../../../../core/models/feedback.model';
import { DateHelper } from '../../../../core/helpers/date.helper';
import { TableColumn } from '../../props/table-column.props';
import { Table } from "../../components/table/table";
import { NoData } from "../../components/no-data/no-data";

@Component({
  selector: 'feedback-pdf-template',
  imports: [CommonModule, TranslateModule, PdfTemplateFooter, PdfTemplateHeader, Table, NoData],
  templateUrl: './feedback-pdf-template.html',
  styleUrl: './feedback-pdf-template.scss'
})
export class FeedbackPdfTemplate {
  @Input() title: string = '';
  @Input() feedbacks: Feedback[] = [];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  exportDate = DateHelper.displayDate(new Date().toString());

  feedbackTableColumns: TableColumn[] = [
    { title: 'teachers.one', field: 'name', type: 'text' },
    { title: 'shared.labels.date', field: 'date', type: 'date' },
    { title: 'shared.labels.comment', field: 'comment', type: 'text' },
  ];

  getDate(date: string): string {
    return DateHelper.displayDate(date) || '-';
  }



}

