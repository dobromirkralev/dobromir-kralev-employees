export interface IModelsBuilder {
  buildModels(data: string[][]): void;
  buildPairsPerProject(): void;
  aggregatePairsAccrossProjects(): Map<
    string,
    {
      empA: string;
      empB: string;
      totalTime: number;
      projects: string[];
    }
  >;
  findTopPair(): {
    empA: string;
    empB: string;
    totalTime: number;
    projects: string[];
  };

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
  }[];
}
