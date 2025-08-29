import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum FamilyRelation {
    Father,
    Mother,
    Son,
    Daughter,
    Grandfather,
    Grandmother
}

@Injectable({
    providedIn: 'root'
})
export class FamilyRelationService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: FamilyRelation.Father, label: this.translateService.instant('familyRelations.father') },
            { value: FamilyRelation.Mother, label: this.translateService.instant('familyRelations.mother') },
            { value: FamilyRelation.Son, label: this.translateService.instant('familyRelations.son') },
            { value: FamilyRelation.Daughter, label: this.translateService.instant('familyRelations.daughter') },
            { value: FamilyRelation.Grandfather, label: this.translateService.instant('familyRelations.grandFather') },
            { value: FamilyRelation.Grandmother, label: this.translateService.instant('familyRelations.grandMother') }
        ];
    }

    getRelation(relation: FamilyRelation): string {
        return this.getOptions().find(r => r.value === relation)?.label || '';
    }
}