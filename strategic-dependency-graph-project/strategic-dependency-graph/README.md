# Strategic Dependency Graph

A strategic dependency graph for technology, sovereignty, and opportunity discovery.

This repo is being built to answer one question:

> Where should a builder, investor, company, or country position itself?

The system maps critical companies, startups, suppliers, infrastructure, software layers, hardware dependencies, research labs, public programs, and strategic bottlenecks across AI, defense, aerospace, industrial software, energy, compute, chips, and sovereign technology.

## Current battlefield

The first battlefield is the **European AI Stack**.

The first database package lives at:

```text
data/eu-ai-stack/v0.1/
```

It contains:

- nodes
- edges
- source ledger
- opportunity seeds
- Codex website prompt seed
- README for the data package

## Core doctrine

This is not a market map.

This is a machine for detecting:

- who matters
- who depends on whom
- where sovereignty is real
- where dependency is hidden
- where critical bottlenecks exist
- where a new company can insert itself
- where France and Europe have leverage

## Graph color code

```text
Green  = sovereign / controlled / resilient
Orange = dependent / exposed / replaceable with effort
Red    = critical bottleneck / dangerous dependency
Blue   = strategic enabler
Purple = opportunity / whitespace
Grey   = unknown / low-confidence data
```

## Project structure

```text
docs/
  master-plan.md
  data-collection-backlog.v0.csv

schemas/
  strategic-graph-schema.v0.json

data/
  source-ledgers/
    source-ledger-seed.v0.csv

  eu-ai-stack/
    v0.1/
      eu_ai_stack_graph_v0.json
      eu_ai_stack_nodes_v0.csv
      eu_ai_stack_edges_v0.csv
      eu_ai_stack_opportunities_v0.csv
      eu_ai_stack_sources_v0.csv
      codex_website_prompt_seed.md

prompts/
  codex-system-prompt.md

assets/
  initial-map-sketch.png

reports/
```

## Interpretation rules

1. `known` edges are directly supported by public sources.
2. `inferred` edges are strategic dependency hypotheses.
3. Inferred edges are not supplier-contract claims.
4. Defense data must remain public-source only.
5. Every important relationship needs a source and a reason.
6. The map should be useful before it is complete.

## Immediate build objective

Build a static web app that loads:

```text
data/eu-ai-stack/v0.1/eu_ai_stack_graph_v0.json
```

and displays:

- graph visualization
- node details
- edge details
- filters
- opportunity ranking
- source ledger

## Product line

The opportunity is derived from the structure of the real economy.
