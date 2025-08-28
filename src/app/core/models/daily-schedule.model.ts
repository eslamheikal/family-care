import { DayOfWeek } from "../enums/day-week.enum";

export interface DailySchedule {
  dayName: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  courseName: string;
  teacherName: string;
  roomName: string;
  groupName: string;
}