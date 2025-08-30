import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DropdownProps } from "../../features/shared/props/dropdown.props";

export enum UserRoleEnum {
  None,
  Admin,
  Employee,
  FamilyParent,
  FamilyMember
}


@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private translateService = inject(TranslateService);

  getOptions(): DropdownProps[] {
    return [
      { value: UserRoleEnum.Admin, label: this.translateService.instant('userRole.admin') },
      { value: UserRoleEnum.Employee, label: this.translateService.instant('userRole.employee') },
      { value: UserRoleEnum.FamilyParent, label: this.translateService.instant('userRole.familyParent') },
      { value: UserRoleEnum.FamilyMember, label: this.translateService.instant('userRole.familyMember') }
    ];
  }

  getRole(role: UserRoleEnum): string {
    return this.getOptions().find(r => r.value === role)?.label || '';
  }
}