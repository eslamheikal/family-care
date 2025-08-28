import { CalendarDateFormatter, DateFormatterParams, DateAdapter } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CALENDAR_CONSTANTS } from './calendar.constants';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService,
        @Inject(LOCALE_ID) private locale: string,
        protected override dateAdapter: DateAdapter
    ) {
        super(dateAdapter);
    }

    private getLang(): 'en' | 'ar' {
        const lang = this.translateService.currentLang?.toLowerCase() || 'en';
        return lang === 'ar' ? 'ar' : 'en';
    }

    private getDayName(date: Date): string {
        const lang = this.getLang();
        const adjustedIndex = (date.getDay() + 1) % 7; // Saturday as first day
        return CALENDAR_CONSTANTS.dayNames[lang][adjustedIndex];
    }

    private getMonthName(monthIndex: number): string {
        const lang = this.getLang();
        return CALENDAR_CONSTANTS.monthNames[lang][monthIndex];
    }

    override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
        return this.getDayName(date);
    }

    override monthViewTitle({ date, locale }: DateFormatterParams): string {
        return `${this.getMonthName(date.getMonth())} ${date.getFullYear()}`;
    }

    override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
        // Return only the day name, without any date information
        return this.getDayName(date);
    }

    override weekViewTitle({ date, locale }: DateFormatterParams): string {
        const lang = this.getLang();
        const monthName = this.getMonthName(date.getMonth());
        const year = date.getFullYear();
        return lang === 'ar'
            ? `أسبوع ${date.getDate()} ${monthName} ${year}`
            : `Week of ${date.getDate()} ${monthName} ${year}`;
    }

    override dayViewTitle({ date }: DateFormatterParams): string {
        return this.datePipe.transform(
            date,
            this.getLang() === 'ar' ? 'EEEE، d MMMM y' : 'EEEE, MMMM d, y',
            this.locale
        ) || '';
    }
}
