import { WandSparkles } from "lucide-react";

export function GenerateButton({ disabled, isGenerating, onGenerate }) {
  return (
    <button
      className="generate-button"
      type="button"
      onClick={onGenerate}
      disabled={disabled || isGenerating}
    >
      <WandSparkles size={20} />
      <span>{isGenerating ? "Generating..." : "Generate Content"}</span>
    </button>
  );
}
