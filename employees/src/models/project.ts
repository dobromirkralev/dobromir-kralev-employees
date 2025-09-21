import type { Employee } from "./employee";
import type { TimePeriodDelta } from "./timeperiod";

export interface Project {
  id: string;
  employees: Employee[];
}

export interface EmployeesProjectPeriod {
  id: string; // Emp1:Emp2:ProjectId
  deltaPeriod: TimePeriodDelta;
}
