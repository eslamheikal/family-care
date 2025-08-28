import { CalendarDateFormatter, DateFormatterParams, DateAdapter } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    const dayNames = {
      'en': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      'ar': ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    };
    
    const currentLang = this.translateService.currentLang || 'en';
    const dayIndex = date.getDay();
    
    return dayNames[currentLang as keyof typeof dayNames]?.[dayIndex] || 
           dayNames['en'][dayIndex];
  }

  public override monthViewTitle({ date, locale }: DateFormatterParams): string {
    const monthNames = {
      'en': ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
      'ar': ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
             'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    };
    
    const currentLang = this.translateService.currentLang || 'en';
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    
    const monthName = monthNames[currentLang as keyof typeof monthNames]?.[monthIndex] || 
                     monthNames['en'][monthIndex];
    
    return `${monthName} ${year}`;
  }

  public override weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return this.monthViewColumnHeader({ date, locale });
  }

  public override weekViewTitle({ date, locale }: DateFormatterParams): string {
    const currentLang = this.translateService.currentLang || 'en';
    
    if (currentLang === 'ar') {
      return `أسبوع ${date.getDate()} ${this.monthViewTitle({ date, locale })}`;
    }
    
    return `Week of ${date.getDate()} ${this.monthViewTitle({ date, locale })}`;
  }

  public override dayViewTitle({ date, locale }: DateFormatterParams): string {
    const currentLang = this.translateService.currentLang || 'en';
    
    if (currentLang === 'ar') {
      return this.datePipe.transform(date, 'EEEE، d MMMM y', locale) || '';
    }
    
    return this.datePipe.transform(date, 'EEEE, MMMM d, y', locale) || '';
  }
}