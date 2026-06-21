# Strategic Dependency Graph — Master Plan v0.1

Created: 2026-06-21

## North Star

Build a strategic dependency graph for technology, sovereignty, and opportunity discovery.

The system maps critical companies, startups, suppliers, infrastructure, software layers, hardware dependencies, research labs, public programs, and strategic bottlenecks across AI, defense, aerospace, and industrial software.

The goal is not to create another market map.

The goal is to build a machine that answers:

> Where should a builder, investor, company, or country position itself?

## Core Principle

Build one master graph, not five isolated databases.

Sector maps are views of the same deeper system.

```text
Master Graph
├── View 1: EU AI Stack
├── View 2: Global AI Stack
├── View 3: European Defense Stack
├── View 4: Global Aerospace Stack
└── View 5: Industrial Software / OT / Automation / Simulation
```

## Strategic User Lens

Primary lens:
- Builder / founder looking for high-leverage gaps
- B2B buyer looking for strategic dependency exposure
- VC / scout looking for non-obvious opportunity zones
- French / European sovereignty actor looking for national or regional leverage

France lens:
- What is France structurally good at?
- Where is France exposed?
- Where can a French startup insert itself?
- Which bottlenecks align with France 2030, defense, AI, industry, energy, aerospace, or public infrastructure priorities?

## Color System

```text
Green  = sovereign / controlled / resilient
Orange = dependent / exposed / replaceable with effort
Red    = critical bottleneck / dangerous dependency
Blue   = strategic enabler
Purple = opportunity / whitespace
Grey   = unknown / low-confidence data
```

Colors should come from scores, not vibes.

## Scoring Fields

Each node and edge can have:

```text
sovereignty_score: 0–5
dependency_risk: 0–5
criticality: 0–5
replaceability: 0–5
market_importance: 0–5
urgency: 0–5
accessibility: 0–5
france_or_eu_fit: 0–5
incumbent_strength: 0–5
regulatory_friction: 0–5
capital_intensity: 0–5
confidence: low / medium / high
time_to_substitute: short / medium / long / unknown
```

## Node Types

```text
company
startup
government_agency
research_lab
open_source_project
cloud_provider
chip_supplier
data_center
energy_provider
software_platform
hardware_component
manufacturing_partner
defense_prime
aerospace_prime
regulator
funding_program
standard_body
system_integrator
```

## Edge Types

```text
depends_on
supplies_to
owns
partners_with
competes_with
funded_by
regulated_by
uses
substitutes
integrates_with
manufactures_for
certified_by
secured_by
hosted_on
powered_by
```

## Opportunity Extraction v0

Opportunity Score:

```text
Opportunity Score =
criticality
× dependency_risk
× market_importance
× urgency
× accessibility
× france_or_eu_fit
× evidence_confidence
-
incumbent_strength
-
regulatory_friction
-
capital_intensity
```

Opportunity categories:

```text
Substitution opportunity
= replace foreign or exposed supplier

Infrastructure opportunity
= build missing layer others depend on

Tooling opportunity
= make complex stack usable

Compliance/trust opportunity
= help companies meet regulation, sovereignty, safety, or security requirements

Integration opportunity
= connect fragmented European actors

Defense-adjacent opportunity
= civilian technology with defense relevance

Data/visibility opportunity
= expose hidden system behavior

Operational efficiency opportunity
= reduce cost, latency, failure, downtime, or cognitive load in critical industries
```

## Build Order

### Phase 1 — EU AI Stack

Why first:
- Closest to France
- Current strategic urgency
- Strong investor and public interest
- Visible dependencies: compute, cloud, chips, energy, data centers, regulation, open-source stack

Target v0:
```text
50 nodes
120 edges
20 opportunity signals
```

### Phase 2 — Global AI Stack

Purpose:
- Compare Europe against US, China, Middle East, and global cloud/chip infrastructure.
- Reveal where Europe is strong, weak, or structurally late.

Target v1:
```text
150 nodes
350 edges
50 opportunity signals
```

### Phase 3 — European Defense Stack

Scope:
- Defense primes
- Dual-use startups
- sensors
- drones
- satellites
- cybersecurity
- secure communications
- simulation
- AI for defense
- manufacturing bottlenecks
- supply chain risks

Rule:
Use public sources only. No classified data. No sensitive operational data.

Target:
```text
80 nodes
200 edges
30 opportunity signals
```

### Phase 4 — Global Aerospace Stack

Scope:
- Aerospace primes
- aircraft manufacturers
- space companies
- avionics
- engines
- materials
- simulation software
- certification
- maintenance
- autonomy
- satellite infrastructure

Target:
```text
120 nodes
300 edges
40 opportunity signals
```

### Phase 5 — Industrial Software View

Start as a cross-cutting layer, not a separate database.

Extract industrial software nodes across AI, defense, aerospace, robotics, energy, chips, and factories.

Potential categories:
```text
PLM
CAD
CAE
MES
ERP
SCADA
digital twins
simulation
robotics software
factory automation
industrial cybersecurity
supply chain software
predictive maintenance
embedded software
secure collaboration
```

Decision rule:
If enough nodes and opportunities appear, promote Industrial Software into its own full database/view.

## Milestones

### Week 1 — Define the Machine

Deliverables:
```text
schema.json
taxonomy.yaml
color_rules.md
scoring_rules.md
node_template.json
edge_template.json
source_policy.md
```

### Week 2 — EU AI Stack v0

Deliverables:
```text
eu_ai_nodes.json
eu_ai_edges.json
eu_ai_sources.json
eu_ai_map_v0
```

Target:
```text
25 companies/institutions
60 dependencies
10 bottlenecks
```

### Week 3 — EU AI Stack v1 + First Insight Report

Deliverables:
```text
EU_AI_Strategic_Dependency_Report_v1.md
Top_10_AI_Dependencies.md
Top_10_AI_Opportunities.md
```

### Week 4 — Website Prototype

Simple static JSON website.

Interface:
```text
left panel: sectors/views
center: graph
right panel: node details
filters: country, risk, dependency type, opportunity score
```

### Week 5 — Opportunity Extractor v0

Input:
```text
nodes + edges
```

Output:
```text
ranked opportunity list
```

Example output:
```json
{
  "opportunity": "Sovereign AI deployment layer for regulated industries",
  "score": 84,
  "reason": "High criticality and dependency risk around regulated AI deployment.",
  "affected_nodes": ["mistral_ai", "european_enterprises", "public_sector_buyers"],
  "dependency_type": "compute/software/security",
  "buyer_types": ["enterprise", "government", "cloud provider"],
  "france_fit": 5
}
```

### Week 6–7 — Global AI Expansion

Add:
```text
US AI stack
China AI stack
Middle East AI infra
major chip suppliers
major cloud providers
global model companies
global data center operators
```

### Week 8–9 — European Defense Stack

Deliverables:
```text
EU_Defense_nodes.json
EU_Defense_edges.json
EU_Defense_dependency_report.md
EU_Defense_opportunities.md
```

### Week 10–11 — Global Aerospace Stack

Deliverables:
```text
Aerospace_Global_nodes.json
Aerospace_Global_edges.json
Aerospace_opportunities.md
```

### Week 12 — Industrial Software Extraction

Query:
```text
Show all industrial software dependencies across AI, defense, aerospace.
```

Deliverable:
```text
Industrial_Software_View_v0.md
```

## Data Collection Rules

1. Source every important node and edge.
2. Prefer official sources, annual reports, investor relations pages, EU/public sources, company documentation, standards bodies, and reputable industry research.
3. Avoid relying on blogs unless used only as weak signals.
4. Every edge should include a reason.
5. Every score should include confidence.
6. Public-source only for defense.
7. Distinguish known facts from inferred relationships.
8. Build useful structure before chasing completeness.

## First Data Collection Priority

Start with EU AI Stack.

Initial categories:
```text
foundation model companies
AI application companies
cloud/HPC providers
GPU/chip suppliers
data center operators
energy dependencies
open-source frameworks
research labs
public programs
regulators
enterprise buyers
security/compliance providers
```

## Product Demo Vision

Demo flow:
1. Open EU AI Stack map.
2. Click a major company.
3. Show dependency chain.
4. Highlight red/orange bottlenecks.
5. Click "Extract Opportunities."
6. Show ranked startup / B2B / national opportunity zones.
7. Filter by France/EU fit.

Core line:

> The opportunity is derived from the structure of the real economy.
