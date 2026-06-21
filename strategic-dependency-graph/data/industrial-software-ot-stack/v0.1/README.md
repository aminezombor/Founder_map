# Industrial Software / OT Stack Database v0.1

Created: 2026-06-21

## What this is

A public-source strategic dependency graph for industrial software, operational technology, automation, simulation and industrial data.

This is the fifth database for Founder Map / Strategic Dependency Graph.

It is the cross-cutting layer that connects the previous databases:

- EU AI Stack
- Global AI Stack
- European Defence Stack
- Global Aerospace Stack

## Current counts

```text
nodes: 81
edges: 262
opportunities: 12
sources: 48
```

## What this database maps

- CAD / CAM
- CAE / simulation
- PLM / ALM / MBSE
- MES / MOM
- SCADA / HMI
- PLC / control runtime
- industrial connectivity
- OPC UA / MQTT / Sparkplug
- industrial DataOps and contextualization
- digital twin / virtual twin
- industrial AI / agents
- OT cybersecurity
- industrial cloud / edge
- ERP and supply-chain integration
- maintenance and reliability
- frontline operations
- low-code industrial apps
- quality and traceability
- industrial standards and governance

## Interpretation rules

1. `known` means directly supported by a public source.
2. `inferred` means a strategic dependency hypothesis, not a supplier-contract claim.
3. A dependency edge does not imply a direct commercial relationship unless explicitly sourced.
4. Use `confidence` and `fact_status` in the UI.
5. This layer is cross-cutting: it should connect AI, defence, aerospace, factories, energy and infrastructure.

## Strong early signals

1. Industrial software is the hidden operating layer of the real economy.
2. The key bottlenecks are not only machines; they are data context, integration, compliance evidence, digital thread breakage, OT visibility, change control and frontline adoption.
3. Europe is structurally strong through Siemens, Dassault Systèmes, Schneider Electric / AVEVA, ABB, Beckhoff, Bosch Rexroth, SAP, Hexagon, CODESYS and Cognite.
4. US hyperscalers dominate industrial cloud/AI infrastructure, while European vendors are stronger in engineering, automation, PLM, digital twin and industrial operations.
5. The most founder-buildable opportunities are integration layers, evidence layers, DataOps layers, OT governance, digital thread tooling and AI-readiness tooling.

## Top opportunity seeds

- Industrial dependency graph OS for factories and critical suppliers
- IEC 62443 continuous evidence and patch-status platform
- Unified Namespace builder and data-quality monitor
- Brownfield machine connector marketplace
- AI-ready factory score and remediation engine
- Simulation-to-MES bridge for validated production change
- PLC and machine-parameter change-control vault
- Frontline-to-digital-thread work instruction platform
- OT asset intelligence for procurement and cyber insurance
- Machine-level energy and emissions digital twin
- Industrial vendor-lock-in translator and migration assistant
- Industrial software opportunity engine for founders and investors

## Codex usage

Primary data file:

```text
data/industrial-software-ot-stack/v0.1/industrial_software_ot_stack_graph_v0.json
```

Recommended UI behavior:

- Add cross-database references.
- Add industrial layer filters.
- Highlight standards: OPC UA, ISA-95, ISA/IEC 62443, Sparkplug.
- Highlight red bottlenecks: Brownfield Integration Gap, OT Cyber Asset Visibility Gap, Digital Thread Breakage, Industrial Data Quality Gap, IEC 62443 Evidence Gap.
- Add Europe / France lens.
- Show opportunities as extracted from cross-stack bottlenecks.
