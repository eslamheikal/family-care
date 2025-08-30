import { GenderEnum } from "../enums/gender.enum";
import { Relation } from "../enums/relation.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export class User {
    id!: number;
    name!: string;
    email!: string;
    phone!: string;
    password!: string;
    birthDate?: string;

    gender?: GenderEnum;
    relation?: Relation;
    role!: UserRoleEnum;

    parentId?: number;
    joinedDate?: string;
    isActive?: boolean;

    membersNumber?: number;
    familyName?: string;
    relationName?: string;
    age?: number;
}
