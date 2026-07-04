const USER_KEY = "repurpose_user_id";

export function getStoredUserId() {
  return window.localStorage.getItem(USER_KEY) || "user_demo";
}

export function storeUserId(userId) {
  if (userId) window.localStorage.setItem(USER_KEY, userId);
}

async function request(path, options = {}) {
  const headers = {
    "x-user-id": getStoredUserId(),
    ...(options.headers || {})
  };

  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "The request failed.");
  }

  if (data.user?.id) storeUserId(data.user.id);

  return data;
}

export async function getSession() {
  const data = await request("/api/auth/session");
  if (data.user?.id) storeUserId(data.user.id);
  return data;
}

export function login(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateProfile(payload) {
  return request("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  window.localStorage.removeItem(USER_KEY);
  return request("/api/auth/logout", { method: "POST" });
}

export function getPlans() {
  return request("/api/plans");
}

export function updatePlan(plan) {
  return request("/api/plan", {
    method: "PUT",
    body: JSON.stringify({ plan })
  });
}

export function getUsage() {
  return request("/api/usage");
}

export function getProjects() {
  return request("/api/projects");
}

export function getProject(projectId) {
  return request(`/api/projects/${projectId}`);
}

export function createProject(payload) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getBrandProfiles() {
  return request("/api/brand-profiles");
}

export function createBrandProfile(payload) {
  return request("/api/brand-profiles", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateBrandProfile(profileId, payload) {
  return request(`/api/brand-profiles/${profileId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteBrandProfile(profileId) {
  return request(`/api/brand-profiles/${profileId}`, {
    method: "DELETE"
  });
}

export function getWorkspace() {
  return request("/api/workspace");
}

export function createClient(payload) {
  return request("/api/clients", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createTeamMember(payload) {
  return request("/api/team-members", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getIntegrations() {
  return request("/api/integrations");
}

export function connectIntegration(integrationId) {
  return request(`/api/integrations/${integrationId}/connect`, {
    method: "POST"
  });
}

export function disconnectIntegration(integrationId) {
  return request(`/api/integrations/${integrationId}/disconnect`, {
    method: "POST"
  });
}

export function queueOutput(payload) {
  return request("/api/publish-queue", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function recordExport() {
  return request("/api/exports/record", {
    method: "POST"
  });
}

export function uploadMedia({ file, projectId }) {
  const formData = new FormData();
  formData.append("file", file);
  if (projectId) formData.append("projectId", projectId);

  return request("/api/upload", {
    method: "POST",
    body: formData
  });
}

export function transcribeMedia(fileId) {
  return request("/api/transcribe", {
    method: "POST",
    body: JSON.stringify({ fileId })
  });
}

export function generateContent(payload) {
  return request("/api/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function regenerateOutput(payload) {
  return request("/api/regenerate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function saveOutput(outputId, content, status = "edited") {
  return request(`/api/outputs/${outputId}`, {
    method: "PUT",
    body: JSON.stringify({ content, status })
  });
}