import type { ScoredOpportunity } from "../../scoring/scoringTypes";
import { phaseLabel } from "../../scoring/scoringExplain";
import { ScoreMeter } from "./ScoreMeter";

interface OpportunityRankTableProps {
  opportunities: ScoredOpportunity[];
  selectedOpportunityId?: string;
  onSelect: (opportunityId: string) => void;
}

export function OpportunityRankTable({ opportunities, selectedOpportunityId, onSelect }: OpportunityRankTableProps) {
  return (
    <section className="v2-panel rank-panel">
      <div className="rank-toolbar">
        <div>
          <h1>Best opportunities for you</h1>
          <p>Ranked by your weighted preferences across selected domains.</p>
        </div>
        <div className="rank-actions">
          <label>
            Sort by
            <select value="finalUtility" onChange={() => undefined}>
              <option value="finalUtility">Final utility</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rank-table-wrap">
        <table className="rank-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Opportunity</th>
              <th>Phase</th>
              <th>Final utility</th>
              <th>Structural</th>
              <th>Personal fit</th>
              <th>Feasibility</th>
              <th>Strategic leverage</th>
              <th>Buyer access</th>
              <th>Exit optionality</th>
              <th>Source dataset</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity, index) => {
              const selected = selectedOpportunityId === opportunity.id;
              const breakdown = opportunity.breakdown;
              return (
                <tr key={opportunity.id} className={selected ? "selected" : undefined} onClick={() => onSelect(opportunity.id)}>
                  <td>{index + 1}</td>
                  <td>
                    <button type="button" className="table-title" onClick={() => onSelect(opportunity.id)}>
                      <strong>{opportunity.title}</strong>
                      <span>{opportunity.type || "Opportunity"}</span>
                    </button>
                  </td>
                  <td><span className={`phase-pill phase-${breakdown.phase}`}>{phaseLabel(breakdown.phase)}</span></td>
                  <td><ScoreMeter value={breakdown.finalUtilityScore} /></td>
                  <td><ScoreMeter value={breakdown.structuralOpportunityScore} compact /></td>
                  <td><ScoreMeter value={breakdown.personalFitScore} tone="blue" compact /></td>
                  <td><ScoreMeter value={breakdown.feasibilityScore} tone="orange" compact /></td>
                  <td><ScoreMeter value={breakdown.strategicLeverageScore} tone="green" compact /></td>
                  <td><ScoreMeter value={breakdown.buyerAccessScore} tone="purple" compact /></td>
                  <td><ScoreMeter value={breakdown.exitOptionalityScore} tone="teal" compact /></td>
                  <td><span className="dataset-dot">{opportunity.sourceDatasetLabel}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
