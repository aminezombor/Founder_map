import type { BoardVerdict } from "../../hunter/hunterTypes";

interface CouncilVerdictCardProps {
  verdict: BoardVerdict;
}

export function CouncilVerdictCard({ verdict }: CouncilVerdictCardProps) {
  return (
    <article className="v3-council-card">
      <header>
        <h3>{verdict.lensName}</h3>
        <strong>{verdict.scoreContribution}</strong>
      </header>
      <dl>
        <div>
          <dt>For</dt>
          <dd>{verdict.strongestFor}</dd>
        </div>
        <div>
          <dt>Against</dt>
          <dd>{verdict.strongestAgainst}</dd>
        </div>
        <div>
          <dt>10x move</dt>
          <dd>{verdict.tenXMove}</dd>
        </div>
        <div>
          <dt>Changes mind</dt>
          <dd>{verdict.evidenceToChangeMind}</dd>
        </div>
      </dl>
    </article>
  );
}
