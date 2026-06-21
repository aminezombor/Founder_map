import { Crosshair, Maximize2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { GraphEdge, GraphNode, Selection, VisibleGraph } from "../types/graph";
import { getFactStatusStyle, getSemanticColor, withAlpha } from "../utils/colors";
import { Legend } from "./Legend";

interface GraphCanvasProps {
  graph: VisibleGraph;
  theme: "light" | "dark";
  selection: Selection;
  highlightedNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
}

type PositionedNode = GraphNode & { x?: number; y?: number };

function nodeRadius(node: GraphNode, selected: boolean, hovered: boolean): number {
  const base = 5.5;
  const criticality = node.criticality ?? 0;
  const market = node.market_importance ?? 0;
  return base + criticality * 0.85 + market * 0.45 + (selected ? 5 : 0) + (hovered ? 2.5 : 0);
}

function labelText(node: GraphNode, selected: boolean): string {
  const max = selected ? 48 : 34;
  return node.name.length > max ? `${node.name.slice(0, max - 1)}...` : node.name;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function intersects(
  box: { left: number; right: number; top: number; bottom: number },
  others: Array<{ left: number; right: number; top: number; bottom: number }>
): boolean {
  return others.some((other) => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top);
}

function getNodeDegreeMap(edges: GraphEdge[]): Map<string, number> {
  const degree = new Map<string, number>();
  for (const edge of edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  return degree;
}

function labelPriority(node: GraphNode, degree: number, selected: boolean, hovered: boolean, highlighted: boolean): number {
  if (selected) return 10000;
  if (hovered) return 9000;
  if (highlighted) return 7000 + degree * 4;
  const criticality = node.criticality ?? 0;
  const market = node.market_importance ?? 0;
  const red = String(node.color).toLowerCase() === "red" ? 34 : 0;
  const type = String(node.type ?? "").toLowerCase();
  const layer = type.includes("layer") || type.includes("sector_view") ? 24 : 0;
  return criticality * 18 + market * 7 + degree * 3 + red + layer;
}

function getSelectionNodeIds(selection: Selection, highlightedNodeIds: Set<string>, highlightedEdgeIds: Set<string>, edges: GraphEdge[]): Set<string> {
  const focusIds = new Set(highlightedNodeIds);
  if (selection?.kind === "node") focusIds.add(selection.id);
  if (selection?.kind === "edge") {
    const selectedEdge = edges.find((edge) => edge.id === selection.id);
    if (selectedEdge) {
      focusIds.add(selectedEdge.from);
      focusIds.add(selectedEdge.to);
    }
  }
  for (const edge of edges) {
    if (highlightedEdgeIds.has(edge.id)) {
      focusIds.add(edge.from);
      focusIds.add(edge.to);
    }
  }
  return focusIds;
}

export function GraphCanvas({
  graph,
  theme,
  selection,
  highlightedNodeIds,
  highlightedEdgeIds,
  onSelectNode,
  onSelectEdge
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const selectedNodeId = selection?.kind === "node" ? selection.id : undefined;
  const selectedEdgeId = selection?.kind === "edge" ? selection.id : undefined;

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width: Math.max(320, Math.round(width)), height: Math.max(320, Math.round(height)) });
    };
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setSize({ width: Math.max(320, Math.round(width)), height: Math.max(320, Math.round(height)) });
      } else {
        updateSize();
      }
    });
    observer.observe(containerRef.current);
    updateSize();
    const frame = window.requestAnimationFrame(updateSize);
    window.addEventListener("resize", updateSize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
    };
  }, []);

  const hasFocus = Boolean(selectedNodeId || selectedEdgeId || highlightedNodeIds.size || highlightedEdgeIds.size);
  const degreeById = useMemo(() => getNodeDegreeMap(graph.edges), [graph.edges]);
  const focusNodeIds = useMemo(
    () => getSelectionNodeIds(selection, highlightedNodeIds, highlightedEdgeIds, graph.edges),
    [graph.edges, highlightedEdgeIds, highlightedNodeIds, selection]
  );

  const graphData = useMemo(
    () => ({
      nodes: graph.nodes,
      links: graph.edges
    }),
    [graph.nodes, graph.edges]
  );

  const runReadableOverview = useCallback(() => {
    graphRef.current?.zoomToFit?.(650, 125);
  }, []);

  const runFitAll = useCallback(() => {
    graphRef.current?.zoomToFit?.(650, 70);
  }, []);

  const runReset = useCallback(() => {
    runReadableOverview();
  }, [runReadableOverview]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      graphRef.current?.d3Force?.("charge")?.strength?.(-110);
      graphRef.current?.d3Force?.("link")?.distance?.((link: GraphEdge) => 42 + (link.criticality ?? 0) * 8);
      graphRef.current?.d3ReheatSimulation?.();
      window.setTimeout(runReadableOverview, 520);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [graph.nodes.length, graph.edges.length, runReadableOverview]);

  useEffect(() => {
    if (!selection) return undefined;
    const timer = window.setTimeout(() => {
      if (selection.kind === "node") {
        const selected = graph.nodes.find((node) => node.id === selection.id) as PositionedNode | undefined;
        if (typeof selected?.x === "number" && typeof selected.y === "number") {
          graphRef.current?.centerAt?.(selected.x, selected.y, 650);
          graphRef.current?.zoom?.(1.55, 650);
        }
        return;
      }

      if (focusNodeIds.size) {
        graphRef.current?.zoomToFit?.(
          650,
          210,
          (nodeObject: PositionedNode) => focusNodeIds.has(nodeObject.id)
        );
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [focusNodeIds, graph.nodes, selection]);

  const isEdgeFocused = useCallback(
    (edge: GraphEdge) => {
      if (!hasFocus) return true;
      if (highlightedEdgeIds.has(edge.id) || selectedEdgeId === edge.id) return true;
      return highlightedNodeIds.has(edge.from) && highlightedNodeIds.has(edge.to);
    },
    [hasFocus, highlightedEdgeIds, highlightedNodeIds, selectedEdgeId]
  );

  const drawNode = useCallback(
    (nodeObject: object, ctx: CanvasRenderingContext2D) => {
      const node = nodeObject as PositionedNode;
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

      ctx.restore();
    },
    [hasFocus, highlightedNodeIds, hoveredNodeId, selectedNodeId, theme]
  );

  const drawLabels = useCallback(
    (ctx: CanvasRenderingContext2D, globalScale: number) => {
      const placed: Array<{ left: number; right: number; top: number; bottom: number }> = [];
      const labelLimit = hasFocus ? 42 : zoomScale > 2 ? 72 : zoomScale > 1.25 ? 46 : 24;
      const priorityFloor = hasFocus ? 0 : zoomScale > 1.25 ? 68 : 96;
      const candidates = [...graph.nodes]
        .filter((node): node is PositionedNode => typeof (node as PositionedNode).x === "number" && typeof (node as PositionedNode).y === "number")
        .map((node) => {
          const selected = node.id === selectedNodeId;
          const hovered = node.id === hoveredNodeId;
          const highlighted = highlightedNodeIds.has(node.id);
          return {
            node,
            selected,
            hovered,
            highlighted,
            priority: labelPriority(node, degreeById.get(node.id) ?? 0, selected, hovered, highlighted)
          };
        })
        .filter(({ selected, hovered, highlighted, priority }) => selected || hovered || highlighted || (!hasFocus && priority >= priorityFloor))
        .sort((left, right) => right.priority - left.priority)
        .slice(0, labelLimit);

      for (const { node, priority, selected, hovered, highlighted } of candidates) {
        if (typeof node.x !== "number" || typeof node.y !== "number") continue;
        const forceVisible = selected || hovered || highlighted;
        const radius = nodeRadius(node, selected, hovered);
        const fontSize = (selected ? 13.5 : priority > 150 ? 12.5 : 11.5) / globalScale;
        const label = labelText(node, selected);
        const paddingX = 5.5 / globalScale;
        const paddingY = 3.5 / globalScale;
        const gap = 6 / globalScale;
        const height = fontSize + paddingY * 2.2;

        ctx.save();
        ctx.font = `${forceVisible ? 750 : 680} ${fontSize}px Inter, ui-sans-serif, system-ui`;
        const width = ctx.measureText(label).width + paddingX * 2;
        const placements = [
          { x: node.x - width / 2, y: node.y + radius + gap, textAlign: "center" as CanvasTextAlign, textX: node.x },
          { x: node.x - width / 2, y: node.y - radius - gap - height, textAlign: "center" as CanvasTextAlign, textX: node.x },
          { x: node.x + radius + gap, y: node.y - height / 2, textAlign: "left" as CanvasTextAlign, textX: node.x + radius + gap + paddingX },
          { x: node.x - radius - gap - width, y: node.y - height / 2, textAlign: "left" as CanvasTextAlign, textX: node.x - radius - gap - width + paddingX }
        ];

        let chosen = placements[0];
        let box = { left: chosen.x, right: chosen.x + width, top: chosen.y, bottom: chosen.y + height };
        for (const placement of placements) {
          const nextBox = { left: placement.x, right: placement.x + width, top: placement.y, bottom: placement.y + height };
          if (!intersects(nextBox, placed) || forceVisible) {
            chosen = placement;
            box = nextBox;
            break;
          }
        }
        if (!forceVisible && intersects(box, placed)) {
          ctx.restore();
          continue;
        }

        roundedRect(ctx, chosen.x, chosen.y, width, height, 5 / globalScale);
        ctx.fillStyle = theme === "dark" ? "rgba(7, 16, 28, 0.78)" : "rgba(255, 255, 255, 0.84)";
        ctx.fill();
        ctx.strokeStyle = theme === "dark" ? "rgba(177, 200, 228, 0.18)" : "rgba(141, 154, 174, 0.3)";
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();
        ctx.textAlign = chosen.textAlign;
        ctx.textBaseline = "middle";
        ctx.fillStyle = forceVisible
          ? theme === "dark" ? "rgba(246, 250, 255, 0.98)" : "rgba(9, 18, 31, 0.98)"
          : theme === "dark" ? "rgba(222, 233, 248, 0.88)" : "rgba(28, 41, 60, 0.88)";
        ctx.fillText(label, chosen.textX, chosen.y + height / 2);
        placed.push(box);
        ctx.restore();
      }
    },
    [degreeById, graph.nodes, hasFocus, highlightedNodeIds, hoveredNodeId, selectedNodeId, theme, zoomScale]
  );

  const background = theme === "dark" ? "#07101c" : "#f6f8fb";

  return (
    <section className="graph-shell">
      <div className="graph-map-meta">
        <div>
          <strong>Strategic map</strong>
          <span>{graph.nodes.length} visible nodes / {graph.edges.length} visible edges</span>
        </div>
      </div>

      <div className="graph-actions icon-button-row" aria-label="Map controls">
        <button type="button" className="icon-button" title="Reset view" onClick={runReset}>
          <RotateCcw size={16} aria-hidden />
        </button>
        <button type="button" className="icon-button" title="Readable overview" onClick={runReadableOverview}>
          <Crosshair size={16} aria-hidden />
        </button>
        <button type="button" className="icon-button" title="Fit all" onClick={runFitAll}>
          <Maximize2 size={16} aria-hidden />
        </button>
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
            onRenderFramePost={drawLabels}
            nodePointerAreaPaint={(nodeObject, color, ctx) => {
              const node = nodeObject as PositionedNode;
              if (typeof node.x !== "number" || typeof node.y !== "number") return;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, nodeRadius(node, node.id === selectedNodeId, false) + 8, 0, Math.PI * 2);
              ctx.fill();
            }}
            linkColor={(edgeObject) => {
              const edge = edgeObject as GraphEdge;
              const base = getSemanticColor(edge.color, theme);
              return withAlpha(base, isEdgeFocused(edge) ? 0.62 : 0.08);
            }}
            linkWidth={(edgeObject) => {
              const edge = edgeObject as GraphEdge;
              const selected = selectedEdgeId === edge.id || highlightedEdgeIds.has(edge.id);
              return Math.max(selected ? 1.8 : 0.8, (edge.criticality ?? 1) * 0.35 + (edge.dependency_risk ?? 0) * 0.25 + (selected ? 1.2 : 0));
            }}
            linkLineDash={(edgeObject) => getFactStatusStyle((edgeObject as GraphEdge).fact_status).dash}
            linkDirectionalArrowLength={(edgeObject) => (isEdgeFocused(edgeObject as GraphEdge) ? 3.5 : 0)}
            linkDirectionalArrowRelPos={0.78}
            linkDirectionalArrowColor={(edgeObject) => withAlpha(getSemanticColor((edgeObject as GraphEdge).color, theme), 0.68)}
            onNodeHover={(nodeObject) => setHoveredNodeId((nodeObject as GraphNode | null)?.id ?? null)}
            onNodeClick={(nodeObject) => onSelectNode((nodeObject as GraphNode).id)}
            onLinkClick={(edgeObject) => onSelectEdge((edgeObject as GraphEdge).id)}
            onZoom={(transform) => setZoomScale(transform.k)}
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
