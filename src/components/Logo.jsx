import { AppLogoSymbol } from "./BrandLogos.jsx";

export function Logo() {
  return (
    <div className="logo-lockup" aria-label="AI Content Repurposing Engine">
      <div className="logo-mark" aria-hidden="true">
        <span className="logo-pulse" />
        <AppLogoSymbol />
      </div>
      <div className="logo-text">
        <strong>RepurposeAI</strong>
        <span>Content Engine</span>
      </div>
    </div>
  );
}