import type { GraphEdge, GraphNode, Selection, VisibleGraph } from "../types/graph";

export interface LayoutGraphNode extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  __degree: number;
  __targetX: number;
  __targetY: number;
  __labelPriority: number;
}

interface FocusState {
  selectedNodeId?: string;
  hoveredNodeId?: string | null;
  highlightedNodeIds: Set<string>;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function semanticFamily(node: GraphNode): string {
  const type = String(node.type ?? "").toLowerCase();
  const sector = String(node.sector?.[0] ?? "").toLowerCase();
  const tags = node.tags.join(" ").toLowerCase();
  const haystack = `${type} ${sector} ${tags}`;

  if (type.includes("sector_view")) return "00-core";
  if (type.includes("capability")) return "10-capability";
  if (haystack.match(/government|agency|policy|funding|program|regulator|standard|official/)) return "20-institutions";
  if (haystack.match(/dependency|gap|bottleneck|risk|supply|export|compliance|sovereignty/)) return "30-dependencies";
  if (haystack.match(/company|vendor|supplier|prime|cloud|chip|manufactur|operator|provider/)) return "40-market";
  if (haystack.match(/software|platform|model|data|ai|cyber|digital/)) return "50-software";
  if (sector) return `60-${sector}`;
  return `90-${type || "other"}`;
}

export function getNodeDegreeMap(edges: GraphEdge[]): Map<string, number> {
  const degree = new Map<string, number>();
  for (const edge of edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  return degree;
}

export function getBaseLabelPriority(node: GraphNode, degree: number): number {
  const criticality = node.criticality ?? 0;
  const market = node.market_importance ?? 0;
  const red = String(node.color).toLowerCase() === "red" ? 42 : 0;
  const type = String(node.type ?? "").toLowerCase();
  const layer = type.includes("layer") || type.includes("sector_view") ? 30 : 0;
  return degree * 4.5 + criticality * 16 + market * 7 + red + layer;
}

export function getFocusLabelPriority(node: LayoutGraphNode, focus: FocusState): number {
  if (node.id === focus.selectedNodeId) return 10000;
  if (node.id === focus.hoveredNodeId) return 9000;
  if (focus.highlightedNodeIds.has(node.id)) return 7000 + node.__labelPriority;
  return node.__labelPriority;
}

export function buildReadableGraphData(graph: VisibleGraph): { nodes: LayoutGraphNode[]; links: GraphEdge[]; degreeById: Map<string, number> } {
  const degreeById = getNodeDegreeMap(graph.edges);
  const families = [...new Set(graph.nodes.map(semanticFamily))].sort((left, right) => left.localeCompare(right));
  const familyIndex = new Map(families.map((family, index) => [family, index]));
  const familyCounts = new Map<string, number>();
  const mapRadius = clamp(Math.sqrt(Math.max(1, graph.nodes.length)) * 118, 760, 1320);
  const familyRadius = mapRadius * 0.58;

  const nodes = graph.nodes.map((node) => {
    const family = semanticFamily(node);
    const familySlot = familyIndex.get(family) ?? 0;
    const withinFamilyIndex = familyCounts.get(family) ?? 0;
    familyCounts.set(family, withinFamilyIndex + 1);

    const degree = degreeById.get(node.id) ?? 0;
    const basePriority = getBaseLabelPriority(node, degree);
    const familyAngle = family === "00-core" ? 0 : (Math.PI * 2 * familySlot) / Math.max(1, families.length);
    const localAngle = (hashString(node.id) % 6283) / 1000;
    const spiral = 46 + Math.sqrt(withinFamilyIndex + 1) * 52 + degree * 1.8;
    const familyCenterRadius = family === "00-core" ? 0 : familyRadius;
    const criticalityPull = (node.criticality ?? 0) * 7;
    const targetX = Math.cos(familyAngle) * (familyCenterRadius + criticalityPull) + Math.cos(localAngle) * spiral;
    const targetY = Math.sin(familyAngle) * (familyCenterRadius + criticalityPull) + Math.sin(localAngle) * spiral;
    const seedAngle = localAngle + withinFamilyIndex * 2.399963;

    return {
      ...node,
      x: targetX + Math.cos(seedAngle) * 120,
      y: targetY + Math.sin(seedAngle) * 120,
      __degree: degree,
      __targetX: targetX,
      __targetY: targetY,
      __labelPriority: basePriority
    };
  });

  return { nodes, links: graph.edges, degreeById };
}

export function getFocusNodeIds(selection: Selection, highlightedNodeIds: Set<string>, highlightedEdgeIds: Set<string>, edges: GraphEdge[]): Set<string> {
  const focusIds = new Set(highlightedNodeIds);
  if (selection?.kind === "node") focusIds.add(selection.id);
  if (selection?.kind === "edge") {
    const selectedEdge = edges.find((edge) => edge.id === selection.id);
    if (selectedEdge) {
      focusIds.add(selectedEdge.from);
      focusIds.add(selectedEdge.to);
    }
  }
  for (const edge of edges) {
    if (highlightedEdgeIds.has(edge.id)) {
      focusIds.add(edge.from);
      focusIds.add(edge.to);
    }
  }
  return focusIds;
}
