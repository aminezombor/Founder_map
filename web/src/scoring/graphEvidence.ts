import type { GraphDataset, GraphEdge, GraphNode, Opportunity } from "../types/graph";
import type { EvidenceStrength } from "./scoringTypes";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function confidenceScore(confidence?: string): number {
  const value = String(confidence ?? "").toLowerCase();
  if (value.includes("high")) return 86;
  if (value.includes("medium")) return 66;
  if (value.includes("low")) return 38;
  return 55;
}

export function buildDegreeMap(dataset: GraphDataset): Map<string, number> {
  const degree = new Map<string, number>();
  for (const node of dataset.nodes) degree.set(node.id, 0);
  for (const edge of dataset.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  return degree;
}

export function getAffectedNodeCentrality(affectedNodes: GraphNode[], degreeMap: Map<string, number>): number {
  if (!affectedNodes.length) return 0;
  return affectedNodes.reduce((sum, node) => sum + (degreeMap.get(node.id) ?? 0), 0) / affectedNodes.length;
}

export function computeEvidenceStrength(input: {
  opportunity: Opportunity;
  affectedNodes: GraphNode[];
  connectedEdges: GraphEdge[];
  degreeMap: Map<string, number>;
}): EvidenceStrength {
  const bottleneckNodes = input.affectedNodes.filter((node) => ["red", "orange"].includes(String(node.color).toLowerCase()));
  const highCriticalEdges = input.connectedEdges.filter((edge) => (edge.criticality ?? 0) >= 4 || (edge.dependency_risk ?? 0) >= 4);
  const knownEdgeCount = input.connectedEdges.filter((edge) => String(edge.fact_status ?? "").toLowerCase() === "known").length;
  const inferredEdgeCount = input.connectedEdges.filter((edge) => String(edge.fact_status ?? "").toLowerCase() === "inferred").length;
  const affectedNodeCentrality = getAffectedNodeCentrality(input.affectedNodes, input.degreeMap);
  const sourceIds = new Set<string>([
    ...input.opportunity.sources,
    ...input.affectedNodes.flatMap((node) => node.sources),
    ...highCriticalEdges.flatMap((edge) => edge.sources)
  ]);

  const score = clamp(
    18 +
      Math.min(18, input.affectedNodes.length * 3.2) +
      Math.min(20, bottleneckNodes.length * 7) +
      Math.min(18, highCriticalEdges.length * 3.5) +
      Math.min(10, sourceIds.size * 1.8) +
      Math.min(12, affectedNodeCentrality * 2.2) +
      confidenceScore(input.opportunity.confidence) * 0.14 +
      Math.min(8, knownEdgeCount * 1.6) -
      Math.min(8, inferredEdgeCount * 0.45)
  );

  const level = score >= 82 ? "very-strong" : score >= 66 ? "strong" : score >= 44 ? "moderate" : "weak";
  const explanations = [
    `${input.affectedNodes.length} affected nodes are resolved in the graph.`,
    `${bottleneckNodes.length} affected nodes are red/orange bottlenecks.`,
    `${highCriticalEdges.length} connected edges are high criticality or high dependency risk.`,
    `${knownEdgeCount} known connected edges and ${inferredEdgeCount} inferred connected edges are visible.`,
    `Affected node centrality averages ${affectedNodeCentrality.toFixed(1)} graph connections.`,
    `${sourceIds.size} distinct source IDs support the opportunity, affected nodes, or strong edges.`
  ];

  return {
    score,
    level,
    explanations,
    affectedNodeCount: input.affectedNodes.length,
    bottleneckNodeCount: bottleneckNodes.length,
    highCriticalEdgeCount: highCriticalEdges.length,
    knownEdgeCount,
    inferredEdgeCount,
    affectedNodeCentrality
  };
}
