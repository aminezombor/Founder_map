import { ExternalLink, Map, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { PreferenceWeights, ScoredOpportunity } from "../../scoring/scoringTypes";
import { phaseDescription, phaseLabel } from "../../scoring/scoringExplain";
import { defaultPreferenceWeights } from "../../scoring/scoringTypes";
import { ScoreMeter } from "./ScoreMeter";
import { OpportunityInspectorTabs } from "./OpportunityInspectorTabs";

interface OpportunityInspectorProps {
  opportunity?: ScoredOpportunity;
  weights?: PreferenceWeights;
  onClose?: () => void;
}

export function OpportunityInspector({ opportunity, weights = defaultPreferenceWeights, onClose }: OpportunityInspectorProps) {
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

      <OpportunityInspectorTabs opportunity={opportunity} weights={weights} />

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
