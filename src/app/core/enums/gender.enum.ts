import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum GenderEnum {
  Male,
  Female
}

@Injectable({
    providedIn: 'root'
})
export class GenderService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: GenderEnum.Male, label: this.translateService.instant('gender.male') },
            { value: GenderEnum.Female, label: this.translateService.instant('gender.female') }
        ];
    }

    getGender(gender: GenderEnum): string {
        return this.getOptions().find(g => g.value === gender)?.label || '';
    }
}