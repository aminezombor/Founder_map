import type {
  DatasetStats,
  FilterOptions,
  FilterState,
  GraphDataset,
  GraphEdge,
  GraphNode,
  Opportunity,
  Selection,
  SourceRecord,
  VisibleGraph
} from "../types/graph";
import { normalizeText } from "./text";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function includesAny(selected: string[], value?: string): boolean {
  return !selected.length || (value ? selected.includes(value) : false);
}

function overlaps(selected: string[], values: string[]): boolean {
  return !selected.length || values.some((value) => selected.includes(value));
}

function nodeSearchText(node: GraphNode): string {
  return normalizeText([
    node.id,
    node.name,
    node.description,
    node.country,
    node.region,
    node.type,
    ...node.sector,
    ...node.tags
  ].join(" "));
}

function matchesQuery(haystack: string, query: string): boolean {
  if (!query) return true;
  if (haystack.includes(query)) return true;
  const tokens = query.split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return true;
  if (tokens.every((token) => haystack.includes(token))) return true;
  return tokens.some((token) => token.length >= 5 && haystack.includes(token));
}

export function getFilterOptions(dataset: GraphDataset): FilterOptions {
  return {
    nodeTypes: uniqueSorted(dataset.nodes.map((node) => node.type ?? "")),
    countries: uniqueSorted(dataset.nodes.map((node) => node.country ?? "")),
    regions: uniqueSorted(dataset.nodes.map((node) => node.region ?? "")),
    sectors: uniqueSorted(dataset.nodes.flatMap((node) => [...node.sector, ...node.tags])),
    colors: uniqueSorted([...dataset.nodes.map((node) => node.color ?? ""), ...dataset.edges.map((edge) => edge.color ?? "")]),
    confidences: uniqueSorted([...dataset.nodes.map((node) => node.confidence ?? ""), ...dataset.edges.map((edge) => edge.confidence ?? "")]),
    factStatuses: uniqueSorted([...dataset.nodes.map((node) => node.fact_status ?? ""), ...dataset.edges.map((edge) => edge.fact_status ?? "")]),
    edgeTypes: uniqueSorted(dataset.edges.map((edge) => edge.type ?? "")),
    dependencyCategories: uniqueSorted(dataset.edges.map((edge) => edge.dependency_category ?? ""))
  };
}

export function calculateDatasetStats(dataset: GraphDataset, visible?: VisibleGraph): DatasetStats {
  return {
    nodes: dataset.nodes.length,
    edges: dataset.edges.length,
    opportunities: dataset.opportunities.length,
    sources: dataset.sources.length,
    knownEdges: dataset.edges.filter((edge) => edge.fact_status === "known").length,
    inferredEdges: dataset.edges.filter((edge) => edge.fact_status === "inferred").length,
    redBottlenecks: dataset.nodes.filter((node) => String(node.color).toLowerCase() === "red").length,
    filteredNodes: visible?.nodes.length,
    filteredEdges: visible?.edges.length
  };
}

export function getOpportunityConnectedNodeIds(dataset: GraphDataset): Set<string> {
  return new Set(dataset.opportunities.flatMap((opportunity) => opportunity.affected_nodes));
}

export function filterGraph(dataset: GraphDataset, filters: FilterState): VisibleGraph {
  const query = normalizeText(filters.query);
  const opportunityConnected = getOpportunityConnectedNodeIds(dataset);

  const visibleNodes = dataset.nodes.filter((node) => {
    if (query && !matchesQuery(nodeSearchText(node), query)) return false;
    if (!includesAny(filters.nodeTypes, node.type)) return false;
    if (!includesAny(filters.countries, node.country)) return false;
    if (!includesAny(filters.regions, node.region)) return false;
    if (!overlaps(filters.sectors, [...node.sector, ...node.tags])) return false;
    if (!includesAny(filters.colors, node.color)) return false;
    if (!includesAny(filters.confidences, node.confidence)) return false;
    if (!includesAny(filters.factStatuses, node.fact_status)) return false;
    if ((node.criticality ?? 0) < filters.criticalityMin) return false;
    if ((node.sovereignty_score ?? 0) < filters.sovereigntyMin) return false;
    if (filters.franceEuLens && (node.france_or_eu_fit ?? 0) < 4 && !/france|eu|europe/i.test(`${node.country} ${node.region} ${node.tags.join(" ")}`)) return false;
    if (filters.bottlenecksOnly && String(node.color).toLowerCase() !== "red") return false;
    if (filters.opportunityConnectedOnly && !opportunityConnected.has(node.id)) return false;
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = dataset.renderableEdges.filter((edge) => {
    if (!visibleNodeIds.has(edge.from) || !visibleNodeIds.has(edge.to)) return false;
    if (!includesAny(filters.edgeTypes, edge.type)) return false;
    if (!includesAny(filters.dependencyCategories, edge.dependency_category)) return false;
    if (!includesAny(filters.colors, edge.color)) return false;
    if (!includesAny(filters.confidences, edge.confidence)) return false;
    if (!includesAny(filters.factStatuses, edge.fact_status)) return false;
    if ((edge.criticality ?? 0) < filters.criticalityMin) return false;
    return true;
  });

  return { nodes: visibleNodes, edges: visibleEdges };
}

export function getNodeById(dataset: GraphDataset, nodeId?: string): GraphNode | undefined {
  return nodeId ? dataset.nodeById.get(nodeId) : undefined;
}

export function getEdgeById(dataset: GraphDataset, edgeId?: string): GraphEdge | undefined {
  return edgeId ? dataset.edges.find((edge) => edge.id === edgeId) : undefined;
}

export function getEdgesForNode(dataset: GraphDataset, nodeId: string): { incoming: GraphEdge[]; outgoing: GraphEdge[] } {
  return {
    incoming: dataset.edges.filter((edge) => edge.to === nodeId),
    outgoing: dataset.edges.filter((edge) => edge.from === nodeId)
  };
}

export function getConnectedNodeIds(dataset: GraphDataset, nodeId: string): Set<string> {
  const connected = new Set<string>([nodeId]);
  for (const edge of dataset.edges) {
    if (edge.from === nodeId) connected.add(edge.to);
    if (edge.to === nodeId) connected.add(edge.from);
  }
  return connected;
}

function textOverlaps(left: string | undefined, right: string | undefined): boolean {
  const leftTokens = normalizeText(left).split(" ").filter((token) => token.length > 3);
  const rightText = normalizeText(right);
  return leftTokens.some((token) => rightText.includes(token));
}

export function getRelatedOpportunities(dataset: GraphDataset, selection: Selection): Opportunity[] {
  if (!selection) return [...dataset.opportunities].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (selection.kind === "opportunity") {
    const selected = dataset.opportunities.find((opportunity) => opportunity.id === selection.id);
    return selected ? [selected] : [];
  }

  if (selection.kind === "node") {
    const node = getNodeById(dataset, selection.id);
    if (!node) return [];
    return dataset.opportunities
      .filter((opportunity) => {
        const dependencyHaystack = normalizeText(opportunity.dependency_types.join(" "));
        return (
          opportunity.affected_nodes.includes(node.id) ||
          normalizeText(opportunity.reason).includes(normalizeText(node.id)) ||
          node.sector.some((sector) => dependencyHaystack.includes(normalizeText(sector))) ||
          node.tags.some((tag) => dependencyHaystack.includes(normalizeText(tag)))
        );
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  const edge = getEdgeById(dataset, selection.id);
  if (!edge) return [];
  return dataset.opportunities
    .filter((opportunity) => {
      const dependencyTypes = normalizeText(opportunity.dependency_types.join(" "));
      return (
        opportunity.affected_nodes.includes(edge.from) ||
        opportunity.affected_nodes.includes(edge.to) ||
        dependencyTypes.includes(normalizeText(edge.dependency_category)) ||
        textOverlaps(edge.reason, opportunity.reason)
      );
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export function getSourceRecords(dataset: GraphDataset, sourceIds: string[]): SourceRecord[] {
  return sourceIds.map((sourceId) => dataset.sourceById.get(sourceId)).filter((source): source is SourceRecord => Boolean(source));
}

export function searchNodes(dataset: GraphDataset, query: string): GraphNode[] {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  return dataset.nodes
    .filter((node) => matchesQuery(nodeSearchText(node), normalized))
    .sort((a, b) => {
      const aName = normalizeText(a.name).startsWith(normalized) ? 0 : 1;
      const bName = normalizeText(b.name).startsWith(normalized) ? 0 : 1;
      return aName - bName || a.name.localeCompare(b.name);
    })
    .slice(0, 10);
}

export function getSelectionHighlights(dataset: GraphDataset, selection: Selection): { nodeIds: Set<string>; edgeIds: Set<string> } {
  if (!selection) return { nodeIds: new Set(), edgeIds: new Set() };

  if (selection.kind === "node") {
    const nodeIds = getConnectedNodeIds(dataset, selection.id);
    const edgeIds = new Set(
      dataset.edges.filter((edge) => edge.from === selection.id || edge.to === selection.id).map((edge) => edge.id)
    );
    return { nodeIds, edgeIds };
  }

  if (selection.kind === "edge") {
    const edge = getEdgeById(dataset, selection.id);
    return {
      nodeIds: new Set(edge ? [edge.from, edge.to] : []),
      edgeIds: new Set([selection.id])
    };
  }

  const opportunity = dataset.opportunities.find((item) => item.id === selection.id);
  return {
    nodeIds: new Set(opportunity?.affected_nodes.filter((nodeId) => dataset.nodeById.has(nodeId)) ?? []),
    edgeIds: new Set()
  };
}
