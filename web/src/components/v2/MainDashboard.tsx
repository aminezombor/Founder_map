import { useMemo } from "react";
import type { GraphDataset } from "../../types/graph";
import type { DomainId, OpportunityAdvancedFilters, PreferenceWeights, ScoredOpportunity } from "../../scoring/scoringTypes";
import { AdvancedRankingControls } from "./AdvancedRankingControls";
import { DomainSelector } from "./DomainSelector";
import { EvidenceStrip } from "./EvidenceStrip";
import { NextDatasetCard } from "./NextDatasetCard";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityInspector } from "./OpportunityInspector";
import { OpportunityRankTable } from "./OpportunityRankTable";
import { PreferenceSliders } from "./PreferenceSliders";

interface MainDashboardProps {
  datasets: GraphDataset[];
  scoredOpportunities: ScoredOpportunity[];
  totalOpportunityCount: number;
  selectedOpportunity?: ScoredOpportunity;
  weights: PreferenceWeights;
  selectedDomainIds: DomainId[];
  advancedFilters: OpportunityAdvancedFilters;
  onWeightsChange: (weights: PreferenceWeights) => void;
  onDomainsChange: (domainIds: DomainId[]) => void;
  onAdvancedFiltersChange: (filters: OpportunityAdvancedFilters) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}

export function MainDashboard({
  datasets,
  scoredOpportunities,
  totalOpportunityCount,
  selectedOpportunity,
  weights,
  selectedDomainIds,
  advancedFilters,
  onWeightsChange,
  onDomainsChange,
  onAdvancedFiltersChange,
  onSelectOpportunity
}: MainDashboardProps) {
  const countsByDomain = useMemo(
    () => new Map(datasets.map((dataset) => [dataset.id, dataset.opportunities.length])),
    [datasets]
  );
  const visibleOpportunities = scoredOpportunities.slice(0, 40);

  return (
    <div className="dashboard-grid">
      <aside className="dashboard-left">
        <PreferenceSliders weights={weights} onChange={onWeightsChange} />
        <AdvancedRankingControls filters={advancedFilters} onChange={onAdvancedFiltersChange} />
        <DomainSelector selectedDomainIds={selectedDomainIds} onChange={onDomainsChange} countsByDomain={countsByDomain} />
        <NextDatasetCard />
      </aside>

      <section className="dashboard-center">
        <OpportunityRankTable
          opportunities={visibleOpportunities}
          totalCount={totalOpportunityCount}
          filteredCount={scoredOpportunities.length}
          sortBy={advancedFilters.sortBy}
          query={advancedFilters.query}
          selectedOpportunityId={selectedOpportunity?.id}
          onSelect={onSelectOpportunity}
        />
        <div className="opportunity-card-list">
          {visibleOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              rank={index + 1}
              selected={selectedOpportunity?.id === opportunity.id}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </section>

      <OpportunityInspector opportunity={selectedOpportunity} weights={weights} />

      <div className="dashboard-bottom">
        <EvidenceStrip opportunity={selectedOpportunity} />
      </div>
    </div>
  );
}
