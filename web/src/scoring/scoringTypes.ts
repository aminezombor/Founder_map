import type { GraphDataset, GraphEdge, GraphNode, Opportunity } from "../types/graph";

export type DomainId =
  | "eu-ai-stack"
  | "global-ai-stack"
  | "industrial-software-ot-stack"
  | "european-defence-stack"
  | "global-aerospace-stack"
  | "robotics-execution-stack";

export type PreferenceKey =
  | "feasibility"
  | "founderSpeedFit"
  | "strategicLeverage"
  | "buyerAccess"
  | "exitOptionality";

export interface PreferenceWeights {
  feasibility: number;
  founderSpeedFit: number;
  strategicLeverage: number;
  buyerAccess: number;
  exitOptionality: number;
}

export type OpportunityPhase = "now" | "near" | "later" | "big-bet";

export interface OpportunityScoreBreakdown {
  structuralOpportunityScore: number;
  feasibilityScore: number;
  founderSpeedFitScore: number;
  strategicLeverageScore: number;
  buyerAccessScore: number;
  exitOptionalityScore: number;
  personalFitScore: number;
  riskGate: number;
  finalUtilityScore: number;
  wedgeToEmpireScore: number;
  proofVelocityScore: number;
  phase: OpportunityPhase;
  scoreReasons: string[];
  riskFlags: string[];
  firstWedge: string;
  expansionPath: string;
  possibleBuyers: string[];
  possibleAcquirerCategories: string[];
  estimatedTimeToMvpMonths: number | null;
  estimatedTimeToRevenueMonths: number | null;
  estimatedTimeToExitMonths: number | null;
}

export interface ScoredOpportunity {
  id: string;
  sourceDatasetId: DomainId;
  sourceDatasetLabel: string;
  title: string;
  type?: string;
  reason?: string;
  affected_nodes: string[];
  dependency_types: string[];
  buyer_types: string[];
  originalScore?: number | null;
  opportunity: Opportunity;
  dataset: GraphDataset;
  affectedNodeRecords: GraphNode[];
  connectedEdges: GraphEdge[];
  bottleneckNodes: GraphNode[];
  breakdown: OpportunityScoreBreakdown;
}

export interface DomainOption {
  id: DomainId;
  label: string;
  shortLabel: string;
  status: "active" | "evidence" | "planned";
  includedByDefault: boolean;
  includedInScoring: boolean;
  planned?: boolean;
  reason?: string;
}

export const defaultPreferenceWeights: PreferenceWeights = {
  feasibility: 2,
  founderSpeedFit: 2,
  strategicLeverage: 2,
  buyerAccess: 2,
  exitOptionality: 2
};

export const defaultScoringDomainIds: DomainId[] = [
  "eu-ai-stack",
  "global-ai-stack",
  "industrial-software-ot-stack"
];

export const domainOptions: DomainOption[] = [
  {
    id: "eu-ai-stack",
    label: "EU AI Stack",
    shortLabel: "EU AI",
    status: "active",
    includedByDefault: true,
    includedInScoring: true
  },
  {
    id: "global-ai-stack",
    label: "Global AI Stack",
    shortLabel: "Global AI",
    status: "active",
    includedByDefault: true,
    includedInScoring: true
  },
  {
    id: "industrial-software-ot-stack",
    label: "Industrial Software / OT Stack",
    shortLabel: "Industrial OT",
    status: "active",
    includedByDefault: true,
    includedInScoring: true
  },
  {
    id: "european-defence-stack",
    label: "European Defence Stack",
    shortLabel: "EU Defence",
    status: "evidence",
    includedByDefault: false,
    includedInScoring: true,
    reason: "Evidence and application domain; available when toggled."
  },
  {
    id: "global-aerospace-stack",
    label: "Global Aerospace Stack",
    shortLabel: "Aerospace",
    status: "evidence",
    includedByDefault: false,
    includedInScoring: true,
    reason: "Evidence and application domain; available when toggled."
  },
  {
    id: "robotics-execution-stack",
    label: "Robotics Execution Stack",
    shortLabel: "Robotics",
    status: "planned",
    includedByDefault: false,
    includedInScoring: false,
    planned: true,
    reason: "Planned domain. Data will be collected after the scoring schema is validated."
  }
];

export function isDomainId(value: string): value is DomainId {
  return domainOptions.some((domain) => domain.id === value);
}

export function getDomainOption(id: string): DomainOption | undefined {
  return domainOptions.find((domain) => domain.id === id);
}
