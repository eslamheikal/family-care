import { ClassScheduleStatus } from "../enums/class-schedule-status.enum";
import { DayOfWeek } from "../enums/day-week.enum";

export class ClassSchedule {
    id!: number;
    roomId!: number;
    groupId!: number;
    color!: string;
    
    day!: DayOfWeek;
    startTime!: string;
    endTime!: string;
    status!: ClassScheduleStatus;

    startDate!: string | null;
    endDate!: string | null;

    groupName?: string;
    roomName?: string;
    courseName?: string;
    teacherName?: string;
}