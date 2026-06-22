import type { DomainId, PreferenceWeights } from "../../scoring/scoringTypes";
import { defaultPreferenceWeights } from "../../scoring/scoringTypes";
import { DomainSelector } from "./DomainSelector";
import { PreferenceSliders } from "./PreferenceSliders";

interface SettingsPageProps {
  weights: PreferenceWeights;
  selectedDomainIds: DomainId[];
  countsByDomain: Map<string, number>;
  onWeightsChange: (weights: PreferenceWeights) => void;
  onDomainsChange: (domainIds: DomainId[]) => void;
}

export function SettingsPage({
  weights,
  selectedDomainIds,
  countsByDomain,
  onWeightsChange,
  onDomainsChange
}: SettingsPageProps) {
  const settingsJson = JSON.stringify({ preferenceWeights: weights, selectedDomainIds }, null, 2);
  return (
    <div className="v2-doc-page settings-page">
      <section className="v2-panel doc-hero">
        <h1>Settings</h1>
        <p>Preference weights and domain selection are saved locally in this browser.</p>
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
          <h2>Founder profile</h2>
          <p className="muted">Future placeholder: founder background, network, constraints, capital access, and preferred wedge style.</p>
        </section>
      </div>
    </div>
  );
}
