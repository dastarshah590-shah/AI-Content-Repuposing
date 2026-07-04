import { env } from "../config/env.js";

export const SUPPORTED_PLATFORMS = [
  "linkedin",
  "twitter",
  "instagram",
  "video_script",
  "email",
  "blog_summary",
  "facebook",
  "youtube_description",
  "hooks",
  "ctas",
  "hashtags",
  "content_calendar"
];

export const SUPPORTED_TONES = [
  "professional",
  "friendly",
  "bold",
  "educational",
  "witty",
  "persuasive",
  "inspirational",
  "casual",
  "founder-style",
  "agency-style"
];

export const SUPPORTED_MEDIA_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "video/mp4",
  "video/quicktime"
];

export function stripUnsafeHtml(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateGenerationPayload(payload = {}) {
  const errors = [];
  const sourceContent = stripUnsafeHtml(payload.content || payload.sourceContent);
  const title = stripUnsafeHtml(payload.title || "Untitled Content");
  const audience = stripUnsafeHtml(payload.audience || "content consumers");
  const goal = stripUnsafeHtml(payload.goal || "repurpose this content");
  const optionalContext = stripUnsafeHtml(payload.optionalContext || "");
  const brandVoice = stripUnsafeHtml(payload.brandVoice || "");
  const customTone = stripUnsafeHtml(payload.customTone || "");
  const tone = stripUnsafeHtml(payload.tone || customTone || "professional");
  const contentType = stripUnsafeHtml(payload.contentType || "article");
  const platforms = Array.isArray(payload.platforms) ? payload.platforms : [];

  if (!sourceContent || sourceContent.length < env.minInputChars) {
    errors.push(`Please paste at least ${env.minInputChars} characters of content.`);
  }

  if (sourceContent.length > env.maxInputChars) {
    errors.push(`Please keep content under ${env.maxInputChars.toLocaleString()} characters.`);
  }

  if (!platforms.length) {
    errors.push("Select at least one platform.");
  }

  const invalidPlatforms = platforms.filter(
    (platform) => !SUPPORTED_PLATFORMS.includes(platform)
  );

  if (invalidPlatforms.length) {
    errors.push(`Unsupported platforms: ${invalidPlatforms.join(", ")}.`);
  }

  if (!tone || tone.length > 200) {
    errors.push("Choose a tone or enter a custom tone under 200 characters.");
  }

  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.status = 400;
    throw error;
  }

  return {
    projectId: payload.projectId,
    title,
    sourceContent,
    contentType,
    platforms,
    tone,
    audience,
    goal,
    optionalContext,
    brandVoice
  };
}

export function validateRegeneratePayload(payload = {}) {
  const platform = stripUnsafeHtml(payload.platform || "");
  const tone = stripUnsafeHtml(payload.tone || "professional");
  const instructions = stripUnsafeHtml(payload.instructions || "");

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    const error = new Error("Choose a valid platform to regenerate.");
    error.status = 400;
    throw error;
  }

  if (tone.length > 200 || instructions.length > 400) {
    const error = new Error("Tone or instructions are too long.");
    error.status = 400;
    throw error;
  }

  return {
    generationId: payload.generationId,
    outputId: payload.outputId,
    platform,
    tone,
    instructions
  };
}

export function validateOutputUpdatePayload(payload = {}) {
  const content = String(payload.content || "").trim();

  if (!content) {
    const error = new Error("Output content cannot be empty.");
    error.status = 400;
    throw error;
  }

  if (content.length > 12000) {
    const error = new Error("Output content is too long to save.");
    error.status = 400;
    throw error;
  }

  return { content };
}

export function assertSupportedMedia(file) {
  if (!file) {
    const error = new Error("Please upload a media file.");
    error.status = 400;
    throw error;
  }

  if (!SUPPORTED_MEDIA_TYPES.includes(file.mimetype)) {
    const error = new Error("This file type is not supported. Upload MP3, WAV, MP4, M4A, or MOV.");
    error.status = 400;
    throw error;
  }
}
