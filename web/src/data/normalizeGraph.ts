import type {
  GraphDataset,
  GraphEdge,
  GraphManifest,
  GraphNode,
  Opportunity,
  RawGraphDataset,
  SourceRecord
} from "../types/graph";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function normalizeSources(rawSources: RawGraphDataset["sources"]): SourceRecord[] {
  if (Array.isArray(rawSources)) {
    return rawSources.map((source, index) => ({
      ...source,
      id: source.id || `source_${index + 1}`
    }));
  }

  return Object.entries(rawSources ?? {}).map(([id, source]) => ({
    id,
    ...source
  }));
}

function normalizeNode(row: Record<string, unknown>): GraphNode {
  return {
    ...row,
    id: asString(row.id),
    name: asString(row.name, asString(row.id)),
    type: asString(row.type),
    country: asString(row.country),
    region: asString(row.region),
    sector: asStringArray(row.sector),
    strategic_role: asString(row.strategic_role),
    description: asString(row.description),
    sovereignty_score: asNumber(row.sovereignty_score),
    criticality: asNumber(row.criticality),
    market_importance: asNumber(row.market_importance),
    france_or_eu_fit: asNumber(row.france_or_eu_fit),
    color: asString(row.color, "grey"),
    confidence: asString(row.confidence),
    tags: asStringArray(row.tags),
    sources: asStringArray(row.sources),
    fact_status: asString(row.fact_status)
  };
}

function normalizeEdge(row: Record<string, unknown>, index: number, nodeIds: Set<string>): GraphEdge {
  const from = asString(row.from);
  const to = asString(row.to);
  const id = `${from || "missing"}__${to || "missing"}__${asString(row.type, "edge")}__${index}`;

  return {
    ...row,
    id,
    from,
    to,
    source: from,
    target: to,
    type: asString(row.type),
    dependency_category: asString(row.dependency_category),
    reason: asString(row.reason),
    dependency_risk: asNumber(row.dependency_risk),
    criticality: asNumber(row.criticality),
    replaceability: asNumber(row.replaceability),
    time_to_substitute: asString(row.time_to_substitute),
    color: asString(row.color, "grey"),
    confidence: asString(row.confidence),
    sources: asStringArray(row.sources),
    fact_status: asString(row.fact_status),
    tags: asStringArray(row.tags),
    unresolved: !nodeIds.has(from) || !nodeIds.has(to)
  };
}

function normalizeOpportunity(row: Record<string, unknown>, nodeIds: Set<string>): Opportunity {
  const affectedNodes = asStringArray(row.affected_nodes);
  return {
    ...row,
    id: asString(row.id),
    title: asString(row.title, asString(row.id)),
    type: asString(row.type),
    score: asNumber(row.score),
    reason: asString(row.reason),
    affected_nodes: affectedNodes,
    dependency_types: asStringArray(row.dependency_types),
    buyer_types: asStringArray(row.buyer_types),
    criticality: asNumber(row.criticality),
    dependency_risk: asNumber(row.dependency_risk),
    market_importance: asNumber(row.market_importance),
    urgency: asNumber(row.urgency),
    accessibility: asNumber(row.accessibility),
    france_fit: asNumber(row.france_fit),
    eu_fit: asNumber(row.eu_fit),
    capital_intensity: asNumber(row.capital_intensity),
    regulatory_friction: asNumber(row.regulatory_friction),
    incumbent_strength: asNumber(row.incumbent_strength),
    confidence: asString(row.confidence),
    sources: asStringArray(row.sources),
    unresolvedAffectedNodes: affectedNodes.filter((nodeId) => !nodeIds.has(nodeId))
  };
}

export function normalizeGraph(id: string, label: string, raw: RawGraphDataset, readme?: string): GraphDataset {
  const manifest = (raw.manifest ?? {}) as GraphManifest;
  const nodes = (raw.nodes ?? []).map(normalizeNode).filter((node) => node.id);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = (raw.edges ?? []).map((edge, index) => normalizeEdge(edge, index, nodeIds));
  const opportunities = (raw.opportunities ?? []).map((opportunity) => normalizeOpportunity(opportunity, nodeIds));
  const sources = normalizeSources(raw.sources);
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return {
    id,
    label,
    manifest,
    readme,
    nodes,
    edges,
    renderableEdges: edges.filter((edge) => !edge.unresolved),
    opportunities,
    sources,
    sourceById,
    nodeById,
    validationWarnings: []
  };
}
