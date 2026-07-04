import { Router } from "express";
import { env } from "../config/env.js";
import { accountRoutes } from "./accountRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { brandRoutes } from "./brandRoutes.js";
import { generationRoutes } from "./generationRoutes.js";
import { integrationRoutes } from "./integrationRoutes.js";
import { projectRoutes } from "./projectRoutes.js";
import { transcriptionRoutes } from "./transcriptionRoutes.js";
import { uploadRoutes } from "./uploadRoutes.js";
import { workspaceRoutes } from "./workspaceRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    user: req.user,
    model: env.openAiApiKey ? env.openAiModel : "local-demo-generator",
    transcriptionModel: env.openAiTranscriptionModel
  });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use(accountRoutes);
apiRoutes.use("/projects", projectRoutes);
apiRoutes.use(brandRoutes);
apiRoutes.use(workspaceRoutes);
apiRoutes.use(integrationRoutes);
apiRoutes.use(generationRoutes);
apiRoutes.use(uploadRoutes);
apiRoutes.use(transcriptionRoutes);