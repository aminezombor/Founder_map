# Global Aerospace Stack Database v0.1

Created: 2026-06-21

## What this is

A public-source strategic dependency graph for the global aerospace stack.

This is the fourth database for Founder Map / Strategic Dependency Graph.

It maps aircraft OEMs, engine/propulsion systems, Tier-1 suppliers, certification/regulation, MRO/aftermarket, air traffic operations, space launch, satellite systems, sustainability layers, software/data layers and strategic bottlenecks.

## Current counts

```text
nodes: 74
edges: 255
opportunities: 12
sources: 50
```

## What this database maps

- aircraft OEMs / airframers
- commercial and business aviation
- engine and propulsion suppliers
- CFM / GE / Safran / Rolls-Royce / Pratt & Whitney ecosystem
- Tier-1 avionics and systems suppliers
- aerostructures and materials
- landing gear and actuation
- MRO and aftermarket
- certification and regulation
- air traffic management and airline operations
- launch and space systems
- satellite operators and manufacturers
- sustainable aviation: SAF, hydrogen, electric/hybrid
- aerospace software, data and cybersecurity
- multi-tier supply-chain visibility

## Interpretation rules

1. `known` means directly supported by a public source.
2. `inferred` means a strategic dependency hypothesis, not a supplier-contract claim.
3. A dependency edge does not imply a direct commercial relationship unless explicitly sourced.
4. Use `confidence` and `fact_status` in the UI.
5. The graph should expose structural pressure points, not pretend to be complete.

## Strong early signals

1. Engine MRO, spare parts, castings/forgings, titanium/specialty materials and certification are major bottleneck zones.
2. Software opportunity is strongest around certification evidence, digital thread, supplier visibility, MRO intelligence, cyber assurance and operational disruption intelligence.
3. Europe has strong aerospace sovereignty through Airbus, Safran, Thales, Dassault, Leonardo, ArianeGroup, Arianespace, Eutelsat, SES, ESA and EASA.
4. The global stack remains highly concentrated around engines, avionics, certified electronics and key space-launch capacity.
5. The best founder opportunities are B2B infrastructure layers, not building aircraft.

## Top opportunity seeds

- Aerospace supplier dependency and quality-risk graph
- Certification evidence OS for aerospace software and hardware
- Engine MRO capacity and parts intelligence platform
- Aerospace spares and aftermarket FinOps
- Avionics and connected-aircraft cyber assurance layer
- SAF procurement and traceability platform
- Airspace disruption and airline operations intelligence
- Launch access and satellite deployment intelligence
- Ground segment and satellite operations observability
- Digital thread for aerospace SMEs and suppliers
- Hydrogen airport and aircraft-readiness assessment platform
- Aerospace opportunity radar for founders and investors

## Codex usage

Primary data file:

```text
data/global-aerospace-stack/v0.1/global_aerospace_stack_graph_v0.json
```

Recommended UI behavior:

- Add aerospace-domain filters.
- Highlight red bottlenecks: engine MRO, certification, materials, supply chain, launch cadence, aviation cyber.
- Add Europe/France lens.
- Show opportunity extraction from bottleneck connections.
- Make inferred edges visibly different from known edges.
