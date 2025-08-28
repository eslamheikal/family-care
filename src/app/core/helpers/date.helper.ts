import { formatDate } from "@angular/common";

export class DateHelper {

  static toOldDatePicker(date: string | null | undefined): string | null {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : null;
  }

  static toDatePicker(date: string | null | undefined): Date | null {
    return date ? new Date(date) : null;
  }

  static toDateOnly(date: string | null | undefined): string | null {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : null;
  }

  static displayDate(date: string | null | undefined): string | null {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : null;
  }

  static getAge(birthDate: string) {
    const today = new Date();
    const _birthDate = new Date(birthDate);
    let age = today.getFullYear() - _birthDate.getFullYear();
    const m = today.getMonth() - _birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < _birthDate.getDate())) {
      age--;
    }
    return age;
  }

  static getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  static getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
