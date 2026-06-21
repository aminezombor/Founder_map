# Codex Prompt Seed — Global Aerospace Stack v0.1

Extend the Strategic Dependency Graph UI to support the Global Aerospace Stack dataset.

Use:

```text
data/global-aerospace-stack/v0.1/global_aerospace_stack_graph_v0.json
```

## Required dataset selector

Add:

```text
EU AI Stack
Global AI Stack
European Defence Stack
Global Aerospace Stack
```

## Required filters

Add aerospace-specific filters:

- aircraft OEMs
- engine suppliers
- Tier-1 suppliers
- aerostructures
- avionics
- MRO / aftermarket
- certification
- air traffic / operations
- space launch
- satellite systems
- sustainable aviation
- software/data/cyber
- bottlenecks
- Europe / France lens

## Visual priorities

Red nodes/edges are strategic bottlenecks:

- Engine MRO Capacity
- Castings / Forgings Capacity
- Titanium / Specialty Metals Dependency
- Semiconductor / Avionics Electronics Dependency
- Certification Bottleneck
- Quality Escape / Traceability Risk
- SAF Supply Constraint
- Aviation Cybersecurity Risk
- Launch Cadence / Range Constraint
- Aerospace Supply Chain Visibility Layer

Blue nodes are strategic enablers:

- EASA
- FAA
- ICAO
- EUROCONTROL
- ESA
- Airbus
- Safran
- Thales
- ArianeGroup
- Arianespace
- CFM International

Green nodes are Europe/France strengths:

- Airbus
- Safran Aircraft Engines
- Safran
- Dassault Aviation
- Thales Aerospace
- ArianeGroup
- Arianespace
- Airbus Space Systems
- Eutelsat
- SES
- EASA
- ESA

## Required panels

1. Graph canvas
2. Aerospace-domain layer filter
3. Europe / France lens
4. Node/edge detail panel
5. Opportunity panel
6. Source ledger panel
7. Bottleneck interpretation panel

## Critical behavior

- Always show `fact_status`.
- Never present inferred edges as confirmed supplier contracts.
- Make bottlenecks visually obvious.
- Opportunity extraction should feel derived from bottleneck structure.
- Make engine/MRO/certification/materials/supply-chain pressure easy to see.

## First demo path

Click:

```text
Global Aerospace Stack
```

Show:

- Airframer / OEM Layer
- Engine / Propulsion Layer
- MRO / Aftermarket Layer
- Certification / Regulation Layer
- Space Launch Layer
- Aerospace Software / Data Layer

## Second demo path

Click:

```text
Europe / France lens
```

Show:

- Airbus
- Safran
- Safran Aircraft Engines
- CFM International
- Dassault Aviation
- Thales Aerospace
- ArianeGroup
- Arianespace
- Airbus Space Systems
- EASA
- ESA
- Eutelsat

## Third demo path

Click:

```text
Engine MRO Capacity
```

Show opportunities:

- Engine MRO capacity and parts intelligence platform
- Aerospace spares and aftermarket FinOps
- Aerospace supplier dependency and quality-risk graph

## Design tone

Strategic intelligence console.
Global aerospace reality.
Certification-aware.
Supply-chain aware.
Founder opportunity extraction from industrial bottlenecks.
