import { DropdownProps } from "../../features/shared/props/dropdown.props";
import { GenderEnum } from "../enums/gender.enum";

export class GenderHelper {

  static getOptions(): DropdownProps[] {
    return [
      { label: 'ذكر', value: GenderEnum.Male },
      { label: 'أنثى', value: GenderEnum.Female }
    ];
  }

  static get(gender: GenderEnum) {
    return gender === GenderEnum.Male ? 'ذكر' : 'أنثى';
  }
}