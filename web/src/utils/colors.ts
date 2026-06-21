import type { SemanticColor } from "../types/graph";

export const colorMeanings: Record<string, string> = {
  green: "Sovereign / controlled / resilient",
  orange: "Dependent / exposed / replaceable with effort",
  red: "Critical bottleneck / dangerous dependency",
  blue: "Strategic enabler / institution / standard / infrastructure",
  purple: "Opportunity / whitespace",
  grey: "Unknown / low-confidence data",
  gray: "Unknown / low-confidence data"
};

const semanticPalette: Record<string, { light: string; dark: string }> = {
  green: { light: "#16875f", dark: "#45d18f" },
  orange: { light: "#c56a10", dark: "#f4a340" },
  red: { light: "#cf334b", dark: "#ff6175" },
  blue: { light: "#2878d8", dark: "#61a6ff" },
  purple: { light: "#8557df", dark: "#b48cff" },
  grey: { light: "#758093", dark: "#9aa6b8" },
  gray: { light: "#758093", dark: "#9aa6b8" }
};

export function getColorMeaning(color?: SemanticColor): string {
  return colorMeanings[String(color ?? "grey").toLowerCase()] ?? colorMeanings.grey;
}

export function getSemanticColor(color: SemanticColor | undefined, theme: "light" | "dark"): string {
  return semanticPalette[String(color ?? "grey").toLowerCase()]?.[theme] ?? semanticPalette.grey[theme];
}

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getFactStatusStyle(factStatus?: string): { label: string; dash: number[]; className: string } {
  const normalized = String(factStatus ?? "unknown").toLowerCase();
  if (normalized === "known") {
    return { label: "Known", dash: [], className: "fact-known" };
  }
  if (normalized === "inferred") {
    return { label: "Inferred", dash: [8, 5], className: "fact-inferred" };
  }
  return { label: "Unspecified", dash: [2, 6], className: "fact-unknown" };
}
