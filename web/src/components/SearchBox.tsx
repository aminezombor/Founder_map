import { Search } from "lucide-react";
import type { GraphNode } from "../types/graph";

interface SearchBoxProps {
  query: string;
  results: GraphNode[];
  onQueryChange: (query: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function SearchBox({ query, results, onQueryChange, onSelectNode }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label className="field">
        <span className="field-label">Search</span>
        <span className="input-with-icon">
          <Search size={15} aria-hidden />
          <input
            type="search"
            placeholder="Mistral AI, NVIDIA, OPC UA..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </span>
      </label>

      {query.trim() && (
        <div className="search-results" aria-label="Search results">
          {results.length ? (
            results.map((node) => (
              <button key={node.id} type="button" className="search-result" onClick={() => onSelectNode(node.id)}>
                <span>{node.name}</span>
                <small>
                  {node.type || "node"} {node.country ? `- ${node.country}` : ""}
                </small>
              </button>
            ))
          ) : (
            <div className="empty-mini">No matching nodes</div>
          )}
        </div>
      )}
    </div>
  );
}
