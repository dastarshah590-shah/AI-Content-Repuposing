import { useCallback, useState } from "react";
import {
  generateContent,
  getProject,
  getProjects,
  regenerateOutput,
  saveOutput
} from "../services/api.js";

export function useGenerateContent({ onUsage } = {}) {
  const [result, setResult] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState("");
  const [error, setError] = useState("");

  const refreshProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    }
  }, []);

  const openProject = useCallback(
    async (projectId) => {
      const data = await getProject(projectId);
      const latest = data.latestGeneration;
      if (latest) {
        setResult({
          success: true,
          projectId: data.project.id,
          generationId: latest.id,
          model: latest.aiModel,
          analysis: latest.analysis,
          outputs: latest.outputs,
          calendarIdeas: latest.calendarIdeas || []
        });
      }
      await refreshProjects();
      return data;
    },
    [refreshProjects]
  );

  const runGenerate = useCallback(
    async (payload) => {
      setIsGenerating(true);
      setError("");

      try {
        const data = await generateContent(payload);
        setResult(data);
        onUsage?.(data.usage);
        await refreshProjects();
        return data;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      } finally {
        setIsGenerating(false);
      }
    },
    [onUsage, refreshProjects]
  );

  const runRegenerate = useCallback(
    async ({ output, tone, instructions }) => {
      if (!result?.generationId || !output?.id) return null;

      setRegeneratingId(output.id);
      setError("");

      try {
        const data = await regenerateOutput({
          generationId: result.generationId,
          outputId: output.id,
          platform: output.platform,
          tone,
          instructions
        });

        setResult((current) => ({
          ...current,
          outputs: current.outputs.map((item) =>
            item.id === output.id ? data.output : item
          )
        }));
        onUsage?.(data.usage);

        return data.output;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      } finally {
        setRegeneratingId("");
      }
    },
    [onUsage, result]
  );

  const runSaveOutput = useCallback(async (outputId, content, status) => {
    const data = await saveOutput(outputId, content, status);
    setResult((current) =>
      current
        ? {
            ...current,
            outputs: current.outputs.map((output) =>
              output.id === outputId ? data.output : output
            )
          }
        : current
    );
    onUsage?.(data.usage);
    return data.output;
  }, [onUsage]);

  return {
    result,
    projects,
    isGenerating,
    regeneratingId,
    error,
    setError,
    setResult,
    refreshProjects,
    openProject,
    runGenerate,
    runRegenerate,
    runSaveOutput
  };
}