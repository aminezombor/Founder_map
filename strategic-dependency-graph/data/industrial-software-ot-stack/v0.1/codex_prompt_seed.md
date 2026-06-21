# Codex Prompt Seed — Industrial Software / OT Stack v0.1

Extend the Strategic Dependency Graph UI to support the Industrial Software / OT Stack dataset.

Use:

```text
data/industrial-software-ot-stack/v0.1/industrial_software_ot_stack_graph_v0.json
```

## Required dataset selector

Add:

```text
EU AI Stack
Global AI Stack
European Defence Stack
Global Aerospace Stack
Industrial Software / OT Stack
```

## Required filters

Add industrial-specific filters:

- CAD / CAM
- CAE / simulation
- PLM / ALM / MBSE
- MES / MOM
- SCADA / HMI
- PLC / control runtime
- industrial connectivity
- industrial DataOps
- digital twin / virtual twin
- industrial AI / agents
- OT cybersecurity
- industrial cloud / edge
- ERP / supply chain
- maintenance / reliability
- frontline operations
- quality / traceability
- standards
- bottlenecks
- Europe / France lens
- cross-database references

## Visual priorities

Red nodes/edges are strategic bottlenecks:

- Brownfield Integration Gap
- IT / OT Semantic Gap
- Industrial Vendor Lock-in
- OT Cyber Asset Visibility Gap
- Industrial Data Quality Gap
- Digital Thread Breakage
- Simulation-to-Shopfloor Gap
- Industrial AI Trust Gap
- IEC 62443 Evidence Gap
- Industrial Change Management Gap

Blue nodes are standards/enablers:

- OPC UA
- ISA-95
- ISA/IEC 62443
- MQTT Sparkplug
- Unified Namespace
- Digital Thread
- Industrial Ontology / Asset Model

Green nodes are Europe/France strengths:

- Siemens Xcelerator
- Dassault Systèmes 3DEXPERIENCE
- Schneider Electric EcoStruxure / AVEVA
- ABB Ability
- Beckhoff
- Bosch Rexroth ctrlX
- CODESYS
- SAP Digital Manufacturing
- Hexagon Manufacturing Intelligence
- Cognite

## Required panels

1. Graph canvas
2. Industrial layer filter
3. Standards / architecture filter
4. Europe / France lens
5. Cross-database reference panel
6. Node/edge detail panel
7. Opportunity panel
8. Bottleneck interpretation panel
9. Source ledger panel

## Critical behavior

- Always show `fact_status`.
- Never present inferred edges as confirmed vendor integrations or supplier contracts.
- Make standards visibly separate from vendors.
- Show how industrial software connects AI, defence and aerospace.
- Make red bottlenecks visually obvious.
- Opportunity extraction should feel derived from cross-stack industrial bottlenecks.

## First demo path

Click:

```text
Industrial Software / OT Stack
```

Show:

- CAD / CAM Layer
- CAE / Simulation Layer
- PLM / ALM / MBSE Layer
- MES / MOM Layer
- SCADA / HMI Layer
- PLC / Control Runtime Layer
- Industrial Connectivity Layer
- Industrial DataOps Layer
- OT Cybersecurity Layer

## Second demo path

Click:

```text
Europe / France lens
```

Show:

- Siemens Xcelerator
- Dassault Systèmes 3DEXPERIENCE
- Schneider Electric / AVEVA
- ABB
- Beckhoff
- Bosch Rexroth ctrlX
- SAP Digital Manufacturing
- CODESYS
- Cognite
- Hexagon

## Third demo path

Click:

```text
Digital Thread Breakage
```

Show opportunities:

- Frontline-to-digital-thread work instruction platform
- Simulation-to-MES bridge for validated production change
- Industrial dependency graph OS
- Digital thread for cross-stack critical suppliers

## Fourth demo path

Click:

```text
IEC 62443 Evidence Gap
```

Show opportunities:

- IEC 62443 continuous evidence and patch-status platform
- PLC and machine-parameter change-control vault
- OT asset intelligence for procurement and cyber insurance

## Design tone

Strategic intelligence console.
Industrial reality.
Cross-stack opportunity extraction.
No generic dashboard energy.
This is where the real economy becomes visible.
