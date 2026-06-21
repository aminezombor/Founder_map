import type { DatasetConfig } from "../types/graph";

interface DatasetSelectorProps {
  datasets: DatasetConfig[];
  activeDatasetId: string;
  onChange: (datasetId: string) => void;
}

export function DatasetSelector({ datasets, activeDatasetId, onChange }: DatasetSelectorProps) {
  return (
    <label className="field">
      <span className="field-label">Dataset</span>
      <select value={activeDatasetId} onChange={(event) => onChange(event.target.value)}>
        {datasets.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.label}
          </option>
        ))}
      </select>
    </label>
  );
}
