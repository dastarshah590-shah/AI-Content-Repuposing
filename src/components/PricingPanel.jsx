import { CheckCircle2 } from "lucide-react";

export function PricingPanel({ plans, currentPlan, onSelectPlan, onToast }) {
  async function selectPlan(planId) {
    await onSelectPlan(planId);
    onToast("Plan switched locally.");
  }

  return (
    <section className="panel pricing-panel" id="pricing" aria-labelledby="pricing-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">Plans</p>
          <h2 id="pricing-heading">Usage limits</h2>
        </div>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => {
          const active = currentPlan === plan.id;
          return (
            <button
              key={plan.id}
              className={`price-card ${active ? "selected" : ""}`}
              type="button"
              onClick={() => selectPlan(plan.id)}
            >
              <span className="price-title">
                {active && <CheckCircle2 size={16} />}
                {plan.label}
              </span>
              <strong>${plan.price}/mo</strong>
              <small>{plan.monthlyGenerations} generations</small>
              <small>{plan.maxPlatforms} platforms per run</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}