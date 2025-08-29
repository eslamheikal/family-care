import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum VisitType {
  GeneralCheckup,
  FollowUp,
  LabTests,
  Radiology,
  Surgery,
  Vaccination,
  Consultation
}

@Injectable({
    providedIn: 'root'
})
export class VisitTypeService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: VisitType.GeneralCheckup, label: this.translateService.instant('visitType.generalCheckup') },
            { value: VisitType.FollowUp, label: this.translateService.instant('visitType.followUp') },
            { value: VisitType.LabTests, label: this.translateService.instant('visitType.labTests') },
        ];
    }

    getType(type: VisitType): string {
        return this.getOptions().find(t => t.value === type)?.label || '';
    }
}
