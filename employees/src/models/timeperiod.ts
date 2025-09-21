export interface TimePeriod {
  start: Date;
  end: Date;
  numberOfDays: number;
}

export interface TimePeriodDelta {
  startTime: Date;
  endTime: Date;
  delta: number;
}
