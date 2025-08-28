import { inject, Injectable } from "@angular/core";
import { DayOfWeek } from "../enums/day-week.enum";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

@Injectable({
  providedIn: 'root'
})
export class WeekDaysService {

  private translate = inject(TranslateService);

  getDayOptions(): DropdownProps[] {
    return [
      { label: this.translate.instant('days.saturday'), value: DayOfWeek.Saturday },
      { label: this.translate.instant('days.sunday'), value: DayOfWeek.Sunday },
      { label: this.translate.instant('days.monday'), value: DayOfWeek.Monday },
      { label: this.translate.instant('days.tuesday'), value: DayOfWeek.Tuesday },
      { label: this.translate.instant('days.wednesday'), value: DayOfWeek.Wednesday },
      { label: this.translate.instant('days.thursday'), value: DayOfWeek.Thursday },
      { label: this.translate.instant('days.friday'), value: DayOfWeek.Friday }
    ];
  }

  getDayName(day: DayOfWeek): string {
    const dayNames: { [key in DayOfWeek]: string } = {
      [DayOfWeek.Saturday]: this.translate.instant('days.saturday'),
      [DayOfWeek.Sunday]: this.translate.instant('days.sunday'),
      [DayOfWeek.Monday]: this.translate.instant('days.monday'),
      [DayOfWeek.Tuesday]: this.translate.instant('days.tuesday'),
      [DayOfWeek.Wednesday]: this.translate.instant('days.wednesday'),
      [DayOfWeek.Thursday]: this.translate.instant('days.thursday'),
      [DayOfWeek.Friday]: this.translate.instant('days.friday')
    };
    return dayNames[day] || '';
  }

  isToday(day: number): boolean {
    return day === (new Date().getDay() + 1) % 7;
  }
}