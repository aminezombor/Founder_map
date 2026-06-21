import { useEffect, useMemo, useState } from "react";
import { datasetRegistry, getDatasetConfig } from "./data/datasetRegistry";
import { loadDatasets } from "./data/loadGraph";
import { DetailPanel } from "./components/DetailPanel";
import { GraphCanvas } from "./components/GraphCanvas";
import { Layout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { StatBar } from "./components/StatBar";
import type { FilterState, GraphDataset, Selection } from "./types/graph";
import { defaultFilters } from "./types/graph";
import {
  calculateDatasetStats,
  filterGraph,
  getFilterOptions,
  getSelectionHighlights,
  searchNodes
} from "./utils/graphSelectors";

function cloneDefaultFilters(): FilterState {
  return {
    ...defaultFilters,
    nodeTypes: [],
    countries: [],
    regions: [],
    sectors: [],
    colors: [],
    confidences: [],
    factStatuses: [],
    edgeTypes: [],
    dependencyCategories: []
  };
}

function getInitialTheme(): "light" | "dark" {
  const stored = window.localStorage.getItem("founder-map-theme");
  return stored === "dark" ? "dark" : "light";
}

export default function App() {
  const [datasets, setDatasets] = useState<GraphDataset[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState(datasetRegistry[0].id);
  const [filters, setFilters] = useState<FilterState>(() => cloneDefaultFilters());
  const [selection, setSelection] = useState<Selection>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => getInitialTheme());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDatasets()
      .then((loaded) => {
        setDatasets(loaded);
        setError(null);
      })
      .catch((loadError: unknown) => {
        console.error(loadError);
        setError(loadError instanceof Error ? loadError.message : "Failed to load graph datasets.");
      });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("founder-map-theme", theme);
  }, [theme]);

  const activeDataset = useMemo(
    () => datasets.find((dataset) => dataset.id === activeDatasetId) ?? datasets[0],
    [activeDatasetId, datasets]
  );

  const activeConfig = useMemo(() => getDatasetConfig(activeDatasetId), [activeDatasetId]);

  const filterOptions = useMemo(
    () =>
      activeDataset
        ? getFilterOptions(activeDataset)
        : {
            nodeTypes: [],
            countries: [],
            regions: [],
            sectors: [],
            colors: [],
            confidences: [],
            factStatuses: [],
            edgeTypes: [],
            dependencyCategories: []
          },
    [activeDataset]
  );

  const visibleGraph = useMemo(
    () => (activeDataset ? filterGraph(activeDataset, filters) : { nodes: [], edges: [] }),
    [activeDataset, filters]
  );

  const stats = useMemo(
    () =>
      activeDataset
        ? calculateDatasetStats(activeDataset, visibleGraph)
        : {
            nodes: 0,
            edges: 0,
            opportunities: 0,
            sources: 0,
            knownEdges: 0,
            inferredEdges: 0,
            redBottlenecks: 0
          },
    [activeDataset, visibleGraph]
  );

  const searchResults = useMemo(
    () => (activeDataset ? searchNodes(activeDataset, filters.query) : []),
    [activeDataset, filters.query]
  );

  const highlights = useMemo(
    () => (activeDataset ? getSelectionHighlights(activeDataset, selection) : { nodeIds: new Set<string>(), edgeIds: new Set<string>() }),
    [activeDataset, selection]
  );

  function handleDatasetChange(datasetId: string) {
    setActiveDatasetId(datasetId);
    setFilters(cloneDefaultFilters());
    setSelection(null);
    setIsMenuOpen(false);
  }

  function handleFilterChange(patch: Partial<FilterState>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function handleSelectNode(nodeId: string) {
    setSelection({ kind: "node", id: nodeId });
    setFilters((current) => ({ ...current, query: "" }));
    setIsMenuOpen(false);
  }

  function handleSelectEdge(edgeId: string) {
    setSelection({ kind: "edge", id: edgeId });
  }

  function handleSelectOpportunity(opportunityId: string) {
    setSelection({ kind: "opportunity", id: opportunityId });
  }

  if (error) {
    return (
      <div className="boot-screen">
        <strong>Founder Map could not load.</strong>
        <p>{error}</p>
        <span>Run npm run sync-data before starting the dev server.</span>
      </div>
    );
  }

  if (!activeDataset) {
    return (
      <div className="boot-screen">
        <strong>Loading Founder Map</strong>
        <p>Loading local strategic dependency graph data...</p>
      </div>
    );
  }

  return (
    <Layout
      controls={
        <Sidebar
          datasets={datasetRegistry}
          activeDatasetId={activeDatasetId}
          safetyBadge={Boolean(activeConfig.safetyBadge)}
          theme={theme}
          stats={stats}
          filters={filters}
          filterOptions={filterOptions}
          searchResults={searchResults}
          isOpen={isMenuOpen}
          onDatasetChange={handleDatasetChange}
          onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          onToggleOpen={() => setIsMenuOpen((current) => !current)}
          onFilterChange={handleFilterChange}
          onResetFilters={() => setFilters(cloneDefaultFilters())}
          onSelectNode={handleSelectNode}
        />
      }
      graph={
        <GraphCanvas
          graph={visibleGraph}
          theme={theme}
          selection={selection}
          highlightedNodeIds={highlights.nodeIds}
          highlightedEdgeIds={highlights.edgeIds}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
        />
      }
      inspector={
        <DetailPanel
          dataset={activeDataset}
          selection={selection}
          onClose={() => setSelection(null)}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
          onSelectOpportunity={handleSelectOpportunity}
        />
      }
      statBar={<StatBar stats={stats} datasetLabel={activeDataset.label} />}
    />
  );
}
