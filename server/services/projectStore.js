import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { createId } from "../utils/id.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const dataFile = path.join(dataDir, "local-store.json");

export const PLAN_LIMITS = {
  free: {
    label: "Free",
    price: 0,
    monthlyGenerations: 3,
    maxPlatforms: 3,
    mediaUploadMb: 0,
    brandProfiles: 1,
    teamMembers: 1,
    clients: 1,
    exports: ["copy", "markdown", "txt"]
  },
  starter: {
    label: "Starter",
    price: 15,
    monthlyGenerations: 50,
    maxPlatforms: 8,
    mediaUploadMb: 25,
    brandProfiles: 3,
    teamMembers: 2,
    clients: 5,
    exports: ["copy", "markdown", "txt", "csv", "doc"]
  },
  pro: {
    label: "Pro",
    price: 39,
    monthlyGenerations: 1000,
    maxPlatforms: 12,
    mediaUploadMb: 250,
    brandProfiles: 10,
    teamMembers: 5,
    clients: 25,
    exports: ["copy", "markdown", "txt", "csv", "pdf", "doc", "notion"]
  },
  agency: {
    label: "Agency",
    price: 99,
    monthlyGenerations: 5000,
    maxPlatforms: 12,
    mediaUploadMb: 500,
    brandProfiles: 50,
    teamMembers: 25,
    clients: 250,
    exports: ["copy", "markdown", "txt", "csv", "pdf", "doc", "notion", "calendar_csv"]
  }
};

const defaultIntegrations = [
  { id: "linkedin", label: "LinkedIn", category: "social", connected: false, mode: "oauth-required" },
  { id: "x", label: "X/Twitter", category: "social", connected: false, mode: "oauth-required" },
  { id: "instagram", label: "Instagram", category: "social", connected: false, mode: "oauth-required" },
  { id: "facebook", label: "Facebook", category: "social", connected: false, mode: "oauth-required" },
  { id: "youtube", label: "YouTube", category: "social", connected: false, mode: "oauth-required" },
  { id: "notion", label: "Notion", category: "export", connected: false, mode: "api-key-required" },
  { id: "google_docs", label: "Google Docs", category: "export", connected: false, mode: "oauth-required" },
  { id: "airtable", label: "Airtable", category: "export", connected: false, mode: "api-key-required" },
  { id: "wordpress", label: "WordPress", category: "publishing", connected: false, mode: "api-key-required" },
  { id: "buffer", label: "Buffer", category: "scheduler", connected: false, mode: "oauth-required" },
  { id: "hootsuite", label: "Hootsuite", category: "scheduler", connected: false, mode: "oauth-required" },
  { id: "zapier", label: "Zapier", category: "automation", connected: false, mode: "webhook-required" }
];

function hashPassword(password = "") {
  return crypto.createHash("sha256").update(`local-demo:${password}`).digest("hex");
}

function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function nowIso() {
  return new Date().toISOString();
}

function defaultState() {
  const now = nowIso();
  return {
    users: [
      {
        id: "user_demo",
        email: "demo@local.app",
        name: "Demo Creator",
        passwordHash: null,
        plan: "agency",
        subscriptionStatus: "local-demo",
        createdAt: now,
        updatedAt: now
      }
    ],
    projects: [],
    generations: [],
    outputs: [],
    uploadedFiles: [],
    brandProfiles: [
      {
        id: "brand_demo",
        userId: "user_demo",
        name: "Practical Expert",
        voiceDescription: "Clear, useful, confident, and human. Avoid hype.",
        targetAudience: "Small business owners and busy operators",
        preferredTone: "friendly",
        wordsToUse: ["practical", "clear", "useful", "repeatable"],
        wordsToAvoid: ["revolutionary", "magic", "guaranteed"],
        ctaStyle: "soft question or useful next step",
        emojiPreference: "minimal",
        formalityLevel: 55,
        exampleContent: "Use plain language, show the workflow, and end with one action.",
        createdAt: now,
        updatedAt: now
      }
    ],
    clients: [
      {
        id: "client_demo",
        userId: "user_demo",
        name: "Demo Client",
        industry: "Marketing",
        notes: "Local sample client for agency workflows.",
        createdAt: now,
        updatedAt: now
      }
    ],
    teamMembers: [
      {
        id: "member_demo",
        userId: "user_demo",
        name: "Demo Creator",
        email: "demo@local.app",
        role: "Owner",
        createdAt: now,
        updatedAt: now
      }
    ],
    integrations: {
      user_demo: defaultIntegrations
    },
    publishQueue: [],
    usage: {
      user_demo: {
        month: monthKey(),
        generations: 0,
        platformsGenerated: 0,
        transcriptions: 0,
        exports: 0
      }
    }
  };
}

function normalizeState(value) {
  const state = { ...defaultState(), ...(value || {}) };
  state.users ||= [];
  state.projects ||= [];
  state.generations ||= [];
  state.outputs ||= [];
  state.uploadedFiles ||= [];
  state.brandProfiles ||= [];
  state.clients ||= [];
  state.teamMembers ||= [];
  state.integrations ||= {};
  state.publishQueue ||= [];
  state.usage ||= {};

  if (!state.users.length) {
    state.users = defaultState().users;
  }

  for (const user of state.users) {
    state.integrations[user.id] ||= defaultIntegrations;
    state.usage[user.id] ||= {
      month: monthKey(),
      generations: 0,
      platformsGenerated: 0,
      transcriptions: 0,
      exports: 0
    };
  }

  return state;
}

function loadState() {
  fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(dataFile)) {
    const fresh = defaultState();
    fs.writeFileSync(dataFile, JSON.stringify(fresh, null, 2));
    return fresh;
  }

  try {
    return normalizeState(JSON.parse(fs.readFileSync(dataFile, "utf8")));
  } catch {
    const fresh = defaultState();
    fs.writeFileSync(dataFile, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

const state = loadState();

function persist() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
}

function publicUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return {
    ...safeUser,
    planLimits: PLAN_LIMITS[user.plan] || PLAN_LIMITS.free
  };
}

export function listPlans() {
  return Object.entries(PLAN_LIMITS).map(([id, plan]) => ({ id, ...plan }));
}

export function getDefaultUser() {
  return publicUser(state.users[0]);
}

export function getUser(userId) {
  return publicUser(state.users.find((user) => user.id === userId) || state.users[0]);
}

export function createUser({ email, name, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }

  if (state.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    const error = new Error("An account with that email already exists.");
    error.status = 409;
    throw error;
  }

  const now = nowIso();
  const user = {
    id: createId("user"),
    email: normalizedEmail,
    name: name || normalizedEmail.split("@")[0],
    passwordHash: password ? hashPassword(password) : null,
    plan: "free",
    subscriptionStatus: "local-demo",
    createdAt: now,
    updatedAt: now
  };

  state.users.push(user);
  state.integrations[user.id] = defaultIntegrations.map((integration) => ({ ...integration }));
  state.usage[user.id] = {
    month: monthKey(),
    generations: 0,
    platformsGenerated: 0,
    transcriptions: 0,
    exports: 0
  };
  state.teamMembers.push({
    id: createId("member"),
    userId: user.id,
    name: user.name,
    email: user.email,
    role: "Owner",
    createdAt: now,
    updatedAt: now
  });
  persist();
  return publicUser(user);
}

export function authenticateUser({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = state.users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    const error = new Error("Account was not found.");
    error.status = 401;
    throw error;
  }

  if (user.passwordHash && user.passwordHash !== hashPassword(password)) {
    const error = new Error("Password is incorrect.");
    error.status = 401;
    throw error;
  }

  return publicUser(user);
}

export function updateUserPlan(userId, plan) {
  if (!PLAN_LIMITS[plan]) {
    const error = new Error("Choose a valid plan.");
    error.status = 400;
    throw error;
  }

  const user = state.users.find((item) => item.id === userId) || state.users[0];
  user.plan = plan;
  user.subscriptionStatus = "local-demo";
  user.updatedAt = nowIso();
  persist();
  return publicUser(user);
}

export function updateUserProfile(userId, updates) {
  const user = state.users.find((item) => item.id === userId) || state.users[0];
  user.name = updates.name || user.name;
  user.email = updates.email || user.email;
  user.updatedAt = nowIso();
  persist();
  return publicUser(user);
}

function getRawUser(userId) {
  return state.users.find((user) => user.id === userId) || state.users[0];
}

export function getUsage(userId) {
  const user = getRawUser(userId);
  const currentMonth = monthKey();
  const usage = state.usage[user.id] || {
    month: currentMonth,
    generations: 0,
    platformsGenerated: 0,
    transcriptions: 0,
    exports: 0
  };

  if (usage.month !== currentMonth) {
    usage.month = currentMonth;
    usage.generations = 0;
    usage.platformsGenerated = 0;
    usage.transcriptions = 0;
    usage.exports = 0;
  }

  state.usage[user.id] = usage;
  return {
    ...usage,
    limits: PLAN_LIMITS[user.plan] || PLAN_LIMITS.free
  };
}

export function assertGenerationAllowed(userId, platformCount) {
  const user = getRawUser(userId);
  const usage = getUsage(user.id);
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

  if (platformCount > limits.maxPlatforms) {
    const error = new Error(`${limits.label} allows ${limits.maxPlatforms} platforms per generation.`);
    error.status = 403;
    throw error;
  }

  if (usage.generations >= limits.monthlyGenerations) {
    const error = new Error(`You have reached the ${limits.label} monthly generation limit.`);
    error.status = 403;
    throw error;
  }
}

export function recordGeneration(userId, platformCount) {
  const user = getRawUser(userId);
  getUsage(user.id);
  const usage = state.usage[user.id];
  usage.generations += 1;
  usage.platformsGenerated += platformCount;
  persist();
  return getUsage(user.id);
}

export function recordTranscription(userId) {
  const user = getRawUser(userId);
  getUsage(user.id);
  const usage = state.usage[user.id];
  usage.transcriptions += 1;
  persist();
  return getUsage(user.id);
}

export function recordExport(userId) {
  const user = getRawUser(userId);
  getUsage(user.id);
  const usage = state.usage[user.id];
  usage.exports += 1;
  persist();
  return getUsage(user.id);
}

export function createProject({
  userId,
  title,
  sourceType,
  sourceContent = "",
  transcript = "",
  clientId = "",
  brandProfileId = ""
}) {
  const now = nowIso();
  const user = getRawUser(userId);
  const project = {
    id: createId("project"),
    userId: user.id,
    clientId,
    brandProfileId,
    title,
    sourceType,
    sourceContent,
    transcript,
    status: "draft",
    createdAt: now,
    updatedAt: now
  };

  state.projects.push(project);
  persist();
  return project;
}

export function getProject(projectId, userId) {
  return state.projects.find(
    (project) => project.id === projectId && (!userId || project.userId === userId)
  );
}

export function listProjects(userId) {
  return state.projects
    .filter((project) => project.userId === userId)
    .map((project) => {
      const projectGenerations = state.generations.filter(
        (generation) => generation.projectId === project.id
      );
      const outputCount = projectGenerations.reduce(
        (count, generation) => count + generation.outputIds.length,
        0
      );
      const client = state.clients.find((item) => item.id === project.clientId);
      return {
        ...project,
        clientName: client?.name || "",
        generationCount: projectGenerations.length,
        outputCount
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getProjectDetails(projectId, userId) {
  const project = getProject(projectId, userId);
  if (!project) return null;

  const generations = state.generations
    .filter((generation) => generation.projectId === project.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((generation) => ({
      ...generation,
      outputs: generation.outputIds.map((outputId) => state.outputs.find((output) => output.id === outputId)).filter(Boolean)
    }));

  return {
    project,
    generations,
    latestGeneration: generations[0] || null
  };
}

export function saveGeneration({
  userId,
  projectId,
  title,
  sourceContent,
  platforms,
  tone,
  audience,
  model,
  analysis,
  generatedOutputs,
  calendarIdeas,
  clientId = "",
  brandProfileId = ""
}) {
  const now = nowIso();
  const user = getRawUser(userId);
  let project = projectId ? getProject(projectId, user.id) : null;

  if (!project) {
    project = createProject({
      userId: user.id,
      title,
      sourceType: "text",
      sourceContent,
      clientId,
      brandProfileId
    });
  }

  project.title = title || project.title;
  project.sourceContent = sourceContent || project.sourceContent;
  project.clientId = clientId || project.clientId;
  project.brandProfileId = brandProfileId || project.brandProfileId;
  project.updatedAt = now;
  project.status = "generated";

  const generation = {
    id: createId("generation"),
    userId: user.id,
    projectId: project.id,
    selectedPlatforms: platforms,
    tone,
    audience,
    aiModel: model,
    analysis,
    calendarIdeas,
    outputIds: [],
    createdAt: now
  };

  const savedOutputs = generatedOutputs.map((output) => {
    const saved = {
      id: createId("output"),
      userId: user.id,
      generationId: generation.id,
      projectId: project.id,
      platform: output.platform,
      title: output.title,
      content: output.content,
      hashtags: output.hashtags || [],
      cta: output.cta || "",
      notes: output.notes || "",
      metadata: output.metadata || {},
      status: "draft",
      createdAt: now,
      updatedAt: now
    };
    state.outputs.push(saved);
    generation.outputIds.push(saved.id);
    return saved;
  });

  state.generations.push(generation);
  persist();

  return {
    project,
    generation,
    outputs: savedOutputs
  };
}

export function getGeneration(generationId, userId) {
  const generation = state.generations.find(
    (item) => item.id === generationId && (!userId || item.userId === userId)
  );
  if (!generation) return null;

  return {
    ...generation,
    outputs: generation.outputIds.map((outputId) => state.outputs.find((output) => output.id === outputId)).filter(Boolean)
  };
}

export function getOutput(outputId, userId) {
  return state.outputs.find(
    (output) => output.id === outputId && (!userId || output.userId === userId)
  );
}

export function updateOutput(outputId, updates, userId) {
  const output = getOutput(outputId, userId);

  if (!output) {
    const error = new Error("Output was not found.");
    error.status = 404;
    throw error;
  }

  Object.assign(output, updates, { updatedAt: nowIso() });
  persist();
  return output;
}

export function addUploadedFile({ userId, projectId, file }) {
  const now = nowIso();
  const user = getRawUser(userId);
  const uploadedFile = {
    id: createId("file"),
    userId: user.id,
    projectId,
    fileName: file.originalname,
    fileType: file.mimetype,
    filePath: file.path,
    fileSize: file.size,
    transcriptStatus: "pending",
    createdAt: now
  };

  state.uploadedFiles.push(uploadedFile);
  persist();
  return uploadedFile;
}

export function getUploadedFile(fileId, userId) {
  return state.uploadedFiles.find(
    (file) => file.id === fileId && (!userId || file.userId === userId)
  );
}

export function updateUploadedFile(fileId, updates, userId) {
  const file = getUploadedFile(fileId, userId);

  if (!file) {
    const error = new Error("Uploaded file was not found.");
    error.status = 404;
    throw error;
  }

  Object.assign(file, updates);
  persist();
  return file;
}

export function listBrandProfiles(userId) {
  return state.brandProfiles
    .filter((profile) => profile.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getBrandProfile(profileId, userId) {
  return state.brandProfiles.find(
    (profile) => profile.id === profileId && (!userId || profile.userId === userId)
  );
}

export function createBrandProfile(userId, payload) {
  const user = getRawUser(userId);
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
  const existing = listBrandProfiles(user.id);

  if (existing.length >= limits.brandProfiles) {
    const error = new Error(`${limits.label} allows ${limits.brandProfiles} brand profiles.`);
    error.status = 403;
    throw error;
  }

  const now = nowIso();
  const profile = {
    id: createId("brand"),
    userId: user.id,
    name: payload.name || "New Brand Voice",
    voiceDescription: payload.voiceDescription || "",
    targetAudience: payload.targetAudience || "",
    preferredTone: payload.preferredTone || "professional",
    wordsToUse: payload.wordsToUse || [],
    wordsToAvoid: payload.wordsToAvoid || [],
    ctaStyle: payload.ctaStyle || "",
    emojiPreference: payload.emojiPreference || "minimal",
    formalityLevel: Number(payload.formalityLevel || 50),
    exampleContent: payload.exampleContent || "",
    createdAt: now,
    updatedAt: now
  };

  state.brandProfiles.push(profile);
  persist();
  return profile;
}

export function updateBrandProfile(userId, profileId, payload) {
  const profile = getBrandProfile(profileId, userId);
  if (!profile) {
    const error = new Error("Brand profile was not found.");
    error.status = 404;
    throw error;
  }

  Object.assign(profile, {
    name: payload.name ?? profile.name,
    voiceDescription: payload.voiceDescription ?? profile.voiceDescription,
    targetAudience: payload.targetAudience ?? profile.targetAudience,
    preferredTone: payload.preferredTone ?? profile.preferredTone,
    wordsToUse: payload.wordsToUse ?? profile.wordsToUse,
    wordsToAvoid: payload.wordsToAvoid ?? profile.wordsToAvoid,
    ctaStyle: payload.ctaStyle ?? profile.ctaStyle,
    emojiPreference: payload.emojiPreference ?? profile.emojiPreference,
    formalityLevel: Number(payload.formalityLevel ?? profile.formalityLevel),
    exampleContent: payload.exampleContent ?? profile.exampleContent,
    updatedAt: nowIso()
  });
  persist();
  return profile;
}

export function deleteBrandProfile(userId, profileId) {
  const index = state.brandProfiles.findIndex(
    (profile) => profile.id === profileId && profile.userId === userId
  );
  if (index === -1) return false;
  state.brandProfiles.splice(index, 1);
  persist();
  return true;
}

export function listClients(userId) {
  return state.clients
    .filter((client) => client.userId === userId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function createClient(userId, payload) {
  const user = getRawUser(userId);
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
  if (listClients(user.id).length >= limits.clients) {
    const error = new Error(`${limits.label} allows ${limits.clients} client folders.`);
    error.status = 403;
    throw error;
  }

  const now = nowIso();
  const client = {
    id: createId("client"),
    userId: user.id,
    name: payload.name || "New Client",
    industry: payload.industry || "",
    notes: payload.notes || "",
    createdAt: now,
    updatedAt: now
  };
  state.clients.push(client);
  persist();
  return client;
}

export function listTeamMembers(userId) {
  return state.teamMembers
    .filter((member) => member.userId === userId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function createTeamMember(userId, payload) {
  const user = getRawUser(userId);
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
  if (listTeamMembers(user.id).length >= limits.teamMembers) {
    const error = new Error(`${limits.label} allows ${limits.teamMembers} team members.`);
    error.status = 403;
    throw error;
  }

  const now = nowIso();
  const member = {
    id: createId("member"),
    userId: user.id,
    name: payload.name || "New Team Member",
    email: payload.email || "",
    role: payload.role || "Editor",
    createdAt: now,
    updatedAt: now
  };
  state.teamMembers.push(member);
  persist();
  return member;
}

export function listIntegrations(userId) {
  state.integrations[userId] ||= defaultIntegrations.map((integration) => ({ ...integration }));
  return state.integrations[userId];
}

export function connectIntegration(userId, integrationId) {
  const integrations = listIntegrations(userId);
  const integration = integrations.find((item) => item.id === integrationId);
  if (!integration) {
    const error = new Error("Integration was not found.");
    error.status = 404;
    throw error;
  }

  integration.connected = true;
  integration.mode = "local-demo";
  integration.connectedAt = nowIso();
  persist();
  return integration;
}

export function disconnectIntegration(userId, integrationId) {
  const integration = listIntegrations(userId).find((item) => item.id === integrationId);
  if (!integration) return null;
  integration.connected = false;
  integration.mode = defaultIntegrations.find((item) => item.id === integrationId)?.mode || "credentials-required";
  delete integration.connectedAt;
  persist();
  return integration;
}

export function queueOutputForPublishing(userId, { outputId, integrationId, scheduledFor = "" }) {
  const output = getOutput(outputId, userId);
  if (!output) {
    const error = new Error("Output was not found.");
    error.status = 404;
    throw error;
  }

  const integration = listIntegrations(userId).find((item) => item.id === integrationId);
  if (!integration) {
    const error = new Error("Integration was not found.");
    error.status = 404;
    throw error;
  }

  const now = nowIso();
  const queueItem = {
    id: createId("queue"),
    userId,
    outputId,
    projectId: output.projectId,
    platform: output.platform,
    integrationId,
    content: output.content,
    status: integration.connected ? "ready" : "needs-connection",
    scheduledFor,
    createdAt: now,
    updatedAt: now
  };

  state.publishQueue.push(queueItem);
  output.status = "queued";
  output.updatedAt = now;
  persist();
  return queueItem;
}

export function listPublishQueue(userId) {
  return state.publishQueue
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}