import { DayOfWeek } from "../enums/day-week.enum";
import { Course } from "./course.model";
import { DailySchedule } from "./daily-schedule.model";
import { Student } from "./student.model";
import { Teacher } from "./teacher.model";

export interface Group {
    id: number;
    name: string;
    courseName: string;
    courseId: number;
    teacherId: number;
    capacity: number;
    numberOfStudents: number;

    teacher?: Teacher;
    course?: Course;
    students?: Student[];
    dailySchedules?: DailySchedule[];
    attendces? : GroupAttendance[];
}

export interface GroupAttendance {
    sessionId: number;
    date: Date;
    present: number;
    late: number;
    absent: number;
    total?: number;
}
