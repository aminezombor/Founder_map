# Codex Prompt Seed — Global AI Stack v0.1

Build or extend the Strategic Dependency Graph UI to support the Global AI Stack dataset.

Use:

```text
data/global-ai-stack/v0.1/global_ai_stack_graph_v0.json
```

## Required additions

Add a dataset selector with at least:

```text
EU AI Stack
Global AI Stack
```

For Global AI Stack, the interface must make regional comparison obvious:

- US AI Ecosystem
- European AI Ecosystem
- China AI Ecosystem
- Middle East AI Ecosystem
- Canadian AI Ecosystem

## Visual priorities

Red nodes/edges are strategic bottlenecks:
- GPU / Accelerator Compute Layer
- Advanced Chip Supply Chain
- AI Data Center / Energy Layer
- NVIDIA
- TSMC
- HBM suppliers
- US hyperscaler model platforms

Blue nodes/edges are strategic enablers:
- AI Safety / Governance / Compliance
- ASML
- EU AI regulation / AI Factories
- regional ecosystem clusters
- model/cloud platforms

Green nodes are sovereign/regional strengths:
- European AI Ecosystem
- Mistral AI
- ASML
- SAP Business AI

Orange nodes are dependency or exposure zones:
- open-weight model distribution
- inference runtime
- AI tooling
- China compute exposure
- cloud/model concentration

## Required panels

1. Graph canvas
2. Regional comparison panel
3. Node/edge detail panel
4. Opportunity panel
5. Source ledger panel

## Critical behavior

- Always show `fact_status`.
- Never present `inferred` edges as direct supplier contracts.
- A dependency edge means structural exposure unless directly sourced otherwise.
- Opportunity extraction should feel derived from graph bottlenecks.

## First demo path

Click:

```text
European AI Ecosystem
```

Show:

- Mistral AI
- ASML
- EU AI Factories
- EU AI Act
- dependency on GPU Compute Layer
- dependency on Advanced Chip Supply Chain
- opportunity: Europe-vs-world AI strategic comparison dashboard

## Second demo path

Click:

```text
GPU / Accelerator Compute Layer
```

Show:

- NVIDIA
- AMD
- Intel
- CoreWeave
- AWS Bedrock
- Azure OpenAI / AI Foundry
- Google Cloud Vertex
- TSMC
- HBM/memory nodes
- opportunity: Global GPU capacity intelligence and allocation broker

## Design tone

Strategic intelligence console.
Industrial reality.
Dependency visibility.
No generic SaaS template energy.
