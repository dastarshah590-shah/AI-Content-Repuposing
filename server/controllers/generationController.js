import {
  assertGenerationAllowed,
  getBrandProfile,
  getGeneration,
  getOutput,
  getUsage,
  recordGeneration,
  saveGeneration,
  updateOutput
} from "../services/projectStore.js";
import {
  generateRepurposedContent,
  regenerateRepurposedOutput
} from "../services/openaiService.js";
import {
  validateGenerationPayload,
  validateOutputUpdatePayload,
  validateRegeneratePayload
} from "../utils/validators.js";

function brandVoiceFromProfile(profile) {
  if (!profile) return "";
  return [
    profile.voiceDescription,
    profile.wordsToUse?.length ? `Words to use: ${profile.wordsToUse.join(", ")}` : "",
    profile.wordsToAvoid?.length ? `Words to avoid: ${profile.wordsToAvoid.join(", ")}` : "",
    profile.ctaStyle ? `CTA style: ${profile.ctaStyle}` : "",
    profile.emojiPreference ? `Emoji preference: ${profile.emojiPreference}` : "",
    profile.exampleContent ? `Example: ${profile.exampleContent}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateContent(req, res, next) {
  try {
    const payload = validateGenerationPayload(req.body);
    assertGenerationAllowed(req.userId, payload.platforms.length);

    const brandProfileId = req.body.brandProfileId || "";
    const clientId = req.body.clientId || "";
    const brandProfile = brandProfileId ? getBrandProfile(brandProfileId, req.userId) : null;
    const mergedPayload = {
      ...payload,
      brandProfileId,
      clientId,
      audience: payload.audience || brandProfile?.targetAudience || "content consumers",
      tone: payload.tone || brandProfile?.preferredTone || "professional",
      brandVoice: [payload.brandVoice, brandVoiceFromProfile(brandProfile)]
        .filter(Boolean)
        .join("\n")
    };

    const generated = await generateRepurposedContent(mergedPayload);
    const saved = saveGeneration({
      userId: req.userId,
      projectId: payload.projectId,
      title: payload.title,
      sourceContent: payload.sourceContent,
      platforms: payload.platforms,
      tone: mergedPayload.tone,
      audience: mergedPayload.audience,
      model: generated.model,
      analysis: generated.analysis,
      generatedOutputs: generated.outputs,
      calendarIdeas: generated.calendarIdeas || [],
      clientId,
      brandProfileId
    });
    const usage = recordGeneration(req.userId, payload.platforms.length);

    res.json({
      success: true,
      projectId: saved.project.id,
      generationId: saved.generation.id,
      model: saved.generation.aiModel,
      analysis: saved.generation.analysis,
      outputs: saved.outputs,
      calendarIdeas: saved.generation.calendarIdeas,
      usage
    });
  } catch (error) {
    next(error);
  }
}

export async function regenerateContent(req, res, next) {
  try {
    const payload = validateRegeneratePayload(req.body);
    const generation = getGeneration(payload.generationId, req.userId);

    if (!generation) {
      return res.status(404).json({
        success: false,
        message: "Generation was not found."
      });
    }

    assertGenerationAllowed(req.userId, 1);

    const existingOutput =
      getOutput(payload.outputId, req.userId) ||
      generation.outputs.find((output) => output.platform === payload.platform);

    if (!existingOutput) {
      return res.status(404).json({
        success: false,
        message: "Output was not found."
      });
    }

    const regenerated = await regenerateRepurposedOutput({
      generation,
      existingOutput,
      platform: payload.platform,
      tone: payload.tone,
      instructions: payload.instructions
    });

    const updated = updateOutput(
      existingOutput.id,
      {
        title: regenerated.title,
        content: regenerated.content,
        hashtags: regenerated.hashtags || [],
        cta: regenerated.cta || "",
        notes: regenerated.notes || ""
      },
      req.userId
    );
    const usage = recordGeneration(req.userId, 1);

    res.json({
      success: true,
      platform: updated.platform,
      output: updated,
      usage
    });
  } catch (error) {
    next(error);
  }
}

export function putOutput(req, res, next) {
  try {
    const payload = validateOutputUpdatePayload(req.body);
    const output = updateOutput(
      req.params.outputId,
      {
        content: payload.content,
        status: req.body.status || "edited"
      },
      req.userId
    );

    res.json({
      success: true,
      message: "Output updated successfully.",
      output,
      usage: getUsage(req.userId)
    });
  } catch (error) {
    next(error);
  }
}