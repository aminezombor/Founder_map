import type { GraphDataset, GraphEdge, GraphNode, Opportunity } from "../types/graph";
import { inferAcquirerCategories } from "./acquirerModel";
import {
  defaultPreferenceWeights,
  type DomainId,
  type PreferenceWeights,
  type ScoredOpportunity,
  type OpportunityPhase
} from "./scoringTypes";

const HARDWARE_TERMS = ["hardware", "materials", "battery", "sensor", "robot", "robotics", "semiconductor", "fab", "mro", "aerospace", "certification"];
const SOFTWARE_TERMS = ["software", "data", "platform", "scanner", "intelligence", "graph", "compliance", "observability", "ai", "cloud", "rag", "governance"];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function toScore(value?: number | null, max = 5, fallback = 55): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return clamp((value / max) * 100);
}

function inverseScore(value?: number | null, max = 5, fallback = 58): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return clamp(100 - (value / max) * 100);
}

function confidenceScore(confidence?: string): number {
  const value = String(confidence ?? "").toLowerCase();
  if (value.includes("high")) return 86;
  if (value.includes("medium")) return 68;
  if (value.includes("low")) return 42;
  return 58;
}

function geometricMean(values: number[]): number {
  const safe = values.map((value) => clamp(value, 8, 100));
  const product = safe.reduce((acc, value) => acc * value, 1);
  return Math.pow(product, 1 / safe.length);
}

function average(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0) / Math.max(1, values.length);
}

function textFor(opportunity: Opportunity, nodes: GraphNode[], edges: GraphEdge[]) {
  return [
    opportunity.title,
    opportunity.reason,
    opportunity.type,
    opportunity.dependency_types.join(" "),
    opportunity.buyer_types.join(" "),
    nodes.map((node) => `${node.name} ${node.type} ${node.sector.join(" ")} ${node.tags.join(" ")}`).join(" "),
    edges.map((edge) => `${edge.type} ${edge.dependency_category} ${edge.reason} ${edge.tags.join(" ")}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getAffectedNodes(dataset: GraphDataset, opportunity: Opportunity): GraphNode[] {
  return opportunity.affected_nodes.map((nodeId) => dataset.nodeById.get(nodeId)).filter((node): node is GraphNode => Boolean(node));
}

function getConnectedEdges(dataset: GraphDataset, opportunity: Opportunity): GraphEdge[] {
  const affected = new Set(opportunity.affected_nodes);
  return dataset.edges.filter((edge) => affected.has(edge.from) || affected.has(edge.to));
}

function getPossibleBuyers(opportunity: Opportunity, text: string): string[] {
  const buyers = opportunity.buyer_types.map((buyer) => buyer.trim()).filter(Boolean);
  if (text.includes("factory") || text.includes("industrial") || text.includes("ot")) buyers.push("industrial operators");
  if (text.includes("ai") || text.includes("gpu") || text.includes("cloud")) buyers.push("AI labs", "cloud providers");
  if (text.includes("compliance") || text.includes("governance") || text.includes("security")) buyers.push("regulated enterprises");
  if (text.includes("supplier") || text.includes("procurement")) buyers.push("procurement and supply-chain teams");
  if (text.includes("defence")) buyers.push("defence primes");
  return [...new Set(buyers)].slice(0, 6);
}

function estimateMonths(phase: OpportunityPhase, proofVelocityScore: number, capitalIntensity?: number | null) {
  const capital = capitalIntensity ?? 2;
  if (phase === "now") {
    return {
      mvp: proofVelocityScore > 78 ? 1 : 2,
      revenue: 3 + Math.round(capital / 2),
      exit: 36
    };
  }
  if (phase === "near") {
    return {
      mvp: 3 + Math.round(capital / 2),
      revenue: 6 + Math.round(capital),
      exit: 48
    };
  }
  if (phase === "later") {
    return {
      mvp: 6 + Math.round(capital),
      revenue: 12 + Math.round(capital * 2),
      exit: 72
    };
  }
  return {
    mvp: 9 + Math.round(capital * 2),
    revenue: 18 + Math.round(capital * 3),
    exit: 96
  };
}

function classifyPhase(input: {
  feasibility: number;
  proofVelocity: number;
  strategicLeverage: number;
  capitalIntensity?: number | null;
  regulatoryFriction?: number | null;
  text: string;
}): OpportunityPhase {
  const capital = input.capitalIntensity ?? 2;
  const regulatory = input.regulatoryFriction ?? 2;
  const hardwareHeavy = hasAny(input.text, HARDWARE_TERMS);
  if (input.strategicLeverage >= 82 && (capital >= 4 || regulatory >= 4 || hardwareHeavy)) return "big-bet";
  if (input.feasibility >= 70 && input.proofVelocity >= 68 && capital <= 2.5 && regulatory <= 2.8 && !hardwareHeavy) return "now";
  if (input.feasibility >= 58 && input.proofVelocity >= 55 && capital <= 3.5) return "near";
  return "later";
}

function weightedPersonalFit(weights: PreferenceWeights, scores: Record<keyof PreferenceWeights, number>): number {
  const entries = Object.entries(weights) as Array<[keyof PreferenceWeights, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0);
  if (total === 0) return average(Object.values(scores));
  return entries.reduce((sum, [key, weight]) => sum + scores[key] * Math.max(0, weight), 0) / total;
}

function scoreOne(dataset: GraphDataset, datasetId: DomainId, opportunity: Opportunity, weights: PreferenceWeights): ScoredOpportunity {
  const affectedNodes = getAffectedNodes(dataset, opportunity);
  const connectedEdges = getConnectedEdges(dataset, opportunity);
  const text = textFor(opportunity, affectedNodes, connectedEdges);
  const bottleneckNodes = affectedNodes.filter((node) => ["red", "orange"].includes(String(node.color).toLowerCase()));
  const highCriticalEdges = connectedEdges.filter((edge) => (edge.criticality ?? 0) >= 4 || (edge.dependency_risk ?? 0) >= 4);
  const hardwareHeavy = hasAny(text, HARDWARE_TERMS);
  const softwareFirst = hasAny(text, SOFTWARE_TERMS);

  const bottleneckSignal = clamp(48 + bottleneckNodes.length * 14 + highCriticalEdges.length * 4);
  const graphEdgeSignal = clamp(45 + highCriticalEdges.length * 6 + connectedEdges.length * 1.4);
  const structuralOpportunityScore = geometricMean([
    toScore(opportunity.criticality, 5, 58),
    toScore(opportunity.dependency_risk, 5, 56),
    toScore(opportunity.market_importance, 5, 60),
    toScore(opportunity.urgency, 5, 55),
    confidenceScore(opportunity.confidence),
    bottleneckSignal,
    graphEdgeSignal
  ]);

  const materialLightScore = hardwareHeavy ? inverseScore(opportunity.capital_intensity, 5, 44) : inverseScore(opportunity.capital_intensity, 5, 72);
  const dataAccessScore = toScore(opportunity.accessibility, 5, softwareFirst ? 66 : 55);
  const regulatorySimplicity = inverseScore(opportunity.regulatory_friction, 5, datasetId === "european-defence-stack" ? 42 : 60);
  const capitalRequirementInverse = inverseScore(opportunity.capital_intensity, 5, 62);
  const technicalUnknownInverse = softwareFirst ? 70 : hardwareHeavy ? 43 : 58;
  const proofVelocityScore = clamp(average([
    dataAccessScore,
    softwareFirst ? 78 : 52,
    regulatorySimplicity,
    capitalRequirementInverse,
    inverseScore(opportunity.incumbent_strength, 5, 55)
  ]));
  const feasibilityScore = clamp(average([
    materialLightScore,
    softwareFirst ? 80 : 48,
    dataAccessScore,
    regulatorySimplicity,
    capitalRequirementInverse,
    technicalUnknownInverse,
    proofVelocityScore
  ]));

  const franceEuFit = average([toScore(opportunity.france_fit, 5, 55), toScore(opportunity.eu_fit, 5, 55)]);
  const aiSoftwareFit = softwareFirst || text.includes("ai") ? 78 : 58;
  const founderSpeedFitScore = clamp(average([
    proofVelocityScore,
    aiSoftwareFit,
    text.includes("graph") || text.includes("system") || text.includes("dependency") ? 82 : 62,
    text.includes("open") || text.includes("demo") || text.includes("scanner") ? 78 : 60,
    franceEuFit
  ]));

  const wedgeToEmpireScore = clamp(average([
    text.includes("scanner") || text.includes("graph") || text.includes("evidence") ? 84 : 62,
    toScore(opportunity.market_importance, 5, 60),
    bottleneckSignal,
    opportunity.dependency_types.length >= 3 ? 78 : 58
  ]));
  const strategicLeverageScore = clamp(average([
    toScore(opportunity.criticality, 5, 58),
    bottleneckSignal,
    franceEuFit,
    graphEdgeSignal,
    wedgeToEmpireScore,
    toScore(opportunity.market_importance, 5, 60)
  ]));

  const buyerAccessScore = clamp(average([
    toScore(opportunity.dependency_risk, 5, 56),
    toScore(opportunity.market_importance, 5, 60),
    toScore(opportunity.urgency, 5, 55),
    dataAccessScore,
    regulatorySimplicity,
    opportunity.buyer_types.length ? 72 : 52
  ]));

  const acquirerCategoriesForOpportunity = inferAcquirerCategories({
    datasetId,
    title: opportunity.title,
    reason: opportunity.reason,
    dependencyTypes: opportunity.dependency_types,
    buyerTypes: opportunity.buyer_types,
    nodeText: affectedNodes.map((node) => `${node.name} ${node.sector.join(" ")} ${node.tags.join(" ")}`).join(" ")
  });
  const acquirerCountScore = clamp(44 + acquirerCategoriesForOpportunity.length * 10);
  const exitOptionalityScore = clamp(average([
    acquirerCountScore,
    strategicLeverageScore,
    inverseScore(opportunity.incumbent_strength, 5, 56),
    softwareFirst ? 76 : 48,
    dataAccessScore,
    capitalRequirementInverse
  ]));

  const legalRisk = toScore(opportunity.regulatory_friction, 5, datasetId === "european-defence-stack" ? 74 : 48);
  const capitalRisk = toScore(opportunity.capital_intensity, 5, hardwareHeavy ? 72 : 42);
  const dataRisk = 100 - dataAccessScore;
  const salesRisk = 100 - buyerAccessScore;
  const operatingRisk = hardwareHeavy ? 68 : 42;
  const riskLoad = average([legalRisk, capitalRisk, dataRisk, salesRisk, operatingRisk]);
  const riskGate = clamp(1 - riskLoad / 235, 0.48, 0.96);

  const fitScores = {
    feasibility: feasibilityScore,
    founderSpeedFit: founderSpeedFitScore,
    strategicLeverage: strategicLeverageScore,
    buyerAccess: buyerAccessScore,
    exitOptionality: exitOptionalityScore
  };
  const personalFitScore = weightedPersonalFit(weights, fitScores);
  const personalFitModifier = 0.35 + 0.65 * (personalFitScore / 100);
  const finalUtilityScore = clamp(structuralOpportunityScore * personalFitModifier * riskGate);
  const phase = classifyPhase({
    feasibility: feasibilityScore,
    proofVelocity: proofVelocityScore,
    strategicLeverage: strategicLeverageScore,
    capitalIntensity: opportunity.capital_intensity,
    regulatoryFriction: opportunity.regulatory_friction,
    text
  });
  const months = estimateMonths(phase, proofVelocityScore, opportunity.capital_intensity);
  const possibleBuyers = getPossibleBuyers(opportunity, text);

  const riskFlags: string[] = [];
  if ((opportunity.capital_intensity ?? 0) >= 4 || hardwareHeavy) riskFlags.push("Later-phase or capital-intensive path");
  if ((opportunity.regulatory_friction ?? 0) >= 4 || datasetId === "european-defence-stack") riskFlags.push("Regulatory or compliance complexity");
  if (dataAccessScore < 55) riskFlags.push("Data access needs validation");
  if (buyerAccessScore < 58) riskFlags.push("Buyer access or sales-cycle risk");
  if ((opportunity.incumbent_strength ?? 0) >= 4) riskFlags.push("Strong incumbents may compress the wedge");

  const scoreReasons = [
    `${bottleneckNodes.length} affected bottleneck nodes and ${highCriticalEdges.length} high-criticality connected edges.`,
    `${Math.round(proofVelocityScore)} proof velocity score from data access, software-first path, and regulatory simplicity.`,
    `${Math.round(wedgeToEmpireScore)} wedge-to-empire score from the first wedge and expansion surface.`
  ];

  const wedgeBase = opportunity.title.replace(/\.$/, "");
  const firstWedge = text.includes("scanner")
    ? `Launch a narrow scanner for one painful workflow around ${wedgeBase}.`
    : text.includes("compliance") || text.includes("evidence")
      ? `Start with evidence collection and audit readiness for one regulated buyer segment.`
      : text.includes("graph") || text.includes("intelligence")
        ? `Start with a focused intelligence layer around one bottleneck and one buyer workflow.`
        : `Start with a small, demonstrable workflow that proves demand for ${wedgeBase}.`;

  const expansionPath = text.includes("factory") || text.includes("industrial")
    ? "Expand from assessment to workflow system, then into operating intelligence across factories and suppliers."
    : text.includes("gpu") || text.includes("compute")
      ? "Expand from visibility to allocation, benchmarking, commitments, and marketplace intelligence."
      : text.includes("security") || text.includes("compliance")
        ? "Expand from evidence automation to governance, remediation, and continuous control monitoring."
        : "Expand from wedge workflow to platform data layer, then to cross-domain operating system.";

  return {
    id: `${datasetId}::${opportunity.id}`,
    sourceDatasetId: datasetId,
    sourceDatasetLabel: dataset.label,
    title: opportunity.title,
    type: opportunity.type,
    reason: opportunity.reason,
    affected_nodes: opportunity.affected_nodes,
    dependency_types: opportunity.dependency_types,
    buyer_types: opportunity.buyer_types,
    originalScore: opportunity.score,
    opportunity,
    dataset,
    affectedNodeRecords: affectedNodes,
    connectedEdges,
    bottleneckNodes,
    breakdown: {
      structuralOpportunityScore,
      feasibilityScore,
      founderSpeedFitScore,
      strategicLeverageScore,
      buyerAccessScore,
      exitOptionalityScore,
      personalFitScore,
      riskGate,
      finalUtilityScore,
      wedgeToEmpireScore,
      proofVelocityScore,
      phase,
      scoreReasons,
      riskFlags,
      firstWedge,
      expansionPath,
      possibleBuyers,
      possibleAcquirerCategories: acquirerCategoriesForOpportunity,
      estimatedTimeToMvpMonths: months.mvp,
      estimatedTimeToRevenueMonths: months.revenue,
      estimatedTimeToExitMonths: months.exit
    }
  };
}

export function scoreOpportunities(
  datasets: GraphDataset[],
  selectedDomainIds: DomainId[],
  weights: PreferenceWeights = defaultPreferenceWeights
): ScoredOpportunity[] {
  const selected = new Set(selectedDomainIds);
  return datasets
    .filter((dataset) => selected.has(dataset.id as DomainId))
    .flatMap((dataset) =>
      dataset.opportunities.map((opportunity) => scoreOne(dataset, dataset.id as DomainId, opportunity, weights))
    )
    .sort((a, b) => b.breakdown.finalUtilityScore - a.breakdown.finalUtilityScore);
}

export function findScoredOpportunity(scored: ScoredOpportunity[], id?: string): ScoredOpportunity | undefined {
  if (!id) return undefined;
  return scored.find((opportunity) => opportunity.id === id || opportunity.opportunity.id === id);
}
