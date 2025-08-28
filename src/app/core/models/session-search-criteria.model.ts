import { ClassSessionStatus } from "../enums/class-session-status.enum";

export interface SessionSearchCriteria {
  startDate?: string | null;
  endDate?: string | null;
  courseId?: number | null;
  groupId?: number | null;
  roomId?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  status?: ClassSessionStatus | null;

  courseName?: string | null;
  groupName?: string | null;
  roomName?: string | null;
  statusName?: string | null;
}