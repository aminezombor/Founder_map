import type { DatasetStats } from "../types/graph";

export function StatBar({ stats, datasetLabel }: { stats: DatasetStats; datasetLabel: string }) {
  return (
    <div className="stat-bar" role="status">
      <span>Dataset: {datasetLabel}</span>
      <span>Nodes: {stats.nodes}</span>
      <span>Edges: {stats.edges}</span>
      <span>Known: {stats.knownEdges}</span>
      <span>Inferred: {stats.inferredEdges}</span>
      <span>Red bottlenecks: {stats.redBottlenecks}</span>
      {typeof stats.filteredNodes === "number" && (
        <span>
          Filtered: {stats.filteredNodes} / {stats.filteredEdges} 
        </span>
      )}
    </div>
  );
}
