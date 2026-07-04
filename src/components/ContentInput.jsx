import { ClipboardPaste, Sparkles } from "lucide-react";
import { sampleContent } from "../utils/sampleContent.js";

const contentTypes = ["blog", "newsletter", "article", "transcript", "podcast notes", "youtube script"];

export function ContentInput({
  form,
  brandProfiles = [],
  clients = [],
  onChange,
  onLoadSample,
  onApplyBrandProfile
}) {
  const charCount = form.sourceContent.length;

  async function handlePaste() {
    if (!navigator.clipboard?.readText) return;
    const text = await navigator.clipboard.readText();
    onChange({ sourceContent: text });
  }

  function handleBrandChange(profileId) {
    onChange({ brandProfileId: profileId });
    const profile = brandProfiles.find((item) => item.id === profileId);
    if (profile) onApplyBrandProfile(profile);
  }

  return (
    <section className="panel composer-panel animated-card" aria-labelledby="source-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Step 1</p>
          <h2 id="source-heading">Source</h2>
        </div>
        <div className="toolbar-row">
          <button
            className="icon-button"
            type="button"
            onClick={() => onLoadSample(sampleContent)}
            title="Load sample content"
            aria-label="Load sample content"
          >
            <Sparkles size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={handlePaste}
            title="Paste from clipboard"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste size={18} />
          </button>
        </div>
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="How AI Helps Small Businesses Save Time"
          />
        </label>
        <label className="field">
          <span>Content type</span>
          <select
            value={form.contentType}
            onChange={(event) => onChange({ contentType: event.target.value })}
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Brand profile</span>
          <select value={form.brandProfileId} onChange={(event) => handleBrandChange(event.target.value)}>
            <option value="">No brand profile</option>
            {brandProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Client folder</span>
          <select value={form.clientId} onChange={(event) => onChange({ clientId: event.target.value })}>
            <option value="">No client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="field source-textarea">
        <span>Long-form content</span>
        <textarea
          value={form.sourceContent}
          onChange={(event) => onChange({ sourceContent: event.target.value })}
          placeholder="Paste a blog post, transcript, newsletter, article, podcast notes, or script..."
        />
      </label>

      <div className="input-footer">
        <span className={charCount >= 300 ? "valid-count" : "muted-count"}>
          {charCount.toLocaleString()} characters
        </span>
        <span>Minimum 300</span>
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Target audience</span>
          <input
            value={form.audience}
            onChange={(event) => onChange({ audience: event.target.value })}
            placeholder="Small business owners"
          />
        </label>
        <label className="field">
          <span>Goal</span>
          <input
            value={form.goal}
            onChange={(event) => onChange({ goal: event.target.value })}
            placeholder="Educate and generate leads"
          />
        </label>
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Context</span>
          <input
            value={form.optionalContext}
            onChange={(event) => onChange({ optionalContext: event.target.value })}
            placeholder="Campaign, launch, or content angle"
          />
        </label>
        <label className="field">
          <span>Brand voice</span>
          <input
            value={form.brandVoice}
            onChange={(event) => onChange({ brandVoice: event.target.value })}
            placeholder="Clear, direct, practical"
          />
        </label>
      </div>
    </section>
  );
}