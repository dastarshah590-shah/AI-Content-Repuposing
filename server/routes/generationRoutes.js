import { Router } from "express";
import {
  generateContent,
  putOutput,
  regenerateContent
} from "../controllers/generationController.js";

export const generationRoutes = Router();

generationRoutes.post("/generate", generateContent);
generationRoutes.post("/regenerate", regenerateContent);
generationRoutes.put("/outputs/:outputId", putOutput);
