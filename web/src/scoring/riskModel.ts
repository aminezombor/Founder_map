export type RiskLevel = "low" | "medium" | "high";

export const riskDefinitions = {
  data_access_risk: {
    label: "Data access risk",
    low: "The wedge can start from public, sample, or easy-to-export operational data.",
    medium: "The wedge needs buyer data, but can be tested with a narrow pilot or sample workflow.",
    high: "The wedge depends on sensitive, proprietary, or hard-to-integrate operational data."
  },
  capital_intensity_risk: {
    label: "Capital intensity risk",
    low: "Software-first or analysis-first path with limited upfront spend.",
    medium: "Requires meaningful pilot effort, integration work, or specialist setup.",
    high: "Requires hardware, certification, facilities, or capital-heavy deployment before proof."
  },
  regulatory_risk: {
    label: "Regulatory risk",
    low: "Limited regulated surface and few approval dependencies.",
    medium: "Compliance matters, but proof can start inside a bounded workflow.",
    high: "Certification, safety, defence, legal, or procurement constraints can dominate timing."
  },
  sales_cycle_risk: {
    label: "Sales-cycle risk",
    low: "Clear buyer, urgent pain, and plausible lightweight pilot motion.",
    medium: "Buyer pain exists, but adoption likely needs workflow validation and budget mapping.",
    high: "Enterprise, public-sector, or strategic sales motion can slow validation."
  },
  incumbent_risk: {
    label: "Incumbent risk",
    low: "Weak incumbent pressure or room for a specialized wedge.",
    medium: "Some incumbent pressure, but differentiation can come from speed or focus.",
    high: "Large incumbents may compress pricing, distribution, or roadmap space."
  },
  operational_complexity_risk: {
    label: "Operational complexity risk",
    low: "Can be proven with a narrow workflow and low operational burden.",
    medium: "Needs integration with real operations or partner access.",
    high: "Deployment, support, safety, or multi-party coordination may dominate the business."
  }
} as const;

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 68) return "high";
  if (score >= 42) return "medium";
  return "low";
}
