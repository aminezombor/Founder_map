import type { ScoredOpportunity } from "../../scoring/scoringTypes";

interface EvidenceStripProps {
  opportunity?: ScoredOpportunity;
}

export function EvidenceStrip({ opportunity }: EvidenceStripProps) {
  if (!opportunity) return null;
  const strongestEdges = [...opportunity.connectedEdges]
    .sort((a, b) => ((b.criticality ?? 0) + (b.dependency_risk ?? 0)) - ((a.criticality ?? 0) + (a.dependency_risk ?? 0)))
    .slice(0, 4);
  const sources = opportunity.opportunity.sources.slice(0, 5);

  return (
    <section className="v2-panel evidence-strip">
      <div className="evidence-head">
        <strong>Top evidence behind this opportunity</strong>
        <span>{opportunity.sourceDatasetLabel}</span>
      </div>
      <div className="evidence-row">
        <div>
          <h3>Affected nodes</h3>
          <p>{opportunity.affectedNodeRecords.slice(0, 4).map((node) => node.name).join(", ") || "No resolved nodes"}</p>
        </div>
        <div>
          <h3>Bottlenecks</h3>
          <p>{opportunity.bottleneckNodes.slice(0, 4).map((node) => node.name).join(", ") || "No direct red/orange node"}</p>
        </div>
        <div>
          <h3>Strong edges</h3>
          <p>{strongestEdges.map((edge) => edge.dependency_category || edge.type || "dependency").join(", ") || "No connected edge"}</p>
        </div>
        <div>
          <h3>Source IDs</h3>
          <p>{sources.join(", ") || "No source IDs attached"}</p>
        </div>
      </div>
    </section>
  );
}
