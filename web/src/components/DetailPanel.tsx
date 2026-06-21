import type { ReactNode } from "react";
import type { DatasetConfig, GraphDataset, GraphEdge, GraphNode, Opportunity, Selection, SourceRecord } from "../types/graph";
import { getColorMeaning } from "../utils/colors";
import {
  getEdgeById,
  getEdgesForNode,
  getNodeById,
  getRelatedOpportunities,
  getSourceRecords
} from "../utils/graphSelectors";
import { formatList, truncate } from "../utils/text";
import { DatasetPanel } from "./DatasetPanel";
import { OpportunityPanel } from "./OpportunityPanel";
import { SourcesPanel } from "./SourcesPanel";

type DetailTab = "selected" | "opportunities" | "sources" | "dataset";

interface DetailPanelProps {
  dataset: GraphDataset;
  config: DatasetConfig;
  selection: Selection;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
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
    <div className="source-ref-list">
      {sources.map((source) => (
        <a key={source.id} href={source.url || "#"} target={source.url ? "_blank" : undefined} rel="noreferrer">
          <strong>{source.title || source.id}</strong>
          <span>{source.id}</span>
        </a>
      ))}
    </div>
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
    <div className="panel-scroll">
      <header className="selected-header">
        <span className={`swatch swatch-${node.color || "grey"}`} />
        <div>
          <h2>{node.name}</h2>
          <p>{node.strategic_role || node.type || "Strategic node"}</p>
        </div>
      </header>

      <p className="description">{node.description}</p>

      <dl className="detail-grid">
        <DetailRow label="Type" value={node.type} />
        <DetailRow label="Country / region" value={`${node.country || "-"} / ${node.region || "-"}`} />
        <DetailRow label="Sectors" value={formatList(node.sector)} />
        <DetailRow label="Color meaning" value={getColorMeaning(node.color)} />
        <DetailRow label="Sovereignty" value={node.sovereignty_score ?? "-"} />
        <DetailRow label="Criticality" value={node.criticality ?? "-"} />
        <DetailRow label="Market importance" value={node.market_importance ?? "-"} />
        <DetailRow label="France / EU fit" value={node.france_or_eu_fit ?? "-"} />
        <DetailRow label="Confidence" value={node.confidence || "-"} />
        <DetailRow label="Fact status" value={node.fact_status || "-"} />
        <DetailRow label="Tags" value={formatList(node.tags)} />
      </dl>

      <section>
        <h3>Connected nodes</h3>
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
      </section>

      <section>
        <h3>Incoming edges</h3>
        <div className="edge-list">
          {incoming.length ? incoming.map((edge) => <EdgeButton key={edge.id} edge={edge} dataset={dataset} onSelectEdge={onSelectEdge} />) : <p className="muted">No incoming edges.</p>}
        </div>
      </section>

      <section>
        <h3>Outgoing edges</h3>
        <div className="edge-list">
          {outgoing.length ? outgoing.map((edge) => <EdgeButton key={edge.id} edge={edge} dataset={dataset} onSelectEdge={onSelectEdge} />) : <p className="muted">No outgoing edges.</p>}
        </div>
      </section>

      <section>
        <h3>Related opportunities</h3>
        <div className="mini-list">
          {opportunities.length ? (
            opportunities.map((opportunity) => (
              <button key={opportunity.id} type="button" className="mini-row button-row" onClick={() => onSelectOpportunity(opportunity.id)}>
                <strong>{opportunity.title}</strong>
                <span>{opportunity.score ?? "-"}</span>
              </button>
            ))
          ) : (
            <p className="muted">No directly related opportunities.</p>
          )}
        </div>
      </section>

      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, node.sources)} />
      </section>
    </div>
  );
}

function EdgeSelected({ edge, dataset }: { edge: GraphEdge; dataset: GraphDataset }) {
  const from = getNodeById(dataset, edge.from);
  const to = getNodeById(dataset, edge.to);
  return (
    <div className="panel-scroll">
      <header className="selected-header">
        <span className={`swatch swatch-${edge.color || "grey"}`} />
        <div>
          <h2>{from?.name ?? edge.from}{" -> "}{to?.name ?? edge.to}</h2>
          <p>{edge.dependency_category || edge.type || "Dependency"}</p>
        </div>
      </header>
      <p className="description">{edge.reason}</p>
      <dl className="detail-grid">
        <DetailRow label="Type" value={edge.type} />
        <DetailRow label="Dependency category" value={edge.dependency_category} />
        <DetailRow label="Dependency risk" value={edge.dependency_risk ?? "-"} />
        <DetailRow label="Criticality" value={edge.criticality ?? "-"} />
        <DetailRow label="Replaceability" value={edge.replaceability ?? "-"} />
        <DetailRow label="Time to substitute" value={edge.time_to_substitute || "-"} />
        <DetailRow label="Confidence" value={edge.confidence || "-"} />
        <DetailRow label="Fact status" value={edge.fact_status || "-"} />
        <DetailRow label="Tags" value={formatList(edge.tags)} />
      </dl>
      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, edge.sources)} />
      </section>
    </div>
  );
}

function OpportunitySelected({ opportunity, dataset, onSelectNode }: { opportunity: Opportunity; dataset: GraphDataset; onSelectNode: (nodeId: string) => void }) {
  return (
    <div className="panel-scroll">
      <header className="selected-header">
        <span className="swatch swatch-purple" />
        <div>
          <h2>{opportunity.title}</h2>
          <p>{opportunity.type || "Opportunity seed"}</p>
        </div>
      </header>
      <p className="description">{opportunity.reason}</p>
      <dl className="detail-grid">
        <DetailRow label="Score" value={opportunity.score ?? "-"} />
        <DetailRow label="Criticality" value={opportunity.criticality ?? "-"} />
        <DetailRow label="Dependency risk" value={opportunity.dependency_risk ?? "-"} />
        <DetailRow label="Market importance" value={opportunity.market_importance ?? "-"} />
        <DetailRow label="Urgency" value={opportunity.urgency ?? "-"} />
        <DetailRow label="Accessibility" value={opportunity.accessibility ?? "-"} />
        <DetailRow label="France fit" value={opportunity.france_fit ?? "-"} />
        <DetailRow label="EU fit" value={opportunity.eu_fit ?? "-"} />
        <DetailRow label="Confidence" value={opportunity.confidence || "-"} />
        <DetailRow label="Buyer types" value={formatList(opportunity.buyer_types)} />
        <DetailRow label="Dependency types" value={formatList(opportunity.dependency_types)} />
      </dl>
      <section>
        <h3>Affected nodes</h3>
        <div className="chip-wrap">
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
      </section>
      <section>
        <h3>Sources</h3>
        <SourceRefs sources={getSourceRecords(dataset, opportunity.sources)} />
      </section>
    </div>
  );
}

function EmptySelected({ dataset }: { dataset: GraphDataset }) {
  const topOpportunity = [...dataset.opportunities].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  return (
    <div className="panel-scroll empty-selected">
      <h2>Nothing selected</h2>
      <p>Click a node, edge, or opportunity to inspect the structure behind it.</p>
      {topOpportunity && (
        <div className="empty-callout">
          <strong>Top opportunity</strong>
          <span>{topOpportunity.title}</span>
          <small>{truncate(topOpportunity.reason, 120)}</small>
        </div>
      )}
    </div>
  );
}

export function DetailPanel({
  dataset,
  config,
  selection,
  activeTab,
  onTabChange,
  onSelectNode,
  onSelectEdge,
  onSelectOpportunity
}: DetailPanelProps) {
  const selectedNode = selection?.kind === "node" ? getNodeById(dataset, selection.id) : undefined;
  const selectedEdge = selection?.kind === "edge" ? getEdgeById(dataset, selection.id) : undefined;
  const selectedOpportunity =
    selection?.kind === "opportunity" ? dataset.opportunities.find((opportunity) => opportunity.id === selection.id) : undefined;
  const relatedOpportunities = getRelatedOpportunities(dataset, selection);

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: "selected", label: "Selected" },
    { id: "opportunities", label: "Opportunities" },
    { id: "sources", label: "Sources" },
    { id: "dataset", label: "Dataset" }
  ];

  return (
    <aside className="detail-panel">
      <div className="panel-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "selected" && selectedNode && (
        <NodeSelected
          node={selectedNode}
          dataset={dataset}
          opportunities={relatedOpportunities}
          onSelectEdge={onSelectEdge}
          onSelectNode={onSelectNode}
          onSelectOpportunity={onSelectOpportunity}
        />
      )}
      {activeTab === "selected" && selectedEdge && <EdgeSelected edge={selectedEdge} dataset={dataset} />}
      {activeTab === "selected" && selectedOpportunity && (
        <OpportunitySelected opportunity={selectedOpportunity} dataset={dataset} onSelectNode={onSelectNode} />
      )}
      {activeTab === "selected" && !selectedNode && !selectedEdge && !selectedOpportunity && <EmptySelected dataset={dataset} />}
      {activeTab === "opportunities" && (
        <OpportunityPanel
          dataset={dataset}
          opportunities={selection ? relatedOpportunities : dataset.opportunities}
          selectedOpportunityId={selection?.kind === "opportunity" ? selection.id : undefined}
          onSelectOpportunity={onSelectOpportunity}
          onSelectNode={onSelectNode}
        />
      )}
      {activeTab === "sources" && <SourcesPanel sources={dataset.sources} />}
      {activeTab === "dataset" && <DatasetPanel dataset={dataset} config={config} />}
    </aside>
  );
}

export type { DetailTab };
