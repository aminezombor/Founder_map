import { confidenceCaveat } from "../../scoring/scoringExplain";
import { phaseDefinitions } from "../../scoring/phaseModel";

function Formula({ children }: { children: string }) {
  return <pre>{children}</pre>;
}

export function MethodologyPage() {
  return (
    <div className="v2-doc-page methodology-page">
      <section className="v2-panel doc-hero">
        <h1>Scoring methodology</h1>
        <p>{confidenceCaveat()} The dashboard is designed to sequence action, not declare permanent market truth.</p>
      </section>

      <section className="doc-grid">
        <article className="v2-panel">
          <h2>1. What the Opportunity Engine does</h2>
          <p>It turns local graph data into ranked build opportunities: data to graph, graph to bottleneck, bottleneck to opportunity, score to personal fit, then action.</p>
        </article>

        <article className="v2-panel">
          <h2>2. What the five coefficients mean</h2>
          <p>Each preference coefficient runs from 0 to 3. 0 means ignored, 1 means light preference, 2 means strong preference, and 3 means dominant preference.</p>
        </article>

        <article className="v2-panel formula-card">
          <h2>3. Exact final utility formula</h2>
          <Formula>{`FinalUtility =
StructuralOpportunityScore
x PersonalFitModifier
x RiskGate`}</Formula>
        </article>

        <article className="v2-panel formula-card">
          <h2>4. Structural Opportunity Score formula</h2>
          <Formula>{`StructuralOpportunityScore =
weighted geometric mean of:
- criticality
- dependency risk
- market importance
- urgency
- evidence confidence
- connected bottleneck strength
- affected node centrality
- cross-domain relevance
- evidence strength`}</Formula>
        </article>

        <article className="v2-panel formula-card">
          <h2>5. Personal Fit Score formula</h2>
          <Formula>{`PersonalFitModifier =
0.35 + 0.65 x PersonalFitScore / 100

PersonalFitScore =
weighted_average(
  FeasibilityScore,
  FounderSpeedFitScore,
  StrategicLeverageScore,
  BuyerAccessScore,
  ExitOptionalityScore
)`}</Formula>
          <p>Weights are the user coefficients from 0 to 3. If all weights are zero, equal weights are used.</p>
        </article>

        <article className="v2-panel">
          <h2>6. Feasibility sub-score</h2>
          <p>Combines material-light score, software-first score, data access score, time to MVP, regulatory simplicity, capital requirement inverse, technical unknown inverse, and proof velocity.</p>
        </article>

        <article className="v2-panel">
          <h2>7. Founder Speed Fit sub-score</h2>
          <p>Combines prototype speed, learning velocity, AI/software fit, strategic/system-thinking fit, demo potential, and France/EU relevance when applicable.</p>
        </article>

        <article className="v2-panel">
          <h2>8. Strategic Leverage sub-score</h2>
          <p>Combines bottleneck criticality, cross-domain relevance, sovereignty relevance, infrastructure importance, defensibility potential, and wedge-to-empire score.</p>
        </article>

        <article className="v2-panel">
          <h2>9. Buyer Access sub-score</h2>
          <p>Combines pain intensity, budget, urgency, pilotability, sales-cycle simplicity, and distribution access.</p>
        </article>

        <article className="v2-panel">
          <h2>10. Exit Optionality sub-score</h2>
          <p>Combines acquirer count, strategic acquirer fit, buy-vs-build pressure, integration simplicity, revenue quality, data asset value, time-to-exit attractiveness, and capital efficiency.</p>
        </article>

        <article className="v2-panel formula-card">
          <h2>11. Risk Gate</h2>
          <Formula>{`RiskGate is 0 to 1.
It reduces final score for:
- legal/regulatory risk
- capital intensity risk
- data access risk
- sales-cycle risk
- operational complexity risk
- incumbent risk`}</Formula>
        </article>

        <article className="v2-panel">
          <h2>12. Phase model</h2>
          <dl className="phase-definition-list">
            {Object.entries(phaseDefinitions).map(([phase, definition]) => (
              <div key={phase}>
                <dt>{definition.label}</dt>
                <dd>{definition.meaning} {definition.typicalPath} {definition.warning}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="v2-panel">
          <h2>13. Proof Velocity</h2>
          <p>Proof velocity asks how quickly a founder can produce credible signal through a demo, expert validation, sample data, pilot conversation, or paid test.</p>
        </article>

        <article className="v2-panel">
          <h2>14. Wedge-to-Empire Path</h2>
          <p>This asks whether a narrow wedge can expand into a larger strategic platform. Big bet is not bad; it means attack through a smaller wedge first.</p>
        </article>

        <article className="v2-panel">
          <h2>15. Evidence Strength</h2>
          <p>Evidence strength combines affected node count, red/orange bottleneck count, high-criticality edge count, source count, confidence, known/inferred edge split, and affected node centrality.</p>
        </article>

        <article className="v2-panel">
          <h2>16. Known vs inferred data</h2>
          <p>Known and inferred graph edges remain separate. The engine can use both, but the Evidence tab always shows the known/inferred split.</p>
        </article>

        <article className="v2-panel">
          <h2>17. Data-derived vs heuristic</h2>
          <h3>Data-derived</h3>
          <p>Opportunity fields, affected nodes, node colors, node scores, edge dependency risk, edge criticality, fact_status, confidence, source dataset, and graph centrality.</p>
          <h3>Heuristic</h3>
          <p>Inferred buyer access, inferred acquirer categories, inferred phase, estimated time to MVP/revenue/exit, wedge-to-empire score, proof velocity score, and opportunity archetype match.</p>
        </article>

        <article className="v2-panel">
          <h2>18. Why this is not bullshit</h2>
          <p>Every score is traceable to visible inputs. Hidden heuristics are listed. User coefficients are explicit. Known and inferred graph evidence remain separate. The final ranking is for sequencing action, not declaring truth. Score explanations show graph evidence and score drivers.</p>
        </article>
      </section>
    </div>
  );
}
