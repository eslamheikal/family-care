import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum Month {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December
}


@Injectable({
    providedIn: 'root'
})
export class MonthService {

    private translateService = inject(TranslateService);


    getOptions(): DropdownProps[] {
        return [
            { value: Month.January, label: this.translateService.instant('months.january') },
            { value: Month.February, label: this.translateService.instant('months.february') },
            { value: Month.March, label: this.translateService.instant('months.march') },
            { value: Month.April, label: this.translateService.instant('months.april') },
            { value: Month.May, label: this.translateService.instant('months.may') },
            { value: Month.June, label: this.translateService.instant('months.june') },
            { value: Month.July, label: this.translateService.instant('months.july') },
            { value: Month.August, label: this.translateService.instant('months.august') },
            { value: Month.September, label: this.translateService.instant('months.september') },
            { value: Month.October, label: this.translateService.instant('months.october') },
            { value: Month.November, label: this.translateService.instant('months.november') },
            { value: Month.December, label: this.translateService.instant('months.december') },
        ];
    }

    getMonths(): string[] {
        return this.getOptions().map(m => m.label);
    }

    getMonth(month: Month): string {
        return this.getOptions().find(m => m.value === month)?.label || '';
    }
    
}
