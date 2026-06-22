import type { WorldState } from "../../hunter/hunterTypes";
import { EvidenceSignalList } from "./EvidenceSignalList";

interface WorldStatePageProps {
  worldState: WorldState;
}

export function WorldStatePage({ worldState }: WorldStatePageProps) {
  const forSignals = worldState.signals.filter((signal) => signal.polarity !== "against");
  const againstSignals = worldState.signals.filter((signal) => signal.polarity === "against" || signal.polarity === "mixed");

  return (
    <div className="v2-doc-page v3-world-page">
      <section className="v2-panel doc-hero">
        <span className="eyebrow">World state</span>
        <h1>Current pressure map</h1>
        <p>{worldState.summary}</p>
      </section>
      <section className="v3-two-col">
        <article className="v2-panel">
          <h2>Signals pushing hunts forward</h2>
          <EvidenceSignalList signals={forSignals} empty="No positive or mixed signals loaded." />
        </article>
        <article className="v2-panel">
          <h2>Signals that should make us careful</h2>
          <EvidenceSignalList signals={againstSignals} empty="No counter-signals loaded." />
        </article>
      </section>
    </div>
  );
}
