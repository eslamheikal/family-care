import { VisitStatus } from "../enums/visit-status.enum";
import { VisitType } from "../enums/visit-type.enum";

export interface Visits {
  id: number;
  date: string;
  time: string;
  type: VisitType;
  status: VisitStatus;
  location: string; 
  notes: string;
  cost: number;
  userId: number;

  memberName?: string;
  typeLabel?: string;
  statusLabel?: string;
}
