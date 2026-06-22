import type { OpportunityAdvancedFilters, ScoredOpportunity } from "../../scoring/scoringTypes";
import { phaseLabel } from "../../scoring/scoringExplain";
import { PhaseLegend } from "./PhaseLegend";
import { ScoreMeter } from "./ScoreMeter";

interface OpportunityRankTableProps {
  opportunities: ScoredOpportunity[];
  totalCount: number;
  filteredCount: number;
  sortBy: OpportunityAdvancedFilters["sortBy"];
  query: string;
  selectedOpportunityId?: string;
  onSelect: (opportunityId: string) => void;
}

const sortLabels: Record<OpportunityAdvancedFilters["sortBy"], string> = {
  finalUtility: "Final utility",
  structural: "Structural",
  personalFit: "Fit",
  feasibility: "Feasibility",
  founderSpeedFit: "Founder speed",
  strategicLeverage: "Leverage",
  buyerAccess: "Buyer",
  exitOptionality: "Exit",
  proofVelocity: "Proof velocity",
  wedgeToEmpire: "Wedge-to-empire"
};

export function OpportunityRankTable({ opportunities, totalCount, filteredCount, sortBy, query, selectedOpportunityId, onSelect }: OpportunityRankTableProps) {
  const mark = (key: OpportunityAdvancedFilters["sortBy"]) => (sortBy === key ? "desc" : "");

  return (
    <section className="v2-panel rank-panel">
      <div className="rank-toolbar">
        <div>
          <h1>Best opportunities for you</h1>
          <p>{filteredCount} of {totalCount} opportunities shown{query ? ` for "${query}"` : ""}. Sorted by {sortLabels[sortBy]}.</p>
        </div>
      </div>
      <PhaseLegend />

      <div className="rank-table-wrap">
        <table className="rank-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Opportunity</th>
              <th>Phase</th>
              <th>Final utility {mark("finalUtility")}</th>
              <th>Structural {mark("structural")}</th>
              <th>Fit {mark("personalFit")}</th>
              <th>Feasibility {mark("feasibility")}</th>
              <th>Leverage {mark("strategicLeverage")}</th>
              <th>Buyer {mark("buyerAccess")}</th>
              <th>Exit {mark("exitOptionality")}</th>
              <th>Dataset</th>
            </tr>
          </thead>
          <tbody>
            {!opportunities.length && (
              <tr>
                <td colSpan={11}>
                  <div className="empty-table-state">No opportunities match the current filters.</div>
                </td>
              </tr>
            )}
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
