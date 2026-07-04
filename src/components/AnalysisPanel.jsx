export function AnalysisPanel({ analysis }) {
  if (!analysis) return null;

  return (
    <section className="analysis-band" aria-labelledby="analysis-heading">
      <div>
        <p className="step-label">Analysis</p>
        <h2 id="analysis-heading">{analysis.mainTopic}</h2>
        <p>{analysis.summary}</p>
      </div>
      <div className="analysis-list">
        {(analysis.keyIdeas || []).slice(0, 3).map((idea) => (
          <span key={idea}>{idea}</span>
        ))}
      </div>
    </section>
  );
}
