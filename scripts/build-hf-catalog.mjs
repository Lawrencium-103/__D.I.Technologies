// Pulls the Hugging Face Hub model catalog (handled in lib/hfCatalog.js) and
// writes a full snapshot to data/hf-catalog.json. One-time backfill; the
// scheduled delta sync runs the same core via netlify/functions/hfcatalog-sync.
//
// Usage: node scripts/build-hf-catalog.mjs [maxModels] [configFetchLimit] [outJson]

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pullCatalog, DEFAULT_MAX_MODELS, DEFAULT_CONFIG_LIMIT } from '../lib/hfCatalog.js'

const MAX_MODELS = Math.max(1, Math.min(Number(process.argv[2]) || DEFAULT_MAX_MODELS, 10000))
const CONFIG_LIMIT = Math.max(0, Math.min(Number(process.argv[3]) || DEFAULT_CONFIG_LIMIT, 5000))
const OUT = fileURLToPath(new URL(process.argv[4] || '../data/hf-catalog.json', import.meta.url))

async function main() {
  const { payload } = await pullCatalog({ maxModels: MAX_MODELS, configLimit: CONFIG_LIMIT })
  writeFileSync(OUT, JSON.stringify(payload, null, 2))
  console.log(`Pulled ${payload.rawPulled} raw models -> kept ${payload.count} (excluded: ${JSON.stringify(payload.excluded)})`)
  console.log(`Params: ${payload.coverage.withParams}/${payload.count} (${payload.coverage.paramsRecoveryPct}%) | VRAM rows: ${payload.coverage.withVram}`)
  console.log(`Enrich: ${payload.coverage.configOk} config ok, ${payload.coverage.configFallback} fallback (${JSON.stringify(payload.coverage.fallbackReasons)})`)
  console.log(`Wrote ${OUT} (${(Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(2)} MB)`)
  console.log('Top 5 by downloads:', payload.models.slice(0, 5).map((m) => `${m.id} (${(m.downloads / 1e6).toFixed(1)}M dl${m.vram ? `, ${m.vram.q4km.toFixed(1)}GB@Q4_K_M` : ', no VRAM'})`).join(' | '))
}

main().catch((e) => {
  console.error('Failed:', e.message)
  process.exit(1)
})