import { FamilyMember } from "./family-member.model";

export class Family {
  id: number = 0;
  code!: string;
  joinedDate!: string | null;
  isActive!: boolean;
  membersNumber!: number;
  familyName!: string;
  familyResponsible!: FamilyMember;
}
