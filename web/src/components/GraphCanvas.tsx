import { Maximize2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { GraphEdge, GraphNode, VisibleGraph } from "../types/graph";
import { getFactStatusStyle, getSemanticColor, withAlpha } from "../utils/colors";
import { Legend } from "./Legend";

interface GraphCanvasProps {
  graph: VisibleGraph;
  theme: "light" | "dark";
  selectedNodeId?: string;
  selectedEdgeId?: string;
  highlightedNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
}

function nodeRadius(node: GraphNode, selected: boolean, hovered: boolean): number {
  const base = 5.5;
  const criticality = node.criticality ?? 0;
  const market = node.market_importance ?? 0;
  return base + criticality * 0.85 + market * 0.45 + (selected ? 5 : 0) + (hovered ? 2.5 : 0);
}

function shouldShowLabel(node: GraphNode, scale: number, selected: boolean, highlighted: boolean): boolean {
  return selected || highlighted || (node.criticality ?? 0) >= 5 || (node.market_importance ?? 0) >= 5 || scale > 1.25;
}

export function GraphCanvas({
  graph,
  theme,
  selectedNodeId,
  selectedEdgeId,
  highlightedNodeIds,
  highlightedEdgeIds,
  onSelectNode,
  onSelectEdge
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(320, width), height: Math.max(320, height) });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      graphRef.current?.zoomToFit?.(650, 70);
      graphRef.current?.d3Force?.("charge")?.strength?.(-110);
      graphRef.current?.d3Force?.("link")?.distance?.((link: GraphEdge) => 42 + (link.criticality ?? 0) * 8);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [graph.nodes.length, graph.edges.length]);

  const hasFocus = Boolean(selectedNodeId || selectedEdgeId || highlightedNodeIds.size || highlightedEdgeIds.size);

  const graphData = useMemo(
    () => ({
      nodes: graph.nodes,
      links: graph.edges
    }),
    [graph.nodes, graph.edges]
  );

  const isEdgeFocused = useCallback(
    (edge: GraphEdge) => {
      if (!hasFocus) return true;
      if (highlightedEdgeIds.has(edge.id) || selectedEdgeId === edge.id) return true;
      return highlightedNodeIds.has(edge.from) && highlightedNodeIds.has(edge.to);
    },
    [hasFocus, highlightedEdgeIds, highlightedNodeIds, selectedEdgeId]
  );

  const drawNode = useCallback(
    (nodeObject: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const node = nodeObject as GraphNode & { x?: number; y?: number };
      if (typeof node.x !== "number" || typeof node.y !== "number") return;
      const selected = node.id === selectedNodeId;
      const hovered = node.id === hoveredNodeId;
      const highlighted = highlightedNodeIds.has(node.id);
      const active = !hasFocus || selected || hovered || highlighted;
      const color = getSemanticColor(node.color, theme);
      const radius = nodeRadius(node, selected, hovered);

      ctx.save();
      ctx.globalAlpha = active ? 1 : 0.18;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.lineWidth = selected ? 2.8 : highlighted ? 1.8 : 1;
      ctx.strokeStyle = selected ? (theme === "dark" ? "#ffffff" : "#0c1220") : withAlpha(color, 0.88);
      ctx.stroke();

      if (String(node.color).toLowerCase() === "red") {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(color, active ? 0.42 : 0.12);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      if (shouldShowLabel(node, globalScale, selected, highlighted)) {
        const fontSize = Math.max(9, 12 / globalScale);
        const label = node.name;
        ctx.font = `${selected ? 700 : 600} ${fontSize}px Inter, ui-sans-serif, system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = theme === "dark" ? "rgba(235, 244, 255, 0.94)" : "rgba(18, 29, 46, 0.94)";
        ctx.fillText(label, node.x, node.y + radius + 4);
      }

      ctx.restore();
    },
    [hasFocus, highlightedNodeIds, hoveredNodeId, selectedNodeId, theme]
  );

  const background = theme === "dark" ? "#07101c" : "#f6f8fb";

  return (
    <section className="graph-shell">
      <div className="graph-toolbar">
        <div>
          <strong>Strategic map</strong>
          <span>{graph.nodes.length} visible nodes / {graph.edges.length} visible edges</span>
        </div>
        <div className="icon-button-row">
          <button type="button" className="icon-button" title="Reset view" onClick={() => graphRef.current?.centerAt?.(0, 0, 500)}>
            <RotateCcw size={16} aria-hidden />
          </button>
          <button type="button" className="icon-button" title="Fit to screen" onClick={() => graphRef.current?.zoomToFit?.(650, 70)}>
            <Maximize2 size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="graph-canvas">
        {graph.nodes.length ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={size.width}
            height={size.height}
            backgroundColor={background}
            nodeId="id"
            linkSource="source"
            linkTarget="target"
            nodeCanvasObject={drawNode}
            nodeCanvasObjectMode={() => "replace"}
            nodePointerAreaPaint={(nodeObject, color, ctx) => {
              const node = nodeObject as GraphNode & { x?: number; y?: number };
              if (typeof node.x !== "number" || typeof node.y !== "number") return;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, nodeRadius(node, node.id === selectedNodeId, false) + 5, 0, Math.PI * 2);
              ctx.fill();
            }}
            linkColor={(edgeObject) => {
              const edge = edgeObject as GraphEdge;
              const base = getSemanticColor(edge.color, theme);
              return withAlpha(base, isEdgeFocused(edge) ? 0.62 : 0.08);
            }}
            linkWidth={(edgeObject) => {
              const edge = edgeObject as GraphEdge;
              return Math.max(0.8, (edge.criticality ?? 1) * 0.35 + (edge.dependency_risk ?? 0) * 0.25);
            }}
            linkLineDash={(edgeObject) => getFactStatusStyle((edgeObject as GraphEdge).fact_status).dash}
            linkDirectionalArrowLength={(edgeObject) => (isEdgeFocused(edgeObject as GraphEdge) ? 3.5 : 0)}
            linkDirectionalArrowRelPos={0.78}
            linkDirectionalArrowColor={(edgeObject) => withAlpha(getSemanticColor((edgeObject as GraphEdge).color, theme), 0.68)}
            onNodeHover={(nodeObject) => setHoveredNodeId((nodeObject as GraphNode | null)?.id ?? null)}
            onNodeClick={(nodeObject) => onSelectNode((nodeObject as GraphNode).id)}
            onLinkClick={(edgeObject) => onSelectEdge((edgeObject as GraphEdge).id)}
            cooldownTicks={90}
            minZoom={0.25}
            maxZoom={7}
          />
        ) : (
          <div className="empty-state">
            <strong>No nodes match these filters.</strong>
            <span>Reset filters or widen the search to restore the map.</span>
          </div>
        )}
      </div>

      <Legend />
    </section>
  );
}
