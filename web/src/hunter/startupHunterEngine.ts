import type { ScoredOpportunity } from "../scoring/scoringTypes";
import type {
  BoardVerdict,
  EvidenceSignal,
  FounderProfile,
  FounderThesis,
  StartupHunt,
  StartupHuntScores,
  ValidationPlan,
  WorldState
} from "./hunterTypes";
import { buildCouncilVerdicts } from "./founderCouncil";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function words(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length > 2);
}

function textForOpportunity(opportunity: ScoredOpportunity): string {
  return [
    opportunity.title,
    opportunity.reason,
    opportunity.type,
    opportunity.sourceDatasetLabel,
    opportunity.dependency_types.join(" "),
    opportunity.buyer_types.join(" "),
    opportunity.affectedNodeRecords.map((node) => `${node.name} ${node.tags.join(" ")} ${node.sector.join(" ")}`).join(" "),
    opportunity.breakdown.graphDrivers.join(" "),
    opportunity.breakdown.scoreDrivers.join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

function matchingSignals(opportunity: ScoredOpportunity, thesis: FounderThesis, worldState: WorldState): EvidenceSignal[] {
  const corpus = `${textForOpportunity(opportunity)} ${thesis.text.toLowerCase()}`;
  return worldState.signals
    .map((signal) => {
      const keywordHits = signal.keywords.filter((keyword) => corpus.includes(keyword.toLowerCase())).length;
      const domainHit = signal.relatedDomains.includes(opportunity.sourceDatasetId) ? 2 : 0;
      const thesisHits = words(thesis.text).filter((word) => signal.summary.toLowerCase().includes(word) || signal.title.toLowerCase().includes(word)).length;
      return { signal, score: keywordHits * 3 + domainHit + Math.min(3, thesisHits) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.signal);
}

function graphSignal(opportunity: ScoredOpportunity): EvidenceSignal {
  return {
    id: `graph-${opportunity.id}`,
    title: "Founder Map graph evidence",
    summary: opportunity.breakdown.graphDrivers.slice(0, 4).join(" "),
    signalType: "buyer_pain",
    sourceLabel: "Founder Map graph-derived heuristic",
    collectedAt: "local",
    confidence: opportunity.breakdown.evidenceLevel === "very-strong" || opportunity.breakdown.evidenceLevel === "strong" ? "high" : "medium",
    polarity: "for",
    relatedDomains: [opportunity.sourceDatasetId],
    keywords: opportunity.dependency_types
  };
}

function riskSignal(opportunity: ScoredOpportunity): EvidenceSignal {
  return {
    id: `risk-${opportunity.id}`,
    title: "Founder Map risk counter-evidence",
    summary: opportunity.breakdown.riskDrivers.join(" "),
    signalType: "counter_evidence",
    sourceLabel: "Founder Map scoring heuristic",
    collectedAt: "local",
    confidence: "medium",
    polarity: "against",
    relatedDomains: [opportunity.sourceDatasetId],
    keywords: ["risk", "buyer", "capital", "regulation", "incumbent"]
  };
}

function founderFit(opportunity: ScoredOpportunity, profile: FounderProfile, thesis: FounderThesis): number {
  const domainFit = profile.preferredDomains.includes(opportunity.sourceDatasetId) ? 12 : 0;
  const softwareFit = profile.buildMode === "software-first" && opportunity.breakdown.feasibilityScore >= 62 ? 10 : 0;
  const geographyFit = profile.geography === "france-eu" && (opportunity.sourceDatasetId.includes("eu") || opportunity.sourceDatasetId.includes("european")) ? 8 : 0;
  const thesisHits = words(thesis.text).filter((word) => textForOpportunity(opportunity).includes(word)).length;
  return clamp(opportunity.breakdown.founderSpeedFitScore * 0.55 + opportunity.breakdown.personalFitScore * 0.25 + domainFit + softwareFit + geographyFit + Math.min(10, thesisHits * 1.5));
}

function originality(opportunity: ScoredOpportunity, thesis: FounderThesis): number {
  const rareTerms = ["dependency", "sovereignty", "ontology", "traceability", "readiness", "dual-use", "compute", "robot", "procurement", "simulation"];
  const corpus = `${textForOpportunity(opportunity)} ${thesis.text.toLowerCase()}`;
  const rareHits = rareTerms.filter((term) => corpus.includes(term)).length;
  return clamp(48 + rareHits * 6 + opportunity.breakdown.wedgeToEmpireScore * 0.28 + (opportunity.breakdown.archetype === "generic_platform" ? -10 : 5));
}

function moneyFlow(opportunity: ScoredOpportunity, evidenceFor: EvidenceSignal[]): number {
  const budgetSignals = evidenceFor.filter((signal) => signal.signalType === "budget_movement" || signal.signalType === "procurement").length;
  return clamp(opportunity.breakdown.buyerAccessScore * 0.4 + opportunity.breakdown.exitOptionalityScore * 0.25 + budgetSignals * 10 + opportunity.buyer_types.length * 4);
}

function acquirerPressure(opportunity: ScoredOpportunity): number {
  return clamp(42 + opportunity.breakdown.possibleAcquirerCategories.length * 7 + opportunity.breakdown.exitOptionalityScore * 0.35);
}

function validationVelocity(opportunity: ScoredOpportunity, profile: FounderProfile): number {
  const soloPenalty = profile.constraint === "solo" && opportunity.breakdown.phase === "big-bet" ? -12 : 0;
  const softwareBoost = profile.buildMode === "software-first" ? 6 : 0;
  return clamp(opportunity.breakdown.proofVelocityScore + softwareBoost + soloPenalty);
}

function buildScores(input: {
  opportunity: ScoredOpportunity;
  profile: FounderProfile;
  thesis: FounderThesis;
  evidenceFor: EvidenceSignal[];
  evidenceAgainst: EvidenceSignal[];
}): StartupHuntScores {
  const evidenceScore = clamp(input.opportunity.breakdown.evidenceStrength.score + input.evidenceFor.length * 3 - input.evidenceAgainst.length * 2);
  const founderFitScore = founderFit(input.opportunity, input.profile, input.thesis);
  const ambitionScore = clamp(input.opportunity.breakdown.strategicLeverageScore * 0.45 + input.opportunity.breakdown.wedgeToEmpireScore * 0.35 + (input.profile.ambitionMode === "world-bending" ? 14 : input.profile.ambitionMode === "venture-scale" ? 8 : 0));
  const originalityScore = originality(input.opportunity, input.thesis);
  const moneyFlowScore = moneyFlow(input.opportunity, input.evidenceFor);
  const acquirerPressureScore = acquirerPressure(input.opportunity);
  const validationVelocityScore = validationVelocity(input.opportunity, input.profile);
  const worldStateScore = clamp(evidenceScore * 0.55 + input.evidenceFor.length * 8 + input.opportunity.breakdown.affectedNodeCentrality * 2);
  const exitScore = clamp((input.opportunity.breakdown.exitOptionalityScore + acquirerPressureScore) / 2);
  const riskScore = clamp(100 - input.opportunity.breakdown.riskGate * 100 + input.evidenceAgainst.length * 7);
  const counterEvidencePenalty = clamp(input.evidenceAgainst.length * 5 + (riskScore > 55 ? 8 : 0));
  const founderGutScore = clamp((founderFitScore + originalityScore + ambitionScore) / 3);
  const rawDisagreement = Math.abs(ambitionScore - validationVelocityScore) + Math.abs(moneyFlowScore - originalityScore) * 0.45;
  const councilDisagreementScore = clamp(rawDisagreement);
  const riskGate = clamp(input.opportunity.breakdown.riskGate * 100, 48, 97) / 100;
  const moneyFlowModifier = 0.7 + moneyFlowScore / 250;
  const founderFitModifier = 0.65 + founderFitScore / 220;
  const ambitionModifier = 0.72 + ambitionScore / 260;
  const startupHunterScore = clamp(evidenceScore * moneyFlowModifier * founderFitModifier * ambitionModifier * riskGate - counterEvidencePenalty);

  return {
    startupHunterScore,
    worldStateScore,
    originalityScore,
    moneyFlowScore,
    acquirerPressureScore,
    counterEvidencePenalty,
    councilDisagreementScore,
    founderGutScore,
    validationVelocityScore,
    founderFitScore,
    ambitionScore,
    evidenceScore,
    exitScore,
    riskScore
  };
}

function productShape(opportunity: ScoredOpportunity): string {
  if (opportunity.breakdown.archetype.includes("dataops")) return "A software-first industrial data readiness layer with diagnostics, remediation workflow, and continuous evidence.";
  if (opportunity.breakdown.archetype.includes("compliance")) return "A narrow evidence automation product that turns regulatory pressure into operational proof.";
  if (opportunity.breakdown.archetype.includes("dependency")) return "A dependency intelligence layer that maps bottlenecks, suppliers, replacement risk, and action paths.";
  if (opportunity.breakdown.archetype.includes("infrastructure")) return "A compute/infrastructure intelligence product for allocation, energy, capacity, and cost decisions.";
  return "A focused diagnostic and workflow product that starts with one painful proof point and expands into an operating layer.";
}

function buildValidationPlan(opportunity: ScoredOpportunity): ValidationPlan {
  return {
    next7Days: [
      "Write the one-sentence enemy: what hidden inefficiency this hunt exposes.",
      "Book 5 calls with the target buyer profile.",
      "Build a no-code or spreadsheet demo using one real workflow.",
      "Collect one sample dataset, procurement document, or operator artifact."
    ],
    next30Days: [
      "Turn the demo into a repeatable diagnostic.",
      "Run 10 buyer interviews and score urgency, budget, and data access.",
      "Find one design partner willing to share workflow evidence.",
      "Prove whether the wedge creates a dataset or workflow moat."
    ],
    killCriteria: [
      "Buyers agree the problem exists but will not allocate budget or owner.",
      "The first proof requires enterprise integration before any clear value.",
      "The output is just a report and cannot become recurring workflow software."
    ]
  };
}

export function generateStartupHunts(input: {
  opportunities: ScoredOpportunity[];
  profile: FounderProfile;
  thesis: FounderThesis;
  worldState: WorldState;
}): StartupHunt[] {
  return input.opportunities
    .slice(0, 60)
    .map((opportunity) => {
      const matchedSignals = matchingSignals(opportunity, input.thesis, input.worldState);
      const evidenceFor = [graphSignal(opportunity), ...matchedSignals.filter((signal) => signal.polarity !== "against")].slice(0, 6);
      const evidenceAgainst = [riskSignal(opportunity), ...matchedSignals.filter((signal) => signal.polarity === "against" || signal.polarity === "mixed")].slice(0, 5);
      const scores = buildScores({ opportunity, profile: input.profile, thesis: input.thesis, evidenceFor, evidenceAgainst });
      const marketGap = `${opportunity.title} exposes a gap between strategic need and operational readiness in ${opportunity.sourceDatasetLabel}.`;
      const firstWedge = opportunity.breakdown.firstWedge;
      const councilVerdicts: BoardVerdict[] = buildCouncilVerdicts({
        opportunity,
        title: opportunity.title,
        marketGap,
        firstWedge,
        scores
      });
      const targetBuyer = opportunity.breakdown.possibleBuyers[0] || opportunity.buyer_types[0] || "strategic operators";
      const likelyAcquirers = opportunity.breakdown.possibleAcquirerCategories;

      return {
        id: `hunt-${opportunity.id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        sourceOpportunityId: opportunity.id,
        sourceDatasetId: opportunity.sourceDatasetId,
        title: opportunity.title,
        thesis: input.thesis.text,
        whyNonObvious: `The obvious market sees ${opportunity.type || "a problem"}. The non-obvious angle is controlling the evidence loop around ${opportunity.dependency_types.slice(0, 3).join(", ") || "the dependency"} before incumbents package it.`,
        marketGap,
        firstWedge,
        productShape: productShape(opportunity),
        moneyMap: {
          targetBuyer,
          budgetSource: opportunity.buyer_types.length ? `${opportunity.buyer_types.slice(0, 3).join(", ")} budget or transformation spend` : "innovation, operations, compliance, or infrastructure budget",
          whyTheyPayNow: opportunity.breakdown.scoreDrivers[2] || "The buyer has visible pain, but the exact budget owner must be validated.",
          pilotPriceLogic: "Start as a diagnostic or workflow pilot priced low enough for fast approval, then expand into recurring operating software.",
          expansionPath: opportunity.breakdown.expansionPath
        },
        exitMap: {
          likelyAcquirers,
          buyVsBuildPressure: `Acquirers would buy if the wedge owns workflow data, buyer access, or dependency intelligence they cannot recreate quickly.`,
          strategicTrigger: opportunity.breakdown.scoreDrivers[3] || "A strategic acquirer needs proof that this changes roadmap, procurement, or deployment speed.",
          acquisitionNarrative: `Become the evidence layer for ${opportunity.sourceDatasetLabel}, then sell into ${likelyAcquirers.slice(0, 3).join(", ") || "strategic platforms"}.`
        },
        evidenceFor,
        evidenceAgainst,
        councilVerdicts,
        validationPlan: buildValidationPlan(opportunity),
        founderDecision: scores.councilDisagreementScore > 42
          ? "High-tension hunt: chase only if the first buyer calls sharpen the wedge fast."
          : "Coherent hunt: run the validation sprint and look for budget owner pull.",
        scores
      };
    })
    .sort((a, b) =>
      b.scores.startupHunterScore - a.scores.startupHunterScore ||
      b.scores.moneyFlowScore - a.scores.moneyFlowScore ||
      b.scores.originalityScore - a.scores.originalityScore ||
      a.title.localeCompare(b.title)
    );
}

export function findStartupHunt(hunts: StartupHunt[], id?: string): StartupHunt | undefined {
  if (!id) return undefined;
  return hunts.find((hunt) => hunt.id === id || hunt.sourceOpportunityId === id);
}
