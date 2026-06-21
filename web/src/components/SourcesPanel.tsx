import { ExternalLink } from "lucide-react";
import type { SourceRecord } from "../types/graph";

export function SourcesPanel({ sources }: { sources: SourceRecord[] }) {
  return (
    <div className="panel-scroll source-list">
      {sources.map((source) => (
        <article key={source.id} className="source-card">
          <div>
            <strong>{source.title || source.id}</strong>
            <small>{source.type || "source"} - {source.id}</small>
          </div>
          {source.notes && <p>{source.notes}</p>}
          {source.url && (
            <a href={source.url} target="_blank" rel="noreferrer">
              Open source <ExternalLink size={13} aria-hidden />
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
