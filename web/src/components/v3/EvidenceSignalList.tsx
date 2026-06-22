import type { EvidenceSignal } from "../../hunter/hunterTypes";

interface EvidenceSignalListProps {
  signals: EvidenceSignal[];
  empty: string;
}

export function EvidenceSignalList({ signals, empty }: EvidenceSignalListProps) {
  if (!signals.length) return <p className="muted">{empty}</p>;
  return (
    <div className="v3-evidence-list">
      {signals.map((signal) => (
        <article key={signal.id} className={`v3-evidence-card polarity-${signal.polarity}`}>
          <header>
            <strong>{signal.title}</strong>
            <span>{signal.signalType.replaceAll("_", " ")}</span>
          </header>
          <p>{signal.summary}</p>
          <footer>
            {signal.sourceUrl ? (
              <a href={signal.sourceUrl} target="_blank" rel="noreferrer">{signal.sourceLabel}</a>
            ) : (
              <span>{signal.sourceLabel}</span>
            )}
            <em>{signal.confidence} confidence</em>
          </footer>
        </article>
      ))}
    </div>
  );
}
