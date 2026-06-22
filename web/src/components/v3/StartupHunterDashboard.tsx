import { Link } from "react-router-dom";
import { Brain, Compass, Sparkles } from "lucide-react";
import type { FounderProfile, FounderThesis, StartupHunt, WorldState } from "../../hunter/hunterTypes";
import { HunterScore } from "./HunterScore";
import { CouncilVerdictCard } from "./CouncilVerdictCard";

interface StartupHunterDashboardProps {
  hunts: StartupHunt[];
  selectedHunt?: StartupHunt;
  thesis: FounderThesis;
  profile: FounderProfile;
  worldState: WorldState;
  onThesisChange: (thesis: FounderThesis) => void;
  onProfileChange: (profile: FounderProfile) => void;
  onSelectHunt: (huntId: string) => void;
}

export function StartupHunterDashboard({
  hunts,
  selectedHunt,
  thesis,
  profile,
  worldState,
  onThesisChange,
  onProfileChange,
  onSelectHunt
}: StartupHunterDashboardProps) {
  const topSignals = worldState.signals.slice(0, 4);

  return (
    <div className="v3-hunter-page">
      <section className="v3-hero-panel">
        <div>
          <span className="eyebrow">Founder Council</span>
          <h1>Turn messy markets into dangerous startup hunts.</h1>
          <p>{worldState.summary}</p>
        </div>
        <div className="v3-hero-actions">
          <Link to="/world-state" className="v2-secondary-button"><Compass size={16} aria-hidden /> World state</Link>
          <Link to="/council" className="v2-secondary-button"><Brain size={16} aria-hidden /> Council</Link>
        </div>
      </section>

      <section className="v3-hunter-grid">
        <aside className="v3-control-stack">
          <section className="v2-panel v3-thesis-panel">
            <div className="v2-section-head">
              <div>
                <h2>Your thesis</h2>
                <p>One belief. The council turns it into hunts.</p>
              </div>
              <Sparkles size={18} aria-hidden />
            </div>
            <textarea
              value={thesis.text}
              onChange={(event) => onThesisChange({ ...thesis, text: event.target.value, intensity: Math.max(20, Math.min(100, event.target.value.length)) })}
              rows={6}
              aria-label="Founder thesis"
            />
            <label className="mini-range">
              <span>Gut intensity <b>{thesis.intensity}</b></span>
              <input type="range" min="0" max="100" value={thesis.intensity} onChange={(event) => onThesisChange({ ...thesis, intensity: Number(event.target.value) })} />
            </label>
          </section>

          <section className="v2-panel v3-profile-panel">
            <h2>Founder center</h2>
            <label>
              <span>Constraint</span>
              <select value={profile.constraint} onChange={(event) => onProfileChange({ ...profile, constraint: event.target.value as FounderProfile["constraint"] })}>
                <option value="solo">Solo</option>
                <option value="small-team">Small team</option>
                <option value="fundraise-ready">Fundraise-ready</option>
              </select>
            </label>
            <label>
              <span>Geography</span>
              <select value={profile.geography} onChange={(event) => onProfileChange({ ...profile, geography: event.target.value as FounderProfile["geography"] })}>
                <option value="france-eu">France / EU first</option>
                <option value="global">Global</option>
                <option value="us">US first</option>
              </select>
            </label>
            <label>
              <span>Build mode</span>
              <select value={profile.buildMode} onChange={(event) => onProfileChange({ ...profile, buildMode: event.target.value as FounderProfile["buildMode"] })}>
                <option value="software-first">Software-first</option>
                <option value="hardware-allowed">Hardware allowed</option>
                <option value="deeptech">Deeptech</option>
              </select>
            </label>
            <label>
              <span>Ambition</span>
              <select value={profile.ambitionMode} onChange={(event) => onProfileChange({ ...profile, ambitionMode: event.target.value as FounderProfile["ambitionMode"] })}>
                <option value="fast-proof">Fast proof</option>
                <option value="venture-scale">Venture-scale</option>
                <option value="world-bending">World-bending</option>
              </select>
            </label>
          </section>

          <section className="v2-panel v3-world-mini">
            <h2>World-state pressure</h2>
            {topSignals.map((signal) => (
              <div key={signal.id}>
                <strong>{signal.title}</strong>
                <span>{signal.signalType.replaceAll("_", " ")} / {signal.confidence}</span>
              </div>
            ))}
          </section>
        </aside>

        <section className="v2-panel v3-hunt-list">
          <div className="v2-section-head">
            <div>
              <h2>Startup hunts</h2>
              <p>{hunts.length} generated from graph evidence, world-state signals, and your founder center.</p>
            </div>
            <Link to="/dashboard" className="v2-secondary-button">V2 dashboard</Link>
          </div>
          {hunts.slice(0, 18).map((hunt, index) => (
            <button
              key={hunt.id}
              type="button"
              className={`v3-hunt-row${selectedHunt?.id === hunt.id ? " selected" : ""}`}
              onClick={() => onSelectHunt(hunt.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{hunt.title}</strong>
              <em>{hunt.whyNonObvious}</em>
              <HunterScore value={hunt.scores.startupHunterScore} />
            </button>
          ))}
        </section>

        <aside className="v2-panel v3-selected-hunt">
          {selectedHunt ? (
            <>
              <span className="eyebrow">Selected hunt</span>
              <h2>{selectedHunt.title}</h2>
              <p>{selectedHunt.marketGap}</p>
              <div className="v3-score-grid">
                <HunterScore value={selectedHunt.scores.startupHunterScore} label="Hunter" />
                <HunterScore value={selectedHunt.scores.originalityScore} label="Originality" tone="purple" />
                <HunterScore value={selectedHunt.scores.moneyFlowScore} label="Money" tone="teal" />
                <HunterScore value={selectedHunt.scores.councilDisagreementScore} label="Tension" tone="orange" />
              </div>
              <section>
                <h3>First wedge</h3>
                <p>{selectedHunt.firstWedge}</p>
              </section>
              <section>
                <h3>Council pulse</h3>
                {selectedHunt.councilVerdicts.slice(0, 2).map((verdict) => <CouncilVerdictCard key={verdict.lensId} verdict={verdict} />)}
              </section>
              <div className="inspector-actions">
                <Link to={`/hunt/${encodeURIComponent(selectedHunt.id)}`} className="v2-primary-button">Deep hunt</Link>
                <Link to={`/map?dataset=${encodeURIComponent(selectedHunt.sourceDatasetId)}`} className="v2-secondary-button">Evidence map</Link>
              </div>
            </>
          ) : (
            <p className="muted">No hunts available yet.</p>
          )}
        </aside>
      </section>
    </div>
  );
}
