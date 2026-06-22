import type { WorldState } from "./hunterTypes";

export async function loadWorldState(): Promise<WorldState> {
  const response = await fetch("/data/intelligence/world-state.json");
  if (!response.ok) {
    throw new Error(`Failed to load world-state intelligence: ${response.status}`);
  }
  return (await response.json()) as WorldState;
}
