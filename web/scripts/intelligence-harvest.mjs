import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const thesis = process.argv.slice(2).join(" ").trim();

if (!thesis) {
  console.error("Usage: pnpm run harvest:intelligence -- \"your thesis or market obsession\"");
  process.exit(1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72) || "untitled-thesis";
}

const today = new Date().toISOString().slice(0, 10);
const slug = slugify(thesis);
const outDir = path.join(process.cwd(), "public", "data", "intelligence", "harvests");
const outPath = path.join(outDir, `${today}-${slug}.json`);

const harvest = {
  id: `${today}-${slug}`,
  thesis,
  generatedAt: new Date().toISOString(),
  purpose: "Codex-assisted public/free evidence collection. Fill only with sourced public claims or clearly marked heuristics.",
  searchPrompts: [
    `${thesis} buyer pain public source`,
    `${thesis} procurement budget public source`,
    `${thesis} acquisition acquirer public source`,
    `${thesis} regulation compliance public source`,
    `${thesis} open source github momentum`,
    `${thesis} counter evidence market risk`
  ],
  requiredSignalShape: {
    id: "string",
    title: "string",
    summary: "string",
    signalType: "buyer_pain | budget_movement | procurement | regulation | research_momentum | competitor_activity | acquisition_exit | open_source_momentum | talent_job_demand | counter_evidence",
    sourceUrl: "public URL required for external claims",
    sourceLabel: "string",
    collectedAt: today,
    confidence: "low | medium | high",
    polarity: "for | against | mixed",
    relatedDomains: ["eu-ai-stack", "global-ai-stack", "industrial-software-ot-stack"],
    keywords: ["keyword"]
  },
  signals: []
};

await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(harvest, null, 2)}\n`, "utf8");
console.log(`Created intelligence harvest scaffold: ${outPath}`);
