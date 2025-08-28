import { AttendanceStatus } from '../enums/attendance-status.enum';
import { ClassSessionStatus } from '../enums/class-session-status.enum';

export class StudentAttendanceDisplay
{
    roomName?: string | null;
    groupName?: string | null;
    courseName?: string | null;
    sessionDate?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    sessionStatus?: ClassSessionStatus | null;
    dayName?: string | null;

    attendances: StudentAttendance[] = [];
}


export class StudentAttendance {
  id: number = 0;
  sessionId: number = 0;
  studentId: number = 0;
  status: AttendanceStatus | null = AttendanceStatus.None;
  note?: string;
  
  studentName?: string;
} 