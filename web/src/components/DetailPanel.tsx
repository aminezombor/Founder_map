import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { GraphDataset, GraphEdge, GraphNode, Opportunity, Selection, SourceRecord } from "../types/graph";
import { getColorMeaning } from "../utils/colors";
import {
  getEdgeById,
  getEdgesForNode,
  getNodeById,
  getRelatedOpportunities,
  getSourceRecords
} from "../utils/graphSelectors";
import { formatList } from "../utils/text";

interface DetailPanelProps {
  dataset: GraphDataset;
  selection: Selection;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || "Not specified"}</dd>
    </div>
  );
}

function SourceRefs({ sources }: { sources: SourceRecord[] }) {
  if (!sources.length) return <p className="muted">No source IDs attached.</p>;
  return (
    <div className="source-ref-list compact">
      {sources.map((source) => (
        <a key={source.id} href={source.url || "#"} target={source.url ? "_blank" : undefined} rel="noreferrer">
          <strong>{source.title || source.id}</strong>
          <span>{source.id}</span>
        </a>
      ))}
    </div>
  );
}

function topOpportunities(dataset: GraphDataset): Opportunity[] {
  return [...dataset.opportunities].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5);
}

function OpportunityList({
  dataset,
  opportunities,
  onSelectOpportunity,
  fallback = false
}: {
  dataset: GraphDataset;
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunityId: string) => void;
  fallback?: boolean;
}) {
  const visible = opportunities.length ? opportunities : topOpportunities(dataset);
  return (
    <section className="opportunity-priority">
      <h3>{opportunities.length ? "Related opportunities" : "Top dataset opportunities"}</h3>
      {!opportunities.length && fallback && <p className="muted">No direct opportunity match for this selection yet.</p>}
      <div className="mini-list">
        {visible.length ? (
          visible.map((opportunity) => (
            <button key={opportunity.id} type="button" className="mini-row button-row" onClick={() => onSelectOpportunity(opportunity.id)}>
              <strong>{opportunity.title}</strong>
              <span>{opportunity.score ?? "-"}</span>
            </button>
          ))
        ) : (
          <p className="muted">No opportunities in this dataset.</p>
        )}
      </div>
    </section>
  );
}

function EdgeButton({ edge, dataset, onSelectEdge }: { edge: GraphEdge; dataset: GraphDataset; onSelectEdge: (edgeId: string) => void }) {
  const from = dataset.nodeById.get(edge.from)?.name ?? edge.from;
  const to = dataset.nodeById.get(edge.to)?.name ?? edge.to;
  return (
    <button type="button" className="edge-button" onClick={() => onSelectEdge(edge.id)}>
      <strong>{from}{" -> "}{to}</strong>
      <span>{edge.dependency_category || edge.type || "dependency"} - {edge.fact_status || "unknown"}</span>
    </button>
  );
}

function NodeSelected({
  node,
  dataset,
  opportunities,
  onSelectEdge,
  onSelectNode,
  onSelectOpportunity
}: {
  node: GraphNode;
  dataset: GraphDataset;
  opportunities: Opportunity[];
  onSelectEdge: (edgeId: string) => void;
  onSelectNode: (nodeId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}) {
  const { incoming, outgoing } = getEdgesForNode(dataset, node.id);
  const connectedIds = [...new Set([...incoming.map((edge) => edge.from), ...outgoing.map((edge) => edge.to)])].filter(
    (id) => id !== node.id
  );

  return (
    <div className="inspector-scroll">
      <header className="selected-header">
        <span className={`swatch swatch-${node.color || "grey"}`} />
        <div>
          <h2>{node.name}</h2>
          <p>{node.strategic_role || node.type || "Strategic node"}</p>
        </div>
      </header>

      <p className="description">{node.description}</p>

      <dl className="detail-grid compact-context">
        <DetailRow label="Type" value={node.type} />
        <DetailRow label="Country / region" value={`${node.country || "-"} / ${node.region || "-"}`} />
        <DetailRow label="Sectors" value={formatList(node.sector)} />
        <DetailRow label="Color meaning" value={getColorMeaning(node.color)} />
        <DetailRow label="Sovereignty" value={node.sovereignty_score ?? "-"} />
        <DetailRow label="Criticality" value={node.criticality ?? "-"} />
        <DetailRow label="Market importance" value={node.market_importance ?? "-"} />
        <DetailRow label="France / EU fit" value={node.france_or_eu_fit ?? "-"} />
      </dl>

      <OpportunityList dataset={dataset} opportunities={opportunities} onSelectOpportunity={onSelectOpportunity} fallback />

      <details className="inspector-collapse">
        <summary>Connected nodes <span>{connectedIds.length}</span></summary>
        <div className="chip-wrap">
          {connectedIds.map((id) => {
            const connected = dataset.nodeById.get(id);
            return connected ? (
              <button key={id} type="button" className="mini-link" onClick={() => onSelectNode(id)}>
                {connected.name}
              </button>
            ) : (
              <span key={id} className="unresolved-node">{id}</span>
            );
          })}
        </div>
      </details>

      <details className="inspector-collapse">
        <summary>Incoming edges <span>{incoming.length}</span></summary>
        <div className="edge-list">
          {incoming.length ? incoming.map((edge) => <EdgeButton key={edge.id} edge={edge} dataset={dataset} onSelectEdge={onSelectEdge} />) : <p className="muted">No incoming edges.</p>}
        </div>
      </details>

      <details className="inspector-collapse">
        <summary>Outgoing edges <span>{outgoing.length}</span></summary>
        <div className="edge-list">
          {outgoing.length ? outgoing.map((edge) => <EdgeButton key={edge.id} edge={edge} dataset={dataset} onSelectEdge={onSelectEdge} />) : <p className="muted">No outgoing edges.</p>}
        </div>
      </details>

      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, node.sources)} />
      </section>
    </div>
  );
}

function EdgeSelected({
  edge,
  dataset,
  opportunities,
  onSelectNode,
  onSelectOpportunity
}: {
  edge: GraphEdge;
  dataset: GraphDataset;
  opportunities: Opportunity[];
  onSelectNode: (nodeId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}) {
  const from = getNodeById(dataset, edge.from);
  const to = getNodeById(dataset, edge.to);
  return (
    <div className="inspector-scroll">
      <header className="selected-header">
        <span className={`swatch swatch-${edge.color || "grey"}`} />
        <div>
          <h2>{from?.name ?? edge.from}{" -> "}{to?.name ?? edge.to}</h2>
          <p>{edge.dependency_category || edge.type || "Dependency"}</p>
        </div>
      </header>
      <p className="description">{edge.reason}</p>

      <OpportunityList dataset={dataset} opportunities={opportunities} onSelectOpportunity={onSelectOpportunity} fallback />

      <details className="inspector-collapse">
        <summary>Endpoint nodes <span>{[from, to].filter(Boolean).length}</span></summary>
        <div className="chip-wrap">
          {from && <button type="button" className="mini-link" onClick={() => onSelectNode(from.id)}>{from.name}</button>}
          {to && <button type="button" className="mini-link" onClick={() => onSelectNode(to.id)}>{to.name}</button>}
        </div>
      </details>

      <details className="inspector-collapse">
        <summary>Edge details <span>8</span></summary>
        <dl className="detail-grid compact-context">
          <DetailRow label="Type" value={edge.type} />
          <DetailRow label="Dependency category" value={edge.dependency_category} />
          <DetailRow label="Dependency risk" value={edge.dependency_risk ?? "-"} />
          <DetailRow label="Criticality" value={edge.criticality ?? "-"} />
          <DetailRow label="Replaceability" value={edge.replaceability ?? "-"} />
          <DetailRow label="Time to substitute" value={edge.time_to_substitute || "-"} />
          <DetailRow label="Confidence" value={edge.confidence || "-"} />
          <DetailRow label="Fact status" value={edge.fact_status || "-"} />
        </dl>
      </details>

      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, edge.sources)} />
      </section>
    </div>
  );
}

function OpportunitySelected({ opportunity, dataset, onSelectNode }: { opportunity: Opportunity; dataset: GraphDataset; onSelectNode: (nodeId: string) => void }) {
  return (
    <div className="inspector-scroll">
      <header className="selected-header">
        <span className="swatch swatch-purple" />
        <div>
          <h2>{opportunity.title}</h2>
          <p>{opportunity.type || "Opportunity seed"}</p>
        </div>
      </header>
      <p className="description">{opportunity.reason}</p>
      <dl className="detail-grid compact-context">
        <DetailRow label="Score" value={opportunity.score ?? "-"} />
        <DetailRow label="Criticality" value={opportunity.criticality ?? "-"} />
        <DetailRow label="Dependency risk" value={opportunity.dependency_risk ?? "-"} />
        <DetailRow label="Market importance" value={opportunity.market_importance ?? "-"} />
        <DetailRow label="Urgency" value={opportunity.urgency ?? "-"} />
        <DetailRow label="Accessibility" value={opportunity.accessibility ?? "-"} />
        <DetailRow label="France fit" value={opportunity.france_fit ?? "-"} />
        <DetailRow label="EU fit" value={opportunity.eu_fit ?? "-"} />
      </dl>
      <section>
        <h3>Affected nodes</h3>
        <div className="chip-wrap">
          {opportunity.affected_nodes.map((nodeId) => {
            const node = dataset.nodeById.get(nodeId);
            return node ? (
              <button key={nodeId} type="button" className="mini-link" onClick={() => onSelectNode(node.id)}>
                {node.name}
              </button>
            ) : (
              <span key={nodeId} className="unresolved-node">{nodeId}</span>
            );
          })}
        </div>
      </section>
      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, opportunity.sources)} />
      </section>
    </div>
  );
}

export function DetailPanel({
  dataset,
  selection,
  onClose,
  onSelectNode,
  onSelectEdge,
  onSelectOpportunity
}: DetailPanelProps) {
  if (!selection) return null;

  const selectedNode = selection.kind === "node" ? getNodeById(dataset, selection.id) : undefined;
  const selectedEdge = selection.kind === "edge" ? getEdgeById(dataset, selection.id) : undefined;
  const selectedOpportunity =
    selection.kind === "opportunity" ? dataset.opportunities.find((opportunity) => opportunity.id === selection.id) : undefined;
  const relatedOpportunities = getRelatedOpportunities(dataset, selection);

  return (
    <aside className="map-inspector" aria-label="Selection details">
      <div className="inspector-top">
        <div>
          <strong>Selected</strong>
          <span>{selection.kind}</span>
        </div>
        <button type="button" className="icon-button" onClick={onClose} title="Close details">
          <X size={16} aria-hidden />
        </button>
      </div>

      {selectedNode && (
        <NodeSelected
          node={selectedNode}
          dataset={dataset}
          opportunities={relatedOpportunities}
          onSelectEdge={onSelectEdge}
          onSelectNode={onSelectNode}
          onSelectOpportunity={onSelectOpportunity}
        />
      )}
      {selectedEdge && (
        <EdgeSelected
          edge={selectedEdge}
          dataset={dataset}
          opportunities={relatedOpportunities}
          onSelectNode={onSelectNode}
          onSelectOpportunity={onSelectOpportunity}
        />
      )}
      {selectedOpportunity && <OpportunitySelected opportunity={selectedOpportunity} dataset={dataset} onSelectNode={onSelectNode} />}
    </aside>
  );
}
