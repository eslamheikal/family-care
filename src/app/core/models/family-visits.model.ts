import { VisitStatus } from "../enums/visit-status.enum";
import { VisitType } from "../enums/visit-type.enum";

export interface FamilyVisits {
  id: number;
  familyId: number;
  date: string;
  time: string;
  type: VisitType;
  status: VisitStatus;
  location: string; 
  notes: string;
  cost: number;

  memberName?: string;
  typeLabel?: string;
  statusLabel?: string;
}
