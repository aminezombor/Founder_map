import { ExternalLink, Map, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { ScoredOpportunity } from "../../scoring/scoringTypes";
import { phaseDescription, phaseLabel } from "../../scoring/scoringExplain";
import { ScoreMeter } from "./ScoreMeter";

interface OpportunityInspectorProps {
  opportunity?: ScoredOpportunity;
  onClose?: () => void;
}

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

export function OpportunityInspector({ opportunity, onClose }: OpportunityInspectorProps) {
  if (!opportunity) {
    return (
      <aside className="v2-panel opportunity-inspector">
        <h2>Selected opportunity</h2>
        <p className="muted">Choose a row to see the wedge, evidence, buyers, risks, and next action.</p>
      </aside>
    );
  }

  const breakdown = opportunity.breakdown;
  const mapTo = `/map?dataset=${encodeURIComponent(opportunity.sourceDatasetId)}&opportunity=${encodeURIComponent(opportunity.opportunity.id)}`;
  const deepDiveTo = `/opportunity/${encodeURIComponent(opportunity.id)}`;

  return (
    <aside className="v2-panel opportunity-inspector">
      <div className="inspector-title-row">
        <div>
          <p>Selected opportunity</p>
          <h2>{opportunity.title}</h2>
        </div>
        {onClose && (
          <button type="button" className="v2-icon-button" onClick={onClose} title="Close selected opportunity">
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <div className="inspector-score-row">
        <span className={`phase-pill phase-${breakdown.phase}`}>{phaseLabel(breakdown.phase)}</span>
        <ScoreMeter value={breakdown.finalUtilityScore} />
      </div>
      <p className="phase-copy">{phaseDescription(breakdown.phase)}</p>

      <section>
        <h3>Why it scores</h3>
        <p>{opportunity.reason || breakdown.scoreReasons[0]}</p>
        <ul className="tight-list">
          {breakdown.scoreReasons.map((reason) => (
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
        <h3>Key risks</h3>
        {breakdown.riskFlags.length ? (
          <ul className="tight-list">
            {breakdown.riskFlags.map((risk) => <li key={risk}>{risk}</li>)}
          </ul>
        ) : (
          <p className="muted">No major risk flags from the scoring model.</p>
        )}
      </section>

      <div className="timeline-grid">
        <span><strong>{breakdown.estimatedTimeToMvpMonths ?? "-"}</strong>MVP months</span>
        <span><strong>{breakdown.estimatedTimeToRevenueMonths ?? "-"}</strong>Revenue months</span>
        <span><strong>{breakdown.estimatedTimeToExitMonths ?? "-"}</strong>Exit months</span>
      </div>

      <div className="inspector-actions">
        <Link to={mapTo} className="v2-secondary-button"><Map size={16} aria-hidden /> View in map</Link>
        <Link to={deepDiveTo} className="v2-primary-button">Deep dive <ExternalLink size={15} aria-hidden /></Link>
      </div>
    </aside>
  );
}
