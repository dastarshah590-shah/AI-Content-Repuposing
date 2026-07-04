import { PlatformLogo } from "./BrandLogos.jsx";
import { platforms } from "../data/platforms.js";

export function PlatformSelector({ selectedPlatforms, onToggle }) {
  return (
    <section className="panel" aria-labelledby="platform-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Step 2</p>
          <h2 id="platform-heading">Platforms</h2>
        </div>
        <span className="selection-count">{selectedPlatforms.length} selected</span>
      </div>

      <div className="platform-grid">
        {platforms.map((platform) => {
          const active = selectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              className={`platform-tile ${active ? "selected" : ""}`}
              onClick={() => onToggle(platform.id)}
              aria-pressed={active}
            >
              <span className={`platform-icon platform-icon-${platform.id}`}>
                <PlatformLogo id={platform.id} />
              </span>
              <span className="platform-copy">
                <strong>{platform.label}</strong>
                <small>{platform.description}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}