# Global AI Stack Database v0.1

This is the second database for Founder Map / Strategic Dependency Graph.

## What this is

A public-source strategic dependency graph for the global AI stack.

It extends the EU AI Stack into a global comparison view across:

- United States
- Europe
- China
- Middle East
- Canada
- global chip and infrastructure layers

## Current counts

```text
nodes: 72
edges: 229
opportunities: 12
sources: 44
```

## What this database maps

- frontier model providers
- model/cloud platforms
- GPU and accelerator providers
- advanced chip supply chain
- data centers and energy
- model distribution
- serving/inference runtimes
- AI tooling and observability
- safety/governance/compliance
- training data and data rights
- enterprise workflow distribution
- regional strategic clusters

## Interpretation rules

1. `known` means directly supported by public source.
2. `inferred` means a strategic dependency hypothesis, not a supplier-contract claim.
3. A dependency edge does not imply a direct commercial relationship unless explicitly sourced.
4. Use `confidence` and `fact_status` in the UI.
5. The value of this database is comparative structure, not completeness.

## Strong early signals

1. Global GPU capacity and AI cloud bottleneck.
2. US dominance across models, hyperscalers, chips and AI software.
3. Europe has ASML, regulation, Mistral, AI Factories, but remains exposed to AI accelerators and global cloud infrastructure.
4. China has strong domestic model/cloud layers but remains exposed to accelerator supply constraints.
5. Middle East is becoming an AI infrastructure and capital-energy zone.
6. Enterprise buyers need model routing, procurement intelligence, compliance automation and inference FinOps.

## Top opportunity seeds

- Global GPU capacity intelligence and allocation broker
- Model router with sovereignty, latency, cost and compliance policies
- AI supply-chain risk OS for models, data and dependencies
- Europe-vs-world AI strategic comparison dashboard
- AI inference FinOps and observability layer
- AI data-center energy and grid intelligence
- Multilingual public-sector AI deployment kit
- AI procurement due-diligence engine
- Enterprise runtime for open-weight models
- HBM / memory supply risk intelligence
- Benchmark and evaluation truth layer for model buyers
- Cross-cloud AI continuity and fallback layer

## Codex usage

Primary data file:

```text
strategic-dependency-graph/data/global-ai-stack/v0.1/global_ai_stack_graph_v0.json
```

Recommended UI behavior:

- add region filter
- add dependency-risk filter
- compare regional clusters
- show Europe-vs-US-vs-China-vs-Middle-East exposure
- rank opportunities by score
- visually highlight red infrastructure bottlenecks and blue strategic enablers
