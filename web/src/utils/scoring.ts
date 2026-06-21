export function priorityLabel(score?: number | null): string {
  const value = score ?? 0;
  if (value >= 80) return "High priority";
  if (value >= 60) return "Strong signal";
  if (value >= 40) return "Explore";
  return "Weak / later";
}

export function formatScore(score?: number | null): string {
  return typeof score === "number" ? score.toFixed(score % 1 === 0 ? 0 : 1) : "n/a";
}

export function scorePercent(value?: number | null, max = 5): number {
  if (typeof value !== "number") return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}
