import type { FounderProfile, FounderThesis } from "./hunterTypes";

export const defaultFounderProfile: FounderProfile = {
  id: "founder",
  name: "Founder",
  constraint: "solo",
  geography: "france-eu",
  buildMode: "software-first",
  ambitionMode: "world-bending",
  preferredDomains: ["eu-ai-stack", "global-ai-stack", "industrial-software-ot-stack"],
  geniusIdeas: [
    "Robotics is blocked by deployment readiness, not hardware.",
    "Industrial AI fails when data, asset context, and governance are missing.",
    "Strategic dependency maps should become operating systems, not reports."
  ],
  hatedIdeas: [
    "Generic AI wrappers with no workflow ownership.",
    "Dashboards that do not change budget, procurement, or operations.",
    "Consulting disguised as software."
  ],
  admiredCompanies: ["Palantir", "SpaceX", "Anduril"]
};

export const defaultFounderThesis: FounderThesis = {
  id: "default-thesis",
  text: "The next dangerous startup is a software-first wedge that exposes hidden industrial, AI, defence, or infrastructure dependencies and turns them into buyer action.",
  createdAt: "2026-06-22",
  intensity: 86
};
