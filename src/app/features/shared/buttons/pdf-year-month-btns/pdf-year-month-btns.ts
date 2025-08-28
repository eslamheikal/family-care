import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownProps } from '../../props/dropdown.props';
import { TranslateModule } from '@ngx-translate/core';
import { PdfIconBtn } from "../pdf-icon-btn/pdf-icon-btn";
import { CommonModule } from '@angular/common';
import { MonthesService } from '../../../../core/services/monthes.service';
import { DateHelper } from '../../../../core/helpers/date.helper';

@Component({
  selector: 'pdf-year-month-btns',
  imports: [
    FormsModule,
    TranslateModule,
    PdfIconBtn,
    CommonModule
],
  templateUrl: './pdf-year-month-btns.html',
  styleUrl: './pdf-year-month-btns.scss'
})
export class PdfYearMonthBtns {

  @Input() showPdfBtn: boolean = true;
  @Input() showYearSelect: boolean = true;
  @Input() showMonthSelect: boolean = true;
  @Input() selectedYear: number = DateHelper.getCurrentYear();
  @Input() selectedMonth: number = 0;

  // Filter options
  years: number[] = [];
  months: DropdownProps[] = [];

  private monthesService = inject(MonthesService);


  @Output() onYearChanged = new EventEmitter<number>();
  @Output() onMonthChanged = new EventEmitter<{ year: number, month: number }>();
  @Output() onExport = new EventEmitter<void>();

  ngOnInit() {
    this.years = Array.from({ length: 10 }, (_, i) => DateHelper.getCurrentYear() - i);
    this.months = this.monthesService.getMonthsDropdownProps();
  }

  onYearChange() {
    if (this.selectedYear) {
      this.selectedMonth = 0;
      this.onYearChanged.emit(this.selectedYear);
    }
  }

  onMonthChange() {
    if (this.selectedMonth && this.selectedYear ) {
      this.onMonthChanged.emit({ year: this.selectedYear ?? 0, month: this.selectedMonth ?? 0});
    }
  }


}
