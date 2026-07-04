const platformTitles = {
  linkedin: "LinkedIn Post",
  twitter: "X/Twitter Thread",
  instagram: "Instagram Caption",
  video_script: "Short-Form Video Script",
  email: "Email Newsletter",
  blog_summary: "SEO Blog Summary",
  facebook: "Facebook Post",
  youtube_description: "YouTube Description",
  hooks: "Reusable Hooks",
  ctas: "Calls To Action",
  hashtags: "Hashtag Sets",
  content_calendar: "Content Calendar Ideas"
};

function splitSentences(content) {
  return content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 30);
}

function extractKeywords(content) {
  const stopWords = new Set([
    "about",
    "after",
    "again",
    "because",
    "before",
    "being",
    "between",
    "could",
    "every",
    "from",
    "have",
    "into",
    "more",
    "should",
    "that",
    "their",
    "there",
    "these",
    "they",
    "this",
    "through",
    "with",
    "would",
    "your"
  ]);

  const counts = new Map();
  content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !stopWords.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function createAnalysis({ title, sourceContent, audience, goal, tone }) {
  const sentences = splitSentences(sourceContent);
  const keywords = extractKeywords(sourceContent);
  const mainTopic = title || keywords.slice(0, 3).join(" ");
  const summary =
    sentences.slice(0, 2).join(" ") ||
    `This content explains ${mainTopic} for ${audience}.`;

  return {
    mainTopic,
    summary,
    keyIdeas: [
      sentences[0] || `${mainTopic} matters because it affects daily decisions.`,
      sentences[1] || `The audience can use this idea to make progress faster.`,
      sentences[2] || `Clear examples make the message easier to apply.`
    ],
    audiencePainPoints: [
      `They do not have time to turn one idea into platform-specific content.`,
      `They want useful output without rewriting from scratch.`,
      `They need the message to stay consistent across channels.`
    ],
    audienceDesires: [
      `Publish more consistently with less manual effort.`,
      `Sound clear, credible, and useful.`,
      `Turn one original idea into a repeatable content system.`
    ],
    hooks: [
      `Most ${audience} are sitting on content they could reuse today.`,
      `One strong idea can become a week of useful content.`,
      `The fastest content workflow starts before you open a blank page.`
    ],
    quotableLines: sentences.slice(0, 3),
    contentAngles: [
      "How-to lesson",
      "Mistakes to avoid",
      "Behind-the-scenes process",
      "Before and after transformation"
    ],
    ctas: [
      `${goal}: save this for your next content planning session.`,
      "Try this workflow with your next long-form piece.",
      "Reply with the platform you want to repurpose for first."
    ],
    suggestedTone: tone,
    platformOpportunities: [
      "LinkedIn point-of-view post",
      "X/Twitter tactical thread",
      "Instagram educational caption",
      "Short-form video script",
      "Email newsletter"
    ],
    keywords
  };
}

function makeHashtags(keywords) {
  const base = keywords.length ? keywords : ["content", "marketing", "creator"];
  return base.slice(0, 8).map((keyword) => `#${keyword.replace(/-/g, "")}`);
}

function createOutput({ platform, analysis, tone, audience, goal, variantNote = "" }) {
  const hashtags = makeHashtags(analysis.keywords || []);
  const hook = analysis.hooks[0];
  const idea = analysis.keyIdeas[0];
  const cta = analysis.ctas[0];
  const note = variantNote ? `Variation note: ${variantNote}` : `Tone: ${tone}`;
  const topic = analysis.mainTopic;

  const templates = {
    linkedin: `${hook}\n\n${idea}\n\nHere is the useful part: repurposing works best when you start with the message, then adapt the format. LinkedIn needs a clear point of view, proof, and one takeaway someone can use today.\n\nFor ${audience}, the opportunity is simple: take one long-form asset and create focused posts that match the channel. The goal is to ${goal}.\n\n${cta}`,
    twitter: `1/ ${hook}\n\n2/ Start with the core idea: ${topic}.\n\n3/ Pull out the strongest lesson: ${idea}\n\n4/ Turn that lesson into one practical tip, one example, and one question.\n\n5/ Adapt the same message for each platform instead of rewriting from zero.\n\n6/ Keep the promise tight: ${goal}.\n\n7/ ${cta}`,
    instagram: `${hook}\n\n${idea}\n\nThe easiest way to make this useful:\n\n- Pick the strongest takeaway\n- Turn it into a simple lesson\n- Add one example\n- End with a question\n\nWhat platform would you repurpose this for first?\n\n${hashtags.slice(0, 8).join(" ")}`,
    video_script: `Hook: ${hook}\n\nBody:\n"Here is the mistake: most people treat every platform like a blank page. Instead, start with the main idea from your long-form content. Pull one takeaway, one example, and one action step. Then shape it for the platform."\n\nOn-screen text:\n- One idea, many assets\n- Pull the strongest takeaway\n- Adapt the format\n- Publish faster\n\nCTA: ${cta}`,
    email: `Subject: Turn one idea into more content\nPreview text: A faster way to repurpose your long-form assets.\n\nHi,\n\n${hook}\n\n${idea}\n\nThe simple workflow is to find the strongest message, choose the platform, and reshape the content around how that platform is consumed. A LinkedIn post needs a point of view. A thread needs sequence. A video needs a fast hook. An email needs a clear reason to keep reading.\n\nUse this the next time you finish a blog, transcript, or podcast notes.\n\n${cta}`,
    blog_summary: `Suggested title: ${topic}: A Practical Guide for ${audience}\n\nMeta description: Learn how ${topic} can help ${audience} create clearer, more useful content with less manual effort.\n\nSummary: ${analysis.summary}\n\nSEO keywords: ${(analysis.keywords || []).join(", ")}`,
    facebook: `${hook}\n\n${idea}\n\nA useful way to think about it: one good source can create several smaller, sharper posts when you adapt the angle to the audience.\n\nWhat would you turn this into first?`,
    youtube_description: `${topic}\n\n${analysis.summary}\n\nIn this video:\n00:00 The core problem\n00:30 Why the idea matters\n01:30 How to apply it\n03:00 Key takeaway\n\n${cta}`,
    hooks: analysis.hooks.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    ctas: analysis.ctas.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    hashtags: `${hashtags.join(" ")}\n\nNiche set: #contentstrategy #creatorworkflow #marketingtips`,
    content_calendar: [
      "Day 1: Publish the main takeaway on LinkedIn.",
      "Day 2: Turn the key steps into an X/Twitter thread.",
      "Day 3: Share the strongest quote as an Instagram caption.",
      "Day 4: Record the short-form video script.",
      "Day 5: Send the email version to your list."
    ].join("\n")
  };

  return {
    platform,
    title: platformTitles[platform] || "Generated Output",
    content: templates[platform] || templates.linkedin,
    hashtags,
    cta,
    notes: note
  };
}

export function generateMockContent(payload) {
  const analysis = createAnalysis(payload);
  const outputs = payload.platforms.map((platform) =>
    createOutput({
      platform,
      analysis,
      tone: payload.tone,
      audience: payload.audience,
      goal: payload.goal
    })
  );

  return {
    projectTitle: payload.title,
    summary: analysis.summary,
    analysis,
    outputs,
    calendarIdeas: Array.from({ length: 10 }, (_, index) => ({
      day: `Day ${index + 1}`,
      platform: payload.platforms[index % payload.platforms.length],
      contentIdea: `Repurpose "${analysis.mainTopic}" into a ${payload.tone} asset focused on ${analysis.contentAngles[index % analysis.contentAngles.length].toLowerCase()}.`
    }))
  };
}

export function regenerateMockOutput({ generation, platform, tone, instructions }) {
  return createOutput({
    platform,
    analysis: generation.analysis,
    tone,
    audience: generation.audience,
    goal: "improve this output",
    variantNote: instructions || "Fresh variation"
  });
}
