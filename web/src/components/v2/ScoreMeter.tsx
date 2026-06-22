interface ScoreMeterProps {
  value: number;
  label?: string;
  tone?: "green" | "blue" | "orange" | "purple" | "teal";
  compact?: boolean;
}

export function ScoreMeter({ value, label, tone = "green", compact = false }: ScoreMeterProps) {
  const rounded = Math.round(value);
  return (
    <span className={`score-meter tone-${tone}${compact ? " compact" : ""}`}>
      <span className="score-value">
        {rounded}
        {!compact && <small>/100</small>}
      </span>
      <span className="score-track" aria-hidden>
        <span style={{ width: `${Math.max(0, Math.min(100, rounded))}%` }} />
      </span>
      {label && <span className="sr-only">{label}: {rounded}</span>}
    </span>
  );
}
