import { Map } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { ScoredOpportunity } from "../../scoring/scoringTypes";
import { confidenceCaveat, phaseDescription, phaseLabel, scoreFormulaText, validationNextSteps } from "../../scoring/scoringExplain";
import { findScoredOpportunity } from "../../scoring/opportunityScoring";
import { ScoreMeter } from "./ScoreMeter";

interface OpportunityDeepDiveProps {
  opportunities: ScoredOpportunity[];
}

export function OpportunityDeepDive({ opportunities }: OpportunityDeepDiveProps) {
  const { id } = useParams();
  const opportunity = findScoredOpportunity(opportunities, id ? decodeURIComponent(id) : undefined);

  if (!opportunity) {
    return (
      <div className="v2-doc-page">
        <section className="v2-panel doc-hero">
          <h1>Opportunity not found</h1>
          <p>The selected opportunity is not available in the loaded datasets.</p>
          <Link to="/" className="v2-primary-button">Back to dashboard</Link>
        </section>
      </div>
    );
  }

  const breakdown = opportunity.breakdown;
  const mapTo = `/map?dataset=${encodeURIComponent(opportunity.sourceDatasetId)}&opportunity=${encodeURIComponent(opportunity.opportunity.id)}`;

  return (
    <div className="v2-doc-page deep-dive-page">
      <section className="v2-panel deep-hero">
        <div>
          <span className={`phase-pill phase-${breakdown.phase}`}>{phaseLabel(breakdown.phase)}</span>
          <h1>{opportunity.title}</h1>
          <p>{opportunity.reason}</p>
        </div>
        <div className="deep-score">
          <ScoreMeter value={breakdown.finalUtilityScore} />
          <Link to={mapTo} className="v2-secondary-button"><Map size={16} aria-hidden /> View affected nodes in map</Link>
        </div>
      </section>

      <section className="deep-grid">
        <article className="v2-panel formula-card">
          <h2>Formula applied</h2>
          <pre>{scoreFormulaText(opportunity)}</pre>
          <p>{confidenceCaveat()}</p>
        </article>
        <article className="v2-panel">
          <h2>Phase interpretation</h2>
          <p>{phaseDescription(breakdown.phase)}</p>
        </article>
        <article className="v2-panel score-breakdown-card">
          <h2>Score components</h2>
          <ScoreMeter value={breakdown.structuralOpportunityScore} label="Structural score" />
          <ScoreMeter value={breakdown.personalFitScore} label="Personal fit" tone="blue" />
          <ScoreMeter value={breakdown.feasibilityScore} label="Feasibility" tone="orange" />
          <ScoreMeter value={breakdown.strategicLeverageScore} label="Strategic leverage" />
          <ScoreMeter value={breakdown.buyerAccessScore} label="Buyer access" tone="purple" />
          <ScoreMeter value={breakdown.exitOptionalityScore} label="Exit optionality" tone="teal" />
        </article>
        <article className="v2-panel">
          <h2>First wedge</h2>
          <p>{breakdown.firstWedge}</p>
          <h2>Expansion path</h2>
          <p>{breakdown.expansionPath}</p>
        </article>
        <article className="v2-panel">
          <h2>Buyers and acquirers</h2>
          <div className="v2-chip-list">{breakdown.possibleBuyers.map((buyer) => <span key={buyer}>{buyer}</span>)}</div>
          <div className="v2-chip-list">{breakdown.possibleAcquirerCategories.map((category) => <span key={category}>{category}</span>)}</div>
        </article>
        <article className="v2-panel">
          <h2>Evidence</h2>
          <p><strong>Dataset:</strong> {opportunity.sourceDatasetLabel}</p>
          <p><strong>Affected nodes:</strong> {opportunity.affectedNodeRecords.map((node) => node.name).join(", ") || "No resolved nodes"}</p>
          <p><strong>Related bottlenecks:</strong> {opportunity.bottleneckNodes.map((node) => node.name).join(", ") || "No direct red/orange bottleneck"}</p>
          <p><strong>Sources:</strong> {opportunity.opportunity.sources.join(", ") || "No source IDs attached"}</p>
        </article>
        <article className="v2-panel">
          <h2>Risks</h2>
          {breakdown.riskFlags.length ? (
            <ul className="tight-list">{breakdown.riskFlags.map((risk) => <li key={risk}>{risk}</li>)}</ul>
          ) : (
            <p className="muted">No major risk flags from the scoring model.</p>
          )}
        </article>
        <article className="v2-panel">
          <h2>What to validate next</h2>
          <ul className="tight-list">
            {validationNextSteps(breakdown.phase).map((step) => <li key={step}>{step}</li>)}
          </ul>
        </article>
      </section>
    </div>
  );
}
