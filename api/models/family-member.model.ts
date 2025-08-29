import { FamilyRelationEnum } from "../enums/family.relation.enum";
import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export interface FamilyMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    birthDate: string;
    gender: GenderEnum;
    relation: FamilyRelationEnum;
    role: UserRoleEnum;

    familyId: number;
}