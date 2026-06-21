# Founder Map

Founder Map is a static strategic dependency graph console for exploring where the real economy is strong, exposed, bottlenecked, and buildable.

The repository contains:

- `strategic-dependency-graph/` - public-source v0.1 data packages for AI, defence, aerospace, and industrial software / OT.
- `web/` - the React + Vite website that loads those local JSON datasets and renders the interactive graph console.

## Run Locally

```bash
cd web
npm install
npm run sync-data
npm run dev
```

Build:

```bash
cd web
npm run sync-data
npm run build
```

## What The App Does

- Loads all five v0.1 graph datasets.
- Renders a force-directed graph with semantic node and edge colors.
- Distinguishes known vs inferred relationships.
- Supports dataset switching, search, filters, node/edge selection, source review, and opportunity highlighting.
- Includes Light and Dark modes, with Light as the default.
- Keeps defence data scoped to public-source strategic analysis only.

## Data Scope

This is a static app. There is no backend, no database, no authentication, and no fake API. The data package is the source of truth.

Inferred edges are strategic dependency hypotheses and must not be interpreted as confirmed supplier contracts.
