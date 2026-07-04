import { Inbox } from "lucide-react";
import { AnalysisPanel } from "./AnalysisPanel.jsx";
import { ExportPanel } from "./ExportPanel.jsx";
import { OutputCard } from "./OutputCard.jsx";

export function OutputDashboard({
  result,
  tone,
  regeneratingId,
  onRegenerate,
  onSave,
  onToast
}) {
  if (!result?.outputs?.length) {
    return (
      <section className="empty-state" aria-labelledby="results-heading">
        <Inbox size={28} />
        <div>
          <p className="step-label">Results</p>
          <h2 id="results-heading">Paste a blog, transcript, or script</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="results-section" aria-labelledby="results-heading">
      <div className="results-heading">
        <div>
          <p className="step-label">Results</p>
          <h2 id="results-heading">Generated assets</h2>
        </div>
        <ExportPanel result={result} onToast={onToast} />
      </div>

      <AnalysisPanel analysis={result.analysis} />

      <div className="output-grid">
        {result.outputs.map((output) => (
          <OutputCard
            key={output.id}
            output={output}
            defaultTone={tone}
            isRegenerating={regeneratingId === output.id}
            onRegenerate={onRegenerate}
            onSave={onSave}
            onToast={onToast}
          />
        ))}
      </div>
    </section>
  );
}
