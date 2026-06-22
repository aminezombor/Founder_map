import type { GraphDataset } from "../../types/graph";
import { calculateDatasetStats } from "../../utils/graphSelectors";
import { datasetRegistry } from "../../data/datasetRegistry";
import { defaultScoringDomainIds, domainOptions, evidenceDomainIds, type DomainId } from "../../scoring/scoringTypes";

interface DataPageProps {
  datasets: GraphDataset[];
}

const expectedRoboticsLayers = [
  "robot OEMs",
  "robot categories",
  "robot OS",
  "simulation",
  "perception",
  "edge AI",
  "sensors",
  "actuators",
  "fleet management",
  "safety/compliance",
  "deployment integrators",
  "maintenance",
  "buyers",
  "bottlenecks",
  "opportunities"
];

function DatasetTable({ title, ids, datasets }: { title: string; ids: DomainId[]; datasets: GraphDataset[] }) {
  const datasetById = new Map(datasets.map((dataset) => [dataset.id, dataset]));
  const configById = new Map(datasetRegistry.map((dataset) => [dataset.id, dataset]));

  return (
    <section className="v2-panel data-table-panel">
      <div className="data-section-head">
        <h2>{title}</h2>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Dataset</th>
            <th>Status</th>
            <th>Default scoring</th>
            <th>Dashboard toggle</th>
            <th>Nodes</th>
            <th>Edges</th>
            <th>Opportunities</th>
            <th>Sources</th>
            <th>Warnings</th>
            <th>Graph path</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            const domain = domainOptions.find((option) => option.id === id);
            const dataset = datasetById.get(id);
            const config = configById.get(id);
            const stats = dataset ? calculateDatasetStats(dataset) : undefined;
            return (
              <tr key={id}>
                <td>
                  <strong>{domain?.label ?? id}</strong>
                  {domain?.reason && <span>{domain.reason}</span>}
                </td>
                <td><span className={`status-pill status-${domain?.status ?? "active"}`}>{domain?.status ?? "active"}</span></td>
                <td>{domain?.includedByDefault ? "Yes" : "No"}</td>
                <td>{domain?.includedInScoring && !domain.planned ? "Yes" : "No"}</td>
                <td>{stats?.nodes ?? "-"}</td>
                <td>{stats?.edges ?? "-"}</td>
                <td>{stats?.opportunities ?? "-"}</td>
                <td>{stats?.sources ?? "-"}</td>
                <td>{dataset?.validationWarnings.length ?? 0}</td>
                <td>{config?.graphPath ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export function DataPage({ datasets }: DataPageProps) {
  return (
    <div className="v2-doc-page data-page">
      <section className="v2-panel doc-hero">
        <h1>Dataset inventory</h1>
        <p>Raw JSON files remain unchanged. V2 derives scoring data in code from the loaded datasets and keeps planned domains out of scoring until graph JSON exists.</p>
      </section>

      <DatasetTable title="Active scoring domains" ids={defaultScoringDomainIds} datasets={datasets} />
      <DatasetTable title="Evidence domains" ids={evidenceDomainIds} datasets={datasets} />

      <section className="v2-panel planned-data-card">
        <span className="eyebrow">Planned</span>
        <h2>Robotics Execution Stack</h2>
        <dl className="coefficient-grid">
          <div><dt>Graph loaded</dt><dd>No</dd></div>
          <div><dt>Included in scoring</dt><dd>No</dd></div>
          <div><dt>Status</dt><dd>Not installed</dd></div>
          <div><dt>Reason</dt><dd>Graph JSON not available yet</dd></div>
        </dl>
        <h3>Expected future layers</h3>
        <div className="v2-chip-list">
          {expectedRoboticsLayers.map((layer) => <span key={layer}>{layer}</span>)}
        </div>
      </section>
    </div>
  );
}
