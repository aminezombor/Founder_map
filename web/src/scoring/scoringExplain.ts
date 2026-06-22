import type { OpportunityPhase, ScoredOpportunity } from "./scoringTypes";

export const preferenceExplanations = {
  feasibility: "Buildable with software or data first.",
  founderSpeedFit: "Prototype, learn, demo, and validate quickly.",
  strategicLeverage: "Bottleneck leverage, sovereignty, and defensibility.",
  buyerAccess: "Reachable buyers, urgency, and easy pilots.",
  exitOptionality: "Strategic paths without forced fast-sale bias."
};

export function phaseLabel(phase: OpportunityPhase): string {
  if (phase === "now") return "Now";
  if (phase === "near") return "Near";
  if (phase === "later") return "Later";
  return "Big bet";
}

export function phaseDescription(phase: OpportunityPhase): string {
  if (phase === "now") return "Software or data wedge can be demonstrated quickly.";
  if (phase === "near") return "Needs pilots, partner access, or workflow data before it becomes obvious.";
  if (phase === "later") return "Needs deeper integration, certification, hardware, or enterprise rollout.";
  return "Huge strategic surface, but should be broken into a smaller proof wedge first.";
}

export function validationNextSteps(phase: OpportunityPhase): string[] {
  if (phase === "now") {
    return ["Build a demo", "Contact 5 buyers", "Validate data access"];
  }
  if (phase === "near") {
    return ["Find a pilot partner", "Verify workflow pain", "Collect sample data"];
  }
  if (phase === "later") {
    return ["Map capital requirements", "Find a strategic partner", "Validate regulation"];
  }
  return ["Break into a smaller wedge first", "Map strategic partner path", "Validate the highest-risk assumption"];
}

export function scoreFormulaText(opportunity?: ScoredOpportunity): string {
  if (!opportunity) {
    return "FinalUtility = StructuralOpportunityScore x PersonalFitModifier x RiskGate";
  }
  const breakdown = opportunity.breakdown;
  return `FinalUtility = StructuralOpportunityScore x PersonalFitModifier x RiskGate
${Math.round(breakdown.finalUtilityScore)} = ${Math.round(breakdown.structuralOpportunityScore)} x personal fit modifier x ${breakdown.riskGate.toFixed(2)} risk gate`;
}

export function confidenceCaveat(): string {
  return "Scores are directional intelligence. They combine local graph evidence, opportunity fields, and deterministic heuristics; they are not market truth.";
}
