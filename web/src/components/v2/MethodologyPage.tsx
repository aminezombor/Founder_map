import { confidenceCaveat } from "../../scoring/scoringExplain";

export function MethodologyPage() {
  return (
    <div className="v2-doc-page">
      <section className="v2-panel doc-hero">
        <h1>Scoring methodology</h1>
        <p>{confidenceCaveat()}</p>
      </section>

      <section className="doc-grid">
        <article className="v2-panel">
          <h2>1. What the score means</h2>
          <p>The final utility score ranks opportunities for action under the current preference weights. It is useful for sequencing, not for declaring objective market truth.</p>
        </article>
        <article className="v2-panel">
          <h2>2. Five preference sliders</h2>
          <p>Feasibility, founder speed fit, strategic leverage, buyer access, and exit optionality are weighted from 0 to 3. If all are zero, equal weights are used.</p>
        </article>
        <article className="v2-panel formula-card">
          <h2>3. Structural opportunity score</h2>
          <pre>Structural = geometric mean(opportunity fields + graph evidence)</pre>
          <p>Inputs include criticality, dependency risk, market importance, urgency, confidence, connected bottleneck nodes, and high-criticality edges.</p>
        </article>
        <article className="v2-panel formula-card">
          <h2>4. Personal fit score</h2>
          <pre>PersonalFit = weighted average(five preference dimensions)</pre>
          <p>This controls how much the ranking bends toward the user's current build style.</p>
        </article>
        <article className="v2-panel formula-card">
          <h2>5. Risk gate</h2>
          <pre>FinalUtility = Structural x PersonalFitModifier x RiskGate</pre>
          <p>Risk reduces scores without hiding opportunities. Legal, capital, data access, sales-cycle, and operational risks all contribute.</p>
        </article>
        <article className="v2-panel">
          <h2>6. Phase model</h2>
          <p>Now means a capital-light demo path. Near means pilots or data access. Later means integration, certification, or hardware. Big bet means large strategic surface that needs a smaller wedge first.</p>
        </article>
        <article className="v2-panel">
          <h2>7. Wedge-to-empire path</h2>
          <p>This hidden score asks whether a narrow wedge can expand into a larger strategic platform.</p>
        </article>
        <article className="v2-panel">
          <h2>8. Proof velocity</h2>
          <p>This hidden score asks how quickly a founder can produce credible signal through a demo, prototype, expert validation, pilot conversation, or paid test.</p>
        </article>
        <article className="v2-panel">
          <h2>9. Exit optionality</h2>
          <p>Exit optionality considers acquirer categories, buy-vs-build pressure, integration simplicity, revenue quality, data value, capital efficiency, and time-to-exit attractiveness.</p>
        </article>
        <article className="v2-panel">
          <h2>10. Known vs inferred data</h2>
          <p>Known graph links and inferred links remain distinct in the map. Dashboard scores can use both, but the methodology treats the result as directional.</p>
        </article>
      </section>
    </div>
  );
}
