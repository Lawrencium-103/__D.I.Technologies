// Fetches https://huggingface.co/api/models (paginated) and exports the rows
// into a single CSV spreadsheet. No site changes — pure data export.
//
// Usage: node scripts/hf-models-spreadsheet.js [maxModels]
//   maxModels: how many models to pull (default 3000, capped at 5000).

const UPSTREAM = 'https://huggingface.co/api/models'
const PER_PAGE = 1000
const MAX_MODELS = Math.min(Number(process.argv[2]) || 3000, 5000)
const { fileURLToPath } = await import('node:url')
const OUT = fileURLToPath(new URL('../data/hf-models.csv', import.meta.url))

const COLS = ['id', 'pipeline_tag', 'library_name', 'license', 'likes', 'downloads', 'lastModified', 'created_at', 'gated', 'tags']

function csvCell(v) {
  if (v == null) return ''
  const s = Array.isArray(v) ? v.join('|') : String(v)
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

function rowOf(m) {
  const tags = m.tags || []
  const license = (m.cardData && m.cardData.license) ||
    tags.find((t) => t.startsWith('license:'))?.replace(/^license:/, '') ||
    ''
  return [
    m.id,
    m.pipeline_tag,
    m.library_name,
    license,
    m.likes,
    m.downloads,
    m.lastModified,
    m.created_at,
    m.gated,
    tags.filter((t) => !t.startsWith('license:')).join('|'),
  ].map(csvCell).join(',')
}

async function fetchPage(offset) {
  const url = `${UPSTREAM}?limit=${PER_PAGE}&offset=${offset}&sort=downloads&direction=-1&full=true`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('HTTP ' + res.status + ' @ offset ' + offset)
  return res.json()
}

async function main() {
  const out = []
  let offset = 0
  while (out.length < MAX_MODELS) {
    const page = await fetchPage(offset)
    if (!Array.isArray(page) || page.length === 0) break
    out.push(...page)
    offset += page.length
    if (page.length < PER_PAGE) break
  }
  const rows = out.slice(0, MAX_MODELS)
  const lines = [COLS.join(',')]
  for (const m of rows) lines.push(rowOf(m))
  const fs = await import('node:fs')
  fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf8')
  console.log(`Wrote ${rows.length} models -> ${OUT}`)
}

main().catch((e) => {
  console.error('Failed:', e.message)
  process.exit(1)
})
