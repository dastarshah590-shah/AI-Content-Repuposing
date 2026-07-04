import { Check, ClipboardCopy, RefreshCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlatformLabel } from "../data/platforms.js";
import { tones, formatToneLabel } from "../data/tones.js";
import { copyText } from "../utils/exportUtils.js";

export function OutputCard({
  output,
  defaultTone,
  isRegenerating,
  onRegenerate,
  onSave,
  onToast
}) {
  const [draft, setDraft] = useState(output.content);
  const [tone, setTone] = useState(defaultTone);
  const [instructions, setInstructions] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(output.content);
  }, [output.content]);

  async function handleCopy() {
    await copyText(draft);
    onToast(`${getPlatformLabel(output.platform)} copied.`);
  }

  async function handleSave() {
    await onSave(output.id, draft);
    setSaved(true);
    onToast("Output saved.");
    window.setTimeout(() => setSaved(false), 1600);
  }

  async function handleRegenerate() {
    const updated = await onRegenerate({
      output,
      tone,
      instructions
    });
    if (updated) {
      setDraft(updated.content);
      onToast(`${getPlatformLabel(output.platform)} regenerated.`);
    }
  }

  return (
    <article className="output-card">
      <div className="output-header">
        <div>
          <p className="step-label">{getPlatformLabel(output.platform)}</p>
          <h3>{output.title}</h3>
        </div>
        <div className="toolbar-row">
          <button
            type="button"
            className="icon-button"
            onClick={handleCopy}
            title="Copy output"
            aria-label={`Copy ${getPlatformLabel(output.platform)}`}
          >
            <ClipboardCopy size={17} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={handleSave}
            title="Save edits"
            aria-label={`Save ${getPlatformLabel(output.platform)}`}
          >
            {saved ? <Check size={17} /> : <Save size={17} />}
          </button>
        </div>
      </div>

      <textarea
        className="output-editor"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label={`${getPlatformLabel(output.platform)} output editor`}
      />

      {output.hashtags?.length > 0 && (
        <div className="hashtag-row">
          {output.hashtags.slice(0, 8).map((hashtag) => (
            <span key={hashtag}>{hashtag}</span>
          ))}
        </div>
      )}

      <div className="regenerate-row">
        <label className="field compact-field">
          <span>Variation tone</span>
          <select value={tone} onChange={(event) => setTone(event.target.value)}>
            {tones.map((toneOption) => (
              <option key={toneOption} value={toneOption}>
                {formatToneLabel(toneOption)}
              </option>
            ))}
          </select>
        </label>
        <label className="field compact-field instructions-field">
          <span>Instructions</span>
          <input
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            maxLength={400}
            placeholder="Shorter, more direct, founder-style"
          />
        </label>
        <button
          type="button"
          className="secondary-button regenerate-button"
          onClick={handleRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCcw size={17} />
          <span>{isRegenerating ? "Regenerating" : "Regenerate"}</span>
        </button>
      </div>
    </article>
  );
}
