import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { Router } from "express";
import { env } from "../config/env.js";
import { uploadFile } from "../controllers/uploadController.js";
import { resolveRuntimePath } from "../runtimePaths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = resolveRuntimePath(path.resolve(__dirname, "../uploads"), "uploads");

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: env.uploadSizeLimitMb * 1024 * 1024
  }
});

export const uploadRoutes = Router();

uploadRoutes.post("/upload", upload.single("file"), uploadFile);
