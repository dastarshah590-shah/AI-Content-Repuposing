import os from "node:os";
import path from "node:path";

const runtimeRoot = process.env.VERCEL
  ? path.join(os.tmpdir(), "ai-content-repurposing")
  : null;

export function resolveRuntimePath(localPath, runtimeName) {
  if (runtimeRoot) {
    return path.join(runtimeRoot, runtimeName);
  }

  return localPath;
}
