# European Defence Stack Database v0.1

This is the third database for Founder Map / Strategic Dependency Graph.

## What this is

A public-source strategic dependency graph for the European defence stack.

It maps the European defence-industrial base, capability layers, policy/funding structures, primes, dual-use startups, bottlenecks and opportunity zones.

## Safety scope

This database is for **public-source strategic market and dependency analysis only**.

It does not contain:

- classified data
- operational tactics
- weapon construction instructions
- sensitive military procedures
- targeting information

## Current counts

```text
nodes: 82
edges: 234
opportunities: 12
sources: 45
```

## What this database maps

- EU defence policy and funding
- defence primes
- dual-use startups
- land systems
- air combat
- naval systems
- missiles and air defence
- C4ISR and sensors
- cyber and electronic warfare
- space and secure connectivity
- drones and autonomy
- ammunition / energetics
- industrial supply chain
- simulation and training
- defence AI/software
- procurement and supplier data

## Interpretation rules

1. `known` means directly supported by a public source.
2. `inferred` means a strategic dependency hypothesis, not a supplier-contract claim.
3. A dependency edge does not imply a direct commercial relationship unless explicitly sourced.
4. Use `confidence` and `fact_status` in the UI.
5. Keep all defense-related data public-source and non-operational.

## Strong early signals

1. European defence demand is shifting from peacetime optimization to readiness, mass, resilience and industrial ramp-up.
2. The most interesting B2B opportunities are not in building weapons, but in visibility, compliance, software integration, readiness, simulation, procurement intelligence and secure data layers.
3. France has strong positioning through DGA, AID, Airbus, Thales, Dassault, Safran, Naval Group, MBDA, KNDS, Unseenlabs, Safran AI / Preligens, Delair, Exotrail and HarfangLab.
4. The red bottlenecks are ammunition/energetics, semiconductor/electronics exposure, critical materials, test/qualification capacity, skilled workforce and supply-chain visibility.
5. The purple opportunities should be extracted from readiness gaps, not hype.

## Top opportunity seeds

- European defence supplier dependency intelligence platform
- EDF / EDIP proposal and consortium workspace for SMEs
- Counter-UAS command and evidence console for critical infrastructure
- Secure combat-cloud connector layer for European defence systems
- Defence export-control and classified-compliance OS
- Ammunition and energetics supply-chain observability
- Fleet readiness and predictive maintenance platform for defence assets
- Space ISR tasking and fusion layer for maritime/security users
- Synthetic training and mission rehearsal toolkit for European SMEs
- Defence procurement radar for founders and investors
- Dual-use startup security-clearance and procurement readiness pathway
- European interoperability test harness for defence software

## Codex usage

Primary data file:

```text
strategic-dependency-graph/data/european-defence-stack/v0.1/european_defence_stack_graph_v0.json
```

Recommended UI behavior:

- Add capability-layer filters.
- Add safety badge: "public-source strategic data only".
- Highlight red industrial bottlenecks.
- Highlight France/EU-fit opportunities.
- Make inferred edges visibly different from known edges.
- Add a "France lens" filter.
