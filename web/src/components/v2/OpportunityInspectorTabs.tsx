import { useState } from "react";
import type { PreferenceWeights, ScoredOpportunity } from "../../scoring/scoringTypes";
import { validationNextSteps } from "../../scoring/scoringExplain";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { GraphEvidenceList } from "./GraphEvidenceList";

interface OpportunityInspectorTabsProps {
  opportunity: ScoredOpportunity;
  weights: PreferenceWeights;
}

type InspectorTab = "summary" | "calculation" | "evidence" | "next";

const tabs: Array<{ id: InspectorTab; label: string }> = [
  { id: "summary", label: "Summary" },
  { id: "calculation", label: "Calculation" },
  { id: "evidence", label: "Evidence" },
  { id: "next", label: "Next action" }
];

function chipList(items: string[], empty: string) {
  if (!items.length) return <p className="muted">{empty}</p>;
  return (
    <div className="v2-chip-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function OpportunityInspectorTabs({ opportunity, weights }: OpportunityInspectorTabsProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("summary");
  const breakdown = opportunity.breakdown;

  return (
    <div className="inspector-tab-shell">
      <div className="inspector-tab-list" role="tablist" aria-label="Opportunity details">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : undefined}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="inspector-tab-body">
        {activeTab === "summary" && (
          <>
            <section>
              <h3>Why it scores</h3>
              <p>{opportunity.reason || breakdown.scoreReasons[0]}</p>
              <ul className="tight-list">
                {breakdown.graphDrivers.slice(0, 4).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
                {breakdown.scoreDrivers.slice(0, 3).map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>First wedge</h3>
              <p>{breakdown.firstWedge}</p>
            </section>

            <section>
              <h3>Expansion path</h3>
              <p>{breakdown.expansionPath}</p>
            </section>

            <section>
              <h3>Possible buyers</h3>
              {chipList(breakdown.possibleBuyers, "No buyer types attached.")}
            </section>

            <section>
              <h3>Acquirer categories</h3>
              {chipList(breakdown.possibleAcquirerCategories, "No acquirer categories inferred.")}
            </section>

            <section>
              <h3>Risk flags</h3>
              {breakdown.riskFlags.length ? (
                <ul className="tight-list">
                  {breakdown.riskFlags.map((risk) => <li key={risk}>{risk}</li>)}
                </ul>
              ) : (
                <p className="muted">No major risk flags from the scoring model.</p>
              )}
            </section>
          </>
        )}

        {activeTab === "calculation" && <ScoreBreakdown opportunity={opportunity} weights={weights} />}

        {activeTab === "evidence" && <GraphEvidenceList opportunity={opportunity} />}

        {activeTab === "next" && (
          <section>
            <h3>Deterministic next validation</h3>
            <ul className="tight-list">
              {validationNextSteps(breakdown.phase).map((step) => <li key={step}>{step}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
