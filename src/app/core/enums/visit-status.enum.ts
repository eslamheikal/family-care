import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum VisitStatus {
    Pending,
    Completed,
    Cancelled
}


@Injectable({
    providedIn: 'root'
})
export class VisitStatusService {

    private translateService = inject(TranslateService);

    getOptions(): DropdownProps[] {
        return [
            { value: VisitStatus.Pending, label: this.translateService.instant('visitStatus.pending') },
            { value: VisitStatus.Completed, label: this.translateService.instant('visitStatus.completed') },
            { value: VisitStatus.Cancelled, label: this.translateService.instant('visitStatus.cancelled') }
        ];
    }

    getStatus(status: VisitStatus): string {
        return this.getOptions().find(s => s.value === status)?.label || '';
    }
}