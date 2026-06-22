import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { loadDatasets } from "./data/loadGraph";
import { AppShell } from "./components/v2/AppShell";
import { DataPage } from "./components/v2/DataPage";
import { MainDashboard } from "./components/v2/MainDashboard";
import { MethodologyPage } from "./components/v2/MethodologyPage";
import { OpportunityDeepDive } from "./components/v2/OpportunityDeepDive";
import { SettingsPage } from "./components/v2/SettingsPage";
import { MapPage } from "./pages/MapPage";
import { findScoredOpportunity, scoreOpportunities } from "./scoring/opportunityScoring";
import {
  defaultPreferenceWeights,
  defaultScoringDomainIds,
  domainOptions,
  isDomainId,
  type DomainId,
  type PreferenceWeights
} from "./scoring/scoringTypes";
import type { GraphDataset } from "./types/graph";

const THEME_KEY = "founder-map-theme";
const WEIGHTS_KEY = "founder-map-v2-preferences";
const DOMAINS_KEY = "founder-map-v2-domains";

function getInitialTheme(): "light" | "dark" {
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function clampWeight(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(3, Math.round(value))) : 2;
}

function getInitialWeights(): PreferenceWeights {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WEIGHTS_KEY) || "null") as Partial<PreferenceWeights> | null;
    if (!parsed) return defaultPreferenceWeights;
    return {
      feasibility: clampWeight(parsed.feasibility),
      founderSpeedFit: clampWeight(parsed.founderSpeedFit),
      strategicLeverage: clampWeight(parsed.strategicLeverage),
      buyerAccess: clampWeight(parsed.buyerAccess),
      exitOptionality: clampWeight(parsed.exitOptionality)
    };
  } catch {
    return defaultPreferenceWeights;
  }
}

function getInitialDomains(): DomainId[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DOMAINS_KEY) || "null") as unknown;
    if (!Array.isArray(parsed)) return defaultScoringDomainIds;
    const allowed = new Set(domainOptions.filter((domain) => domain.includedInScoring && !domain.planned).map((domain) => domain.id));
    const valid = parsed.filter((id): id is DomainId => typeof id === "string" && isDomainId(id) && allowed.has(id));
    return valid.length ? valid : defaultScoringDomainIds;
  } catch {
    return defaultScoringDomainIds;
  }
}

function ShellRoute({
  children,
  theme,
  onThemeToggle
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}) {
  return <AppShell theme={theme} onThemeToggle={onThemeToggle}>{children}</AppShell>;
}

export default function App() {
  const [datasets, setDatasets] = useState<GraphDataset[]>([]);
  const [weights, setWeights] = useState<PreferenceWeights>(() => getInitialWeights());
  const [selectedDomainIds, setSelectedDomainIds] = useState<DomainId[]>(() => getInitialDomains());
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | undefined>();
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
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    window.localStorage.setItem(DOMAINS_KEY, JSON.stringify(selectedDomainIds));
  }, [selectedDomainIds]);

  const scoredOpportunities = useMemo(
    () => scoreOpportunities(datasets, selectedDomainIds, weights),
    [datasets, selectedDomainIds, weights]
  );
  const allScoredOpportunities = useMemo(
    () =>
      scoreOpportunities(
        datasets,
        domainOptions.filter((domain) => domain.includedInScoring && !domain.planned).map((domain) => domain.id),
        weights
      ),
    [datasets, weights]
  );
  const selectedOpportunity = useMemo(
    () => findScoredOpportunity(scoredOpportunities, selectedOpportunityId) ?? scoredOpportunities[0],
    [scoredOpportunities, selectedOpportunityId]
  );
  const countsByDomain = useMemo(
    () => new Map(datasets.map((dataset) => [dataset.id, dataset.opportunities.length])),
    [datasets]
  );

  useEffect(() => {
    if (!scoredOpportunities.length) {
      setSelectedOpportunityId(undefined);
      return;
    }
    if (!selectedOpportunityId || !findScoredOpportunity(scoredOpportunities, selectedOpportunityId)) {
      setSelectedOpportunityId(scoredOpportunities[0].id);
    }
  }, [scoredOpportunities, selectedOpportunityId]);

  function handleDomainChange(domainIds: DomainId[]) {
    setSelectedDomainIds(domainIds.filter((id) => domainOptions.some((domain) => domain.id === id && domain.includedInScoring && !domain.planned)));
  }

  if (error) {
    return (
      <div className="boot-screen">
        <strong>Founder Map could not load.</strong>
        <p>{error}</p>
        <span>Run pnpm run sync-data before starting the dev server.</span>
      </div>
    );
  }

  if (!datasets.length) {
    return (
      <div className="boot-screen">
        <strong>Loading Founder Map</strong>
        <p>Loading local strategic dependency graph data...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <MainDashboard
                datasets={datasets}
                scoredOpportunities={scoredOpportunities}
                selectedOpportunity={selectedOpportunity}
                weights={weights}
                selectedDomainIds={selectedDomainIds}
                onWeightsChange={setWeights}
                onDomainsChange={handleDomainChange}
                onSelectOpportunity={setSelectedOpportunityId}
              />
            </ShellRoute>
          }
        />
        <Route path="/map" element={<MapPage datasets={datasets} theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))} />} />
        <Route
          path="/methodology"
          element={<ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}><MethodologyPage /></ShellRoute>}
        />
        <Route
          path="/data"
          element={<ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}><DataPage datasets={datasets} /></ShellRoute>}
        />
        <Route
          path="/settings"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <SettingsPage
                weights={weights}
                selectedDomainIds={selectedDomainIds}
                countsByDomain={countsByDomain}
                onWeightsChange={setWeights}
                onDomainsChange={handleDomainChange}
              />
            </ShellRoute>
          }
        />
        <Route
          path="/opportunity/:id"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <OpportunityDeepDive opportunities={allScoredOpportunities} />
            </ShellRoute>
          }
        />
        <Route
          path="*"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <div className="v2-doc-page">
                <section className="v2-panel doc-hero">
                  <h1>Page not found</h1>
                  <p>This route does not exist in Founder Map.</p>
                  <Link to="/" className="v2-primary-button">Back to dashboard</Link>
                </section>
              </div>
            </ShellRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
