import type { ReactNode } from "react";

export function Layout({ sidebar, graph, detail, statBar }: { sidebar: ReactNode; graph: ReactNode; detail: ReactNode; statBar: ReactNode }) {
  return (
    <div className="app-shell">
      {sidebar}
      <main className="main-region">
        {graph}
        {statBar}
      </main>
      {detail}
    </div>
  );
}
