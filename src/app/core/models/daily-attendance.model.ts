import { AttendanceStatus } from "../enums/attendance-status.enum";

export interface DailyAttendanceModel {
    sessionId: number;
    date: string;
    startTime: string | null;
    endTime: string | null;
    note: string;
    status: AttendanceStatus;
    courseName: string

    late: boolean;
    absent: boolean;
    present: boolean;
}