import type { ScoredOpportunity } from "../../scoring/scoringTypes";
import { phaseLabel } from "../../scoring/scoringExplain";
import { ScoreMeter } from "./ScoreMeter";

interface OpportunityCardProps {
  opportunity: ScoredOpportunity;
  rank: number;
  selected: boolean;
  onSelect: (opportunityId: string) => void;
}

export function OpportunityCard({ opportunity, rank, selected, onSelect }: OpportunityCardProps) {
  const breakdown = opportunity.breakdown;
  return (
    <button type="button" className={`opportunity-card${selected ? " selected" : ""}`} onClick={() => onSelect(opportunity.id)}>
      <span className="opportunity-rank">#{rank}</span>
      <strong>{opportunity.title}</strong>
      <span>{opportunity.sourceDatasetLabel}</span>
      <div>
        <span className={`phase-pill phase-${breakdown.phase}`}>{phaseLabel(breakdown.phase)}</span>
        <ScoreMeter value={breakdown.finalUtilityScore} />
      </div>
    </button>
  );
}
