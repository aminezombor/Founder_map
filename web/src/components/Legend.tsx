import { colorMeanings } from "../utils/colors";

const legendItems = ["green", "orange", "red", "blue", "purple", "grey"];

export function Legend() {
  return (
    <div className="legend" aria-label="Graph legend">
      {legendItems.map((color) => (
        <div key={color} className="legend-item">
          <span className={`swatch swatch-${color}`} />
          <span>{colorMeanings[color]}</span>
        </div>
      ))}
      <div className="legend-item">
        <span className="edge-sample solid" />
        <span>Known edge</span>
      </div>
      <div className="legend-item">
        <span className="edge-sample dashed" />
        <span>Inferred edge</span>
      </div>
    </div>
  );
}
