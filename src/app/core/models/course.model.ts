import { Group } from "./group.model";
import { Teacher } from "./teacher.model";

export interface Course {
    id: number;
    name: string;
    description: string;

    numberOfTeachers: number;
    teachers: Teacher[];

    groups: Group[];
}