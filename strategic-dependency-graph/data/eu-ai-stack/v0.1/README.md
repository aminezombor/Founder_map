# EU AI Stack Database v0.1

Created: 2026-06-21

## What this is

A first public-source strategic dependency graph for the European AI stack.

It is built for:
- Codex ingestion
- static website generation
- opportunity extraction
- future expansion into global AI, defense, aerospace and industrial software views

## Files

- `manifest.json` — counts and database metadata
- `eu_ai_stack_graph_v0.json` — full graph: manifest + sources + nodes + edges + opportunities
- `eu_ai_stack_nodes_v0.json/csv` — node table
- `eu_ai_stack_edges_v0.json/csv` — edge table
- `eu_ai_stack_opportunities_v0.json/csv` — opportunity seeds
- `eu_ai_stack_sources_v0.json/csv` — source ledger

## Core logic

Colors:
- Green = sovereign / controlled / resilient
- Orange = dependent / exposed / replaceable with effort
- Red = critical bottleneck / dangerous dependency
- Blue = strategic enabler
- Purple = opportunity / whitespace
- Grey = unknown / low-confidence data

Important fields:
- sovereignty_score: 0–5
- dependency_risk: 0–5
- criticality: 0–5
- replaceability: 0–5
- time_to_substitute: short / medium / long / unknown
- confidence: low / medium / high
- fact_status: known / inferred

## Interpretation rules

1. `known` means the relationship is directly supported by a public source.
2. `inferred` means the relationship is a strategic dependency hypothesis derived from sector logic.
3. Inferred edges are not supplier-contract claims.
4. The database should be expanded source-first, not company-first.
5. Every new important edge should include a reason and source.

## Current scope

This v0 includes:
- EU AI policy and infrastructure nodes
- EuroHPC AI Factories and selected systems
- French AI2F ecosystem nodes
- European AI companies
- cloud and sovereign cloud providers
- accelerator / semiconductor dependencies
- open-source AI software stack
- first opportunity extraction seeds

## Next collection priority

1. Enrich each AI company with:
   - headquarters
   - funding / valuation
   - customers / sectors
   - product categories
   - deployment models
   - public cloud/HPC relationships
   - source confidence

2. Add missing EU AI companies:
   - Poolside
   - Dust
   - Nabla
   - H Company
   - Artefact
   - Dataiku
   - Shift Technology
   - Aqemia
   - InstaDeep / BioNTech AI
   - Stability AI
   - Wayve
   - Graphcore / SoftBank relation
   - ElevenLabs
   - Photoroom
   - Doctrine
   - Preligens / Safran AI

3. Add global comparison layer:
   - OpenAI
   - Anthropic
   - Google DeepMind
   - Meta AI
   - xAI
   - Alibaba / Qwen
   - DeepSeek
   - Tencent / Baidu
   - NVIDIA / AMD / TSMC / hyperscalers

## Immediate web product shape

Website v0:
- Left panel: views and filters
- Center: graph
- Right panel: selected node or edge details
- Opportunity button: ranks opportunities from graph fields
