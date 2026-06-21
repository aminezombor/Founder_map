import type { FilterOptions, FilterState } from "../types/graph";
import { colorMeanings } from "../utils/colors";

interface FilterPanelProps {
  filters: FilterState;
  options: FilterOptions;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function OptionGroup({
  title,
  values,
  selected,
  onToggle,
  limit = 12
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
  limit?: number;
}) {
  const visible = values.slice(0, limit);
  return (
    <details className="filter-group" open={selected.length > 0}>
      <summary>
        <span>{title}</span>
        <small>{selected.length || "all"}</small>
      </summary>
      <div className="checkbox-stack">
        {visible.map((value) => (
          <label key={value} className="check-row">
            <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} />
            <span>{value}</span>
          </label>
        ))}
        {values.length > limit && <small className="muted">Showing first {limit} values</small>}
      </div>
    </details>
  );
}

export function FilterPanel({ filters, options, onChange, onReset }: FilterPanelProps) {
  return (
    <section className="sidebar-section">
      <div className="section-heading">
        <h2>Filters</h2>
        <button type="button" className="text-button" onClick={onReset}>
          Reset
        </button>
      </div>

      <OptionGroup
        title="Node type"
        values={options.nodeTypes}
        selected={filters.nodeTypes}
        onToggle={(value) => onChange({ nodeTypes: toggleValue(filters.nodeTypes, value) })}
      />
      <OptionGroup
        title="Country"
        values={options.countries}
        selected={filters.countries}
        onToggle={(value) => onChange({ countries: toggleValue(filters.countries, value) })}
      />
      <OptionGroup
        title="Region"
        values={options.regions}
        selected={filters.regions}
        onToggle={(value) => onChange({ regions: toggleValue(filters.regions, value) })}
      />
      <OptionGroup
        title="Sector / tag"
        values={options.sectors}
        selected={filters.sectors}
        onToggle={(value) => onChange({ sectors: toggleValue(filters.sectors, value) })}
      />

      <details className="filter-group">
        <summary>
          <span>Color</span>
          <small>{filters.colors.length || "all"}</small>
        </summary>
        <div className="checkbox-stack">
          {options.colors.map((color) => (
            <label key={color} className="check-row color-check">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => onChange({ colors: toggleValue(filters.colors, color) })}
              />
              <span className={`swatch swatch-${color}`} />
              <span>{color}</span>
              <small>{colorMeanings[color] ?? ""}</small>
            </label>
          ))}
        </div>
      </details>

      <OptionGroup
        title="Confidence"
        values={options.confidences}
        selected={filters.confidences}
        onToggle={(value) => onChange({ confidences: toggleValue(filters.confidences, value) })}
      />
      <OptionGroup
        title="Fact status"
        values={options.factStatuses}
        selected={filters.factStatuses}
        onToggle={(value) => onChange({ factStatuses: toggleValue(filters.factStatuses, value) })}
      />
      <OptionGroup
        title="Edge type"
        values={options.edgeTypes}
        selected={filters.edgeTypes}
        onToggle={(value) => onChange({ edgeTypes: toggleValue(filters.edgeTypes, value) })}
      />
      <OptionGroup
        title="Dependency"
        values={options.dependencyCategories}
        selected={filters.dependencyCategories}
        onToggle={(value) =>
          onChange({ dependencyCategories: toggleValue(filters.dependencyCategories, value) })
        }
      />

      <label className="range-field">
        <span>Criticality minimum</span>
        <output>{filters.criticalityMin}</output>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={filters.criticalityMin}
          onChange={(event) => onChange({ criticalityMin: Number(event.target.value) })}
        />
      </label>
      <label className="range-field">
        <span>Sovereignty minimum</span>
        <output>{filters.sovereigntyMin}</output>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={filters.sovereigntyMin}
          onChange={(event) => onChange({ sovereigntyMin: Number(event.target.value) })}
        />
      </label>

      <div className="toggle-stack">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={filters.franceEuLens}
            onChange={(event) => onChange({ franceEuLens: event.target.checked })}
          />
          <span>France / EU lens</span>
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={filters.bottlenecksOnly}
            onChange={(event) => onChange({ bottlenecksOnly: event.target.checked })}
          />
          <span>Only bottlenecks</span>
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={filters.opportunityConnectedOnly}
            onChange={(event) => onChange({ opportunityConnectedOnly: event.target.checked })}
          />
          <span>Opportunity-connected</span>
        </label>
      </div>
    </section>
  );
}
