import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppServicesProvider } from "./di/AppServices.tsx";
import { TimePeriodService } from "./services/timeperiod.service.ts";
import { ModelsBuilderService } from "./services/modelsbuilder.service.ts";

const timePeriodService = new TimePeriodService();
const modelsBuilderService = new ModelsBuilderService(timePeriodService);

const services = {
  timePeriodService,
  modelsBuilderService,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppServicesProvider services={services}>
      <App />
    </AppServicesProvider>
  </StrictMode>
);
