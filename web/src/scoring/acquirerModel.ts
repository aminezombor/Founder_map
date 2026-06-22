import type { DomainId } from "./scoringTypes";

export const acquirerCategories = [
  "industrial software vendors",
  "automation vendors",
  "cloud providers",
  "AI platforms",
  "industrial cybersecurity companies",
  "PLM / CAD / simulation vendors",
  "ERP / supply chain vendors",
  "robotics OEMs",
  "system integrators",
  "defence/aerospace primes",
  "data platforms",
  "consulting / transformation firms"
] as const;

type AcquirerCategory = (typeof acquirerCategories)[number];

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

function addUnique(items: AcquirerCategory[], item: AcquirerCategory) {
  if (!items.includes(item)) items.push(item);
}

export function inferAcquirerCategories(input: {
  datasetId: DomainId;
  title: string;
  reason?: string;
  dependencyTypes: string[];
  buyerTypes: string[];
  nodeText: string;
}): string[] {
  const text = [
    input.datasetId,
    input.title,
    input.reason,
    input.nodeText,
    input.dependencyTypes.join(" "),
    input.buyerTypes.join(" ")
  ]
    .join(" ")
    .toLowerCase();
  const categories: AcquirerCategory[] = [];

  if (includesAny(text, ["ai", "model", "gpu", "compute", "inference", "rag", "agent"])) {
    addUnique(categories, "AI platforms");
    addUnique(categories, "cloud providers");
    addUnique(categories, "data platforms");
  }

  if (includesAny(text, ["factory", "industrial", "ot", "plc", "scada", "mes", "opc", "automation"])) {
    addUnique(categories, "industrial software vendors");
    addUnique(categories, "automation vendors");
    addUnique(categories, "system integrators");
  }

  if (includesAny(text, ["iec", "62443", "cyber", "security", "compliance", "governance"])) {
    addUnique(categories, "industrial cybersecurity companies");
    addUnique(categories, "system integrators");
  }

  if (includesAny(text, ["cad", "plm", "simulation", "digital thread", "bom", "engineering"])) {
    addUnique(categories, "PLM / CAD / simulation vendors");
  }

  if (includesAny(text, ["supplier", "supply", "procurement", "dependency", "inventory", "erp"])) {
    addUnique(categories, "ERP / supply chain vendors");
    addUnique(categories, "data platforms");
    addUnique(categories, "consulting / transformation firms");
  }

  if (includesAny(text, ["robot", "robotics", "fleet", "autonomy"])) {
    addUnique(categories, "robotics OEMs");
    addUnique(categories, "automation vendors");
  }

  if (input.datasetId === "european-defence-stack" || input.datasetId === "global-aerospace-stack") {
    addUnique(categories, "defence/aerospace primes");
    addUnique(categories, "system integrators");
  }

  if (includesAny(text, ["transformation", "readiness", "assessment", "benchmark", "audit"])) {
    addUnique(categories, "consulting / transformation firms");
  }

  if (!categories.length) {
    addUnique(categories, "industrial software vendors");
    addUnique(categories, "data platforms");
    addUnique(categories, "consulting / transformation firms");
  }

  return categories.slice(0, 5);
}
