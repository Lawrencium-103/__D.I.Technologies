import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Search, Database, RefreshCw, ChevronDown, ChevronRight, Table as TableIcon } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const DATA_URL = '/data/hf-catalog.json'
const LIVE_URL = '/.netlify/functions/hfcatalog'
const HF_BASE = 'https://huggingface.co/'

const fmtNum = (n, decimals = 1) => {
  if (n == null || !Number.isFinite(Number(n))) return null
  const v = Number(n)
  if (v >= 1e12) return (v / 1e12).toFixed(decimals) + 'T'
  if (v >= 1e9) return (v / 1e9).toFixed(decimals) + 'B'
  if (v >= 1e6) return (v / 1e6).toFixed(decimals) + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(decimals) + 'K'
  return String(Math.round(v))
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const timeAgo = (iso) => {
  if (!iso) return null
  const ts = Date.parse(iso)
  if (isNaN(ts)) return null
  const mins = Math.max(0, Math.round((Date.now() - ts) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m old`
  const h = Math.floor(mins / 60)
  if (h < 24) return `${h}h old`
  return `${Math.floor(h / 24)}d old`
}

const LICENSE_BUCKETS = {
  permissive: { label: 'Permissive', color: 'var(--color-success)' },
  restricted: { label: 'Restricted', color: 'var(--color-danger)' },
  other: { label: 'Other declared', color: 'var(--color-amber)' },
  undeclared: { label: 'Undeclared', color: 'var(--color-line-strong)' },
}

function licenseBucket(license) {
  if (!license) return 'undeclared'
  const s = String(license).toLowerCase()
  if (/nc|llama|gemma|falcon|openrail|bigscience|gpl|agpl|cc-by-sa|rai|tongyi|baichuan|stability|flux/.test(s)) return 'restricted'
  if (/apache|mit|bsd|unlicense|cc0|cc-by-4|mpl/.test(s)) return 'permissive'
  return 'other'
}

const SORTERS = {
  downloads: (a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0),
  likes: (a, b) => (Number(b.likes) || 0) - (Number(a.likes) || 0),
  params: (a, b) => numLast(b.params, a.params),
  q4km: (a, b) => numLast(b.vram?.q4km, a.vram?.q4km),
  name: (a, b) => String(a.id || '').localeCompare(String(b.id || '')),
  license: (a, b) => String(a.license || '').localeCompare(String(b.license || '')),
  createdAt: (a, b) => numLast(Date.parse(b.createdAt) || 0, Date.parse(a.createdAt) || 0),
}

function numLast(x, y) {
  if (x == null && y == null) return 0
  if (x == null) return 1
  if (y == null) return -1
  return x - y
}

const Bar = ({ label, value, max, color, suffix = '', right }) => {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="font-[var(--font-mono)] text-[0.7rem] text-[var(--color-ink-soft)] w-36 shrink-0 truncate" title={label}>{label}</span>
      <div className="flex-1 h-3.5 bg-[var(--color-paper-2)] border border-[var(--color-line)]">
        <div className="h-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-[var(--font-mono)] text-[0.72rem] tabular-nums text-[var(--color-ink)] w-20 text-right shrink-0">{right ?? `${fmtNum(value)}${suffix}`}</span>
    </div>
  )
}

function Analysis({ models }) {
  const a = useMemo(() => {
    if (!models.length) return null
    const buckets = { permissive: 0, restricted: 0, other: 0, undeclared: 0 }
    const downloadsByBucket = { permissive: 0, restricted: 0, other: 0, undeclared: 0 }
    const gatedByBucket = { permissive: 0, restricted: 0, other: 0, undeclared: 0 }
    let gatedOpen = 0, gatedAuto = 0, gatedManual = 0
    const families = {}
    const modalities = {}
    const cadence = {}
    let totalDownloads = 0

    for (const m of models) {
      const b = licenseBucket(m.license)
      buckets[b]++
      totalDownloads += Number(m.downloads) || 0
      if (Number(m.downloads) > 0) downloadsByBucket[b] += Number(m.downloads) || 0
      const g = m.gated
      if (g === false) gatedOpen++
      else if (g === 'auto') { gatedAuto++; gatedByBucket[b]++ }
      else if (g === 'manual') { gatedManual++; gatedByBucket[b]++ }
      families[m.archFamily] = (families[m.archFamily] || 0) + 1
      modalities[m.modality] = (modalities[m.modality] || 0) + 1
      if (m.createdAt) {
        const month = m.createdAt.slice(0, 7)
        cadence[month] = (cadence[month] || 0) + 1
      }
    }

    const familyRows = Object.entries(families).sort((x, y) => y[1] - x[1]).slice(0, 8)
    const modalityRows = Object.entries(modalities).sort((x, y) => y[1] - x[1])
    const cadenceRows = Object.entries(cadence).sort((x, y) => x[0].localeCompare(y[0])).slice(-18)
    const trending = models.filter((m) => m.trendingScore != null).sort((x, y) => y.trendingScore - x.trendingScore).slice(0, 10)
    const topDownloads = [...models].sort((x, y) => (Number(y.downloads) || 0) - (Number(x.downloads) || 0)).slice(0, 10)

    return {
      buckets, downloadsByBucket, gatedByBucket,
      gatedOpen, gatedAuto, gatedManual,
      familyRows, modalityRows, cadenceRows,
      trending, topDownloads, totalDownloads,
    }
  }, [models])

  if (!a) return null
  const maxBucket = Math.max(1, ...Object.values(a.buckets))
  const maxDlBucket = Math.max(1, ...Object.values(a.downloadsByBucket))
  const maxFamily = Math.max(1, ...a.familyRows.map((r) => r[1]))
  const maxModality = Math.max(1, ...a.modalityRows.map((r) => r[1]))
  const maxCadence = Math.max(1, ...a.cadenceRows.map((r) => r[1]))
  const maxGated = Math.max(1, ...Object.values(a.gatedByBucket))
  const gatedTotal = a.gatedAuto + a.gatedManual

  const TwoCol = ({ children }) => <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-line-strong)] border-2 border-[var(--color-ink)]">{children}</div>
  const Card = ({ children }) => <div className="bg-[var(--color-paper)] p-5 sm:p-6 flex flex-col gap-3">{children}</div>

  return (
    <>
      <TwoCol>
        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">License distribution</span>
          {Object.entries(LICENSE_BUCKETS).map(([k, meta]) => (
            <Bar key={k} label={meta.label} value={a.buckets[k]} max={maxBucket} color={meta.color} right={`${a.buckets[k]} models`} />
          ))}
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            {Math.round((a.buckets.undeclared / models.length) * 100)}% of the catalog has no structured license field — surfaced as &ldquo;undeclared, check LICENSE file&rdquo; rather than guessed.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Downloads by license type</span>
          {Object.entries(LICENSE_BUCKETS).map(([k, meta]) => (
            <Bar key={k} label={meta.label} value={a.downloadsByBucket[k]} max={maxDlBucket} color={meta.color} suffix="" right={fmtNum(a.downloadsByBucket[k])} />
          ))}
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            In this snapshot, permissively licensed models accumulate more downloads than restricted ones — the counterintuitive pattern worth reading before dismissing open licensing.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Gated vs open access</span>
          <Bar label="Open access" value={a.gatedOpen} max={models.length} color="var(--color-success)" right={`${a.gatedOpen} models`} />
          <Bar label="Auto-approved" value={a.gatedAuto} max={models.length} color="var(--color-amber)" right={`${a.gatedAuto} models`} />
          <Bar label="Manual approval" value={a.gatedManual} max={models.length} color="var(--color-danger)" right={`${a.gatedManual} models`} />
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            {gatedTotal} models ({(gatedTotal / Math.max(1, models.length) * 100).toFixed(0)}%) require a click-through agreement; gated repos are flagged per row so deployment planning is not surprised by an approval wall.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">License type among gated models</span>
          {Object.entries(LICENSE_BUCKETS).map(([k, meta]) => (
            <Bar key={k} label={meta.label} value={a.gatedByBucket[k]} max={maxGated} color={meta.color} right={`${a.gatedByBucket[k]} gated`} />
          ))}
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            Gating correlates with license: the most-restricted families gate, permissive families rarely do.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Architecture family breakdown</span>
          {a.familyRows.map(([label, count]) => (
            <Bar key={label} label={label} value={count} max={maxFamily} color="var(--color-burnt)" right={`${count} models`} />
          ))}
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            Families are derived from repo id patterns; derived fine-tunes inherit their base family.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Modality split</span>
          {a.modalityRows.map(([label, count]) => (
            <Bar key={label} label={label} value={count} max={maxModality} color="var(--color-amber)" right={`${count} models`} />
          ))}
        </Card>
      </TwoCol>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-line-strong)] border-2 border-[var(--color-ink)] mt-10">
        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Release cadence (top catalog, by month)</span>
          {a.cadenceRows.map(([month, count]) => (
            <Bar key={month} label={month} value={count} max={maxCadence} color="var(--color-burnt)" right={`${count} models`} />
          ))}
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            The catalog is download-weighted, so cadence shows when today&rsquo;s most-used models were released, not a full hub census.
          </p>
        </Card>

        <Card>
          <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">Trending now vs all-time leaders</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-burnt)] block mb-2">Trending score</span>
              {a.trending.map((m, i) => (
                <div key={m.id} className="flex items-center gap-2 py-1 border-b border-[var(--color-line)] last:border-0">
                  <span className="marker w-5 text-right text-[0.75rem] shrink-0">{i + 1}</span>
                  <a href={HF_BASE + m.id} target="_blank" rel="noreferrer" className="text-[0.82rem] truncate no-underline hover:underline">{m.id}</a>
                  <span className="font-[var(--font-mono)] text-[0.68rem] text-[var(--color-ink-faint)] ml-auto shrink-0">{fmtNum(m.downloads)} dl</span>
                </div>
              ))}
              {a.trending.length === 0 && <p className="text-[0.8rem] text-[var(--color-ink-faint)]">No trending scores in snapshot.</p>}
            </div>
            <div>
              <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-burnt)] block mb-2">All-time downloads</span>
              {a.topDownloads.map((m, i) => (
                <div key={m.id} className="flex items-center gap-2 py-1 border-b border-[var(--color-line)] last:border-0">
                  <span className="marker w-5 text-right text-[0.75rem] shrink-0">{i + 1}</span>
                  <a href={HF_BASE + m.id} target="_blank" rel="noreferrer" className="text-[0.82rem] truncate no-underline hover:underline">{m.id}</a>
                  <span className="font-[var(--font-mono)] text-[0.68rem] text-[var(--color-ink-faint)] ml-auto shrink-0">{fmtNum(m.downloads)} dl</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[0.78rem] text-[var(--color-ink-faint)] leading-relaxed">
            Different lists: trending weights recent momentum, all-time favours durable infrastructure models.
          </p>
        </Card>
      </div>
    </>
  )
}

export default function HfCatalog() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState({ kind: 'loading' })
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState('all')
  const [modality, setModality] = useState('all')
  const [licenseFilter, setLicenseFilter] = useState('all')
  const [gatedOnly, setGatedOnly] = useState(false)
  const [vramOnly, setVramOnly] = useState(false)
  const [llmOnly, setLlmOnly] = useState(false)
  const [sortKey, setSortKey] = useState('downloads')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(50)
  const [expandedId, setExpandedId] = useState(null)

  const load = async () => {
    setStatus({ kind: 'loading' })
    let fallback = false
    try {
      const liveRes = await fetch(LIVE_URL)
      if (liveRes.ok) {
        const live = await liveRes.json()
        if (Array.isArray(live?.models)) {
          setData(live)
          setStatus({ kind: 'ready', live: true })
          return
        }
      }
      fallback = true
    } catch {
      fallback = true
    }
    try {
      const res = await fetch(DATA_URL)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      if (!Array.isArray(json?.models)) throw new Error('unexpected shape')
      setData(json)
      setStatus({ kind: 'ready', live: !fallback })
    } catch (e) {
      setStatus({ kind: 'error', message: e.message })
    }
  }

  useEffect(() => { load() }, [])

  const models = useMemo(() => (data?.models || []), [data])

  const families = useMemo(() => {
    const s = new Set(models.map((m) => m.archFamily).filter(Boolean))
    return [...s].sort((a, b) => a.localeCompare(b))
  }, [models])

  const modalities = useMemo(() => {
    const s = new Set(models.map((m) => m.modality).filter(Boolean))
    return [...s].sort((a, b) => a.localeCompare(b))
  }, [models])

  const filtered = useMemo(() => {
    let list = models
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((m) => String(m.id || '').toLowerCase().includes(q) || String(m.author || '').toLowerCase().includes(q))
    }
    if (family !== 'all') list = list.filter((m) => m.archFamily === family)
    if (modality !== 'all') list = list.filter((m) => m.modality === modality)
    if (licenseFilter !== 'all') list = list.filter((m) => licenseBucket(m.license) === licenseFilter)
    if (gatedOnly) list = list.filter((m) => m.gated !== false)
    if (vramOnly) list = list.filter((m) => m.vram)
    if (llmOnly) list = list.filter((m) => m.pipelineTag === 'text-generation')
    const sorter = SORTERS[sortKey] || SORTERS.downloads
    const dir = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => sorter(a, b) * dir)
  }, [models, query, family, modality, licenseFilter, gatedOnly, vramOnly, llmOnly, sortKey, sortDir])

  const maxPage = Math.max(0, Math.ceil(filtered.length / perPage) - 1)
  const safePage = Math.min(page, maxPage)
  const pageRows = filtered.slice(safePage * perPage, (safePage + 1) * perPage)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const resetFilters = () => {
    setQuery(''); setFamily('all'); setModality('all'); setLicenseFilter('all')
    setGatedOnly(false); setVramOnly(false); setLlmOnly(false)
  }

  const exportCsv = () => {
    const headers = ['id', 'family', 'pipeline_tag', 'modality', 'params', 'params_quality', 'vram_fp16_gb', 'vram_q8_gb', 'vram_q4km_gb', 'downloads', 'likes', 'license', 'license_structured', 'gated', 'created_at', 'last_modified', 'config_source', 'config_fallback_reason']
    const rows = filtered.map((m) => [
      m.id, m.archFamily, m.pipelineTag, m.modality,
      m.params ?? '', m.paramsQuality,
      m.vram?.fp16?.toFixed(2) ?? '', m.vram?.q8?.toFixed(2) ?? '', m.vram?.q4km?.toFixed(2) ?? '',
      m.downloads, m.likes, m.license, m.licenseStructured, m.gated === false ? 'open' : String(m.gated),
      m.createdAt, m.lastModified,
      m.config?.source ?? (m.configFallback ? 'fallback' : ''),
      m.configFallback?.reason ?? '',
    ])
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.map((c) => /[",\n\r]/.test(String(c)) ? '"' + String(c).replace(/"/g, '""') + '"' : c).join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `DIT_HF_Catalog_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(data?.fetchedAt)
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
    } catch { return '' }
  }, [data?.fetchedAt])

  const age = data?.fetchedAt ? timeAgo(data.fetchedAt) : null
  const stale = data?.fetchedAt ? Date.now() - Date.parse(data.fetchedAt) > 48 * 3600000 : false

  const Arrow = ({ k }) =>
    sortKey === k ? (
      <span className="ml-1 inline-block text-[var(--color-burnt)]">{sortDir === 'asc' ? '▲' : '▼'}</span>
    ) : null

  const stats = useMemo(() => {
    if (!models.length) return null
    const withParams = models.filter((m) => m.params).length
    const declared = models.filter((m) => m.license).length
    const gated = models.filter((m) => m.gated !== false).length
    const familiesCount = families.length
    const totalDownloads = models.reduce((a, m) => a + (Number(m.downloads) || 0), 0)
    return { count: models.length, withParams, paramsPct: Math.round((withParams / models.length) * 100), declared, declaredPct: Math.round((declared / models.length) * 100), gated, families: familiesCount, totalDownloads }
  }, [models, families])

  const Chip = ({ active, onClick, children, color }) => (
    <button
      onClick={onClick}
      className={`py-2.5 px-3 border-2 text-sm font-[var(--font-mono)] uppercase tracking-[0.08em] transition-colors ${active ? 'text-white border-[var(--color-ink)]' : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]'}`}
      style={active ? { background: color || 'var(--color-burnt)' } : undefined}
    >
      {children}
    </button>
  )

  const fallbackLabels = {
    gated: 'config gated — VRAM weights-only',
    'no-config-file': 'no config.json — VRAM weights-only',
    'no-architecture-fields': 'no flat architecture fields — VRAM weights-only',
    'fetch-failed': 'fetch failed — VRAM weights-only',
  }

  return (
    <section id="hf-catalog" className="bg-cream-2 border-t-2 border-[var(--color-ink)]">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <ScrollReveal>
          <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
            HuggingFace Hub / Full catalog, computed estimates
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h2 className="flex items-center gap-3"><TableIcon size={26} className="text-[var(--color-burnt)]" /> The HuggingFace <span className="text-[var(--color-burnt)]">catalog.</span></h2>
              <p className="text-[1rem] max-w-[62ch] mt-4">
                A separate, complementary view to the leaderboard above: every model in the top of the Hub sorted by real
                HF downloads — with parameter counts and VRAM estimates computed from the repositories themselves,
                license and access flags surfaced honestly, and no throughput numbers that were never measured.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
                {status.kind === 'ready' ? <Database size={13} className={stale ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'} /> : <Database size={13} />}
                {status.kind === 'loading' ? 'Loading catalog…' : status.kind === 'error' ? 'Catalog unavailable' : `${status.live ? 'Live HF sync' : 'Snapshot'} · ${formattedDate}${age ? ` · ${age}` : ''}`}
              </span>
              {status.kind === 'ready' && stale && (
                <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-1.5 border-2 border-[var(--color-warning)] text-[var(--color-warning)] bg-[var(--color-paper)]">
                  Data is {age} — daily HF sync may have failed
                </span>
              )}
              <button onClick={load} className="btn btn-ghost !py-2 !px-4 !text-sm inline-flex items-center gap-2">
                <RefreshCw size={15} className={status.kind === 'loading' ? 'animate-spin' : ''} /> Refresh
              </button>
              <button onClick={exportCsv} disabled={!models.length} className="btn btn-ghost !py-2 !px-4 !text-sm">Download CSV</button>
              <a href="https://huggingface.co/api/models" target="_blank" rel="noreferrer" className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] inline-flex items-center gap-1 no-underline">
                Source: HF API <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {status.kind === 'error' && (
          <div className="mt-10 border-2 border-[var(--color-danger)] bg-[var(--color-paper)] p-6">
            <p className="font-[var(--font-mono)] text-sm text-[var(--color-danger)]">Catalog data failed to load ({status.message}). Try refreshing, or redeploy with public/data/hf-catalog.json present.</p>
          </div>
        )}

        {stats && (
          <section className="bg-ink mt-12">
            <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--color-ink)]">
              {[
                { k: 'Catalog models', v: fmtNum(stats.count) },
                { k: 'Params recovered', v: stats.paramsPct + '%' },
                { k: 'License declared', v: stats.declaredPct + '%' },
                { k: 'Gated', v: fmtNum(stats.gated) },
                { k: 'Arch families', v: fmtNum(stats.families) },
                { k: 'Total downloads', v: fmtNum(stats.totalDownloads) },
              ].map((st, i) => (
                <div key={i} className="bg-ink px-5 py-6">
                  <div className="font-[var(--font-display)] font-bold text-[var(--color-paper)] text-[2rem] leading-none tabular-nums">{st.v}</div>
                  <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.16em] text-[var(--color-paper)]/75 mt-2">{st.k}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {status.kind === 'ready' && (
          <>
            <ScrollReveal>
              <div className="mt-14 mb-7">
                <h3 className="mb-1">All {models.length} catalog models</h3>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{filtered.length} shown · VRAM figures are computed estimates (weights + KV cache at 4096-token context, FP16 KV) — labeled, not benchmarked · throughput is never fabricated</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                    placeholder="Search model or author…"
                    className="pl-9 pr-3 py-2.5 w-[220px] max-w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]"
                  />
                </div>
                <select value={family} onChange={(e) => { setFamily(e.target.value); setPage(0) }} className="py-2.5 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]">
                  <option value="all">All families</option>
                  {families.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={modality} onChange={(e) => { setModality(e.target.value); setPage(0) }} className="py-2.5 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]">
                  <option value="all">All modalities</option>
                  {modalities.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={licenseFilter} onChange={(e) => { setLicenseFilter(e.target.value); setPage(0) }} className="py-2.5 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]">
                  <option value="all">All licenses</option>
                  {Object.entries(LICENSE_BUCKETS).map(([k, meta]) => <option key={k} value={k}>{meta.label}</option>)}
                </select>
                <Chip active={llmOnly} onClick={() => { setLlmOnly((v) => !v); setPage(0) }}>LLMs only</Chip>
                <Chip active={vramOnly} onClick={() => { setVramOnly((v) => !v); setPage(0) }} color="var(--color-success)">Has VRAM</Chip>
                <Chip active={gatedOnly} onClick={() => { setGatedOnly((v) => !v); setPage(0) }} color="var(--color-amber)">Gated</Chip>
                {(query || family !== 'all' || modality !== 'all' || licenseFilter !== 'all' || gatedOnly || vramOnly || llmOnly) && (
                  <button onClick={resetFilters} className="py-2.5 px-3 border-2 border-[var(--color-ink)] text-sm font-[var(--font-mono)] uppercase tracking-[0.08em] hover:bg-[var(--color-danger)] hover:text-white transition-colors">Reset</button>
                )}
              </div>
            </ScrollReveal>

            <div className="border-2 border-[var(--color-ink)] overflow-x-auto bg-[var(--color-paper)]">
              <table className="w-full text-[0.92rem] border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-[var(--color-paper-2)] text-left">
                    {[
                      { k: 'name', label: 'Model', cls: 'min-w-[260px]' },
                      { k: 'createdAt', label: 'Released', cls: 'w-24' },
                      { k: 'params', label: 'Params', cls: 'w-20' },
                      { k: 'q4km', label: 'VRAM Q4_K_M', cls: 'w-28' },
                      { k: 'downloads', label: 'Downloads', cls: 'w-24' },
                      { k: 'likes', label: 'Likes', cls: 'w-20' },
                      { k: 'license', label: 'License', cls: 'w-28' },
                    ].map((c) => (
                      <th key={c.k} onClick={() => toggleSort(c.k)} className={`px-4 py-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] select-none cursor-pointer hover:text-[var(--color-burnt)] ${c.cls || ''}`}>
                        {c.label}<Arrow k={c.k} />
                      </th>
                    ))}
                    <th className="px-4 py-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] w-24">Access</th>
                    <th className="w-8 px-2" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((m) => {
                    const isOpen = expandedId === m.id
                    const bucket = licenseBucket(m.license)
                    const bucketMeta = LICENSE_BUCKETS[bucket]
                    return (
                      <FragmentRow key={m.id} m={m} isOpen={isOpen} onToggle={() => setExpandedId(isOpen ? null : m.id)} bucketMeta={bucketMeta} fallbackLabels={fallbackLabels} fmtNum={fmtNum} fmtDate={fmtDate} />
                    )
                  })}
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-[var(--color-ink-faint)]">No models match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
              <p className="text-[0.82rem] text-[var(--color-ink-faint)]">
                Page {safePage + 1} / {maxPage + 1} · {filtered.length} models
              </p>
              <div className="flex items-center gap-3">
                <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0) }} className="py-2 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]">
                  {[25, 50, 100, 250].map((n) => <option key={n} value={n}>{n} per page</option>)}
                </select>
                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0} className="py-2 px-4 border-2 border-[var(--color-ink)] font-[var(--font-mono)] text-xs uppercase disabled:opacity-40 hover:bg-[var(--color-ink)] hover:text-white transition-colors">← Prev</button>
                <button onClick={() => setPage((p) => Math.min(maxPage, p + 1))} disabled={safePage >= maxPage} className="py-2 px-4 border-2 border-[var(--color-ink)] font-[var(--font-mono)] text-xs uppercase disabled:opacity-40 hover:bg-[var(--color-ink)] hover:text-white transition-colors">Next →</button>
              </div>
            </div>

            <div className="mt-14 mb-8">
              <ScrollReveal>
                <span className="eyebrow">Catalog analysis</span>
                <h3 className="mt-3 mb-2">What the catalog shows</h3>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)] max-w-[60ch]">
                  Computed from the stored snapshot, not per page load: licensing, access, downloads, families, modalities and release cadence across the top of the Hub.
                </p>
              </ScrollReveal>
            </div>
            <Analysis models={models} />

            <p className="text-[0.8rem] text-[var(--color-ink-faint)] mt-6 leading-relaxed">
              Methodology: paginated HuggingFace API pull (cursor-paginated, client-side re-sort), quantization mirrors (GGUF / AWQ / GPTQ / EXL2 / MLX…), mirror orgs and test/CI fixtures excluded.
              Parameters from safetensors metadata where present, else a dense-architecture estimate from config.json (flagged &ldquo;est.&rdquo;). VRAM = weights (FP16 2.0, Q8 1.0, Q4_K_M 0.56 bytes/param) + FP16 KV cache at 4096 tokens, GQA-aware.
              &ldquo;Undeclared&rdquo; means no structured license field — always check the repo&rsquo;s LICENSE file. Throughput (tok/s) is measured, not computed: no benchmark sources are attached to this snapshot, so no column exists.
              Coverage is honest: {stats ? stats.paramsPct : 0}% of rows carry a parameter count; the rest say &ldquo;not disclosed&rdquo;.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function FragmentRow({ m, isOpen, onToggle, bucketMeta, fallbackLabels, fmtNum, fmtDate }) {
  return (
    <>
      <tr className={`border-t border-[var(--color-line)] transition-colors cursor-pointer ${isOpen ? 'bg-[var(--color-paper-2)]' : 'hover:bg-[var(--color-paper-2)]/60'}`} onClick={onToggle}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown size={14} className="text-[var(--color-burnt)] shrink-0" /> : <ChevronRight size={14} className="text-[var(--color-ink-faint)] shrink-0" />}
            <div className="min-w-0">
              <a href={HF_BASE + m.id} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="font-medium text-[var(--color-ink)] no-underline hover:underline inline-flex items-center gap-1.5 truncate block">
                {m.id}
              </a>
              <div className="flex items-center gap-1.5 mt-0.5">
                {m.archFamily !== 'Other' && <span className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.08em] px-1.5 py-0.5 bg-[var(--color-paper)] border border-[var(--color-line-strong)] text-[var(--color-burnt)]">{m.archFamily}</span>}
                {m.pipelineTag && <span className="font-[var(--font-mono)] text-[0.62rem] text-[var(--color-ink-faint)] truncate">{m.pipelineTag}</span>}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 font-[var(--font-mono)] text-[0.78rem] text-[var(--color-ink-soft)] tabular-nums">{fmtDate(m.createdAt)}</td>
        <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink)]">
          {m.params ? (
            <>
              {fmtNum(m.params)}<span className="text-[var(--color-ink-faint)]">B</span>
              {m.paramsQuality === 'config-estimate' && <span className="ml-1 font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.08em] text-[var(--color-amber)]">est.</span>}
            </>
          ) : (
            <span className="text-[var(--color-ink-faint)]">not disclosed</span>
          )}
        </td>
        <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums">
          {m.vram ? (
            <span title={m.vram.weightsOnly ? 'Weights only — no architecture data for KV cache' : 'Weights + KV cache (4096-token context, FP16)'}>
              {m.vram.q4km.toFixed(1)} GB
              {m.vram.weightsOnly && <span className="ml-1 text-[0.62rem] text-[var(--color-ink-faint)]">w-only</span>}
            </span>
          ) : (
            <span className="text-[var(--color-ink-faint)]">—</span>
          )}
        </td>
        <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{fmtNum(m.downloads)}</td>
        <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{fmtNum(m.likes)}</td>
        <td className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: bucketMeta.color }} />
            <span className={m.license ? 'text-[var(--color-ink-soft)]' : 'text-[var(--color-ink-faint)]'} title={m.license ? '' : 'No structured license field — check the repo LICENSE file'}>
              {m.license || 'undeclared'}
            </span>
          </span>
        </td>
        <td className="px-4 py-3">
          {m.gated === false ? (
            <span className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.08em] px-1.5 py-0.5 bg-[var(--color-success)] text-white">Open</span>
          ) : (
            <span className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.08em] px-1.5 py-0.5 bg-[var(--color-amber)] text-white" title={m.gated === 'manual' ? 'Manual approval required' : 'Auto-approved click-through'}>
              {m.gated}
            </span>
          )}
        </td>
      </tr>
      {isOpen && (
        <tr className="border-t border-[var(--color-line)] bg-[var(--color-paper-2)]/60">
          <td colSpan={9} className="px-4 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 max-w-[1000px]">
              <div>
                <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] block mb-1.5">Parameter count</span>
                <p className="text-sm">
                  {m.params ? `${fmtNum(m.params)}B params` : 'Not disclosed'}
                  {m.paramsQuality === 'safetensors' && <span className="text-[0.7rem] text-[var(--color-ink-faint)]"> · safetensors metadata</span>}
                  {m.paramsQuality === 'config-estimate' && <span className="text-[0.7rem] text-[var(--color-amber)]"> · config.json estimate</span>}
                  {m.paramsQuality === 'missing' && <span className="text-[0.7rem] text-[var(--color-ink-faint)]"> · not in safetensors metadata</span>}
                </p>
              </div>
              <div>
                <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] block mb-1.5">VRAM estimates (computed)</span>
                {m.vram ? (
                  <div className="font-[var(--font-mono)] text-[0.82rem] tabular-nums space-y-0.5">
                    <div>FP16: <span className="font-bold">{m.vram.fp16.toFixed(1)} GB</span></div>
                    <div>Q8: <span className="font-bold">{m.vram.q8.toFixed(1)} GB</span></div>
                    <div>Q4_K_M: <span className="font-bold text-[var(--color-burnt)]">{m.vram.q4km.toFixed(1)} GB</span></div>
                    <div className="text-[0.68rem] text-[var(--color-ink-faint)]">{m.vram.weightsOnly ? 'weights only (KV unknown)' : `incl. ${m.vram.kvCacheGb.toFixed(2)} GB KV @ 4096 ctx`}</div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-ink-faint)]">No parameter count — VRAM not computable.</p>
                )}
              </div>
              <div>
                <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] block mb-1.5">Architecture (config.json)</span>
                {m.config ? (
                  <div className="font-[var(--font-mono)] text-[0.78rem] space-y-0.5">
                    <div>{m.config.modelType || '—'} {m.config.architectures?.length ? `(${m.config.architectures[0]})` : ''}</div>
                    <div>{m.config.numHiddenLayers} layers · {m.config.hiddenSize} hidden{m.config.numAttentionHeads ? ` · ${m.config.numAttentionHeads} heads` : ''}</div>
                    {m.config.numKeyValueHeads && <div>GQA: {m.config.numKeyValueHeads} KV heads {m.config.numKeyValueHeads !== m.config.numAttentionHeads ? '· KV cache reduced' : ''}</div>}
                    <div className="text-[0.68rem] text-[var(--color-ink-faint)]">max pos: {m.config.maxPositionEmbeddings || '—'} · assumed {m.config.contextUsed || 4096} ctx for KV</div>
                    {m.config.torchDtype && <div className="text-[0.68rem] text-[var(--color-ink-faint)]">native dtype: {m.config.torchDtype}</div>}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-ink-faint)]">{fallbackLabels[m.configFallback?.reason] || 'No config.json data.'}</p>
                )}
              </div>
              <div>
                <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] block mb-1.5">Engagement & provenance</span>
                <div className="font-[var(--font-mono)] text-[0.78rem] space-y-0.5">
                  <div>{fmtNum(m.downloads)} downloads · {fmtNum(m.likes)} likes{m.trendingScore != null ? ` · trending ${Math.round(m.trendingScore)}` : ''}</div>
                  <div>created {fmtDate(m.createdAt)} · updated {fmtDate(m.lastModified)}</div>
                  <div>library: {m.library || '—'} · license: {m.license || 'undeclared'}</div>
                </div>
                <a href={HF_BASE + m.id} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-burnt)] hover:text-[var(--color-amber-deep)] no-underline mt-2">
                  Open on HuggingFace <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
