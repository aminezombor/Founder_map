import type { DomainId } from "../scoring/scoringTypes";

export type FounderConstraint = "solo" | "small-team" | "fundraise-ready";
export type FounderGeo = "france-eu" | "global" | "us";
export type BuildMode = "software-first" | "hardware-allowed" | "deeptech";
export type AmbitionMode = "fast-proof" | "venture-scale" | "world-bending";

export interface FounderProfile {
  id: string;
  name: string;
  constraint: FounderConstraint;
  geography: FounderGeo;
  buildMode: BuildMode;
  ambitionMode: AmbitionMode;
  preferredDomains: DomainId[];
  geniusIdeas: string[];
  hatedIdeas: string[];
  admiredCompanies: string[];
}

export interface FounderThesis {
  id: string;
  text: string;
  createdAt: string;
  intensity: number;
}

export type EvidenceSignalType =
  | "buyer_pain"
  | "budget_movement"
  | "procurement"
  | "regulation"
  | "research_momentum"
  | "competitor_activity"
  | "acquisition_exit"
  | "open_source_momentum"
  | "talent_job_demand"
  | "counter_evidence";

export type EvidenceConfidence = "low" | "medium" | "high";

export interface EvidenceSignal {
  id: string;
  title: string;
  summary: string;
  signalType: EvidenceSignalType;
  sourceUrl?: string;
  sourceLabel: string;
  collectedAt: string;
  confidence: EvidenceConfidence;
  polarity: "for" | "against" | "mixed";
  relatedDomains: DomainId[];
  keywords: string[];
}

export interface WorldState {
  id: string;
  generatedAt: string;
  summary: string;
  signals: EvidenceSignal[];
}

export type BoardLensId =
  | "renaissance-builder"
  | "product-prophet"
  | "system-architect"
  | "chaos-inventor"
  | "contrarian-artist"
  | "deal-strategist"
  | "founder";

export interface BoardLens {
  id: BoardLensId;
  name: string;
  role: string;
  worldview: string;
  scoreBias: "ambition" | "simplicity" | "systems" | "originality" | "narrative" | "money" | "fit";
}

export interface BoardVerdict {
  lensId: BoardLensId;
  lensName: string;
  strongestFor: string;
  strongestAgainst: string;
  tenXMove: string;
  evidenceToChangeMind: string;
  scoreContribution: number;
}

export interface MoneyMap {
  targetBuyer: string;
  budgetSource: string;
  whyTheyPayNow: string;
  pilotPriceLogic: string;
  expansionPath: string;
}

export interface ExitMap {
  likelyAcquirers: string[];
  buyVsBuildPressure: string;
  strategicTrigger: string;
  acquisitionNarrative: string;
}

export interface ValidationPlan {
  next7Days: string[];
  next30Days: string[];
  killCriteria: string[];
}

export interface StartupHuntScores {
  startupHunterScore: number;
  worldStateScore: number;
  originalityScore: number;
  moneyFlowScore: number;
  acquirerPressureScore: number;
  counterEvidencePenalty: number;
  councilDisagreementScore: number;
  founderGutScore: number;
  validationVelocityScore: number;
  founderFitScore: number;
  ambitionScore: number;
  evidenceScore: number;
  exitScore: number;
  riskScore: number;
}

export interface StartupHunt {
  id: string;
  sourceOpportunityId: string;
  sourceDatasetId: DomainId;
  title: string;
  thesis: string;
  whyNonObvious: string;
  marketGap: string;
  firstWedge: string;
  productShape: string;
  moneyMap: MoneyMap;
  exitMap: ExitMap;
  evidenceFor: EvidenceSignal[];
  evidenceAgainst: EvidenceSignal[];
  councilVerdicts: BoardVerdict[];
  validationPlan: ValidationPlan;
  founderDecision: string;
  scores: StartupHuntScores;
}
