import { Course } from "./course.model";
import { Group } from "./group.model";
import { Room } from "./room.model";
import { Teacher } from "./teacher.model";

export interface SessionLookup {
    rooms: Room[];
    courses: Course[];
    groups: Group[];
    teachers: Teacher[];
}