import type { DatasetConfig } from "../types/graph";

export const datasetRegistry: DatasetConfig[] = [
  {
    id: "eu-ai-stack",
    label: "EU AI Stack",
    shortLabel: "EU AI",
    graphPath: "/data/eu-ai-stack/v0.1/eu_ai_stack_graph_v0.json",
    readmePath: "/data/eu-ai-stack/v0.1/README.md",
    manifestPath: "/data/eu-ai-stack/v0.1/manifest.json",
    emphasis: ["Mistral AI", "Hugging Face", "EuroHPC", "AI Factories", "compute", "GPUs", "cloud", "regulation"],
    demoNodes: ["mistral_ai", "hugging_face", "eurohpc_ai_factories", "nvidia"]
  },
  {
    id: "global-ai-stack",
    label: "Global AI Stack",
    shortLabel: "Global AI",
    graphPath: "/data/global-ai-stack/v0.1/global_ai_stack_graph_v0.json",
    readmePath: "/data/global-ai-stack/v0.1/README.md",
    manifestPath: "/data/global-ai-stack/v0.1/manifest.json",
    emphasis: ["US AI Ecosystem", "European AI Ecosystem", "China AI Ecosystem", "Middle East AI Ecosystem", "GPU bottlenecks"],
    demoNodes: ["european_ai_ecosystem", "gpu_accelerator_compute_layer", "nvidia", "tsmc"]
  },
  {
    id: "european-defence-stack",
    label: "European Defence Stack",
    shortLabel: "EU Defence",
    graphPath: "/data/european-defence-stack/v0.1/european_defence_stack_graph_v0.json",
    readmePath: "/data/european-defence-stack/v0.1/README.md",
    manifestPath: "/data/european-defence-stack/v0.1/manifest.json",
    safetyBadge: true,
    emphasis: ["France/EU lens", "readiness", "industrial base", "supply-chain visibility", "non-operational public-source data"],
    demoNodes: ["supply_chain_visibility_gap", "thales", "dga", "aid", "airbus_defence_space"]
  },
  {
    id: "global-aerospace-stack",
    label: "Global Aerospace Stack",
    shortLabel: "Aerospace",
    graphPath: "/data/global-aerospace-stack/v0.1/global_aerospace_stack_graph_v0.json",
    readmePath: "/data/global-aerospace-stack/v0.1/README.md",
    manifestPath: "/data/global-aerospace-stack/v0.1/manifest.json",
    emphasis: ["airframers", "engines", "MRO", "certification", "aerospace software", "launch", "satellites"],
    demoNodes: ["engine_mro_capacity", "airbus", "safran", "easa"]
  },
  {
    id: "industrial-software-ot-stack",
    label: "Industrial Software / OT Stack",
    shortLabel: "Industrial OT",
    graphPath: "/data/industrial-software-ot-stack/v0.1/industrial_software_ot_stack_graph_v0.json",
    readmePath: "/data/industrial-software-ot-stack/v0.1/README.md",
    manifestPath: "/data/industrial-software-ot-stack/v0.1/manifest.json",
    emphasis: ["CAD/CAM", "PLM", "MES", "SCADA", "PLC", "OPC UA", "ISA/IEC 62443", "OT cybersecurity"],
    demoNodes: ["industrial_security_compliance_gap", "opc_ua", "isa_iec_62443", "digital_thread_breakage"]
  }
];

export function getDatasetConfig(id: string): DatasetConfig {
  return datasetRegistry.find((dataset) => dataset.id === id) ?? datasetRegistry[0];
}
