import type { ReactNode } from "react";

export function Layout({ controls, graph, inspector, statBar }: { controls: ReactNode; graph: ReactNode; inspector: ReactNode; statBar: ReactNode }) {
  return (
    <div className="map-workspace">
      <main className="map-stage">
        {graph}
      </main>
      {controls}
      {inspector}
      {statBar}
    </div>
  );
}
