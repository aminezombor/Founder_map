import { founderCouncil } from "../../hunter/founderCouncil";

export function CouncilPage() {
  return (
    <div className="v2-doc-page v3-council-page">
      <section className="v2-panel doc-hero">
        <span className="eyebrow">Founder Council</span>
        <h1>Original lenses for attacking ideas.</h1>
        <p>The council is not a literal game or impersonation. It is a set of original reasoning modes that pressure-test startup hunts from invention, product, systems, chaos, narrative, deal, and founder-fit angles.</p>
      </section>
      <section className="v3-council-grid">
        {founderCouncil.map((lens) => (
          <article key={lens.id} className="v2-panel v3-lens-card">
            <span className="eyebrow">{lens.scoreBias}</span>
            <h2>{lens.name}</h2>
            <p>{lens.role}</p>
            <blockquote>{lens.worldview}</blockquote>
          </article>
        ))}
      </section>
    </div>
  );
}
