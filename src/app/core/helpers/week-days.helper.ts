import { DayOfWeek } from "../enums/day-week.enum";

export class WeekDaysHelper {
    static getDays() {
        return [
            { id: DayOfWeek.Saturday, name: 'السبت' },
            { id: DayOfWeek.Sunday, name: 'الأحد' },
            { id: DayOfWeek.Monday, name: 'الاثنين' },
            { id: DayOfWeek.Tuesday, name: 'الثلاثاء' },
            { id: DayOfWeek.Wednesday, name: 'الأربعاء' },
            { id: DayOfWeek.Thursday, name: 'الخميس' },
            { id: DayOfWeek.Friday, name: 'الجمعة' },
        ];
    }
}