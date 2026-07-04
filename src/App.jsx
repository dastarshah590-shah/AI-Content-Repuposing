import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { AccountPanel } from "./components/AccountPanel.jsx";
import { BrandProfilePanel } from "./components/BrandProfilePanel.jsx";
import { ContentInput } from "./components/ContentInput.jsx";
import { GenerateButton } from "./components/GenerateButton.jsx";
import { Header } from "./components/Header.jsx";
import { IntegrationsPanel } from "./components/IntegrationsPanel.jsx";
import { LoadingState } from "./components/LoadingState.jsx";
import { MediaTranscriptionPanel } from "./components/MediaTranscriptionPanel.jsx";
import { OutputDashboard } from "./components/OutputDashboard.jsx";
import { PlatformSelector } from "./components/PlatformSelector.jsx";
import { PricingPanel } from "./components/PricingPanel.jsx";
import { ProjectSidebar } from "./components/ProjectSidebar.jsx";
import { Toast } from "./components/Toast.jsx";
import { ToneSelector } from "./components/ToneSelector.jsx";
import { WorkspacePanel } from "./components/WorkspacePanel.jsx";
import { defaultPlatformIds } from "./data/platforms.js";
import { useAppData } from "./hooks/useAppData.js";
import { useGenerateContent } from "./hooks/useGenerateContent.js";

const initialForm = {
  title: "",
  sourceContent: "",
  contentType: "blog",
  audience: "",
  goal: "",
  optionalContext: "",
  brandVoice: "",
  tone: "professional",
  customTone: "",
  platforms: defaultPlatformIds,
  brandProfileId: "",
  clientId: ""
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [toast, setToast] = useState("");
  const appData = useAppData();
  const {
    result,
    projects,
    isGenerating,
    regeneratingId,
    error,
    setError,
    refreshProjects,
    openProject,
    runGenerate,
    runRegenerate,
    runSaveOutput
  } = useGenerateContent({ onUsage: appData.updateUsage });

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects, appData.user?.id]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeTone = useMemo(
    () => (form.customTone.trim() ? form.customTone.trim() : form.tone),
    [form.customTone, form.tone]
  );

  const canGenerate =
    form.sourceContent.trim().length >= 300 &&
    form.platforms.length > 0 &&
    activeTone.length > 0;

  function updateForm(updates) {
    setError("");
    setForm((current) => ({
      ...current,
      ...updates
    }));
  }

  function togglePlatform(platformId) {
    updateForm({
      platforms: form.platforms.includes(platformId)
        ? form.platforms.filter((item) => item !== platformId)
        : [...form.platforms, platformId]
    });
  }

  function applyBrandProfile(profile) {
    updateForm({
      brandProfileId: profile.id,
      audience: profile.targetAudience || form.audience,
      tone: profile.preferredTone || form.tone,
      customTone: "",
      brandVoice: profile.voiceDescription || form.brandVoice
    });
    setToast("Brand profile applied.");
  }

  function loadSample(sample) {
    updateForm({
      ...sample,
      tone: "friendly",
      customTone: "",
      platforms: defaultPlatformIds
    });
    setToast("Sample content loaded.");
  }

  function handleTranscript(transcript, fileName) {
    updateForm({
      title: form.title || fileName.replace(/\.[^.]+$/, ""),
      contentType: "transcript",
      sourceContent: transcript
    });
  }

  async function handleOpenProject(projectId) {
    const data = await openProject(projectId);
    const latest = data.latestGeneration;
    updateForm({
      title: data.project.title,
      sourceContent: data.project.sourceContent || data.project.transcript || form.sourceContent,
      contentType: data.project.sourceType || form.contentType,
      brandProfileId: data.project.brandProfileId || "",
      clientId: data.project.clientId || "",
      platforms: latest?.selectedPlatforms || form.platforms,
      tone: latest?.tone || form.tone,
      audience: latest?.audience || form.audience
    });
    setToast("Project opened.");
  }

  async function handleGenerate() {
    try {
      await runGenerate({
        title: form.title || "Untitled Content",
        content: form.sourceContent,
        sourceContent: form.sourceContent,
        contentType: form.contentType,
        platforms: form.platforms,
        tone: activeTone,
        audience: form.audience || "content consumers",
        goal: form.goal || "repurpose this content",
        optionalContext: form.optionalContext,
        brandVoice: form.brandVoice,
        brandProfileId: form.brandProfileId,
        clientId: form.clientId
      });
      await appData.refreshIntegrations();
      setToast("Content generated.");
    } catch {
      setToast("Generation needs attention.");
    }
  }

  return (
    <div className="app-shell">
      <Header user={appData.user} />

      <main className="workspace-layout">
        <div className="workspace-main">
          <ContentInput
            form={form}
            brandProfiles={appData.brandProfiles}
            clients={appData.clients}
            onChange={updateForm}
            onLoadSample={loadSample}
            onApplyBrandProfile={applyBrandProfile}
          />

          <div className="settings-grid">
            <PlatformSelector
              selectedPlatforms={form.platforms}
              onToggle={togglePlatform}
            />
            <ToneSelector
              tone={form.tone}
              customTone={form.customTone}
              onChange={updateForm}
            />
          </div>

          <div className="business-grid" id="workspace">
            <MediaTranscriptionPanel
              projectId={result?.projectId}
              onTranscript={handleTranscript}
              onUsage={appData.updateUsage}
              onToast={setToast}
            />
            <WorkspacePanel
              clients={appData.clients}
              teamMembers={appData.teamMembers}
              selectedClientId={form.clientId}
              onSelectClient={(clientId) => updateForm({ clientId })}
              onCreateClient={appData.runCreateClient}
              onCreateTeamMember={appData.runCreateTeamMember}
              onToast={setToast}
            />
          </div>

          <BrandProfilePanel
            profiles={appData.brandProfiles}
            selectedProfileId={form.brandProfileId}
            onSelectProfile={(brandProfileId) => updateForm({ brandProfileId })}
            onSaveProfile={appData.runSaveBrandProfile}
            onApplyProfile={applyBrandProfile}
            onToast={setToast}
          />

          <div className="action-band animated-entry delayed-entry">
            <GenerateButton
              disabled={!canGenerate}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
            {!canGenerate && (
              <span className="action-hint">
                Add 300+ characters and choose at least one platform.
              </span>
            )}
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {isGenerating ? (
            <LoadingState />
          ) : (
            <OutputDashboard
              result={result}
              tone={form.tone}
              regeneratingId={regeneratingId}
              onRegenerate={runRegenerate}
              onSave={runSaveOutput}
              onToast={setToast}
            />
          )}

          <IntegrationsPanel
            integrations={appData.integrations}
            publishQueue={appData.publishQueue}
            result={result}
            onConnectIntegration={appData.runConnectIntegration}
            onQueueOutput={appData.runQueueOutput}
            onToast={setToast}
          />
        </div>

        <div className="rail-stack">
          <AccountPanel
            user={appData.user}
            usage={appData.usage}
            onLogin={appData.runLogin}
            onRegister={appData.runRegister}
            onUpdateProfile={appData.runUpdateProfile}
            onToast={setToast}
          />
          <PricingPanel
            plans={appData.plans}
            currentPlan={appData.user?.plan}
            onSelectPlan={appData.runUpdatePlan}
            onToast={setToast}
          />
          <ProjectSidebar projects={projects} onOpenProject={handleOpenProject} />
        </div>
      </main>

      <Toast message={toast} />
    </div>
  );
}