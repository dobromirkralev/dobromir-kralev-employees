export interface ITimePeriodService {
  calculateNumberOfDays(start: Date, end: Date): number;
  calculateDeltaDays(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): number;
  parseDate(dateStr: string): Date;
}
