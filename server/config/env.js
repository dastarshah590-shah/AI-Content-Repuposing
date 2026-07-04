import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3001),
  appUrl: process.env.APP_URL || "http://localhost:5173",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5.5",
  openAiTranscriptionModel:
    process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-transcribe",
  maxInputChars: Number(process.env.MAX_INPUT_CHARS || 20000),
  minInputChars: Number(process.env.MIN_INPUT_CHARS || 300),
  uploadSizeLimitMb: Number(process.env.UPLOAD_SIZE_LIMIT_MB || 25)
};
