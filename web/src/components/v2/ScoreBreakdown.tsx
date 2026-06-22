import type { PreferenceWeights, ScoredOpportunity } from "../../scoring/scoringTypes";
import { ScoreMeter } from "./ScoreMeter";

interface ScoreBreakdownProps {
  opportunity: ScoredOpportunity;
  weights: PreferenceWeights;
}

export function ScoreBreakdown({ opportunity, weights }: ScoreBreakdownProps) {
  const breakdown = opportunity.breakdown;
  return (
    <div className="score-breakdown-grid">
      <ScoreMeter value={breakdown.finalUtilityScore} label="Final utility" />
      <ScoreMeter value={breakdown.structuralOpportunityScore} label="Structural opportunity" />
      <ScoreMeter value={breakdown.personalFitScore} label="Personal fit" tone="blue" />
      <ScoreMeter value={breakdown.feasibilityScore} label="Feasibility" tone="orange" />
      <ScoreMeter value={breakdown.founderSpeedFitScore} label="Founder speed fit" tone="blue" />
      <ScoreMeter value={breakdown.strategicLeverageScore} label="Strategic leverage" tone="green" />
      <ScoreMeter value={breakdown.buyerAccessScore} label="Buyer access" tone="purple" />
      <ScoreMeter value={breakdown.exitOptionalityScore} label="Exit optionality" tone="teal" />
      <ScoreMeter value={breakdown.proofVelocityScore} label="Proof velocity" tone="orange" />
      <ScoreMeter value={breakdown.wedgeToEmpireScore} label="Wedge-to-empire" tone="green" />
      <ScoreMeter value={breakdown.evidenceStrength.score} label="Evidence strength" tone="blue" />
      <div className="risk-gate-card">
        <strong>{breakdown.riskGate.toFixed(2)}</strong>
        <span>Risk gate</span>
      </div>

      <section className="calculation-block">
        <h3>Active coefficients</h3>
        <dl className="coefficient-grid">
          <div><dt>Feasibility coefficient</dt><dd>{weights.feasibility}</dd></div>
          <div><dt>Founder speed fit coefficient</dt><dd>{weights.founderSpeedFit}</dd></div>
          <div><dt>Strategic leverage coefficient</dt><dd>{weights.strategicLeverage}</dd></div>
          <div><dt>Buyer access coefficient</dt><dd>{weights.buyerAccess}</dd></div>
          <div><dt>Exit optionality coefficient</dt><dd>{weights.exitOptionality}</dd></div>
        </dl>
      </section>

      <section className="calculation-block">
        <h3>Formula</h3>
        <pre>{`FinalUtility =
StructuralOpportunityScore x PersonalFitModifier x RiskGate

PersonalFitModifier =
0.35 + 0.65 x PersonalFitScore / 100

PersonalFitScore =
weighted average of the five score dimensions using current coefficients`}</pre>
      </section>
    </div>
  );
}
