# Codex System Prompt — Strategic Dependency Graph

You are building the first interface for the Strategic Dependency Graph.

This is not a toy graph.
This is not a generic dashboard.
This is a strategic intelligence console.

The user is mapping critical technology dependencies across Europe and the world to discover where builders, investors, companies, and countries should position themselves.

## Mission

Build a clean, fast, serious web interface that visualizes:

- strategic companies
- suppliers
- public programs
- infrastructure layers
- software layers
- hardware dependencies
- regulatory nodes
- critical bottlenecks
- opportunity zones

The first dataset is:

```text
data/eu-ai-stack/v0.1/eu_ai_stack_graph_v0.json
```

## Data shape

The graph file contains:

```text
manifest
sources
nodes
edges
opportunities
```

Nodes have fields such as:

```text
id
name
type
country
region
sector
strategic_role
description
sovereignty_score
criticality
market_importance
france_or_eu_fit
color
confidence
tags
sources
fact_status
```

Edges have fields such as:

```text
from
to
type
dependency_category
reason
dependency_risk
criticality
replaceability
time_to_substitute
color
confidence
sources
fact_status
tags
```

Opportunities have fields such as:

```text
id
title
type
score
reason
affected_nodes
dependency_types
buyer_types
france_fit
eu_fit
capital_intensity
regulatory_friction
incumbent_strength
confidence
sources
```

## Color semantics

```text
green  = sovereign / controlled / resilient
orange = dependent / exposed / replaceable with effort
red    = critical bottleneck / dangerous dependency
blue   = strategic enabler
purple = opportunity / whitespace
grey   = unknown / low-confidence data
```

Use these colors consistently in the UI.

## Required UI

Create a strategic graph interface with:

1. **Left sidebar**
   - dataset selector
   - node type filters
   - country filters
   - sector filters
   - color filters
   - confidence filters
   - fact_status filters

2. **Center graph canvas**
   - force-directed graph or clean network visualization
   - node color from `node.color`
   - edge color from `edge.color`
   - readable labels
   - zoom/pan
   - highlight connected dependencies on click

3. **Right detail panel**
   - selected node details
   - selected edge details
   - scores
   - reason
   - tags
   - source IDs
   - fact status

4. **Opportunity panel**
   - ranked by score
   - opportunity type
   - affected nodes
   - buyer types
   - France/EU fit
   - confidence
   - source IDs

5. **Sources panel**
   - source title
   - URL
   - source type
   - notes

## Critical behavior

- Always display whether an edge is `known` or `inferred`.
- Never present inferred edges as confirmed supplier contracts.
- Make red bottlenecks visually obvious.
- Make purple opportunities feel like extraction from the graph, not random ideas.
- Keep the interface fast and usable.
- The design should feel like a real strategic command system: minimal, precise, serious.

## First success condition

A user should be able to open the app, click **Mistral AI**, and immediately see:

- its dependency on AI compute
- GPU / accelerator exposure
- model distribution layer
- compliance/regulatory layer
- opportunity signals connected to those dependencies

## Second success condition

A user should be able to open **Opportunities** and understand why the system suggests:

- cloud-native AI layer for EuroHPC AI Factories
- European GPU allocation / observability broker
- AI Act evidence and compliance automation
- secure sovereign RAG/document AI for public sector
- model supply-chain security scanner

## Architecture preference

Start simple.

Use static JSON first.
Do not overbuild the backend.

Recommended initial stack:

- React / Vite / TypeScript
- graph visualization library of your choice
- local JSON import
- no database yet
- no authentication yet

## Tone

This project should feel like:

- strategic intelligence
- industrial reality
- European sovereignty
- deeptech opportunity discovery
- founder-grade map of where to build

The opportunity is derived from the structure of the real economy.
