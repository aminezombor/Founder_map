import type { BoardLens, BoardVerdict, StartupHuntScores } from "./hunterTypes";
import type { ScoredOpportunity } from "../scoring/scoringTypes";

export const founderCouncil: BoardLens[] = [
  {
    id: "renaissance-builder",
    name: "The Renaissance Builder",
    role: "Invention, craft, deep systems, impossible ambition.",
    worldview: "The best companies feel like technology, art, and infrastructure fused into one inevitable object.",
    scoreBias: "ambition"
  },
  {
    id: "product-prophet",
    name: "The Product Prophet",
    role: "Category creation, taste, simplicity, user obsession.",
    worldview: "A great wedge should be obvious to the buyer only after they see it.",
    scoreBias: "simplicity"
  },
  {
    id: "system-architect",
    name: "The System Architect",
    role: "Hidden infrastructure, leverage points, strategic dependencies.",
    worldview: "Control the dependency map and you can control where value moves next.",
    scoreBias: "systems"
  },
  {
    id: "chaos-inventor",
    name: "The Chaos Inventor",
    role: "Strange combinations, asymmetric wedges, weird ideas others miss.",
    worldview: "If the idea is too clean, it is probably already owned by someone boring.",
    scoreBias: "originality"
  },
  {
    id: "contrarian-artist",
    name: "The Contrarian Artist",
    role: "Narrative power, attention, culture, world-building.",
    worldview: "A company becomes dangerous when it names a future people secretly want.",
    scoreBias: "narrative"
  },
  {
    id: "deal-strategist",
    name: "The Deal Strategist",
    role: "Money flows, buyers, exits, acquirers, negotiation logic.",
    worldview: "The idea is only real when budget, urgency, and acquirer pressure line up.",
    scoreBias: "money"
  },
  {
    id: "founder",
    name: "The Founder",
    role: "Your gut conviction, constraints, ambition, taste, and final judgment.",
    worldview: "The machine can argue, but you decide what feels alive enough to chase.",
    scoreBias: "fit"
  }
];

function bounded(value: number) {
  return Math.max(0, Math.min(100, value));
}

function biasScore(lens: BoardLens, scores: StartupHuntScores): number {
  if (lens.scoreBias === "ambition") return scores.ambitionScore;
  if (lens.scoreBias === "simplicity") return scores.validationVelocityScore;
  if (lens.scoreBias === "systems") return scores.worldStateScore;
  if (lens.scoreBias === "originality") return scores.originalityScore;
  if (lens.scoreBias === "narrative") return Math.round((scores.originalityScore + scores.ambitionScore) / 2);
  if (lens.scoreBias === "money") return Math.round((scores.moneyFlowScore + scores.exitScore) / 2);
  return scores.founderFitScore;
}

export function buildCouncilVerdicts(input: {
  opportunity: ScoredOpportunity;
  title: string;
  marketGap: string;
  firstWedge: string;
  scores: StartupHuntScores;
}): BoardVerdict[] {
  return founderCouncil.map((lens) => {
    const contribution = bounded(Math.round((biasScore(lens, input.scores) * 0.75) + (input.scores.evidenceScore * 0.25)));
    if (lens.id === "renaissance-builder") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: `This could become infrastructure, not just a feature, because ${input.marketGap.toLowerCase()}`,
        strongestAgainst: "The first version may look too small compared with the ambition.",
        tenXMove: "Design the wedge so every pilot produces reusable system knowledge and a defensible dataset.",
        evidenceToChangeMind: "Proof that the same bottleneck repeats across three unrelated operators.",
        scoreContribution: contribution
      };
    }
    if (lens.id === "product-prophet") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: `The wedge is understandable: ${input.firstWedge}`,
        strongestAgainst: "The buyer may agree with the pain but still not know what product category this belongs to.",
        tenXMove: "Reduce the first product to one painful yes/no diagnostic the buyer can understand in one meeting.",
        evidenceToChangeMind: "Five buyers repeating the same sentence about the pain without being prompted.",
        scoreContribution: contribution
      };
    }
    if (lens.id === "system-architect") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: `${input.opportunity.breakdown.evidenceStrength.affectedNodeCentrality.toFixed(1)} average node centrality suggests this sits near structural dependencies.`,
        strongestAgainst: "Graph centrality can identify importance, but not automatically willingness to pay.",
        tenXMove: "Turn the map into a control point: dependency visibility, remediation workflow, then operating layer.",
        evidenceToChangeMind: "A buyer using the dependency map to change budget, vendor choice, or deployment sequence.",
        scoreContribution: contribution
      };
    }
    if (lens.id === "chaos-inventor") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: "The weirdness is useful: it combines dependency intelligence, buyer workflow, and strategic timing.",
        strongestAgainst: "If it cannot be demoed fast, the weirdness becomes confusion instead of leverage.",
        tenXMove: "Make a strange but undeniable prototype: one ugly workflow transformed into a clear strategic advantage.",
        evidenceToChangeMind: "A demo that makes a skeptical operator laugh because it is too accurate.",
        scoreContribution: contribution
      };
    }
    if (lens.id === "contrarian-artist") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: `The story has tension: ${input.title} turns hidden market dysfunction into a named enemy.`,
        strongestAgainst: "Narrative alone is not a moat; the product must own a repeatable proof loop.",
        tenXMove: "Name the category around the pain, not the technology.",
        evidenceToChangeMind: "People outside the niche immediately understanding the enemy and repeating the phrase.",
        scoreContribution: contribution
      };
    }
    if (lens.id === "deal-strategist") {
      return {
        lensId: lens.id,
        lensName: lens.name,
        strongestFor: `${input.opportunity.breakdown.possibleAcquirerCategories.slice(0, 3).join(", ")} have plausible strategic reasons to buy instead of build.`,
        strongestAgainst: "Exit logic is weak if the product stays as a services-heavy diagnostic.",
        tenXMove: "Make the wedge produce data or workflow lock-in that an acquirer cannot easily recreate.",
        evidenceToChangeMind: "A strategic buyer saying the pain is tied to budget, procurement, or roadmap pressure this year.",
        scoreContribution: contribution
      };
    }
    return {
      lensId: lens.id,
      lensName: lens.name,
      strongestFor: "This matches the founder's appetite for strange, ambitious, evidence-backed opportunities.",
      strongestAgainst: "Gut conviction should not override missing buyer proof.",
      tenXMove: "Let instinct choose the battlefield, then force validation to choose the first move.",
      evidenceToChangeMind: "A buyer call that either sharpens the wedge or kills it cleanly.",
      scoreContribution: contribution
    };
  });
}
