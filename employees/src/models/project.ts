import type { TimePeriodDelta } from "./timeperiod";

export interface EmployeesProjectPeriod {
  id: string; // Emp1:Emp2:ProjectId
  overlapPeriod: TimePeriodDelta;
}
