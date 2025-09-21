export interface TimePeriod {
  start: Date;
  end: Date;
  numberOfDays: number;
}

export interface TimePeriodDelta {
  startTimePeriod: TimePeriod;
  endTimePeriod: TimePeriod;
  delta: number;
}
