import { Router } from "express";
import { getPlans, getUsageSummary, putPlan } from "../controllers/accountController.js";

export const accountRoutes = Router();

accountRoutes.get("/plans", getPlans);
accountRoutes.get("/usage", getUsageSummary);
accountRoutes.put("/plan", putPlan);