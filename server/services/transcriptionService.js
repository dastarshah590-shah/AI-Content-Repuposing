import fs from "node:fs";
import OpenAI from "openai";
import { env } from "../config/env.js";

let client;

function getClient() {
  if (!env.openAiApiKey) return null;
  if (!client) client = new OpenAI({ apiKey: env.openAiApiKey });
  return client;
}

export async function transcribeAudio(filePath) {
  const openai = getClient();

  if (!openai) {
    return "Demo transcript placeholder. Add OPENAI_API_KEY to transcribe uploaded audio or video.";
  }

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: env.openAiTranscriptionModel
  });

  return transcription.text;
}
