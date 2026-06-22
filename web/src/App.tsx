import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { loadDatasets } from "./data/loadGraph";
import { AppShell } from "./components/v2/AppShell";
import { DataPage } from "./components/v2/DataPage";
import { MainDashboard } from "./components/v2/MainDashboard";
import { MethodologyPage } from "./components/v2/MethodologyPage";
import { OpportunityDeepDive } from "./components/v2/OpportunityDeepDive";
import { SettingsPage } from "./components/v2/SettingsPage";
import { CouncilPage } from "./components/v3/CouncilPage";
import { HuntDeepDive } from "./components/v3/HuntDeepDive";
import { StartupHunterDashboard } from "./components/v3/StartupHunterDashboard";
import { WorldStatePage } from "./components/v3/WorldStatePage";
import { MapPage } from "./pages/MapPage";
import { defaultFounderProfile, defaultFounderThesis } from "./hunter/founderDefaults";
import { loadWorldState } from "./hunter/loadWorldState";
import { findStartupHunt, generateStartupHunts } from "./hunter/startupHunterEngine";
import { filterAndSortOpportunities, findScoredOpportunity, scoreOpportunities } from "./scoring/opportunityScoring";
import {
  defaultAdvancedFilters,
  defaultPreferenceWeights,
  defaultScoringDomainIds,
  domainOptions,
  evidenceDomainIds,
  isDomainId,
  scoreableDomainIds,
  type DomainId,
  type OpportunityAdvancedFilters,
  type OpportunityPhase,
  type PreferenceWeights
} from "./scoring/scoringTypes";
import type { GraphDataset } from "./types/graph";
import type { FounderProfile, FounderThesis, WorldState } from "./hunter/hunterTypes";

const THEME_KEY = "founder-map-theme";
const WEIGHTS_KEY = "founder-map-v2-preferences";
const DOMAINS_KEY = "founder-map-v2-domains";
const ADVANCED_FILTERS_KEY = "founder-map-v2-advanced-filters";
const FOUNDER_PROFILE_KEY = "founder-map-v3-founder-profile";
const FOUNDER_THESIS_KEY = "founder-map-v3-founder-thesis";

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
    const allowed = new Set(scoreableDomainIds);
    const valid = parsed.filter((id): id is DomainId => typeof id === "string" && isDomainId(id) && allowed.has(id));
    return valid.length ? valid : defaultScoringDomainIds;
  } catch {
    return defaultScoringDomainIds;
  }
}

function clampScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
}

function isPhase(value: unknown): value is OpportunityPhase {
  return value === "now" || value === "near" || value === "later" || value === "big-bet";
}

function isSortBy(value: unknown): value is OpportunityAdvancedFilters["sortBy"] {
  return (
    value === "finalUtility" ||
    value === "structural" ||
    value === "personalFit" ||
    value === "feasibility" ||
    value === "founderSpeedFit" ||
    value === "strategicLeverage" ||
    value === "buyerAccess" ||
    value === "exitOptionality" ||
    value === "proofVelocity" ||
    value === "wedgeToEmpire"
  );
}

function getInitialAdvancedFilters(): OpportunityAdvancedFilters {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ADVANCED_FILTERS_KEY) || "null") as Partial<OpportunityAdvancedFilters> | null;
    if (!parsed) return defaultAdvancedFilters;
    const phases = Array.isArray(parsed.phases) ? parsed.phases.filter(isPhase) : defaultAdvancedFilters.phases;
    return {
      phases: phases.length ? phases : defaultAdvancedFilters.phases,
      minFinalUtility: clampScore(parsed.minFinalUtility),
      minFeasibility: clampScore(parsed.minFeasibility),
      minExitOptionality: clampScore(parsed.minExitOptionality),
      sortBy: isSortBy(parsed.sortBy) ? parsed.sortBy : defaultAdvancedFilters.sortBy,
      includeEvidenceDomains: Boolean(parsed.includeEvidenceDomains),
      strongGraphEvidenceOnly: Boolean(parsed.strongGraphEvidenceOnly),
      showBigBets: typeof parsed.showBigBets === "boolean" ? parsed.showBigBets : defaultAdvancedFilters.showBigBets,
      query: typeof parsed.query === "string" ? parsed.query : ""
    };
  } catch {
    return defaultAdvancedFilters;
  }
}

function getInitialFounderProfile(): FounderProfile {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FOUNDER_PROFILE_KEY) || "null") as Partial<FounderProfile> | null;
    if (!parsed) return defaultFounderProfile;
    return {
      ...defaultFounderProfile,
      ...parsed,
      preferredDomains: Array.isArray(parsed.preferredDomains) ? parsed.preferredDomains.filter((id): id is DomainId => typeof id === "string" && isDomainId(id)) : defaultFounderProfile.preferredDomains
    };
  } catch {
    return defaultFounderProfile;
  }
}

function getInitialFounderThesis(): FounderThesis {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FOUNDER_THESIS_KEY) || "null") as Partial<FounderThesis> | null;
    if (!parsed || typeof parsed.text !== "string") return defaultFounderThesis;
    return {
      ...defaultFounderThesis,
      ...parsed,
      intensity: typeof parsed.intensity === "number" ? Math.max(0, Math.min(100, parsed.intensity)) : defaultFounderThesis.intensity
    };
  } catch {
    return defaultFounderThesis;
  }
}

function ShellRoute({
  children,
  theme,
  onThemeToggle,
  variant
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  variant?: "default" | "map";
}) {
  return <AppShell theme={theme} onThemeToggle={onThemeToggle} variant={variant}>{children}</AppShell>;
}

export default function App() {
  const [datasets, setDatasets] = useState<GraphDataset[]>([]);
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  const [weights, setWeights] = useState<PreferenceWeights>(() => getInitialWeights());
  const [selectedDomainIds, setSelectedDomainIds] = useState<DomainId[]>(() => getInitialDomains());
  const [advancedFilters, setAdvancedFilters] = useState<OpportunityAdvancedFilters>(() => getInitialAdvancedFilters());
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | undefined>();
  const [founderProfile, setFounderProfile] = useState<FounderProfile>(() => getInitialFounderProfile());
  const [founderThesis, setFounderThesis] = useState<FounderThesis>(() => getInitialFounderThesis());
  const [selectedHuntId, setSelectedHuntId] = useState<string | undefined>();
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
    loadWorldState()
      .then((loaded) => {
        setWorldState(loaded);
        setError(null);
      })
      .catch((loadError: unknown) => {
        console.error(loadError);
        setError(loadError instanceof Error ? loadError.message : "Failed to load V3 world-state intelligence.");
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

  useEffect(() => {
    window.localStorage.setItem(ADVANCED_FILTERS_KEY, JSON.stringify(advancedFilters));
  }, [advancedFilters]);

  useEffect(() => {
    window.localStorage.setItem(FOUNDER_PROFILE_KEY, JSON.stringify(founderProfile));
  }, [founderProfile]);

  useEffect(() => {
    window.localStorage.setItem(FOUNDER_THESIS_KEY, JSON.stringify(founderThesis));
  }, [founderThesis]);

  const effectiveDomainIds = useMemo(() => {
    const ids = new Set(selectedDomainIds);
    if (advancedFilters.includeEvidenceDomains) {
      evidenceDomainIds.forEach((id) => ids.add(id));
    }
    return [...ids].filter((id) => scoreableDomainIds.includes(id));
  }, [advancedFilters.includeEvidenceDomains, selectedDomainIds]);

  const rawScoredOpportunities = useMemo(
    () => scoreOpportunities(datasets, effectiveDomainIds, weights),
    [datasets, effectiveDomainIds, weights]
  );

  const scoredOpportunities = useMemo(
    () => filterAndSortOpportunities(rawScoredOpportunities, advancedFilters),
    [advancedFilters, rawScoredOpportunities]
  );
  const allScoredOpportunities = useMemo(
    () =>
      scoreOpportunities(
        datasets,
        scoreableDomainIds,
        weights
      ),
    [datasets, weights]
  );
  const startupHunts = useMemo(
    () =>
      worldState
        ? generateStartupHunts({
            opportunities: allScoredOpportunities,
            profile: founderProfile,
            thesis: founderThesis,
            worldState
          })
        : [],
    [allScoredOpportunities, founderProfile, founderThesis, worldState]
  );
  const selectedHunt = useMemo(
    () => findStartupHunt(startupHunts, selectedHuntId) ?? startupHunts[0],
    [selectedHuntId, startupHunts]
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

  useEffect(() => {
    if (!startupHunts.length) {
      setSelectedHuntId(undefined);
      return;
    }
    if (!selectedHuntId || !findStartupHunt(startupHunts, selectedHuntId)) {
      setSelectedHuntId(startupHunts[0].id);
    }
  }, [selectedHuntId, startupHunts]);

  function handleDomainChange(domainIds: DomainId[]) {
    setSelectedDomainIds(domainIds.filter((id) => scoreableDomainIds.includes(id)));
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

  if (!datasets.length || !worldState) {
    return (
      <div className="boot-screen">
        <strong>Loading Founder Map</strong>
        <p>Loading local strategic dependency graph data and V3 world-state intelligence...</p>
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
              <StartupHunterDashboard
                hunts={startupHunts}
                selectedHunt={selectedHunt}
                thesis={founderThesis}
                profile={founderProfile}
                worldState={worldState}
                onThesisChange={setFounderThesis}
                onProfileChange={setFounderProfile}
                onSelectHunt={setSelectedHuntId}
              />
            </ShellRoute>
          }
        />
        <Route
          path="/hunter"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <StartupHunterDashboard
                hunts={startupHunts}
                selectedHunt={selectedHunt}
                thesis={founderThesis}
                profile={founderProfile}
                worldState={worldState}
                onThesisChange={setFounderThesis}
                onProfileChange={setFounderProfile}
                onSelectHunt={setSelectedHuntId}
              />
            </ShellRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <MainDashboard
                datasets={datasets}
                scoredOpportunities={scoredOpportunities}
                totalOpportunityCount={rawScoredOpportunities.length}
                selectedOpportunity={selectedOpportunity}
                weights={weights}
                selectedDomainIds={selectedDomainIds}
                advancedFilters={advancedFilters}
                onWeightsChange={setWeights}
                onDomainsChange={handleDomainChange}
                onAdvancedFiltersChange={setAdvancedFilters}
                onSelectOpportunity={setSelectedOpportunityId}
              />
            </ShellRoute>
          }
        />
        <Route
          path="/hunt/:id"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              <HuntDeepDive hunts={startupHunts} />
            </ShellRoute>
          }
        />
        <Route
          path="/world-state"
          element={<ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}><WorldStatePage worldState={worldState} /></ShellRoute>}
        />
        <Route
          path="/council"
          element={<ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}><CouncilPage /></ShellRoute>}
        />
        <Route
          path="/map"
          element={
            <ShellRoute theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))} variant="map">
              <MapPage datasets={datasets} theme={theme} onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))} />
            </ShellRoute>
          }
        />
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
                advancedFilters={advancedFilters}
                countsByDomain={countsByDomain}
                onWeightsChange={setWeights}
                onDomainsChange={handleDomainChange}
                onAdvancedFiltersChange={setAdvancedFilters}
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
