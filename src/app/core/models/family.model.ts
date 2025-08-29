import { FamilyMember } from "./family-member.model";

export interface Family {
  id: number;
  code: string;
  joinedDate: string | null;
  isActive: boolean;
  membersNumber: number;
  familyName: string;
  familyResponsible: FamilyMember;
  familyMembers: FamilyMember[];
}
