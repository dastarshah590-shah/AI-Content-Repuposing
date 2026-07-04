import OpenAI from "openai";
import { env } from "../config/env.js";
import {
  analysisSchema,
  buildAnalysisPrompt,
  buildGenerationPrompt,
  buildRegenerationPrompt,
  generationSchema,
  singleOutputSchema
} from "./promptService.js";
import { generateMockContent, regenerateMockOutput } from "./mockGenerationService.js";

let client;

function getClient() {
  if (!env.openAiApiKey) return null;

  if (!client) {
    client = new OpenAI({ apiKey: env.openAiApiKey });
  }

  return client;
}

function parseJsonResponse(response) {
  if (!response.output_text) {
    throw new Error("The AI response did not include text output.");
  }

  return JSON.parse(response.output_text);
}

async function createStructuredResponse({ schema, name, instructions, prompt, maxTokens }) {
  const openai = getClient();

  if (!openai) {
    return null;
  }

  const response = await openai.responses.create({
    model: env.openAiModel,
    reasoning: { effort: "low" },
    input: [
      {
        role: "developer",
        content: instructions
      },
      {
        role: "user",
        content: prompt
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema
      }
    },
    max_output_tokens: maxTokens
  });

  return parseJsonResponse(response);
}

export async function generateRepurposedContent(payload) {
  const openai = getClient();

  if (!openai) {
    return {
      ...generateMockContent(payload),
      model: "local-demo-generator"
    };
  }

  const analysis = await createStructuredResponse({
    name: "content_repurpose_analysis",
    schema: analysisSchema,
    maxTokens: 1800,
    instructions:
      "You are an expert content strategist. Analyze source material for accurate, useful content repurposing.",
    prompt: buildAnalysisPrompt(payload)
  });

  const generation = await createStructuredResponse({
    name: "content_repurpose_generation",
    schema: generationSchema,
    maxTokens: 4200,
    instructions:
      "You are an expert social media strategist and copywriter. Generate native platform-ready marketing assets.",
    prompt: buildGenerationPrompt({
      analysis,
      platforms: payload.platforms,
      tone: payload.tone,
      audience: payload.audience,
      goal: payload.goal
    })
  });

  return {
    ...generation,
    analysis,
    model: env.openAiModel
  };
}

export async function regenerateRepurposedOutput({
  generation,
  existingOutput,
  platform,
  tone,
  instructions
}) {
  const openai = getClient();

  if (!openai) {
    return regenerateMockOutput({ generation, platform, tone, instructions });
  }

  return createStructuredResponse({
    name: "content_repurpose_single_output",
    schema: singleOutputSchema,
    maxTokens: 1600,
    instructions:
      "You are an expert social media strategist. Regenerate one platform output from the existing analysis.",
    prompt: buildRegenerationPrompt({
      generation,
      existingOutput,
      platform,
      tone,
      instructions
    })
  });
}
