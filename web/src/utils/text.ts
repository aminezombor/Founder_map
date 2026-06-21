export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .toLowerCase()
    .trim();
}

export function truncate(value: string | undefined, length = 140): string {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length - 1).trim()}...` : value;
}

export function formatList(values: string[] | undefined, fallback = "Not specified"): string {
  return values?.length ? values.join(", ") : fallback;
}

export function markdownSummary(markdown?: string, maxLines = 10): string {
  if (!markdown) return "";
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("```"))
    .slice(0, maxLines)
    .join("\n");
}
