# Codex Prompt Seed — European Defence Stack v0.1

Extend the Strategic Dependency Graph UI to support the European Defence Stack dataset.

Use:

```text
strategic-dependency-graph/data/european-defence-stack/v0.1/european_defence_stack_graph_v0.json
```

## Required dataset selector

Add:

```text
EU AI Stack
Global AI Stack
European Defence Stack
```

## Required safety badge

Display a permanent badge for this dataset:

```text
PUBLIC-SOURCE STRATEGIC DATA ONLY
No classified data. No operational tactics. No weapon-construction details.
```

## Visual priorities

Red nodes/edges are strategic bottlenecks:

- Ammunition / Energetics Layer
- Industrial Supply Chain Layer
- Semiconductor / Electronics Dependency
- Critical Raw Materials
- Supply Chain Visibility Gap
- Secure Cloud / Edge Compute

Blue nodes are strategic enablers:

- EDIS
- EDF
- EUDIS
- DGA
- AID
- IRIS²
- Galileo PRS
- Airbus Defence and Space
- MBDA
- Thales
- Safran AI / Preligens
- Unseenlabs

Green nodes are sovereign strengths:

- French and European primes
- Naval Group
- Dassault Aviation
- Safran
- KNDS
- ASML if later cross-linked from Global AI/Chip layers

Purple items are opportunity seeds.

## Required panels

1. Graph canvas
2. Capability layer filter
3. France lens filter
4. Node/edge detail panel
5. Opportunity panel
6. Source ledger panel
7. Safety interpretation panel

## Critical behavior

- Always show `fact_status`.
- Never present inferred edges as confirmed supplier contracts.
- Make France-fit and EU-fit scores visible.
- Make red bottlenecks visually obvious.
- Make opportunities feel extracted from graph structure.

## First demo path

Click:

```text
European Defence Stack
```

Show:

- Policy / Funding / Procurement Layer
- Defence Prime Layer
- Industrial Supply Chain Layer
- Ammunition / Energetics Layer
- Defence AI / Software Layer

## Second demo path

Click:

```text
France lens
```

Show high-fit French nodes:

- DGA
- AID
- Airbus Defence and Space
- Thales
- Dassault Aviation
- Safran
- Naval Group
- MBDA
- KNDS
- Unseenlabs
- Safran AI / Preligens
- Delair
- Exotrail
- HarfangLab

## Third demo path

Click:

```text
Supply Chain Visibility Gap
```

Show connected opportunities:

- European defence supplier dependency intelligence platform
- Defence procurement radar for founders and investors
- Ammunition and energetics supply-chain observability
- Defence export-control and classified-compliance OS

## Design tone

Strategic intelligence console.
Industrial reality.
European readiness.
French leverage.
Defence innovation without theatre.
