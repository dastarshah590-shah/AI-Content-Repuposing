import {
  createBrandProfile,
  deleteBrandProfile,
  listBrandProfiles,
  updateBrandProfile
} from "../services/projectStore.js";
import { stripUnsafeHtml } from "../utils/validators.js";

function listFromText(value) {
  if (Array.isArray(value)) return value.map(stripUnsafeHtml).filter(Boolean);
  return String(value || "")
    .split(",")
    .map((item) => stripUnsafeHtml(item))
    .filter(Boolean);
}

function normalizePayload(body = {}) {
  return {
    name: stripUnsafeHtml(body.name),
    voiceDescription: stripUnsafeHtml(body.voiceDescription),
    targetAudience: stripUnsafeHtml(body.targetAudience),
    preferredTone: stripUnsafeHtml(body.preferredTone || "professional"),
    wordsToUse: listFromText(body.wordsToUse),
    wordsToAvoid: listFromText(body.wordsToAvoid),
    ctaStyle: stripUnsafeHtml(body.ctaStyle),
    emojiPreference: stripUnsafeHtml(body.emojiPreference || "minimal"),
    formalityLevel: Number(body.formalityLevel || 50),
    exampleContent: stripUnsafeHtml(body.exampleContent)
  };
}

export function getBrandProfiles(req, res) {
  res.json({
    success: true,
    brandProfiles: listBrandProfiles(req.userId)
  });
}

export function postBrandProfile(req, res, next) {
  try {
    const profile = createBrandProfile(req.userId, normalizePayload(req.body));
    res.status(201).json({
      success: true,
      brandProfile: profile
    });
  } catch (error) {
    next(error);
  }
}

export function putBrandProfile(req, res, next) {
  try {
    const profile = updateBrandProfile(
      req.userId,
      req.params.profileId,
      normalizePayload(req.body)
    );
    res.json({
      success: true,
      brandProfile: profile
    });
  } catch (error) {
    next(error);
  }
}

export function removeBrandProfile(req, res) {
  deleteBrandProfile(req.userId, req.params.profileId);
  res.json({ success: true });
}