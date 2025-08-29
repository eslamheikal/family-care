import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum DayOfWeek {
    Saturday = 0,
    Sunday = 1,
    Monday = 2,
    Tuesday = 3,
    Wednesday = 4,
    Thursday = 5,
    Friday = 6,
}

@Injectable({
    providedIn: 'root'
})
export class DayOfWeekService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: DayOfWeek.Saturday, label: this.translateService.instant('dayOfWeek.saturday') },
            { value: DayOfWeek.Sunday, label: this.translateService.instant('dayOfWeek.sunday') },
            { value: DayOfWeek.Monday, label: this.translateService.instant('dayOfWeek.monday') },
            { value: DayOfWeek.Tuesday, label: this.translateService.instant('dayOfWeek.tuesday') },
            { value: DayOfWeek.Wednesday, label: this.translateService.instant('dayOfWeek.wednesday') },
            { value: DayOfWeek.Thursday, label: this.translateService.instant('dayOfWeek.thursday') },
            { value: DayOfWeek.Friday, label: this.translateService.instant('dayOfWeek.friday') }
        ];
    }

    getDay(day: DayOfWeek): string {
        return this.getOptions().find(d => d.value === day)?.label || '';
    }

    isToday(day: number): boolean {
        return day === (new Date().getDay() + 1) % 7;
    }
}       