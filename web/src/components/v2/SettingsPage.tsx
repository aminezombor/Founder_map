import type { DomainId, OpportunityAdvancedFilters, PreferenceWeights } from "../../scoring/scoringTypes";
import { defaultPreferenceWeights } from "../../scoring/scoringTypes";
import { DomainSelector } from "./DomainSelector";
import { PreferenceSliders } from "./PreferenceSliders";

interface SettingsPageProps {
  weights: PreferenceWeights;
  selectedDomainIds: DomainId[];
  advancedFilters: OpportunityAdvancedFilters;
  countsByDomain: Map<string, number>;
  onWeightsChange: (weights: PreferenceWeights) => void;
  onDomainsChange: (domainIds: DomainId[]) => void;
  onAdvancedFiltersChange: (filters: OpportunityAdvancedFilters) => void;
}

export function SettingsPage({
  weights,
  selectedDomainIds,
  advancedFilters,
  countsByDomain,
  onWeightsChange,
  onDomainsChange,
  onAdvancedFiltersChange
}: SettingsPageProps) {
  const settingsJson = JSON.stringify({ preferenceWeights: weights, selectedDomainIds, advancedFilters, persistence: "localStorage" }, null, 2);
  return (
    <div className="v2-doc-page settings-page">
      <section className="v2-panel doc-hero">
        <h1>Settings</h1>
        <p>Preference weights, selected domains, advanced ranking controls, and theme are saved locally in this browser. They control ranking emphasis, not raw market truth.</p>
      </section>
      <div className="settings-grid">
        <PreferenceSliders weights={weights} onChange={onWeightsChange} />
        <DomainSelector selectedDomainIds={selectedDomainIds} onChange={onDomainsChange} countsByDomain={countsByDomain} />
        <section className="v2-panel">
          <div className="v2-section-head">
            <div>
              <h2>Export settings JSON</h2>
              <p>Useful for comparing scoring runs later.</p>
            </div>
            <button type="button" className="v2-secondary-button" onClick={() => onWeightsChange(defaultPreferenceWeights)}>
              Reset defaults
            </button>
          </div>
          <pre className="settings-json">{settingsJson}</pre>
        </section>
        <section className="v2-panel">
          <h2>Current ranking controls</h2>
          <dl className="coefficient-grid">
            <div><dt>Sort by</dt><dd>{advancedFilters.sortBy}</dd></div>
            <div><dt>Minimum final utility</dt><dd>{advancedFilters.minFinalUtility}</dd></div>
            <div><dt>Minimum feasibility</dt><dd>{advancedFilters.minFeasibility}</dd></div>
            <div><dt>Minimum exit optionality</dt><dd>{advancedFilters.minExitOptionality}</dd></div>
            <div><dt>Evidence domains</dt><dd>{advancedFilters.includeEvidenceDomains ? "Included" : "Manual only"}</dd></div>
            <div><dt>Strong evidence only</dt><dd>{advancedFilters.strongGraphEvidenceOnly ? "Yes" : "No"}</dd></div>
          </dl>
          <button
            type="button"
            className="v2-secondary-button"
            onClick={() => onAdvancedFiltersChange({ ...advancedFilters, query: "", minFinalUtility: 0, minFeasibility: 0, minExitOptionality: 0 })}
          >
            Clear thresholds
          </button>
        </section>
        <section className="v2-panel">
          <h2>Founder profile</h2>
          <p className="muted">Future placeholder: founder background, network, constraints, capital access, and preferred wedge style.</p>
        </section>
      </div>
    </div>
  );
}
