import type { OpportunityPhase } from "./scoringTypes";

export const phaseDefinitions: Record<
  OpportunityPhase,
  {
    label: string;
    meaning: string;
    typicalPath: string;
    warning: string;
    legend: string;
  }
> = {
  now: {
    label: "Now",
    meaning: "Can be tested with software/data/demo quickly.",
    typicalPath: "Demo, buyer calls, lightweight prototype.",
    warning: "Must still validate willingness to pay.",
    legend: "can be tested with software/data/demo quickly"
  },
  near: {
    label: "Near-term",
    meaning: "Needs pilots, partner access, or real operational data.",
    typicalPath: "Pilot partner, sample data, workflow validation.",
    warning: "Avoid overbuilding before access is confirmed.",
    legend: "needs pilots, partner access, or real data"
  },
  later: {
    label: "Later",
    meaning: "Needs serious integration, certification, hardware, or enterprise rollout.",
    typicalPath: "Strategic partner, integration proof, capital planning.",
    warning: "Extract a smaller wedge first.",
    legend: "needs serious integration, certification, hardware, or capital"
  },
  "big-bet": {
    label: "Big bet",
    meaning: "Huge strategic upside but too large to attack directly.",
    typicalPath: "Wedge first, then platform expansion.",
    warning: "Do not start with the full empire.",
    legend: "huge upside but needs a smaller wedge first"
  }
};

export function phaseLabel(phase: OpportunityPhase): string {
  return phaseDefinitions[phase].label;
}

export function phaseDescription(phase: OpportunityPhase): string {
  const definition = phaseDefinitions[phase];
  return `${definition.meaning} ${definition.typicalPath} ${definition.warning}`;
}

export function classifyPhase(input: {
  feasibility: number;
  proofVelocity: number;
  strategicLeverage: number;
  capitalIntensity?: number | null;
  regulatoryFriction?: number | null;
  hardwareHeavy: boolean;
}): OpportunityPhase {
  const capital = input.capitalIntensity ?? 2;
  const regulatory = input.regulatoryFriction ?? 2;
  if (input.strategicLeverage >= 84 && (capital >= 4 || regulatory >= 4 || input.hardwareHeavy)) return "big-bet";
  if (input.feasibility >= 70 && input.proofVelocity >= 68 && capital <= 2.5 && regulatory <= 2.8 && !input.hardwareHeavy) return "now";
  if (input.feasibility >= 58 && input.proofVelocity >= 55 && capital <= 3.5) return "near";
  return "later";
}
