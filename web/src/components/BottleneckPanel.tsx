import type { GraphDataset } from "../types/graph";

export function BottleneckPanel({ dataset }: { dataset: GraphDataset }) {
  const redNodes = dataset.nodes
    .filter((node) => String(node.color).toLowerCase() === "red")
    .sort((a, b) => (b.criticality ?? 0) - (a.criticality ?? 0))
    .slice(0, 8);

  const highRiskEdges = dataset.edges
    .filter((edge) => (edge.dependency_risk ?? 0) >= 5 || String(edge.color).toLowerCase() === "red")
    .sort((a, b) => (b.criticality ?? 0) - (a.criticality ?? 0))
    .slice(0, 8);

  return (
    <div className="bottleneck-panel">
      <h3>Bottleneck Signals</h3>
      <div className="mini-list">
        {redNodes.map((node) => (
          <div key={node.id} className="mini-row">
            <strong>{node.name}</strong>
            <span>
              C{node.criticality ?? "-"} / S{node.sovereignty_score ?? "-"}
            </span>
          </div>
        ))}
      </div>
      <h4>High-risk relationships</h4>
      <div className="mini-list">
        {highRiskEdges.map((edge) => (
          <div key={edge.id} className="mini-row">
            <strong>{edge.dependency_category || edge.type || "dependency"}</strong>
            <span>
              R{edge.dependency_risk ?? "-"} / {edge.fact_status || "unknown"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
