export interface MonthlyAttendanceModel {
    month: number;
    present: number;
    absent: number;
    late: number;
    total: number;
    monthName: string;
}