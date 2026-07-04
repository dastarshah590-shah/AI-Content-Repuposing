import { BadgeCheck, Mic2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { formatToneLabel, tones } from "../data/tones.js";

const emptyProfile = {
  name: "",
  voiceDescription: "",
  targetAudience: "",
  preferredTone: "professional",
  wordsToUse: "",
  wordsToAvoid: "",
  ctaStyle: "",
  emojiPreference: "minimal",
  formalityLevel: 50,
  exampleContent: ""
};

function toForm(profile) {
  if (!profile) return emptyProfile;
  return {
    ...emptyProfile,
    ...profile,
    wordsToUse: (profile.wordsToUse || []).join(", "),
    wordsToAvoid: (profile.wordsToAvoid || []).join(", ")
  };
}

function toPayload(form) {
  return {
    ...form,
    wordsToUse: form.wordsToUse,
    wordsToAvoid: form.wordsToAvoid,
    formalityLevel: Number(form.formalityLevel || 50)
  };
}

export function BrandProfilePanel({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onSaveProfile,
  onApplyProfile,
  onToast
}) {
  const selected = profiles.find((profile) => profile.id === selectedProfileId);
  const [form, setForm] = useState(toForm(selected));

  useEffect(() => {
    setForm(toForm(selected));
  }, [selected]);

  async function saveProfile() {
    const profile = await onSaveProfile(selected?.id, toPayload(form));
    onSelectProfile(profile.id);
    onToast("Brand profile saved.");
  }

  function newProfile() {
    onSelectProfile("");
    setForm({ ...emptyProfile, name: "New Brand Voice" });
  }

  return (
    <section className="panel brand-panel" aria-labelledby="brand-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Brand voice</p>
          <h2 id="brand-heading">Profiles</h2>
        </div>
        <Mic2 size={20} />
      </div>

      <div className="toolbar-row profile-tabs">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className={`tone-chip ${profile.id === selectedProfileId ? "selected" : ""}`}
            onClick={() => onSelectProfile(profile.id)}
          >
            {profile.name}
          </button>
        ))}
        <button type="button" className="tone-chip" onClick={newProfile}>
          New
        </button>
      </div>

      <div className="field-grid two-columns">
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="field">
          <span>Preferred tone</span>
          <select
            value={form.preferredTone}
            onChange={(event) => setForm({ ...form, preferredTone: event.target.value })}
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>{formatToneLabel(tone)}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Voice description</span>
        <textarea
          value={form.voiceDescription}
          onChange={(event) => setForm({ ...form, voiceDescription: event.target.value })}
          rows={3}
        />
      </label>
      <div className="field-grid two-columns">
        <label className="field">
          <span>Target audience</span>
          <input value={form.targetAudience} onChange={(event) => setForm({ ...form, targetAudience: event.target.value })} />
        </label>
        <label className="field">
          <span>CTA style</span>
          <input value={form.ctaStyle} onChange={(event) => setForm({ ...form, ctaStyle: event.target.value })} />
        </label>
      </div>
      <div className="field-grid two-columns">
        <label className="field">
          <span>Words to use</span>
          <input value={form.wordsToUse} onChange={(event) => setForm({ ...form, wordsToUse: event.target.value })} />
        </label>
        <label className="field">
          <span>Words to avoid</span>
          <input value={form.wordsToAvoid} onChange={(event) => setForm({ ...form, wordsToAvoid: event.target.value })} />
        </label>
      </div>
      <div className="toolbar-row account-actions">
        <button className="secondary-button" type="button" onClick={saveProfile}>
          <Save size={16} />
          <span>Save profile</span>
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => selected && onApplyProfile(selected)}
          disabled={!selected}
        >
          <BadgeCheck size={16} />
          <span>Apply to form</span>
        </button>
      </div>
    </section>
  );
}