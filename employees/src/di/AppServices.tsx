import React, { createContext, useContext } from "react";
import type { ITimePeriodService } from "../services/types/timeperiod";
import { TimePeriodService } from "../services/timeperiod.service";

export interface IAppServices {
  timePeriodService: ITimePeriodService;
}

const defaultServices: IAppServices = {
  timePeriodService: new TimePeriodService(),
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
