import type { ITimePeriodService } from "./types/timeperiod";

export class TimePeriodService implements ITimePeriodService {
  calculateNumberOfDays(start: Date, end: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const startUtc = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((endUtc - startUtc) / millisecondsPerDay) + 1; // +1 to include both start and end dates
  }

  calculateDeltaDays(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): number {
    const latestStart = start1 > start2 ? start1 : start2;
    const earliestEnd = end1 < end2 ? end1 : end2;
    if (latestStart > earliestEnd) {
      return 0; // No overlap
    }
    return this.calculateNumberOfDays(latestStart, earliestEnd);
  }

  parseDate(dateStr: string): Date {
    // should support the following formats:

    // YYYY-MM-DDTHH:mm:ssZ
    // YYYY-MM-DDTHH:mm:ss±HH:mm
    // YYYY-MM-DD HH:mm:ss UTC

    // YYYY-MM-DD
    // DD-MM-YYYY

    // YYYY/MM/DD
    // MM/DD/YYYY
    // DD/MM/YYYY

    // Month DD, YYYY

    // NULL (which means current date)

    dateStr = dateStr.trim();

    if (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/.test(
        dateStr
      )
    ) {
      //YYYY-MM-DDTHH:mm:ssZ
      return new Date(dateStr);
    }

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(dateStr)) {
      //YYYY-MM-DD HH:mm:ss
      return new Date(dateStr.replace(" ", "T"));
    }

    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})? UTC$/.test(dateStr)) {
      //YYYY-MM-DD HH:mm:ss UTC
      return new Date(dateStr.replace(" UTC", "Z").replace(" ", "T"));
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // YYYY-MM-DD
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      // DD-MM-YYYY
      const [d, m, y] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
      // YYYY/MM/DD
      const [y, m, d] = dateStr.split("/").map(Number);
      return new Date(y, m - 1, d);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      // MM/DD/YYYY
      const [m, d, y] = dateStr.split("/").map(Number);
      return new Date(y, m - 1, d);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      // DD/MM/YYYY
      const [d, m, y] = dateStr.split("/").map(Number);
      return new Date(y, m - 1, d);
    }

    if (/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(dateStr)) {
      // Month DD, YYYY
      return new Date(dateStr);
    }

    if (dateStr === "NULL") {
      return new Date(); // current date
    }

    return new Date(dateStr);
  }
}
