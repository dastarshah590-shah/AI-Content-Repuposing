import { SlidersHorizontal } from "lucide-react";
import { formatToneLabel, tones } from "../data/tones.js";

export function ToneSelector({ tone, customTone, onChange }) {
  return (
    <section className="panel" aria-labelledby="tone-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Step 3</p>
          <h2 id="tone-heading">Tone</h2>
        </div>
        <SlidersHorizontal size={20} aria-hidden="true" />
      </div>

      <div className="tone-grid">
        {tones.map((toneOption) => (
          <button
            key={toneOption}
            type="button"
            className={`tone-chip ${tone === toneOption && !customTone ? "selected" : ""}`}
            onClick={() => onChange({ tone: toneOption, customTone: "" })}
          >
            {formatToneLabel(toneOption)}
          </button>
        ))}
      </div>

      <label className="field custom-tone">
        <span>Custom tone</span>
        <input
          value={customTone}
          maxLength={200}
          onChange={(event) =>
            onChange({ customTone: event.target.value, tone: event.target.value || tone })
          }
          placeholder="Professional but friendly"
        />
      </label>
    </section>
  );
}
