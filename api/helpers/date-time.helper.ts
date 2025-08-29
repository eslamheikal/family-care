import { Timestamp } from "@google-cloud/firestore";

export class DateTimeHelper {

  static getCurrentDate(): string {
    return new Date().toISOString();
  }

  static toTimestamp(date: string): Timestamp {
    return Timestamp.fromDate(new Date(date));
  }

  static toDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  static toISOString(timestamp: Timestamp): string {
    return timestamp.toDate().toISOString();
  }

}
