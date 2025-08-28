export interface ScheduleForm {
    id: number;
    groupId: number;
    roomId: number;
    courseId: number;
    teacherId: number;
    startDate: string;
    endDate: string;
}

export interface LessonDailySchedule {
    day: number;
    startTime: string;
    endTime: string;
}