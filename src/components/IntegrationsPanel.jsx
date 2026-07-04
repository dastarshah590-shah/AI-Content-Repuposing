import { SendHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { getBrandColor } from "../data/brandColors.js";
import { getPlatformLabel } from "../data/platforms.js";
import { IntegrationLogo } from "./BrandLogos.jsx";

const platformToIntegration = {
  linkedin: "linkedin",
  twitter: "x",
  instagram: "instagram",
  facebook: "facebook",
  youtube_description: "youtube"
};

export function IntegrationsPanel({
  integrations,
  publishQueue,
  result,
  onConnectIntegration,
  onQueueOutput,
  onToast
}) {
  const outputs = result?.outputs || [];
  const [selectedOutputId, setSelectedOutputId] = useState(outputs[0]?.id || "");
  const selectedOutput = outputs.find((output) => output.id === selectedOutputId) || outputs[0];
  const recommendedIntegration = platformToIntegration[selectedOutput?.platform] || "buffer";
  const [selectedIntegration, setSelectedIntegration] = useState(recommendedIntegration);

  const connectedCount = useMemo(
    () => integrations.filter((integration) => integration.connected).length,
    [integrations]
  );

  async function connect(id) {
    await onConnectIntegration(id);
    onToast("Integration connected in local demo mode.");
  }

  async function queue() {
    if (!selectedOutput) return;
    await onQueueOutput({
      outputId: selectedOutput.id,
      integrationId: selectedIntegration
    });
    onToast("Output queued for publishing.");
  }

  return (
    <section className="panel integrations-panel" id="integrations" aria-labelledby="integrations-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Integrations</p>
          <h2 id="integrations-heading">Publish and sync</h2>
        </div>
        <span className="selection-count">{connectedCount} connected</span>
      </div>

      <div className="integration-grid">
        {integrations.map((integration) => (
          <button
            key={integration.id}
            type="button"
            className={`integration-tile ${integration.connected ? "selected" : ""}`}
            onClick={() => connect(integration.id)}
            style={{ "--brand-color": getBrandColor(integration.id) }}
          >
            <span className="integration-logo">
              <IntegrationLogo id={integration.id} />
            </span>
            <span>{integration.label}</span>
            <small>{integration.connected ? "Local demo" : integration.mode}</small>
          </button>
        ))}
      </div>

      <div className="publish-row">
        <label className="field">
          <span>Output</span>
          <select value={selectedOutput?.id || ""} onChange={(event) => setSelectedOutputId(event.target.value)}>
            {outputs.map((output) => (
              <option key={output.id} value={output.id}>{getPlatformLabel(output.platform)}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Destination</span>
          <select value={selectedIntegration} onChange={(event) => setSelectedIntegration(event.target.value)}>
            {integrations.map((integration) => (
              <option key={integration.id} value={integration.id}>{integration.label}</option>
            ))}
          </select>
        </label>
        <button className="secondary-button publish-button" type="button" onClick={queue} disabled={!selectedOutput}>
          <SendHorizontal size={16} />
          <span>Queue</span>
        </button>
      </div>

      <div className="queue-list">
        {publishQueue.slice(0, 4).map((item) => (
          <span key={item.id}>{getPlatformLabel(item.platform)}{" -> "}{item.integrationId} ({item.status})</span>
        ))}
        {!publishQueue.length && <p className="muted-copy">No queued posts yet.</p>}
      </div>
    </section>
  );
}