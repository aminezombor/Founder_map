import type { DatasetConfig, GraphDataset } from "../types/graph";
import { markdownSummary } from "../utils/text";
import { BottleneckPanel } from "./BottleneckPanel";
import { SafetyBadge } from "./SafetyBadge";

export function DatasetPanel({ dataset, config }: { dataset: GraphDataset; config: DatasetConfig }) {
  return (
    <div className="panel-scroll dataset-panel">
      {config.safetyBadge && <SafetyBadge />}

      <section>
        <h3>Manifest</h3>
        <dl className="detail-grid">
          <div>
            <dt>Database</dt>
            <dd>{dataset.manifest.database || dataset.label}</dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>{dataset.manifest.version || "0.1"}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{dataset.manifest.created || "-"}</dd>
          </div>
          <div>
            <dt>Sources</dt>
            <dd>{dataset.sources.length}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h3>Interpretation</h3>
        <p>
          Known edges are directly supported by public sources. Inferred edges are strategic dependency hypotheses, not
          confirmed supplier contracts.
        </p>
        {dataset.manifest.safety_scope && <p>{dataset.manifest.safety_scope}</p>}
      </section>

      <section>
        <h3>Dataset emphasis</h3>
        <div className="chip-wrap">
          {config.emphasis.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </section>

      {dataset.readme && (
        <section>
          <h3>README summary</h3>
          <pre className="readme-summary">{markdownSummary(dataset.readme, 12)}</pre>
        </section>
      )}

      <BottleneckPanel dataset={dataset} />

      <section>
        <h3>Validation</h3>
        {dataset.validationWarnings.length ? (
          <div className="warning-list">
            {dataset.validationWarnings.map((warning, index) => (
              <div key={`${warning.ownerId}-${warning.missingId}-${index}`} className="warning-row">
                <strong>{warning.kind}</strong>
                <span>{warning.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No validation warnings for local references.</p>
        )}
      </section>
    </div>
  );
}
