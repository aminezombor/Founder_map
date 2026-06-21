# Founder Map

Strategic dependency graph for technology, sovereignty, and opportunity discovery.

This repository is the public home of the Founder Map / Strategic Dependency Graph project.

The mission:

> Map the real dependency structure of critical industries so builders, investors, companies, and countries can see where to position themselves.

Core line:

> The opportunity is derived from the structure of the real economy.

## v0.1 databases

```text
strategic-dependency-graph/data/eu-ai-stack/v0.1/
strategic-dependency-graph/data/global-ai-stack/v0.1/
strategic-dependency-graph/data/european-defence-stack/v0.1/
strategic-dependency-graph/data/global-aerospace-stack/v0.1/
strategic-dependency-graph/data/industrial-software-ot-stack/v0.1/
```

## Current generated database counts

| Database | Nodes | Edges | Opportunities | Sources |
|---|---:|---:|---:|---:|
| EU AI Stack | 87 | 141 | 12 | 46 |
| Global AI Stack | 72 | 229 | 12 | 44 |
| European Defence Stack | 82 | 234 | 12 | 45 |
| Global Aerospace Stack | 74 | 255 | 12 | 50 |
| Industrial Software / OT Stack | 81 | 262 | 12 | 48 |

## System tracks

- strategic companies
- public programs
- model providers
- AI cloud platforms
- GPU and accelerator dependencies
- advanced chip supply chains
- data centers and energy
- defence primes and dual-use startups
- aerospace OEMs and suppliers
- certification and compliance bottlenecks
- industrial software / OT layers
- model distribution layers
- inference runtimes
- AI tooling and observability
- governance and compliance
- opportunity zones

## Interpretation rules

1. `known` means directly supported by public source.
2. `inferred` means a strategic dependency hypothesis, not a supplier-contract claim.
3. A dependency edge does not imply a direct commercial relationship unless explicitly sourced.
4. Use `confidence` and `fact_status` in the UI.
5. Defence data must remain public-source and non-operational.

## Codex build target

Build a Strategic Dependency Graph web app with:

- dataset selector
- graph canvas
- layer filters
- country / region / France lens
- node detail panel
- edge detail panel
- source ledger
- opportunity ranking panel
- bottleneck interpretation panel

Start with static JSON. No auth. No backend until the graph interface proves value.
