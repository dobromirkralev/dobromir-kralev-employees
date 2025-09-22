import type { TimePeriod, TimePeriodDelta } from "../models/timeperiod";
import type { ITimePeriodService } from "./types/timeperiod";
import { DateTime } from "luxon";

export class TimePeriodService implements ITimePeriodService {
  createTimePeriod(startDate: Date, endDate: Date): TimePeriod {
    return {
      start: startDate,
      end: endDate,
      numberOfDays: this.calculateNumberOfDays(startDate, endDate),
    };
  }

  createDeltaPeriod(
    perdiod1: TimePeriod,
    period2: TimePeriod
  ): TimePeriodDelta {
    const latestStart =
      DateTime.fromJSDate(perdiod1.start) > DateTime.fromJSDate(period2.start)
        ? perdiod1.start
        : period2.start;
    const earliestEnd =
      DateTime.fromJSDate(perdiod1.end) < DateTime.fromJSDate(period2.end)
        ? perdiod1.end
        : period2.end;
    if (latestStart > earliestEnd) {
      return {
        startTime: latestStart,
        endTime: earliestEnd,
        delta: 0, // No overlap
      };
    }
    return {
      startTime: latestStart,
      endTime: earliestEnd,
      delta: this.calculateNumberOfDays(latestStart, earliestEnd),
    };
  }

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
    const latestStart =
      DateTime.fromJSDate(start1) > DateTime.fromJSDate(start2)
        ? start1
        : start2;
    const earliestEnd =
      DateTime.fromJSDate(end1) < DateTime.fromJSDate(end2) ? end1 : end2;
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

    // NULL (which means current date)

    dateStr = dateStr.trim();

    let dt = DateTime.fromISO(dateStr, { zone: "utc" });
    if (dt.isValid) {
      return dt.toJSDate();
    }

    dt = DateTime.fromFormat(dateStr, "yyyy-MM-dd HH:mm:ss 'UTC'", {
      zone: "utc",
    });
    if (dt.isValid) {
      return dt.toJSDate();
    }

    dt = DateTime.fromFormat(dateStr, "dd-MM-yyyy", { zone: "utc" });
    if (dt.isValid) {
      return dt.toJSDate();
    }

    dt = DateTime.fromFormat(dateStr, "MM/dd/yyyy", { zone: "utc" });
    if (dt.isValid) {
      return dt.toJSDate();
    }

    dt = DateTime.fromFormat(dateStr, "dd/MM/yyyy", { zone: "utc" });
    if (dt.isValid) {
      return dt.toJSDate();
    }

    if (dateStr === "NULL") {
      return new Date(); // current date
    }

    return new Date(dateStr);
  }
}
