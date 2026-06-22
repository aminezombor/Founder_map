import type { GraphDataset, GraphEdge, GraphNode, Opportunity } from "../types/graph";
import { inferAcquirerCategories } from "./acquirerModel";
import { buildDegreeMap, computeEvidenceStrength } from "./graphEvidence";
import { classifyPhase } from "./phaseModel";
import { matchOpportunityArchetype, renderArchetypeText } from "./scoringCalibration";
import {
  defaultPreferenceWeights,
  type DomainId,
  type OpportunityAdvancedFilters,
  type OpportunityPhase,
  type PreferenceWeights,
  type ScoredOpportunity
} from "./scoringTypes";
import { riskDefinitions, riskLevelFromScore } from "./riskModel";

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

function weightedGeometricMean(values: Array<{ value: number; weight: number }>): number {
  const weightTotal = values.reduce((sum, item) => sum + item.weight, 0);
  const logSum = values.reduce((sum, item) => sum + Math.log(clamp(item.value, 8, 100)) * item.weight, 0);
  return Math.exp(logSum / Math.max(1, weightTotal));
}

function average(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0) / Math.max(1, values.length);
}

function textFor(opportunity: Opportunity, nodes: GraphNode[], edges: GraphEdge[], datasetId: DomainId) {
  return [
    datasetId,
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

function unique(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getPossibleBuyers(opportunity: Opportunity, text: string, archetypeBuyers: string[]): string[] {
  const buyers = [...opportunity.buyer_types, ...archetypeBuyers];
  if (text.includes("factory") || text.includes("industrial") || text.includes("ot")) buyers.push("industrial operators");
  if (text.includes("ai") || text.includes("gpu") || text.includes("cloud")) buyers.push("AI labs", "cloud providers");
  if (text.includes("compliance") || text.includes("governance") || text.includes("security")) buyers.push("regulated enterprises");
  if (text.includes("supplier") || text.includes("procurement")) buyers.push("procurement and supply-chain teams");
  if (text.includes("defence")) buyers.push("defence primes");
  return unique(buyers).slice(0, 8);
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

function weightedPersonalFit(weights: PreferenceWeights, scores: Record<keyof PreferenceWeights, number>): number {
  const entries = Object.entries(weights) as Array<[keyof PreferenceWeights, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0);
  if (total === 0) return average(Object.values(scores));
  return entries.reduce((sum, [key, weight]) => sum + scores[key] * Math.max(0, weight), 0) / total;
}

function scoreLevel(value: number): "low" | "medium" | "high" {
  if (value >= 72) return "high";
  if (value >= 50) return "medium";
  return "low";
}

function sourceDatasetRoleScore(datasetId: DomainId): number {
  if (datasetId === "european-defence-stack" || datasetId === "global-aerospace-stack") return 64;
  return 76;
}

function makeGraphDrivers(input: {
  affectedNodes: GraphNode[];
  bottleneckNodes: GraphNode[];
  highCriticalEdges: GraphEdge[];
  dependencyTypes: string[];
  sourceDatasetLabel: string;
  evidenceLevel: string;
  knownEdgeCount: number;
  inferredEdgeCount: number;
  affectedNodeCentrality: number;
}) {
  const affectedNames = input.affectedNodes.slice(0, 4).map((node) => node.name);
  return [
    `${input.affectedNodes.length} affected nodes`,
    `${input.bottleneckNodes.length} red/orange bottleneck nodes`,
    `${input.highCriticalEdges.length} high-criticality connected edges`,
    affectedNames.length ? `Affected nodes include ${affectedNames.join(", ")}` : "No affected nodes resolved in the graph",
    input.dependencyTypes.length ? `Dependency types: ${input.dependencyTypes.join(", ")}` : "No dependency types attached",
    `Source dataset: ${input.sourceDatasetLabel}`,
    `Evidence strength: ${input.evidenceLevel}`,
    `${input.knownEdgeCount} known edges / ${input.inferredEdgeCount} inferred edges`,
    `Affected node centrality: ${input.affectedNodeCentrality.toFixed(1)} average connections`
  ];
}

function riskDriver(label: keyof typeof riskDefinitions, riskScore: number) {
  const level = riskLevelFromScore(riskScore);
  return `${riskDefinitions[label].label}: ${level}`;
}

function scoreOne(dataset: GraphDataset, datasetId: DomainId, opportunity: Opportunity, weights: PreferenceWeights, degreeMap: Map<string, number>): ScoredOpportunity {
  const affectedNodes = getAffectedNodes(dataset, opportunity);
  const connectedEdges = getConnectedEdges(dataset, opportunity);
  const text = textFor(opportunity, affectedNodes, connectedEdges, datasetId);
  const archetype = matchOpportunityArchetype({ datasetId, opportunity, affectedNodes, connectedEdges });
  const bottleneckNodes = affectedNodes.filter((node) => ["red", "orange"].includes(String(node.color).toLowerCase()));
  const highCriticalEdges = connectedEdges.filter((edge) => (edge.criticality ?? 0) >= 4 || (edge.dependency_risk ?? 0) >= 4);
  const hardwareHeavy = hasAny(text, HARDWARE_TERMS);
  const softwareFirst = hasAny(text, SOFTWARE_TERMS);
  const evidenceStrength = computeEvidenceStrength({ opportunity, affectedNodes, connectedEdges, degreeMap });

  const nodeCriticalityScore = affectedNodes.length ? average(affectedNodes.map((node) => toScore(node.criticality, 5, 56))) : 54;
  const nodeMarketScore = affectedNodes.length ? average(affectedNodes.map((node) => toScore(node.market_importance, 5, 56))) : 54;
  const edgeCriticalityScore = highCriticalEdges.length ? average(highCriticalEdges.map((edge) => average([toScore(edge.criticality, 5, 55), toScore(edge.dependency_risk, 5, 55)]))) : 52;
  const affectedNodeSignal = clamp(42 + evidenceStrength.affectedNodeCount * 4.6 + evidenceStrength.bottleneckNodeCount * 8.8 + evidenceStrength.affectedNodeCentrality * 2.1);
  const bottleneckSignal = clamp(42 + bottleneckNodes.length * 13 + highCriticalEdges.length * 4.4 + edgeCriticalityScore * 0.12);
  const graphEdgeSignal = clamp(38 + highCriticalEdges.length * 5.4 + connectedEdges.length * 1.05 + evidenceStrength.knownEdgeCount * 1.2);
  const dependencyBreadthSignal = clamp(44 + opportunity.dependency_types.length * 8.4 + new Set(affectedNodes.flatMap((node) => node.sector)).size * 3.6);
  const buyerBreadthSignal = clamp(46 + opportunity.buyer_types.length * 7.2);
  const crossDomainRelevance = clamp(average([dependencyBreadthSignal, buyerBreadthSignal, nodeMarketScore, sourceDatasetRoleScore(datasetId)]));
  const structuralOpportunityScore = clamp(
    weightedGeometricMean([
      { value: average([toScore(opportunity.criticality, 5, 58), nodeCriticalityScore]), weight: 1.3 },
      { value: toScore(opportunity.dependency_risk, 5, 56), weight: 1.15 },
      { value: average([toScore(opportunity.market_importance, 5, 60), nodeMarketScore]), weight: 1.05 },
      { value: toScore(opportunity.urgency, 5, 55), weight: 0.9 },
      { value: confidenceScore(opportunity.confidence), weight: 0.7 },
      { value: bottleneckSignal, weight: 1.1 },
      { value: affectedNodeSignal, weight: 0.85 },
      { value: crossDomainRelevance, weight: 0.75 },
      { value: evidenceStrength.score, weight: 1.05 }
    ]) +
      Math.min(4.5, opportunity.dependency_types.length * 0.8) +
      Math.min(3.8, opportunity.buyer_types.length * 0.65) +
      (archetype.id === "generic_platform" ? -1.8 : 1.4)
  );

  const materialLightScore = hardwareHeavy ? inverseScore(opportunity.capital_intensity, 5, 42) : inverseScore(opportunity.capital_intensity, 5, 76);
  const dataAccessScore = toScore(opportunity.accessibility, 5, softwareFirst ? 66 : 55);
  const regulatorySimplicity = inverseScore(opportunity.regulatory_friction, 5, datasetId === "european-defence-stack" ? 42 : 61);
  const capitalRequirementInverse = inverseScore(opportunity.capital_intensity, 5, softwareFirst ? 66 : 54);
  const technicalUnknownInverse = softwareFirst ? 72 : hardwareHeavy ? 40 : 58;
  const timeToMvpScore = softwareFirst ? (hardwareHeavy ? 55 : 78) : hardwareHeavy ? 38 : 58;
  const proofVelocityScore = clamp(average([
    dataAccessScore,
    timeToMvpScore,
    regulatorySimplicity,
    capitalRequirementInverse,
    inverseScore(opportunity.incumbent_strength, 5, 55),
    evidenceStrength.score * 0.7 + confidenceScore(opportunity.confidence) * 0.3
  ]));
  const feasibilityScore = clamp(average([
    materialLightScore,
    softwareFirst ? 82 : 48,
    dataAccessScore,
    timeToMvpScore,
    regulatorySimplicity,
    capitalRequirementInverse,
    technicalUnknownInverse,
    proofVelocityScore
  ]));

  const franceEuFit = average([toScore(opportunity.france_fit, 5, 55), toScore(opportunity.eu_fit, 5, 55)]);
  const aiSoftwareFit = softwareFirst || text.includes("ai") ? 80 : 58;
  const founderSpeedFitScore = clamp(average([
    proofVelocityScore,
    aiSoftwareFit,
    hasAny(text, ["graph", "system", "dependency", "ontology", "platform"]) ? 82 : 62,
    hasAny(text, ["open", "demo", "scanner", "diagnostic", "readiness"]) ? 78 : 60,
    franceEuFit
  ]));

  const wedgeToEmpireScore = clamp(average([
    hasAny(text, ["scanner", "graph", "evidence", "diagnostic", "readiness", "visibility"]) ? 86 : 62,
    toScore(opportunity.market_importance, 5, 60),
    bottleneckSignal,
    dependencyBreadthSignal,
    evidenceStrength.score,
    archetype.id === "generic_platform" ? 58 : 76
  ]));
  const strategicLeverageScore = clamp(average([
    toScore(opportunity.criticality, 5, 58),
    bottleneckSignal,
    franceEuFit,
    graphEdgeSignal,
    crossDomainRelevance,
    wedgeToEmpireScore,
    toScore(opportunity.market_importance, 5, 60)
  ]));

  const buyerAccessScore = clamp(average([
    toScore(opportunity.dependency_risk, 5, 56),
    toScore(opportunity.market_importance, 5, 60),
    toScore(opportunity.urgency, 5, 55),
    dataAccessScore,
    regulatorySimplicity,
    opportunity.buyer_types.length ? buyerBreadthSignal : 50,
    archetype.likelyBuyers.length >= 3 ? 74 : 58
  ]));

  const inferredAcquirers = inferAcquirerCategories({
    datasetId,
    title: opportunity.title,
    reason: opportunity.reason,
    dependencyTypes: opportunity.dependency_types,
    buyerTypes: opportunity.buyer_types,
    nodeText: affectedNodes.map((node) => `${node.name} ${node.sector.join(" ")} ${node.tags.join(" ")}`).join(" ")
  });
  const acquirerCategoriesForOpportunity = unique([...inferredAcquirers, ...archetype.likelyAcquirers]).slice(0, 7);
  const acquirerCountScore = clamp(42 + acquirerCategoriesForOpportunity.length * 8.8);
  const exitOptionalityScore = clamp(average([
    acquirerCountScore,
    strategicLeverageScore,
    inverseScore(opportunity.incumbent_strength, 5, 56),
    softwareFirst ? 78 : 48,
    dataAccessScore,
    capitalRequirementInverse,
    wedgeToEmpireScore,
    evidenceStrength.score
  ]));

  const legalRisk = toScore(opportunity.regulatory_friction, 5, datasetId === "european-defence-stack" ? 74 : 48);
  const capitalRisk = toScore(opportunity.capital_intensity, 5, hardwareHeavy ? 72 : 42);
  const dataRisk = 100 - dataAccessScore;
  const salesRisk = 100 - buyerAccessScore;
  const incumbentRisk = toScore(opportunity.incumbent_strength, 5, 48);
  const operatingRisk = hardwareHeavy ? 68 : datasetId === "global-aerospace-stack" ? 62 : 42;
  const riskLoad = average([legalRisk, capitalRisk, dataRisk, salesRisk, operatingRisk, incumbentRisk]);
  const riskGate = clamp(1 - riskLoad / 260, 0.48, 0.97);

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
    hardwareHeavy
  });
  const months = estimateMonths(phase, proofVelocityScore, opportunity.capital_intensity);
  const possibleBuyers = getPossibleBuyers(opportunity, text, archetype.likelyBuyers);

  const riskFlags: string[] = [];
  if (capitalRisk >= 62 || hardwareHeavy) riskFlags.push("Capital intensity or hardware path needs validation");
  if (legalRisk >= 62 || datasetId === "european-defence-stack") riskFlags.push("Regulatory, compliance, or procurement complexity");
  if (dataRisk >= 45) riskFlags.push("Data access needs validation before overbuilding");
  if (salesRisk >= 45) riskFlags.push("Buyer access or sales-cycle risk");
  if (incumbentRisk >= 62) riskFlags.push("Strong incumbents may compress the wedge");
  for (const risk of archetype.commonRisks) {
    const definition = riskDefinitions[risk as keyof typeof riskDefinitions];
    if (definition && !riskFlags.some((flag) => flag.includes(definition.label))) {
      riskFlags.push(`${definition.label} is common for this archetype`);
    }
  }

  const graphDrivers = makeGraphDrivers({
    affectedNodes,
    bottleneckNodes,
    highCriticalEdges,
    dependencyTypes: opportunity.dependency_types,
    sourceDatasetLabel: dataset.label,
    evidenceLevel: evidenceStrength.level,
    knownEdgeCount: evidenceStrength.knownEdgeCount,
    inferredEdgeCount: evidenceStrength.inferredEdgeCount,
    affectedNodeCentrality: evidenceStrength.affectedNodeCentrality
  });
  const scoreDrivers = [
    `Structural score uses criticality=${opportunity.criticality ?? "unknown"}, dependency risk=${opportunity.dependency_risk ?? "unknown"}, market importance=${opportunity.market_importance ?? "unknown"}, and evidence strength=${evidenceStrength.score.toFixed(1)}.`,
    `Feasibility is ${scoreLevel(feasibilityScore)} from data access ${dataAccessScore.toFixed(1)}, regulatory simplicity ${regulatorySimplicity.toFixed(1)}, and capital inverse ${capitalRequirementInverse.toFixed(1)}.`,
    `Buyer access is ${scoreLevel(buyerAccessScore)} because buyer types include ${possibleBuyers.slice(0, 4).join(", ") || "no explicit buyer types"}.`,
    `Exit optionality is ${scoreLevel(exitOptionalityScore)} because acquirer categories include ${acquirerCategoriesForOpportunity.slice(0, 4).join(", ")}.`,
    `Proof velocity is ${proofVelocityScore.toFixed(1)} and wedge-to-empire is ${wedgeToEmpireScore.toFixed(1)} for the ${archetype.label} archetype.`
  ];
  const riskDrivers = [
    riskDriver("data_access_risk", dataRisk),
    riskDriver("sales_cycle_risk", salesRisk),
    riskDriver("capital_intensity_risk", capitalRisk),
    riskDriver("regulatory_risk", legalRisk),
    riskDriver("incumbent_risk", incumbentRisk),
    riskDriver("operational_complexity_risk", operatingRisk)
  ];
  const focus = affectedNodes.slice(0, 3).map((node) => node.name).join(", ") || opportunity.title;
  const firstWedge = `${renderArchetypeText(archetype.firstWedgeTemplate, opportunity, affectedNodes)} Anchor the first proof around ${focus}.`;
  const expansionPath = `${renderArchetypeText(archetype.expansionPathTemplate, opportunity, affectedNodes)} The expansion path should keep ${opportunity.dependency_types.slice(0, 3).join(", ") || "the core dependency"} visible as the control point.`;
  const scoreReasons = [
    archetype.whyItScoresTemplate,
    graphDrivers[0],
    graphDrivers[1],
    scoreDrivers[0],
    scoreDrivers[4]
  ];

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
      riskFlags: unique(riskFlags).slice(0, 8),
      firstWedge,
      expansionPath,
      possibleBuyers,
      possibleAcquirerCategories: acquirerCategoriesForOpportunity,
      estimatedTimeToMvpMonths: months.mvp,
      estimatedTimeToRevenueMonths: months.revenue,
      estimatedTimeToExitMonths: months.exit,
      evidenceStrength,
      evidenceLevel: evidenceStrength.level,
      graphDrivers,
      scoreDrivers,
      riskDrivers,
      archetype: archetype.id,
      knownEdgeCount: evidenceStrength.knownEdgeCount,
      inferredEdgeCount: evidenceStrength.inferredEdgeCount,
      affectedNodeCentrality: evidenceStrength.affectedNodeCentrality
    }
  };
}

function sortValue(opportunity: ScoredOpportunity, sortBy: OpportunityAdvancedFilters["sortBy"]): number {
  const breakdown = opportunity.breakdown;
  if (sortBy === "structural") return breakdown.structuralOpportunityScore;
  if (sortBy === "personalFit") return breakdown.personalFitScore;
  if (sortBy === "feasibility") return breakdown.feasibilityScore;
  if (sortBy === "founderSpeedFit") return breakdown.founderSpeedFitScore;
  if (sortBy === "strategicLeverage") return breakdown.strategicLeverageScore;
  if (sortBy === "buyerAccess") return breakdown.buyerAccessScore;
  if (sortBy === "exitOptionality") return breakdown.exitOptionalityScore;
  if (sortBy === "proofVelocity") return breakdown.proofVelocityScore;
  if (sortBy === "wedgeToEmpire") return breakdown.wedgeToEmpireScore;
  return breakdown.finalUtilityScore;
}

export function sortScoredOpportunities(
  opportunities: ScoredOpportunity[],
  sortBy: OpportunityAdvancedFilters["sortBy"] = "finalUtility"
): ScoredOpportunity[] {
  return [...opportunities].sort((a, b) => {
    const primary = sortValue(b, sortBy) - sortValue(a, sortBy);
    if (Math.abs(primary) > 0.001) return primary;
    return (
      b.breakdown.finalUtilityScore - a.breakdown.finalUtilityScore ||
      b.breakdown.structuralOpportunityScore - a.breakdown.structuralOpportunityScore ||
      b.breakdown.evidenceStrength.score - a.breakdown.evidenceStrength.score ||
      b.breakdown.proofVelocityScore - a.breakdown.proofVelocityScore ||
      b.breakdown.wedgeToEmpireScore - a.breakdown.wedgeToEmpireScore ||
      a.title.localeCompare(b.title)
    );
  });
}

function opportunitySearchCorpus(opportunity: ScoredOpportunity): string {
  return [
    opportunity.title,
    opportunity.reason,
    opportunity.type,
    opportunity.sourceDatasetLabel,
    opportunity.dependency_types.join(" "),
    opportunity.buyer_types.join(" "),
    opportunity.breakdown.scoreReasons.join(" "),
    opportunity.breakdown.graphDrivers.join(" "),
    opportunity.breakdown.scoreDrivers.join(" "),
    opportunity.breakdown.riskDrivers.join(" "),
    opportunity.affectedNodeRecords.map((node) => node.name).join(" "),
    opportunity.breakdown.possibleBuyers.join(" "),
    opportunity.breakdown.possibleAcquirerCategories.join(" "),
    opportunity.breakdown.archetype
  ]
    .join(" ")
    .toLowerCase();
}

export function filterAndSortOpportunities(
  opportunities: ScoredOpportunity[],
  filters: OpportunityAdvancedFilters
): ScoredOpportunity[] {
  const query = filters.query.trim().toLowerCase();
  return sortScoredOpportunities(
    opportunities.filter((opportunity) => {
      const breakdown = opportunity.breakdown;
      if (!filters.showBigBets && breakdown.phase === "big-bet") return false;
      if (filters.phases.length && !filters.phases.includes(breakdown.phase)) return false;
      if (breakdown.finalUtilityScore < filters.minFinalUtility) return false;
      if (breakdown.feasibilityScore < filters.minFeasibility) return false;
      if (breakdown.exitOptionalityScore < filters.minExitOptionality) return false;
      if (filters.strongGraphEvidenceOnly && !["strong", "very-strong"].includes(breakdown.evidenceLevel)) return false;
      if (query && !opportunitySearchCorpus(opportunity).includes(query)) return false;
      return true;
    }),
    filters.sortBy
  );
}

export function scoreOpportunities(
  datasets: GraphDataset[],
  selectedDomainIds: DomainId[],
  weights: PreferenceWeights = defaultPreferenceWeights
): ScoredOpportunity[] {
  const selected = new Set(selectedDomainIds);
  return sortScoredOpportunities(
    datasets
      .filter((dataset) => selected.has(dataset.id as DomainId))
      .flatMap((dataset) => {
        const degreeMap = buildDegreeMap(dataset);
        return dataset.opportunities.map((opportunity) => scoreOne(dataset, dataset.id as DomainId, opportunity, weights, degreeMap));
      })
  );
}

export function findScoredOpportunity(scored: ScoredOpportunity[], id?: string): ScoredOpportunity | undefined {
  if (!id) return undefined;
  return scored.find((opportunity) => opportunity.id === id || opportunity.opportunity.id === id);
}
