import { ClassSessionStatus } from "../enums/class-session-status.enum";

export class ClassSession {
    id!: number;
    date!: string | null;
    scheduleId!: number;
    status!: ClassSessionStatus;
    teacherId!: number;
    roomId!: number;
    startTime?: string | null;
    endTime?: string | null;
    courseId!: number | null;

    roomName?: string;
    groupName?: string;
    courseName?: string;
    teacherName?: string;
}