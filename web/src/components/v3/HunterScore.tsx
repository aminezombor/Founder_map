interface HunterScoreProps {
  value: number;
  label?: string;
  tone?: "green" | "blue" | "orange" | "purple" | "teal" | "red";
}

export function HunterScore({ value, label, tone = "green" }: HunterScoreProps) {
  const rounded = Math.round(value);
  return (
    <span className={`hunter-score tone-${tone}`}>
      <strong>{rounded}</strong>
      <span aria-hidden><i style={{ width: `${Math.max(0, Math.min(100, rounded))}%` }} /></span>
      {label && <em>{label}</em>}
    </span>
  );
}
