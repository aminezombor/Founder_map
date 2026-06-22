import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { StartupHunt } from "../../hunter/hunterTypes";
import { findStartupHunt } from "../../hunter/startupHunterEngine";
import { CouncilVerdictCard } from "./CouncilVerdictCard";
import { EvidenceSignalList } from "./EvidenceSignalList";
import { HunterScore } from "./HunterScore";

interface HuntDeepDiveProps {
  hunts: StartupHunt[];
}

type HuntTab = "council" | "evidence" | "money" | "validation";

const tabs: Array<{ id: HuntTab; label: string }> = [
  { id: "council", label: "Council" },
  { id: "evidence", label: "Evidence" },
  { id: "money", label: "Money / exit" },
  { id: "validation", label: "Validation" }
];

export function HuntDeepDive({ hunts }: HuntDeepDiveProps) {
  const { id } = useParams();
  const hunt = findStartupHunt(hunts, id ? decodeURIComponent(id) : undefined);
  const [activeTab, setActiveTab] = useState<HuntTab>("council");

  if (!hunt) {
    return (
      <div className="v2-doc-page">
        <section className="v2-panel doc-hero">
          <h1>Hunt not found</h1>
          <p>The selected startup hunt is not available in the current world state.</p>
          <Link to="/hunter" className="v2-primary-button">Back to hunter</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="v3-deep-page">
      <section className="v2-panel v3-deep-hero">
        <div>
          <span className="eyebrow">Startup hunt</span>
          <h1>{hunt.title}</h1>
          <p>{hunt.whyNonObvious}</p>
        </div>
        <div className="v3-score-grid hero-scores">
          <HunterScore value={hunt.scores.startupHunterScore} label="Hunter" />
          <HunterScore value={hunt.scores.evidenceScore} label="Evidence" tone="blue" />
          <HunterScore value={hunt.scores.moneyFlowScore} label="Money" tone="teal" />
          <HunterScore value={hunt.scores.riskScore} label="Risk" tone="red" />
        </div>
      </section>

      <section className="v3-deep-grid">
        <article className="v2-panel">
          <h2>Thesis</h2>
          <p>{hunt.thesis}</p>
          <h3>Market gap</h3>
          <p>{hunt.marketGap}</p>
          <h3>Product shape</h3>
          <p>{hunt.productShape}</p>
        </article>
        <article className="v2-panel">
          <h2>First wedge</h2>
          <p>{hunt.firstWedge}</p>
          <h3>Founder decision</h3>
          <p>{hunt.founderDecision}</p>
        </article>
      </section>

      <section className="v2-panel v3-tab-panel">
        <div className="inspector-tab-list" role="tablist" aria-label="Hunt analysis tabs">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : undefined} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="v3-tab-body">
          {activeTab === "council" && (
            <div className="v3-council-grid">
              {hunt.councilVerdicts.map((verdict) => <CouncilVerdictCard key={verdict.lensId} verdict={verdict} />)}
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="v3-two-col">
              <section>
                <h2>Evidence for</h2>
                <EvidenceSignalList signals={hunt.evidenceFor} empty="No supporting evidence attached." />
              </section>
              <section>
                <h2>Evidence against</h2>
                <EvidenceSignalList signals={hunt.evidenceAgainst} empty="No counter-evidence attached." />
              </section>
            </div>
          )}

          {activeTab === "money" && (
            <div className="v3-two-col">
              <section>
                <h2>Money map</h2>
                <dl className="v3-detail-list">
                  <div><dt>Buyer</dt><dd>{hunt.moneyMap.targetBuyer}</dd></div>
                  <div><dt>Budget</dt><dd>{hunt.moneyMap.budgetSource}</dd></div>
                  <div><dt>Why now</dt><dd>{hunt.moneyMap.whyTheyPayNow}</dd></div>
                  <div><dt>Pilot logic</dt><dd>{hunt.moneyMap.pilotPriceLogic}</dd></div>
                  <div><dt>Expansion</dt><dd>{hunt.moneyMap.expansionPath}</dd></div>
                </dl>
              </section>
              <section>
                <h2>Exit map</h2>
                <dl className="v3-detail-list">
                  <div><dt>Likely acquirers</dt><dd>{hunt.exitMap.likelyAcquirers.join(", ") || "No acquirers inferred"}</dd></div>
                  <div><dt>Buy vs build</dt><dd>{hunt.exitMap.buyVsBuildPressure}</dd></div>
                  <div><dt>Trigger</dt><dd>{hunt.exitMap.strategicTrigger}</dd></div>
                  <div><dt>Narrative</dt><dd>{hunt.exitMap.acquisitionNarrative}</dd></div>
                </dl>
              </section>
            </div>
          )}

          {activeTab === "validation" && (
            <div className="v3-three-col">
              <section>
                <h2>Next 7 days</h2>
                <ul className="tight-list">{hunt.validationPlan.next7Days.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section>
                <h2>Next 30 days</h2>
                <ul className="tight-list">{hunt.validationPlan.next30Days.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section>
                <h2>Kill criteria</h2>
                <ul className="tight-list">{hunt.validationPlan.killCriteria.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
