import { FamilyRelation } from "../enums/family.relation.enum";
import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export interface FamilyMember {
  id: number;
  name: string;
  gender: GenderEnum;
  birthDate: string | null;
  phoneNumber: string;
  email: string;
  password: string;
  isActive: boolean;
  role: UserRoleEnum;
  relation: FamilyRelation;
  relationName?: string;
  age?: number;
}