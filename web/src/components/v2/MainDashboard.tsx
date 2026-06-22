import { useMemo } from "react";
import type { GraphDataset } from "../../types/graph";
import type { DomainId, PreferenceWeights, ScoredOpportunity } from "../../scoring/scoringTypes";
import { DomainSelector } from "./DomainSelector";
import { EvidenceStrip } from "./EvidenceStrip";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityInspector } from "./OpportunityInspector";
import { OpportunityRankTable } from "./OpportunityRankTable";
import { PreferenceSliders } from "./PreferenceSliders";

interface MainDashboardProps {
  datasets: GraphDataset[];
  scoredOpportunities: ScoredOpportunity[];
  selectedOpportunity?: ScoredOpportunity;
  weights: PreferenceWeights;
  selectedDomainIds: DomainId[];
  onWeightsChange: (weights: PreferenceWeights) => void;
  onDomainsChange: (domainIds: DomainId[]) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}

export function MainDashboard({
  datasets,
  scoredOpportunities,
  selectedOpportunity,
  weights,
  selectedDomainIds,
  onWeightsChange,
  onDomainsChange,
  onSelectOpportunity
}: MainDashboardProps) {
  const countsByDomain = useMemo(
    () => new Map(datasets.map((dataset) => [dataset.id, dataset.opportunities.length])),
    [datasets]
  );
  const visibleOpportunities = scoredOpportunities.slice(0, 24);

  return (
    <div className="dashboard-grid">
      <aside className="dashboard-left">
        <PreferenceSliders weights={weights} onChange={onWeightsChange} />
        <DomainSelector selectedDomainIds={selectedDomainIds} onChange={onDomainsChange} countsByDomain={countsByDomain} />
      </aside>

      <section className="dashboard-center">
        <OpportunityRankTable
          opportunities={visibleOpportunities}
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

      <OpportunityInspector opportunity={selectedOpportunity} />

      <div className="dashboard-bottom">
        <EvidenceStrip opportunity={selectedOpportunity} />
      </div>
    </div>
  );
}
