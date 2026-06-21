import { Moon, Sun } from "lucide-react";
import type { DatasetConfig, DatasetStats, FilterOptions, FilterState, GraphNode } from "../types/graph";
import { DatasetSelector } from "./DatasetSelector";
import { FilterPanel } from "./FilterPanel";
import { SafetyBadge } from "./SafetyBadge";
import { SearchBox } from "./SearchBox";

interface SidebarProps {
  datasets: DatasetConfig[];
  activeDatasetId: string;
  safetyBadge: boolean;
  theme: "light" | "dark";
  stats: DatasetStats;
  filters: FilterState;
  filterOptions: FilterOptions;
  searchResults: GraphNode[];
  onDatasetChange: (datasetId: string) => void;
  onThemeToggle: () => void;
  onFilterChange: (patch: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onSelectNode: (nodeId: string) => void;
}

export function Sidebar({
  datasets,
  activeDatasetId,
  safetyBadge,
  theme,
  stats,
  filters,
  filterOptions,
  searchResults,
  onDatasetChange,
  onThemeToggle,
  onFilterChange,
  onResetFilters,
  onSelectNode
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div>
          <h1>Founder Map</h1>
          <p>Strategic Dependency Graph</p>
        </div>
        <button type="button" className="icon-button" onClick={onThemeToggle} title="Switch light / dark mode">
          {theme === "light" ? <Moon size={17} aria-hidden /> : <Sun size={17} aria-hidden />}
        </button>
      </div>

      <DatasetSelector datasets={datasets} activeDatasetId={activeDatasetId} onChange={onDatasetChange} />
      {safetyBadge && <SafetyBadge />}

      <SearchBox
        query={filters.query}
        results={searchResults}
        onQueryChange={(query) => onFilterChange({ query })}
        onSelectNode={onSelectNode}
      />

      <FilterPanel filters={filters} options={filterOptions} onChange={onFilterChange} onReset={onResetFilters} />

      <section className="sidebar-section">
        <h2>Dataset stats</h2>
        <div className="stats-grid">
          <div><strong>{stats.nodes}</strong><span>Nodes</span></div>
          <div><strong>{stats.edges}</strong><span>Edges</span></div>
          <div><strong>{stats.opportunities}</strong><span>Opps</span></div>
          <div><strong>{stats.sources}</strong><span>Sources</span></div>
        </div>
      </section>
    </aside>
  );
}
