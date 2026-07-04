import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { attachUser } from "./middleware/authMiddleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { createRateLimiter } from "./middleware/rateLimitMiddleware.js";
import { apiRoutes } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "uploads");
const distDir = path.resolve(__dirname, "../dist");

fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

app.use(
  cors({
    origin: env.appUrl,
    credentials: false
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(createRateLimiter({ max: 120 }));
app.use("/api", attachUser, apiRoutes);

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, "127.0.0.1", () => {
  console.log(`API server running on http://127.0.0.1:${env.port}`);
});
