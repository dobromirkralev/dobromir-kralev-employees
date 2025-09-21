import type { TimePeriodService } from "./timeperiod.service";

export class ModelsBuilderService {
  private timeperiodService: TimePeriodService;

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
      const numberOfDays = this.timeperiodService.calculateNumberOfDays(
        startDate,
        endDate
      );

      console.log({
        employeeId,
        projectId,
        startDate,
        endDate,
        numberOfDays,
      });
    });
  }
}
