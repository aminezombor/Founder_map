import type { OpportunityPhase } from "../../scoring/scoringTypes";
import { phaseDefinitions, phaseLabel } from "../../scoring/phaseModel";

const phases: OpportunityPhase[] = ["now", "near", "later", "big-bet"];

export function PhaseLegend() {
  return (
    <div className="phase-legend" aria-label="Opportunity phase legend">
      {phases.map((phase) => (
        <span key={phase} title={`${phaseDefinitions[phase].meaning} ${phaseDefinitions[phase].warning}`}>
          <b className={`phase-pill phase-${phase}`}>{phaseLabel(phase)}</b>
          <em>{phaseDefinitions[phase].legend}</em>
        </span>
      ))}
    </div>
  );
}
