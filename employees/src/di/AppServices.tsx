import React, { createContext, useContext } from "react";
import type { ITimePeriodService } from "../services/types/timeperiod";
import type { IModelsBuilder } from "../services/types/modelsbuider";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAppServices {
  timePeriodService?: ITimePeriodService;
  modelsBuilderService?: IModelsBuilder;
}

const defaultServices: IAppServices = {
  timePeriodService: undefined,
  modelsBuilderService: undefined,
};

const AppServicesContext = createContext<IAppServices>(defaultServices);
export const AppServicesProvider: React.FC<
  React.PropsWithChildren<{ services?: IAppServices }>
> = ({ services = {}, children }) => {
  const mergedServices = { ...defaultServices, ...services };
  return (
    <AppServicesContext.Provider value={mergedServices}>
      {children}
    </AppServicesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useServices(): IAppServices {
  return useContext(AppServicesContext);
}
