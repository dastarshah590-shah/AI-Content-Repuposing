import { Router } from "express";
import {
  getWorkspace,
  postClient,
  postTeamMember
} from "../controllers/workspaceController.js";

export const workspaceRoutes = Router();

workspaceRoutes.get("/workspace", getWorkspace);
workspaceRoutes.post("/clients", postClient);
workspaceRoutes.post("/team-members", postTeamMember);