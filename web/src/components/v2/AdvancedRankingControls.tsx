import type { OpportunityAdvancedFilters, OpportunityPhase } from "../../scoring/scoringTypes";
import { phaseDefinitions, phaseLabel } from "../../scoring/phaseModel";

interface AdvancedRankingControlsProps {
  filters: OpportunityAdvancedFilters;
  onChange: (filters: OpportunityAdvancedFilters) => void;
}

const sortOptions: Array<{ value: OpportunityAdvancedFilters["sortBy"]; label: string }> = [
  { value: "finalUtility", label: "Final utility" },
  { value: "structural", label: "Structural score" },
  { value: "personalFit", label: "Personal fit" },
  { value: "feasibility", label: "Feasibility" },
  { value: "founderSpeedFit", label: "Founder speed fit" },
  { value: "strategicLeverage", label: "Strategic leverage" },
  { value: "buyerAccess", label: "Buyer access" },
  { value: "exitOptionality", label: "Exit optionality" },
  { value: "proofVelocity", label: "Proof velocity" },
  { value: "wedgeToEmpire", label: "Wedge-to-empire" }
];

const phaseOrder: OpportunityPhase[] = ["now", "near", "later", "big-bet"];

export function AdvancedRankingControls({ filters, onChange }: AdvancedRankingControlsProps) {
  function patch(patchValue: Partial<OpportunityAdvancedFilters>) {
    onChange({ ...filters, ...patchValue });
  }

  function togglePhase(phase: OpportunityPhase) {
    const phases = filters.phases.includes(phase)
      ? filters.phases.filter((current) => current !== phase)
      : [...filters.phases, phase];
    patch({ phases });
  }

  return (
    <section className="v2-panel advanced-ranking-panel">
      <label className="search-field">
        <span>Search opportunities</span>
        <input
          type="search"
          value={filters.query}
          placeholder="Search title, buyer, dependency, node, reason..."
          onChange={(event) => patch({ query: event.target.value })}
        />
      </label>

      <details>
        <summary>
          <span>Advanced ranking controls</span>
          <b>{filters.sortBy === "finalUtility" ? "Final utility" : sortOptions.find((option) => option.value === filters.sortBy)?.label}</b>
        </summary>

        <div className="advanced-controls-grid">
          <fieldset className="phase-filter">
            <legend>Phase filter</legend>
            {phaseOrder.map((phase) => (
              <label key={phase} className="check-row">
                <input type="checkbox" checked={filters.phases.includes(phase)} onChange={() => togglePhase(phase)} />
                <span title={phaseDefinitions[phase].meaning}>{phaseLabel(phase)}</span>
              </label>
            ))}
          </fieldset>

          <label className="mini-range">
            <span>Minimum final utility <b>{filters.minFinalUtility}</b></span>
            <input type="range" min="0" max="100" value={filters.minFinalUtility} onChange={(event) => patch({ minFinalUtility: Number(event.target.value) })} />
          </label>

          <label className="mini-range">
            <span>Minimum feasibility <b>{filters.minFeasibility}</b></span>
            <input type="range" min="0" max="100" value={filters.minFeasibility} onChange={(event) => patch({ minFeasibility: Number(event.target.value) })} />
          </label>

          <label className="mini-range">
            <span>Minimum exit optionality <b>{filters.minExitOptionality}</b></span>
            <input type="range" min="0" max="100" value={filters.minExitOptionality} onChange={(event) => patch({ minExitOptionality: Number(event.target.value) })} />
          </label>

          <label className="sort-field">
            <span>Sort by</span>
            <select value={filters.sortBy} onChange={(event) => patch({ sortBy: event.target.value as OpportunityAdvancedFilters["sortBy"] })}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="advanced-toggles">
            <label className="toggle-row">
              <input type="checkbox" checked={filters.includeEvidenceDomains} onChange={(event) => patch({ includeEvidenceDomains: event.target.checked })} />
              <span>Include evidence domains in ranking</span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={filters.strongGraphEvidenceOnly} onChange={(event) => patch({ strongGraphEvidenceOnly: event.target.checked })} />
              <span>Show only opportunities with strong graph evidence</span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={filters.showBigBets} onChange={(event) => patch({ showBigBets: event.target.checked })} />
              <span>Show big bets</span>
            </label>
          </div>
        </div>
      </details>
    </section>
  );
}
