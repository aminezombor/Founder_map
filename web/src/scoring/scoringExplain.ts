import type { OpportunityPhase, ScoredOpportunity } from "./scoringTypes";
import { phaseDescription as describePhase, phaseLabel as labelPhase } from "./phaseModel";

export const preferenceExplanations = {
  feasibility: "Buildable with software or data first.",
  founderSpeedFit: "Prototype, learn, demo, and validate quickly.",
  strategicLeverage: "Bottleneck leverage, sovereignty, and defensibility.",
  buyerAccess: "Reachable buyers, urgency, and easy pilots.",
  exitOptionality: "Strategic paths without forced fast-sale bias."
};

export function phaseLabel(phase: OpportunityPhase): string {
  return labelPhase(phase);
}

export function phaseDescription(phase: OpportunityPhase): string {
  return describePhase(phase);
}

export function validationNextSteps(phase: OpportunityPhase): string[] {
  if (phase === "now") {
    return ["Build a demo", "Talk to 5 buyers", "Validate data access", "Test willingness to pay"];
  }
  if (phase === "near") {
    return ["Find pilot partner", "Collect sample workflow/data", "Validate integration pain", "Build narrow prototype"];
  }
  if (phase === "later") {
    return ["Map capital and certification needs", "Find strategic partner", "Identify smaller wedge", "Validate buyer budget"];
  }
  return ["Do not start with the full big bet", "Extract the wedge", "Validate strategic pain", "Find capital/partner path", "Turn the empire into a sequence"];
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
