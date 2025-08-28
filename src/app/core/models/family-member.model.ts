import { UserRoleEnum } from "../enums/user-role.enum";

export class FamilyMember {
  id: number = 0;
  name!: string;
  gender!: string;
  birthDate!: string | null;
  phoneNumber!: string;
  email!: string;
  password!: string;
  isActive!: boolean;
  role!: UserRoleEnum;
}