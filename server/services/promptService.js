export const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mainTopic: { type: "string" },
    summary: { type: "string" },
    keyIdeas: { type: "array", items: { type: "string" } },
    audiencePainPoints: { type: "array", items: { type: "string" } },
    audienceDesires: { type: "array", items: { type: "string" } },
    hooks: { type: "array", items: { type: "string" } },
    quotableLines: { type: "array", items: { type: "string" } },
    contentAngles: { type: "array", items: { type: "string" } },
    ctas: { type: "array", items: { type: "string" } },
    suggestedTone: { type: "string" },
    platformOpportunities: { type: "array", items: { type: "string" } }
  },
  required: [
    "mainTopic",
    "summary",
    "keyIdeas",
    "audiencePainPoints",
    "audienceDesires",
    "hooks",
    "quotableLines",
    "contentAngles",
    "ctas",
    "suggestedTone",
    "platformOpportunities"
  ]
};

export const generationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectTitle: { type: "string" },
    summary: { type: "string" },
    outputs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          platform: {
            type: "string",
            enum: [
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
            ]
          },
          title: { type: "string" },
          content: { type: "string" },
          hashtags: { type: "array", items: { type: "string" } },
          cta: { type: "string" },
          notes: { type: "string" }
        },
        required: ["platform", "title", "content", "hashtags", "cta", "notes"]
      }
    },
    calendarIdeas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          day: { type: "string" },
          platform: { type: "string" },
          contentIdea: { type: "string" }
        },
        required: ["day", "platform", "contentIdea"]
      }
    }
  },
  required: ["projectTitle", "summary", "outputs", "calendarIdeas"]
};

export const singleOutputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    platform: { type: "string" },
    title: { type: "string" },
    content: { type: "string" },
    hashtags: { type: "array", items: { type: "string" } },
    cta: { type: "string" },
    notes: { type: "string" }
  },
  required: ["platform", "title", "content", "hashtags", "cta", "notes"]
};

const platformRules = {
  linkedin:
    "Create a LinkedIn post with a strong hook, short paragraphs, a useful insight, and a soft CTA or question.",
  twitter:
    "Create an X/Twitter thread with 6 to 8 posts, punchy language, each post building on the previous one, and a final CTA.",
  instagram:
    "Create an Instagram caption with a strong first line, line breaks, accessible language, 5 to 10 hashtags, and an engagement question.",
  video_script:
    "Create a 30 to 60 second short-form video script with a first-three-seconds hook, body beats, on-screen text, and CTA.",
  email:
    "Create an email newsletter with subject line, preview text, relatable opening, value-driven body, and clear CTA.",
  blog_summary:
    "Create an SEO-friendly blog summary with improved title, meta description, keywords, and summary.",
  facebook:
    "Create a conversational Facebook post that invites comments and keeps the core message accessible.",
  youtube_description:
    "Create a YouTube description with a compelling first paragraph, key takeaways, chapters, and CTA.",
  hooks:
    "Create a list of strong reusable hooks for the source idea.",
  ctas:
    "Create a list of direct and soft calls to action.",
  hashtags:
    "Create relevant hashtag groups for social publishing.",
  content_calendar:
    "Create practical content calendar ideas that turn the source into multiple days of posts."
};

export function buildAnalysisPrompt({
  sourceContent,
  audience,
  goal,
  contentType,
  optionalContext,
  brandVoice
}) {
  return `
Analyze this source content for multi-platform repurposing.

Source type: ${contentType}
Target audience: ${audience}
Goal: ${goal}
Optional context: ${optionalContext || "None"}
Brand voice notes: ${brandVoice || "None"}

Source content:
${sourceContent}

Extract the strongest strategic information for repurposing. Do not invent unsupported facts.
Return structured JSON only.
`;
}

export function buildGenerationPrompt({ analysis, platforms, tone, audience, goal }) {
  const rules = platforms
    .map((platform) => `- ${platform}: ${platformRules[platform] || "Create a native platform output."}`)
    .join("\n");

  return `
Using this content analysis, generate platform-ready content.

Content analysis:
${JSON.stringify(analysis, null, 2)}

Selected platforms:
${platforms.join(", ")}

Platform rules:
${rules}

Tone: ${tone}
Audience: ${audience}
Goal: ${goal}

Rules:
- Do not invent unsupported facts.
- Keep each output native to its platform.
- Use strong hooks and specific CTAs where useful.
- Avoid generic filler.
- Generate only the selected platforms.
- Return structured JSON only.
`;
}

export function buildRegenerationPrompt({
  generation,
  existingOutput,
  platform,
  tone,
  instructions
}) {
  return `
Regenerate one platform output from the existing generation.

Content analysis:
${JSON.stringify(generation.analysis, null, 2)}

Existing output:
${JSON.stringify(existingOutput, null, 2)}

Platform to regenerate: ${platform}
Tone: ${tone}
Additional instructions: ${instructions || "Improve clarity and usefulness."}

Return only one structured JSON object for the regenerated output.
`;
}
