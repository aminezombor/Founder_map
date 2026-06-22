import { domainOptions, type DomainId } from "../../scoring/scoringTypes";

interface DomainSelectorProps {
  selectedDomainIds: DomainId[];
  onChange: (domainIds: DomainId[]) => void;
  countsByDomain: Map<string, number>;
}

export function DomainSelector({ selectedDomainIds, onChange, countsByDomain }: DomainSelectorProps) {
  function toggleDomain(domainId: DomainId) {
    if (selectedDomainIds.includes(domainId)) {
      onChange(selectedDomainIds.filter((id) => id !== domainId));
      return;
    }
    onChange([...selectedDomainIds, domainId]);
  }

  return (
    <section className="v2-panel domain-panel">
      <div className="v2-section-head">
        <div>
          <h2>Domains</h2>
          <p>Default scoring focuses on AI and Industrial OT.</p>
        </div>
      </div>
      <div className="domain-list">
        {domainOptions.map((domain) => (
          <label key={domain.id} className={`domain-row${domain.planned ? " planned" : ""}`}>
            <input
              type="checkbox"
              checked={selectedDomainIds.includes(domain.id)}
              disabled={domain.planned}
              onChange={() => toggleDomain(domain.id)}
            />
            <span>
              <strong>{domain.label}</strong>
              <em>{domain.status === "planned" ? "Planned" : domain.status === "evidence" ? "Evidence domain" : "Active"}</em>
            </span>
            <b>{domain.planned ? "Planned" : countsByDomain.get(domain.id) ?? 0}</b>
          </label>
        ))}
      </div>
    </section>
  );
}
