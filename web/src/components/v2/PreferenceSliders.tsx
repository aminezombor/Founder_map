import type { PreferenceKey, PreferenceWeights } from "../../scoring/scoringTypes";
import { defaultPreferenceWeights } from "../../scoring/scoringTypes";
import { preferenceExplanations } from "../../scoring/scoringExplain";

interface PreferenceSlidersProps {
  weights: PreferenceWeights;
  onChange: (weights: PreferenceWeights) => void;
}

const sliders: Array<{ key: PreferenceKey; label: string }> = [
  { key: "feasibility", label: "Feasibility" },
  { key: "founderSpeedFit", label: "Founder speed fit" },
  { key: "strategicLeverage", label: "Strategic leverage" },
  { key: "buyerAccess", label: "Buyer access" },
  { key: "exitOptionality", label: "Exit optionality" }
];

const coefficientMeaning = ["ignored", "light preference", "strong preference", "dominant preference"];

export function PreferenceSliders({ weights, onChange }: PreferenceSlidersProps) {
  function updateWeight(key: PreferenceKey, value: number) {
    onChange({ ...weights, [key]: Math.max(0, Math.min(3, Math.round(value))) });
  }

  return (
    <section className="v2-panel preference-panel">
      <div className="v2-section-head">
        <div>
          <h2>My preferences</h2>
          <p>0 ignores a dimension. 3 makes it dominant.</p>
        </div>
        <button type="button" className="v2-link-button" onClick={() => onChange(defaultPreferenceWeights)}>
          Reset
        </button>
      </div>
      <div className="v2-slider-stack">
        {sliders.map((slider) => (
          <label key={slider.key} className="v2-slider">
            <span>
              <strong>{slider.label} <b>{weights[slider.key]}</b></strong>
              <em>{preferenceExplanations[slider.key]}</em>
              <small>Coefficient meaning: {weights[slider.key]} = {coefficientMeaning[weights[slider.key]]}</small>
            </span>
            <div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={weights[slider.key]}
                onInput={(event) => updateWeight(slider.key, Number(event.currentTarget.value))}
                onChange={(event) => updateWeight(slider.key, Number(event.target.value))}
              />
              <input
                type="number"
                min="0"
                max="3"
                step="1"
                value={weights[slider.key]}
                aria-label={`${slider.label} weight`}
                onChange={(event) => updateWeight(slider.key, Number(event.target.value))}
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
