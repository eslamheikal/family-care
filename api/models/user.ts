import { GenderEnum } from "../enums/gender.enum";
import { RelationEnum } from "../enums/relation.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    password: string;
    birthDate?: string | null;
    
    gender: GenderEnum;
    relation: RelationEnum;
    role: UserRoleEnum;

    parentId: number;
    joinedDate?: string | null;
    isActive: boolean;
}