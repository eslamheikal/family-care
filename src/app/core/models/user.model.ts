import { GenderEnum } from "../enums/gender.enum";
import { UserRoleEnum } from "../enums/user-role.enum";

export class User {
    id!: number;
    name!: string;
    phoneNumber!: string;
    email!: string;
    password!: string;
    role!: UserRoleEnum;
    gender?: GenderEnum;
    joinedDate?: Date;
    birthDate?: Date;
    imagePath?: string;
}
