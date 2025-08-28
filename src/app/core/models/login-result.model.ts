import { User } from "./user.model";

export class LoginResult {
    user!: User;
    token!: string;
    refreshToken!: string;
}