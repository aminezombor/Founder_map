import type { ScoredOpportunity } from "../../scoring/scoringTypes";

interface GraphEvidenceListProps {
  opportunity: ScoredOpportunity;
}

function chipList(items: string[], empty: string) {
  if (!items.length) return <p className="muted">{empty}</p>;
  return (
    <div className="v2-chip-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function GraphEvidenceList({ opportunity }: GraphEvidenceListProps) {
  const breakdown = opportunity.breakdown;
  const strongEdges = [...opportunity.connectedEdges]
    .filter((edge) => (edge.criticality ?? 0) >= 4 || (edge.dependency_risk ?? 0) >= 4)
    .sort((a, b) => ((b.criticality ?? 0) + (b.dependency_risk ?? 0)) - ((a.criticality ?? 0) + (a.dependency_risk ?? 0)))
    .slice(0, 8);

  return (
    <div className="graph-evidence-list">
      <section>
        <h3>Evidence strength</h3>
        <p><strong>{breakdown.evidenceLevel}</strong> at {breakdown.evidenceStrength.score.toFixed(1)} / 100</p>
        <ul className="tight-list">
          {breakdown.evidenceStrength.explanations.map((explanation) => (
            <li key={explanation}>{explanation}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Affected nodes</h3>
        {chipList(opportunity.affectedNodeRecords.map((node) => node.name), "No affected nodes resolved.")}
      </section>

      <section>
        <h3>Red/orange bottlenecks</h3>
        {chipList(opportunity.bottleneckNodes.map((node) => node.name), "No direct red/orange bottlenecks.")}
      </section>

      <section>
        <h3>Strong connected edges</h3>
        {strongEdges.length ? (
          <div className="edge-evidence-list">
            {strongEdges.map((edge) => (
              <div key={edge.id}>
                <strong>{edge.source || edge.from} to {edge.target || edge.to}</strong>
                <span>{edge.dependency_category || edge.type || "dependency"} - C{edge.criticality ?? "-"} / R{edge.dependency_risk ?? "-"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No high-criticality connected edges.</p>
        )}
      </section>

      <section>
        <h3>Dependency types</h3>
        {chipList(opportunity.dependency_types, "No dependency types attached.")}
      </section>

      <section>
        <h3>Buyer types</h3>
        {chipList(opportunity.buyer_types, "No buyer types attached.")}
      </section>

      <section>
        <h3>Source IDs</h3>
        {chipList(opportunity.opportunity.sources, "No source IDs attached.")}
      </section>

      <section>
        <h3>Known / inferred split</h3>
        <p>{breakdown.knownEdgeCount} known connected edges and {breakdown.inferredEdgeCount} inferred connected edges.</p>
      </section>
    </div>
  );
}
