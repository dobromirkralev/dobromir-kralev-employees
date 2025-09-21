import type { TimePeriod } from "./timeperiod";

export interface Employee {
  id: string;
  projectId: string;
  period: TimePeriod;
}
