import type { GraphDataset, Opportunity } from "../types/graph";
import { formatScore, priorityLabel } from "../utils/scoring";

interface OpportunityPanelProps {
  dataset: GraphDataset;
  opportunities: Opportunity[];
  selectedOpportunityId?: string;
  onSelectOpportunity: (opportunityId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function OpportunityPanel({
  dataset,
  opportunities,
  selectedOpportunityId,
  onSelectOpportunity,
  onSelectNode
}: OpportunityPanelProps) {
  const sorted = [...opportunities].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <div className="panel-scroll">
      <div className="panel-intro">
        <strong>Opportunity seeds</strong>
        <span>Sorted by score. V0 uses only opportunities already present in the dataset.</span>
      </div>
      {sorted.map((opportunity) => (
        <article
          key={opportunity.id}
          className={`opportunity-card ${selectedOpportunityId === opportunity.id ? "selected" : ""}`}
        >
          <button type="button" onClick={() => onSelectOpportunity(opportunity.id)}>
            <span className="score">{formatScore(opportunity.score)}</span>
            <span>
              <strong>{opportunity.title}</strong>
              <small>{priorityLabel(opportunity.score)}</small>
            </span>
          </button>
          <p>{opportunity.reason}</p>
          <dl className="detail-grid compact">
            <div>
              <dt>Type</dt>
              <dd>{opportunity.type || "Not specified"}</dd>
            </div>
            <div>
              <dt>France fit</dt>
              <dd>{opportunity.france_fit ?? "-"}</dd>
            </div>
            <div>
              <dt>EU fit</dt>
              <dd>{opportunity.eu_fit ?? "-"}</dd>
            </div>
            <div>
              <dt>Confidence</dt>
              <dd>{opportunity.confidence || "-"}</dd>
            </div>
          </dl>
          <div className="chip-wrap">
            {opportunity.dependency_types.map((type) => (
              <span key={type} className="chip">
                {type}
              </span>
            ))}
          </div>
          <div className="affected-list">
            {opportunity.affected_nodes.map((nodeId) => {
              const node = dataset.nodeById.get(nodeId);
              return node ? (
                <button key={nodeId} type="button" className="mini-link" onClick={() => onSelectNode(nodeId)}>
                  {node.name}
                </button>
              ) : (
                <span key={nodeId} className="unresolved-node">
                  {nodeId}
                </span>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
