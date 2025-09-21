import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppServicesProvider } from "./di/AppServices.tsx";
import { TimePeriodService } from "./services/timeperiod.service.ts";

const services = {
  timePeriodService: new TimePeriodService(),
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppServicesProvider services={services}>
      <App />
    </AppServicesProvider>
  </StrictMode>
);
