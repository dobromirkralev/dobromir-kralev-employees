import type { Employee } from "../models/employee";
import type { EmployeesProjectPeriod } from "../models/project";
import type { TimePeriodDelta } from "../models/timeperiod";
import type { TimePeriodService } from "./timeperiod.service";

export class ModelsBuilderService {
  private timeperiodService: TimePeriodService;

  projects: Map<string, Employee[]> = new Map();
  employeeProjectPeriods: EmployeesProjectPeriod[] = [];
  aggregatedPairs: Map<
    string,
    { empA: string; empB: string; totalTime: number; projects: string[] }
  > = new Map();
  employeeList: Employee[] = [];

  constructor(timeperiodService: TimePeriodService) {
    this.timeperiodService = timeperiodService;
  }

  buildModels(data: string[][]): void {
    // resets state
    this.employeeList = [];
    this.projects = new Map();
    this.employeeProjectPeriods = [];
    this.aggregatedPairs = new Map();

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

    // console.log(this.projects);
    this.buildPairsPerProject();
    this.aggregatePairsAccrossProjects();
    // console.log(this.findTopPair());
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
    // console.log(this.employeeProjectPeriods);
  }

  aggregatePairsAccrossProjects(): Map<
    string,
    {
      empA: string;
      empB: string;
      totalTime: number;
      projects: string[];
    }
  > {
    for (const record of this.employeeProjectPeriods) {
      const [empA, empB, projectId] = record.id.split(":");
      const [first, second] = [empA, empB].sort(); // alphabetical order key to avoid duplications
      const key = `${first}:${second}`;
      if (!this.aggregatedPairs.has(key)) {
        this.aggregatedPairs.set(key, {
          empA,
          empB,
          totalTime: record.overlapPeriod.delta,
          projects: [projectId],
        });
      } else {
        const existing = this.aggregatedPairs.get(key);
        if (existing) {
          existing.totalTime += record.overlapPeriod.delta;
          existing.projects.push(projectId);
        }
      }
    }

    // console.log(this.aggregatedPairs);
    return this.aggregatedPairs;
  }

  findTopPair(): {
    empA: string;
    empB: string;
    totalTime: number;
    projects: string[];
  } | null {
    let topPair = null;
    let maxTime = 0;
    for (const pair of this.aggregatedPairs.values()) {
      if (pair.totalTime > maxTime) {
        maxTime = pair.totalTime;
        topPair = pair;
      }
    }
    return topPair;
  }

  listTopPairsProjects(topPair: {
    empA: string;
    empB: string;
    totalTime: number;
    projects: string[];
  }): {
    empA: string;
    empB: string;
    projectId: string;
    daysTogther: number;
  }[] {
    return this.employeeProjectPeriods
      .filter((record) => {
        const [empA, empB, projId] = record.id.split(":");
        console.log({ empA, empB, projId });
        return (
          ((empA === topPair.empA && empB === topPair.empB) ||
            (empA === topPair.empB && empB === topPair.empA)) &&
          topPair.projects.indexOf(projId) !== -1
        );
      })
      .map((record) => {
        const [empA, empB, projectId] = record.id.split(":");
        return {
          empA,
          empB,
          projectId,
          daysTogther: record.overlapPeriod.delta,
        };
      });
  }
}
