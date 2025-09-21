import type { TimePeriod, TimePeriodDelta } from "../../models/timeperiod";

export interface ITimePeriodService {
  calculateNumberOfDays(start: Date, end: Date): number;
  calculateDeltaDays(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): number;
  createDeltaPeriod(perdiod1: TimePeriod, period2: TimePeriod): TimePeriodDelta;
  parseDate(dateStr: string): Date;
}
