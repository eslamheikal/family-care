import { Group } from "./group.model";
import { Room } from "./room.model";

export interface ScheduleLookup {
    rooms: Room[];
    groups: Group[];
}