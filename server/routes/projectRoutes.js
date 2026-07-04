import { Router } from "express";
import { getProject, getProjects, postProject } from "../controllers/projectController.js";

export const projectRoutes = Router();

projectRoutes.get("/", getProjects);
projectRoutes.post("/", postProject);
projectRoutes.get("/:projectId", getProject);