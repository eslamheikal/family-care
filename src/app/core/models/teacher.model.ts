import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Attachment } from "./attachment.model";
import { Course } from "./course.model";
import { DailySchedule } from "./daily-schedule.model";
import { Group } from "./group.model";

export class Teacher {
  id: number = 0;
  name!: string;
  code!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  role: UserRoleEnum = UserRoleEnum.FamilyParent;
  gender!: GenderEnum;
  joinedDate!: string | null;
  birthDate!: string | null;
  isActive!: boolean;
  imagePath!: string;

  qualification!: string;
  experience!: string;
  attachments!: Attachment[];
  courses?: Course[];
  groups?: Group[];
  dailySchedules!: DailySchedule[];
}
