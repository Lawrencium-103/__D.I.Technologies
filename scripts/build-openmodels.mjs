// Parses the lmmarketcap open-source-ai-models HTML table into a clean JSON snapshot.
// Usage: node scripts/build-openmodels.mjs <path-to-html> [out-json]
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const htmlPath = process.argv[2] || "C:/Users/user/AppData/Local/Temp/opencode/lmc_os.html";
const outPath = process.argv[3] || resolve("src/data/openModels.json");

const html = readFileSync(htmlPath, "utf8");

// Each row is an <a href="/model/..."> with 7 ordered spans.
const rowRe = /<a [^>]*href="\/model\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
const rows = [...html.matchAll(rowRe)];

function spanText(cls, block) {
  const re = new RegExp(`class="([^"]*${cls}[^"]*)"[^>]*>([\\s\\S]*?)<\\/span>`);
  const m = block.match(re);
  if (!m) return "";
  return m[2].replace(/<[^>]+>/g, "").trim();
}

const models = [];
let skipped = 0;
for (const r of rows) {
  const id = r[1];
  const block = r[2];
  // Only keep rows that look like leaderboard entries (have a score span).
  const scoreRaw = spanText("font-semibold font-mono tabular-nums", block);
  if (!scoreRaw || !/^\d+$/.test(scoreRaw)) {
    skipped++;
    continue;
  }
  const free = /\(free\)/i.test(block) || /class="[^"]*">Free<\/span>/.test(block);
  const blockClean = block.replace(/<span[^>]*>Free<\/span>/gi, "");
  const rankRaw = (block.match(/class="text-muted-foreground font-mono text-\[11px\]"[^>]*>(\d+)</) || [])[1] || "";
  const modelHtml = (blockClean.match(/class="font-medium truncate[^"]*"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || "";
  const name = modelHtml
    .replace(/<[^>]+>/g, "")
    .replace(/\(free\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const provider = spanText("truncate hidden sm:block", block) || spanText("text-muted-foreground truncate", block);
  const score = parseInt(scoreRaw, 10);
  const contextRaw = spanText("font-mono tabular-nums hidden sm:block", block);
  const mdBlocks = [...block.matchAll(/class="text-muted-foreground font-mono tabular-nums hidden md:block"[^>]*>([^<]*)</g)];
  const inputRaw = mdBlocks[0] ? mdBlocks[0][1].trim() : "";
  const outputRaw = mdBlocks[1] ? mdBlocks[1][1].trim() : "";

  const parseCtx = (s) => {
    if (!s) return null;
    const m = s.match(/([\d.]+)\s*([KM])?/i);
    if (!m) return null;
    let n = parseFloat(m[1]);
    if (m[2] === "K") n *= 1e3;
    if (m[2] === "M") n *= 1e6;
    return n;
  };
  const parsePrice = (s) => {
    if (!s || /free/i.test(s)) return 0;
    const m = s.match(/\$?([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  };

  models.push({
    id,
    rank: parseInt(rankRaw, 10) || models.length + 1,
    name,
    provider: provider || "Unknown",
    score,
    context: contextRaw,
    contextTokens: parseCtx(contextRaw),
    input: inputRaw,
    output: outputRaw,
    inputPerM: parsePrice(inputRaw),
    outputPerM: parsePrice(outputRaw),
    free,
  });
}

models.sort((a, b) => a.rank - b.rank);
const payload = {
  source: "https://lmmarketcap.com/open-source-ai-models",
  fetchedAt: new Date().toISOString(),
  count: models.length,
  models,
};
writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Parsed ${models.length} open models (skipped ${skipped} non-rows) -> ${outPath}`);
console.log("Top 3:", models.slice(0, 3).map((m) => `${m.rank}. ${m.name} (${m.provider}) ${m.score}`).join(" | "));
