import type { GraphEdge, GraphNode, Opportunity } from "../types/graph";
import type { DomainId } from "./scoringTypes";
import { computeEvidenceStrength } from "./graphEvidence";
import { phaseDefinitions } from "./phaseModel";
import { riskDefinitions } from "./riskModel";

export { computeEvidenceStrength as evidenceStrengthRules, phaseDefinitions, riskDefinitions };

export type OpportunityArchetypeId =
  | "ai_readiness"
  | "dependency_graph"
  | "compliance_evidence"
  | "industrial_dataops"
  | "ot_security"
  | "procurement_intelligence"
  | "model_routing"
  | "infrastructure_finops"
  | "simulation_to_execution"
  | "robotics_readiness_future"
  | "supply_chain_visibility"
  | "certification_traceability"
  | "marketplace_intelligence"
  | "generic_platform";

export interface OpportunityArchetype {
  id: OpportunityArchetypeId;
  label: string;
  firstWedgeTemplate: string;
  expansionPathTemplate: string;
  proofSignals: string[];
  likelyBuyers: string[];
  likelyAcquirers: string[];
  commonRisks: string[];
  whyItScoresTemplate: string;
}

export const opportunityArchetypes: Record<OpportunityArchetypeId, OpportunityArchetype> = {
  ai_readiness: {
    id: "ai_readiness",
    label: "AI readiness",
    firstWedgeTemplate:
      "Start with a diagnostic that tells one industrial operator exactly what blocks AI deployment: data quality, asset context, security, workflow readiness, and integration gaps.",
    expansionPathTemplate:
      "Expand from diagnostic into remediation workflows, data-quality monitoring, AI deployment governance, and continuous industrial AI readiness scoring.",
    proofSignals: ["readiness audit", "sample data review", "workflow demo", "buyer pain interview"],
    likelyBuyers: ["industrial operators", "AI transformation teams", "manufacturers", "consultancies"],
    likelyAcquirers: ["AI platforms", "cloud providers", "industrial software vendors", "consulting / transformation firms"],
    commonRisks: ["data_access_risk", "sales_cycle_risk", "incumbent_risk"],
    whyItScoresTemplate: "AI readiness opportunities score when deployment blockers are graph-visible and a diagnostic wedge can create fast proof."
  },
  dependency_graph: {
    id: "dependency_graph",
    label: "Dependency graph",
    firstWedgeTemplate: "Start by mapping dependencies for one factory, supplier network, or critical operational workflow.",
    expansionPathTemplate:
      "Expand into continuous supplier-risk monitoring, procurement intelligence, compliance evidence, and cross-site dependency management.",
    proofSignals: ["dependency map", "risk heatmap", "supplier interview", "workflow bottleneck evidence"],
    likelyBuyers: ["procurement teams", "supply-chain teams", "industrial operators", "risk teams"],
    likelyAcquirers: ["ERP / supply chain vendors", "data platforms", "consulting / transformation firms"],
    commonRisks: ["data_access_risk", "sales_cycle_risk", "operational_complexity_risk"],
    whyItScoresTemplate: "Dependency graph opportunities score when affected nodes connect to bottlenecks, suppliers, or high-risk edges."
  },
  compliance_evidence: {
    id: "compliance_evidence",
    label: "Compliance evidence",
    firstWedgeTemplate: "Start with evidence collection and audit readiness for one compliance pain point.",
    expansionPathTemplate:
      "Expand into workflow remediation, continuous controls, vendor accountability, and governance dashboards.",
    proofSignals: ["audit packet", "evidence checklist", "control gap report", "regulatory workflow interview"],
    likelyBuyers: ["regulated enterprises", "security teams", "compliance teams", "system integrators"],
    likelyAcquirers: ["industrial cybersecurity companies", "system integrators", "consulting / transformation firms"],
    commonRisks: ["regulatory_risk", "sales_cycle_risk", "incumbent_risk"],
    whyItScoresTemplate: "Compliance evidence opportunities score when regulation, assurance, or source-backed proof is central to the bottleneck."
  },
  industrial_dataops: {
    id: "industrial_dataops",
    label: "Industrial dataops",
    firstWedgeTemplate:
      "Start with one messy industrial data flow and make it usable: naming, units, lineage, missing metadata, and context.",
    expansionPathTemplate:
      "Expand into a contextual industrial data layer that powers analytics, AI readiness, quality, and operations intelligence.",
    proofSignals: ["dirty data sample", "lineage demo", "asset-context map", "operator workflow validation"],
    likelyBuyers: ["manufacturers", "industrial software teams", "data teams", "operations leaders"],
    likelyAcquirers: ["industrial software vendors", "data platforms", "automation vendors"],
    commonRisks: ["data_access_risk", "operational_complexity_risk", "sales_cycle_risk"],
    whyItScoresTemplate: "Industrial dataops opportunities score when graph nodes expose messy data, ontology, integration, or quality gaps."
  },
  ot_security: {
    id: "ot_security",
    label: "OT security",
    firstWedgeTemplate: "Start with OT asset visibility and risk evidence for one site or one critical process.",
    expansionPathTemplate:
      "Expand into continuous OT governance, vulnerability workflows, procurement intelligence, and compliance evidence.",
    proofSignals: ["asset inventory", "risk evidence report", "site workflow map", "security gap demo"],
    likelyBuyers: ["OT security teams", "industrial operators", "CISOs", "automation vendors"],
    likelyAcquirers: ["industrial cybersecurity companies", "automation vendors", "system integrators"],
    commonRisks: ["data_access_risk", "regulatory_risk", "operational_complexity_risk"],
    whyItScoresTemplate: "OT security opportunities score when assets, runtime, compliance, or cyber-risk edges cluster around the opportunity."
  },
  procurement_intelligence: {
    id: "procurement_intelligence",
    label: "Procurement intelligence",
    firstWedgeTemplate: "Start with one buyer workflow that turns supplier dependency and replacement risk into procurement action.",
    expansionPathTemplate: "Expand into supplier monitoring, substitution planning, sourcing intelligence, and strategic resilience dashboards.",
    proofSignals: ["supplier risk list", "replacement map", "procurement workflow interview", "source-backed risk brief"],
    likelyBuyers: ["procurement teams", "supply-chain leaders", "risk teams", "public-sector buyers"],
    likelyAcquirers: ["ERP / supply chain vendors", "data platforms", "consulting / transformation firms"],
    commonRisks: ["data_access_risk", "sales_cycle_risk", "incumbent_risk"],
    whyItScoresTemplate: "Procurement intelligence opportunities score when dependency risk can become a repeatable buying workflow."
  },
  model_routing: {
    id: "model_routing",
    label: "Model routing",
    firstWedgeTemplate: "Start with a routing, benchmarking, or governance layer for one high-cost AI workload.",
    expansionPathTemplate: "Expand into model operations, spend governance, reliability monitoring, and enterprise AI control planes.",
    proofSignals: ["benchmark result", "cost comparison", "routing demo", "model governance workflow"],
    likelyBuyers: ["AI teams", "platform engineering", "cloud buyers", "regulated enterprises"],
    likelyAcquirers: ["AI platforms", "cloud providers", "data platforms"],
    commonRisks: ["incumbent_risk", "data_access_risk", "sales_cycle_risk"],
    whyItScoresTemplate: "Model routing opportunities score when compute, model, governance, and cost bottlenecks are connected."
  },
  infrastructure_finops: {
    id: "infrastructure_finops",
    label: "Infrastructure finops",
    firstWedgeTemplate: "Start with visibility into one expensive compute, cloud, or infrastructure allocation problem.",
    expansionPathTemplate: "Expand into allocation governance, commitments, benchmarking, purchasing intelligence, and workload optimization.",
    proofSignals: ["spend analysis", "allocation dashboard", "benchmark demo", "buyer cost interview"],
    likelyBuyers: ["cloud buyers", "AI infrastructure teams", "finance teams", "platform teams"],
    likelyAcquirers: ["cloud providers", "AI platforms", "data platforms"],
    commonRisks: ["incumbent_risk", "sales_cycle_risk", "data_access_risk"],
    whyItScoresTemplate: "Infrastructure finops opportunities score when allocation pain is tied to high-criticality compute or cloud dependencies."
  },
  simulation_to_execution: {
    id: "simulation_to_execution",
    label: "Simulation to execution",
    firstWedgeTemplate: "Start with a validation bridge between simulated planning and one real operational execution workflow.",
    expansionPathTemplate: "Expand into digital-thread validation, operational simulation, deployment governance, and continuous feedback loops.",
    proofSignals: ["simulation gap report", "deployment validation demo", "operator feedback loop", "integration map"],
    likelyBuyers: ["engineering teams", "aerospace operators", "industrial operators", "system integrators"],
    likelyAcquirers: ["PLM / CAD / simulation vendors", "industrial software vendors", "defence/aerospace primes"],
    commonRisks: ["operational_complexity_risk", "capital_intensity_risk", "sales_cycle_risk"],
    whyItScoresTemplate: "Simulation-to-execution opportunities score when simulation, digital thread, or operational deployment nodes are central."
  },
  robotics_readiness_future: {
    id: "robotics_readiness_future",
    label: "Robotics readiness future",
    firstWedgeTemplate: "Start with a robotics deployment-readiness assessment, not hardware.",
    expansionPathTemplate:
      "Expand into robot fleet operations, simulation-to-real validation, maintenance intelligence, and safety/compliance evidence.",
    proofSignals: ["deployment readiness checklist", "site workflow map", "safety gap review", "integration path"],
    likelyBuyers: ["industrial operators", "robotics teams", "automation vendors", "system integrators"],
    likelyAcquirers: ["robotics OEMs", "automation vendors", "industrial software vendors"],
    commonRisks: ["capital_intensity_risk", "operational_complexity_risk", "regulatory_risk"],
    whyItScoresTemplate: "Robotics readiness opportunities are future-facing until the robotics graph exists; they should begin as assessment wedges."
  },
  supply_chain_visibility: {
    id: "supply_chain_visibility",
    label: "Supply-chain visibility",
    firstWedgeTemplate: "Start with visibility for one fragile input, supplier tier, or operational dependency.",
    expansionPathTemplate: "Expand into monitoring, resilience planning, procurement workflows, and cross-site dependency management.",
    proofSignals: ["supplier map", "risk feed", "inventory dependency analysis", "buyer validation"],
    likelyBuyers: ["supply-chain teams", "procurement teams", "industrial operators", "risk teams"],
    likelyAcquirers: ["ERP / supply chain vendors", "data platforms", "consulting / transformation firms"],
    commonRisks: ["data_access_risk", "sales_cycle_risk", "operational_complexity_risk"],
    whyItScoresTemplate: "Supply-chain visibility opportunities score when dependency paths and replacement risk are visible in the graph."
  },
  certification_traceability: {
    id: "certification_traceability",
    label: "Certification traceability",
    firstWedgeTemplate: "Start with traceability for one certification, quality, or safety evidence workflow.",
    expansionPathTemplate: "Expand into digital thread, supplier accountability, compliance automation, and lifecycle evidence systems.",
    proofSignals: ["traceability packet", "quality evidence demo", "certification workflow map", "audit interview"],
    likelyBuyers: ["quality teams", "regulated manufacturers", "aerospace teams", "defence primes"],
    likelyAcquirers: ["PLM / CAD / simulation vendors", "defence/aerospace primes", "industrial software vendors"],
    commonRisks: ["regulatory_risk", "sales_cycle_risk", "operational_complexity_risk"],
    whyItScoresTemplate: "Certification traceability opportunities score when evidence, quality, and lifecycle nodes create unavoidable workflow pain."
  },
  marketplace_intelligence: {
    id: "marketplace_intelligence",
    label: "Marketplace intelligence",
    firstWedgeTemplate: "Start with intelligence for one constrained market: price, supply, quality, allocation, or substitution.",
    expansionPathTemplate: "Expand into decision support, procurement workflows, benchmarking, and marketplace orchestration.",
    proofSignals: ["market map", "benchmark", "buyer call", "allocation or substitute analysis"],
    likelyBuyers: ["procurement teams", "platform buyers", "AI infrastructure teams", "operators"],
    likelyAcquirers: ["cloud providers", "ERP / supply chain vendors", "data platforms"],
    commonRisks: ["data_access_risk", "incumbent_risk", "sales_cycle_risk"],
    whyItScoresTemplate: "Marketplace intelligence opportunities score when supply/demand asymmetry and buyer urgency are explicit."
  },
  generic_platform: {
    id: "generic_platform",
    label: "Generic platform",
    firstWedgeTemplate: "Start with one small, demonstrable workflow tied to a visible bottleneck.",
    expansionPathTemplate: "Expand from the wedge workflow into a repeatable data layer, then a broader operating platform.",
    proofSignals: ["workflow demo", "buyer interview", "source-backed problem brief", "prototype"],
    likelyBuyers: ["operators", "platform teams", "strategy teams", "consultancies"],
    likelyAcquirers: ["industrial software vendors", "data platforms", "consulting / transformation firms"],
    commonRisks: ["sales_cycle_risk", "data_access_risk", "incumbent_risk"],
    whyItScoresTemplate: "Generic platform opportunities score when graph evidence supports a narrow wedge and credible expansion path."
  }
};

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function buildOpportunityText(input: {
  datasetId: DomainId;
  opportunity: Opportunity;
  affectedNodes: GraphNode[];
  connectedEdges: GraphEdge[];
}): string {
  return [
    input.datasetId,
    input.opportunity.title,
    input.opportunity.reason,
    input.opportunity.type,
    input.opportunity.dependency_types.join(" "),
    input.opportunity.buyer_types.join(" "),
    input.affectedNodes.map((node) => `${node.name} ${node.type} ${node.sector.join(" ")} ${node.tags.join(" ")}`).join(" "),
    input.connectedEdges.map((edge) => `${edge.type} ${edge.dependency_category} ${edge.reason} ${edge.tags.join(" ")}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

export function matchOpportunityArchetype(input: {
  datasetId: DomainId;
  opportunity: Opportunity;
  affectedNodes: GraphNode[];
  connectedEdges: GraphEdge[];
}): OpportunityArchetype {
  const text = buildOpportunityText(input);

  if (hasAny(text, ["robot", "robotics", "fleet ops", "fleet operation"])) return opportunityArchetypes.robotics_readiness_future;
  if (hasAny(text, ["ot security", "iec 62443", "cyber", "plc", "scada", "runtime"])) return opportunityArchetypes.ot_security;
  if (hasAny(text, ["compliance", "governance", "audit", "evidence", "certification"])) {
    if (hasAny(text, ["traceability", "quality", "digital thread", "certification"])) return opportunityArchetypes.certification_traceability;
    return opportunityArchetypes.compliance_evidence;
  }
  if (hasAny(text, ["ontology", "asset model", "data quality", "dataops", "lineage", "metadata", "industrial data"])) return opportunityArchetypes.industrial_dataops;
  if (hasAny(text, ["ai readiness", "readiness", "ai deployment", "industrial ai", "trust gap"])) return opportunityArchetypes.ai_readiness;
  if (hasAny(text, ["model routing", "routing", "inference", "model platform", "rag", "frontier model"])) return opportunityArchetypes.model_routing;
  if (hasAny(text, ["gpu", "compute", "cloud spend", "allocation", "finops", "infrastructure"])) return opportunityArchetypes.infrastructure_finops;
  if (hasAny(text, ["simulation", "digital twin", "digital thread", "sim-to-real"])) return opportunityArchetypes.simulation_to_execution;
  if (hasAny(text, ["supplier", "supply chain", "dependency", "substitute", "replaceability"])) {
    if (hasAny(text, ["procurement", "sourcing", "supplier data"])) return opportunityArchetypes.procurement_intelligence;
    return opportunityArchetypes.supply_chain_visibility;
  }
  if (hasAny(text, ["marketplace", "market intelligence", "price", "capacity", "allocation"])) return opportunityArchetypes.marketplace_intelligence;
  if (hasAny(text, ["graph", "dependency map", "dependency intelligence"])) return opportunityArchetypes.dependency_graph;
  return opportunityArchetypes.generic_platform;
}

export function renderArchetypeText(template: string, opportunity: Opportunity, affectedNodes: GraphNode[]): string {
  const nodeFocus = affectedNodes.slice(0, 2).map((node) => node.name).join(" and ");
  return template
    .replaceAll("{title}", opportunity.title)
    .replaceAll("{focus}", nodeFocus || opportunity.title)
    .replaceAll("{type}", opportunity.type || "opportunity");
}
