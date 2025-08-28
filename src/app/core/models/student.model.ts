import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Attachment } from "./attachment.model";
import { DailySchedule } from "./daily-schedule.model";
import { Feedback } from "./feedback.model";
import { Group } from "./group.model";

export class Student {
  id: number = 0;
  code!: string;
  name!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  role: UserRoleEnum = UserRoleEnum.FamilyParent;
  gender!: GenderEnum;
  joinedDate!: string | null;
  birthDate!: string | null;
  isActive!: boolean;
  imagePath!: string;
  
  attendancePercentage!: number;
  qualification!: string;
  attachments!: Attachment[];
  groups!: Group[];
  dailySchedules!: DailySchedule[];
  feedbacks!: Feedback[];
}
