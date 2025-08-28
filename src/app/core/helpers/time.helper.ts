export class TimeHelper {

  static toTimePicker(timeString: string): Date | null {
    if (!timeString) return null;

    // Handle both HH:mm and HH:mm:ss formats
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

    if (isNaN(hours) || isNaN(minutes)) return null;

    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  static toTimeOnly(date: Date | string | null | undefined): string | null {
    if (!date) return null;

    // If it's already a string, return as is
    if (typeof date === 'string') return date;

    // Convert Date to HH:mm:ss format for C# TimeOnly
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  static displayTime(time: Date | string | null | undefined): string {
    if (!time) return '';
    
    // get the time from 24 hours format to 12 hours format

    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, '0')}${ampm}`;
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  }
}
