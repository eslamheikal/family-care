import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum Relation {
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
export class RelationService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: Relation.Father, label: this.translateService.instant('familyRelations.father') },
            { value: Relation.Mother, label: this.translateService.instant('familyRelations.mother') },
            { value: Relation.Son, label: this.translateService.instant('familyRelations.son') },
            { value: Relation.Daughter, label: this.translateService.instant('familyRelations.daughter') },
            { value: Relation.Grandfather, label: this.translateService.instant('familyRelations.grandFather') },
            { value: Relation.Grandmother, label: this.translateService.instant('familyRelations.grandMother') }
        ];
    }

    getParentOptions(userRelation: Relation): DropdownProps[] {
        return this.getOptions().filter(r => r.value !== userRelation);
    }

    getRelation(relation: Relation): string {
        return this.getOptions().find(r => r.value === relation)?.label || '';
    }
}