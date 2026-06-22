import type { GraphDataset } from "../../types/graph";
import { calculateDatasetStats } from "../../utils/graphSelectors";
import { domainOptions } from "../../scoring/scoringTypes";

interface DataPageProps {
  datasets: GraphDataset[];
}

export function DataPage({ datasets }: DataPageProps) {
  const datasetById = new Map(datasets.map((dataset) => [dataset.id, dataset]));

  return (
    <div className="v2-doc-page">
      <section className="v2-panel doc-hero">
        <h1>Dataset inventory</h1>
        <p>Raw JSON files remain unchanged. V2 derives scoring data in code from the loaded datasets.</p>
      </section>
      <section className="v2-panel data-table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dataset</th>
              <th>Status</th>
              <th>Default scoring</th>
              <th>Nodes</th>
              <th>Edges</th>
              <th>Opportunities</th>
              <th>Sources</th>
              <th>Warnings</th>
            </tr>
          </thead>
          <tbody>
            {domainOptions.map((domain) => {
              const dataset = datasetById.get(domain.id);
              const stats = dataset ? calculateDatasetStats(dataset) : undefined;
              return (
                <tr key={domain.id}>
                  <td>
                    <strong>{domain.label}</strong>
                    {domain.reason && <span>{domain.reason}</span>}
                  </td>
                  <td><span className={`status-pill status-${domain.status}`}>{domain.status}</span></td>
                  <td>{domain.includedByDefault ? "Yes" : "No"}</td>
                  <td>{stats?.nodes ?? "-"}</td>
                  <td>{stats?.edges ?? "-"}</td>
                  <td>{stats?.opportunities ?? "-"}</td>
                  <td>{stats?.sources ?? "-"}</td>
                  <td>{dataset?.validationWarnings.length ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
