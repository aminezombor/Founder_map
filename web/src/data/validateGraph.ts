import type { GraphDataset, ValidationWarning } from "../types/graph";

function collectSourceRefs(record: { sources?: string[] }): string[] {
  return record.sources ?? [];
}

export function validateGraph(dataset: GraphDataset): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const nodeIds = new Set(dataset.nodes.map((node) => node.id));
  const sourceIds = new Set(dataset.sources.map((source) => source.id));

  for (const edge of dataset.edges) {
    if (!nodeIds.has(edge.from)) {
      warnings.push({
        severity: "warning",
        kind: "missing_edge_node",
        ownerId: edge.id,
        missingId: edge.from,
        message: `Edge ${edge.id} references missing source node ${edge.from}.`
      });
    }
    if (!nodeIds.has(edge.to)) {
      warnings.push({
        severity: "warning",
        kind: "missing_edge_node",
        ownerId: edge.id,
        missingId: edge.to,
        message: `Edge ${edge.id} references missing target node ${edge.to}.`
      });
    }
  }

  for (const opportunity of dataset.opportunities) {
    for (const nodeId of opportunity.affected_nodes) {
      if (!nodeIds.has(nodeId)) {
        warnings.push({
          severity: "info",
          kind: "missing_opportunity_node",
          ownerId: opportunity.id,
          missingId: nodeId,
          message: `Opportunity ${opportunity.id} references unresolved or external node ${nodeId}.`
        });
      }
    }
  }

  const sourceOwners = [
    ...dataset.nodes.map((node) => ({ type: "node", id: node.id, refs: collectSourceRefs(node) })),
    ...dataset.edges.map((edge) => ({ type: "edge", id: edge.id, refs: collectSourceRefs(edge) })),
    ...dataset.opportunities.map((opportunity) => ({
      type: "opportunity",
      id: opportunity.id,
      refs: collectSourceRefs(opportunity)
    }))
  ];

  for (const owner of sourceOwners) {
    for (const sourceId of owner.refs) {
      if (!sourceIds.has(sourceId)) {
        warnings.push({
          severity: "warning",
          kind: "missing_source",
          ownerId: owner.id,
          missingId: sourceId,
          message: `${owner.type} ${owner.id} references missing source ${sourceId}.`
        });
      }
    }
  }

  return warnings;
}
