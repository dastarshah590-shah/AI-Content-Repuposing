import { Router } from "express";
import {
  getIntegrations,
  postConnectIntegration,
  postDisconnectIntegration,
  postExportEvent,
  postQueueOutput
} from "../controllers/integrationController.js";

export const integrationRoutes = Router();

integrationRoutes.get("/integrations", getIntegrations);
integrationRoutes.post("/integrations/:integrationId/connect", postConnectIntegration);
integrationRoutes.post("/integrations/:integrationId/disconnect", postDisconnectIntegration);
integrationRoutes.post("/publish-queue", postQueueOutput);
integrationRoutes.post("/exports/record", postExportEvent);