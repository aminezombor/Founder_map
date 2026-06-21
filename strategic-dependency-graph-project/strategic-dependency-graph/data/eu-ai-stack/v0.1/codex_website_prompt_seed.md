You are building a static web app for the Strategic Dependency Graph project.

Use `/data/eu_ai_stack_graph_v0.json` as the primary data source.

The app should display:
1. A graph visualization of nodes and edges.
2. Filters by node.type, country, sector, color, confidence, fact_status.
3. Edge filters by type, dependency_category, dependency_risk, criticality, color.
4. A right-side detail panel for selected nodes and edges.
5. An opportunities panel sorted by score.
6. A source panel that shows source titles and URLs.

Color semantics:
- green: sovereign / controlled / resilient
- orange: dependent / exposed / replaceable with effort
- red: critical bottleneck / dangerous dependency
- blue: strategic enabler
- purple: opportunity / whitespace
- grey: unknown / low-confidence data

Important:
- Do not treat inferred edges as verified supplier contracts.
- Display `fact_status` visibly.
- Make the interface feel like a strategic intelligence console, not a toy graph.
