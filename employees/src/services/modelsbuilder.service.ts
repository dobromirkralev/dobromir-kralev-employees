import type { Employee } from "../models/employee";
import type { EmployeesProjectPeriod } from "../models/project";
import type { TimePeriodDelta } from "../models/timeperiod";
import type { TimePeriodService } from "./timeperiod.service";

export class ModelsBuilderService {
  private timeperiodService: TimePeriodService;

  projects: Map<string, Employee[]> = new Map();
  employeeProjectPeriods: EmployeesProjectPeriod[] = [];
  employeeList: Employee[] = [];

  constructor(timeperiodService: TimePeriodService) {
    this.timeperiodService = timeperiodService;
  }

  buildModels(data: string[][]): void {
    data.forEach((row) => {
      const [employeeIdStr, projectIdStr, startDateStr, endDateStr] = row;
      const employeeId = employeeIdStr;
      const projectId = projectIdStr;
      const startDate = this.timeperiodService.parseDate(startDateStr);
      const endDate = this.timeperiodService.parseDate(endDateStr);
      const period = this.timeperiodService.createTimePeriod(
        startDate,
        endDate
      );

      //construct employees
      const employee: Employee = {
        id: employeeId,
        projectId: projectId,
        period: period,
      };
      this.employeeList.push(employee);

      //construct projects
      if (this.projects.has(projectId)) {
        this.projects.get(projectId)?.push(employee);
      } else {
        this.projects.set(projectId, [employee]);
      }
    });

    console.log(this.projects);
    this.buildPairsPerProject();
  }

  buildPairsPerProject(): void {
    const employeeProjectPeriods: Map<string, TimePeriodDelta> = new Map();
    for (const [projectId, employees] of this.projects) {
      if (!Array.isArray(employees) || employees.length < 2) {
        continue;
      }
      for (let i = 0; i < employees.length - 1; i++) {
        for (let j = i + 1; j < employees.length; j++) {
          const emp1 = employees[i];
          const emp2 = employees[j];
          const overlapPeriod = this.timeperiodService.createDeltaPeriod(
            emp1.period,
            emp2.period
          );
          if (overlapPeriod.delta > 0) {
            const pairId1 = `${emp1.id}:${emp2.id}:${projectId}`;
            const pairId2 = `${emp2.id}:${emp1.id}:${projectId}`;
            if (
              !employeeProjectPeriods.has(pairId1) &&
              !employeeProjectPeriods.has(pairId2)
            ) {
              employeeProjectPeriods.set(pairId1, overlapPeriod);
            }
          }
        }
      }
    }
    this.employeeProjectPeriods = Array.from(
      employeeProjectPeriods,
      ([id, overlapPeriod]) => ({ id, overlapPeriod })
    );
    console.log(this.employeeProjectPeriods);
  }
}
