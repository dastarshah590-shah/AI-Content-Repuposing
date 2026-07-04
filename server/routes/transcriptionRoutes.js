import { Router } from "express";
import { transcribeFile } from "../controllers/transcriptionController.js";

export const transcriptionRoutes = Router();

transcriptionRoutes.post("/transcribe", transcribeFile);
