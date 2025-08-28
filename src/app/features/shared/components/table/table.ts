import { Component, Input, SimpleChanges } from '@angular/core';
import { TableColumn } from '../../props/table-column.props';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TimeHelper } from '../../../../core/helpers/time.helper';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {

  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows']) {
    }
  }

  getTime(row: any) {
    let startTime = TimeHelper.displayTime(row?.startTime);
    let endTime = TimeHelper.displayTime(row?.endTime);

    if (!startTime || !endTime) {
      return '';
    }

    return `${startTime} - ${endTime}`;
  }

  getDate(date: string) {
    return DateHelper.displayDate(date);
  }

}
