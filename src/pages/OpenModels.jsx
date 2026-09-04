import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Search, RefreshCw, Trophy, Database } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import HfCatalog from '../components/HfCatalog'
import snapshot from '../data/openModels.json'
import { useSEO } from '../lib/seo'

const LIVE_URL = '/.netlify/functions/livemodels'
const SRC = 'https://lmmarketcap.com/open-source-ai-models'

function parseCtx(s) {
  if (!s || s === '-') return null
  const m = String(s).match(/([\d.]+)\s*([KM])?/i)
  if (!m) return null
  let n = parseFloat(m[1])
  if (m[2] === 'K') n *= 1e3
  if (m[2] === 'M') n *= 1e6
  return n
}

// Open-model detection patterns for live API streams lacking explicit openSource flags
const OPEN_PATTERNS = [
  /llama/i, /qwen/i, /deepseek/i, /gemma/i, /mistral/i, /mixtral/i, /phi/i,
  /starcoder/i, /codellama/i, /command-r/i, /nemotron/i, /glm/i, /yi-/i,
  /falcon/i, /vicuna/i, /zephyr/i, /stable-diffusion/i, /flux/i, /smollm/i,
  /olmo/i, /granite/i, /internlm/i, /baichuan/i, /step-/i, /mimo/i, /kimi/i,
  /wan/i, /cogvideo/i, /sdxl/i, /hunyuan/i
]

function isOpenModel(m) {
  const openFlag = m.openSource ?? m.open_source ?? m.openWeights ?? m.open_weights ?? m.is_open_source ?? m.isOpenSource
  if (openFlag === true) return true
  if (openFlag === false) return false

  const name = String(m.name || m.model || m.id || m.slug || '')
  return OPEN_PATTERNS.some((pat) => pat.test(name))
}

function mapLiveApi(data) {
  const arr = Array.isArray(data) ? data : data?.models || data?.data || []
  if (!Array.isArray(arr)) return []
  const out = []

  for (const m of arr) {
    if (!m || typeof m !== 'object') continue
    if (!isOpenModel(m)) continue

    const rawProv = m.provider || m.org || m.organization || ''
    const provider =
      typeof rawProv === 'string'
        ? rawProv
        : String(rawProv?.name || rawProv?.slug || 'Unknown')
    const name = String(m.name || m.model || m.id || m.slug || '')
    if (!name || !provider) continue

    const score = Number(m.score ?? m.lmcScore ?? m.lmc_score ?? null)
    const rank = Number(m.rank ?? m.quality_rank ?? m.lmcRank ?? m.lmc_rank ?? null)
    if (Number.isNaN(score) && Number.isNaN(rank)) continue

    const ctx = m.contextWindow ?? m.context_window ?? m.context ?? null
    const input = m.pricing?.input ?? m.pricing?.prompt
    const output = m.pricing?.output ?? m.pricing?.completion
    const inputN = input == null ? null : Number(input)
    const outputN = output == null ? null : Number(output)

    const cleanScore = Number.isNaN(score) || score == null ? 0 : Math.round(score)
    const cleanRank = Number.isNaN(rank) || rank == null ? 9999 : rank

    out.push({
      id: String(m.id || m.slug || name.toLowerCase().replace(/\s+/g, '-')),
      rank: cleanRank,
      name,
      provider,
      score: cleanScore,
      context: ctx == null ? '-' : String(ctx),
      contextTokens: typeof ctx === 'number' ? ctx : parseCtx(String(ctx)),
      input: inputN == null || Number.isNaN(inputN) ? '-' : '$' + inputN,
      output: outputN == null || Number.isNaN(outputN) ? '-' : '$' + outputN,
      inputPerM: inputN == null || Number.isNaN(inputN) ? 0 : inputN,
      outputPerM: outputN == null || Number.isNaN(outputN) ? 0 : outputN,
      free: Boolean((m.free ?? m.freeTier ?? m.free_tier) || inputN === 0),
    })
  }

  return out
}

function fmtTokens(n) {
  if (n == null || Number.isNaN(Number(n)) || !Number.isFinite(Number(n))) return '-'
  const num = Number(n)
  if (num >= 1e6) return (num / 1e6).toFixed(num % 1e6 === 0 ? 0 : 1) + 'M'
  if (num >= 1e3) return Math.round(num / 1e3) + 'K'
  return String(num)
}

const SORTERS = {
  rank: (a, b) => (Number(a.rank) || 9999) - (Number(b.rank) || 9999),
  name: (a, b) => String(a.name || '').localeCompare(String(b.name || '')),
  provider: (a, b) => String(a.provider || '').localeCompare(String(b.provider || '')),
  score: (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
  contextTokens: (a, b) => (Number(b.contextTokens) || 0) - (Number(a.contextTokens) || 0),
  inputPerM: (a, b) => (Number(a.inputPerM) || 0) - (Number(b.inputPerM) || 0),
  outputPerM: (a, b) => (Number(a.outputPerM) || 0) - (Number(b.outputPerM) || 0),
}

// Helper to estimate VRAM requirements based on model name / parameters
function estimateVram(name) {
  const n = String(name || '').toLowerCase()
  if (/405b|397b|235b|120b\+/.test(n)) return { label: 'Multi-GPU (8x 80GB)', vram: 640, tier: 'cluster' }
  if (/122b|70b|72b|67b/.test(n)) return { label: 'Enterprise (80GB VRAM)', vram: 80, tier: 'enterprise' }
  if (/35b|34b|32b|31b|30b|27b|26b/.test(n)) return { label: 'Workstation (24GB VRAM)', vram: 24, tier: 'workstation' }
  if (/14b|12b|9b|8b|7b/.test(n)) return { label: 'Desktop / Mac (16GB)', vram: 16, tier: 'desktop' }
  return { label: 'Edge / CPU (8GB VRAM)', vram: 8, tier: 'edge' }
}

export default function OpenModels() {
  useSEO({
    title: 'Open Model Leaderboard, OMSF-graded',
    description:
      'The DIT open model leaderboard: leading open models graded on the OMSF 6-Rung Openness Ladder, plus the full HuggingFace catalog with computed VRAM estimates, license and access analysis.',
    path: '/open-models',
  })
  const initialModels = Array.isArray(snapshot?.models) ? snapshot.models : []
  const initialFetchedAt = snapshot?.fetchedAt || new Date().toISOString()

  const [models, setModels] = useState(initialModels)
  const [status, setStatus] = useState({ kind: 'snapshot', at: initialFetchedAt })
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState('all')
  const [hardwareFilter, setHardwareFilter] = useState('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [sortKey, setSortKey] = useState('rank')
  const [sortDir, setSortDir] = useState('asc')
  const [loading, setLoading] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const loadLive = async () => {
    setLoading(true)
    try {
      const res = await fetch(LIVE_URL, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      const mapped = mapLiveApi(data)
      const valid = mapped.filter((m) => m && m.score > 0)
      if (valid.length >= 5) {
        const sorted = [...valid].sort((a, b) => a.rank - b.rank)
        setModels(sorted)
        setStatus({ kind: 'live', at: new Date().toISOString() })
      } else {
        setStatus({ kind: 'snapshot', at: initialFetchedAt, note: 'Live format unrecognized — showing snapshot.' })
      }
    } catch {
      setStatus({ kind: 'snapshot', at: initialFetchedAt, note: 'Live update unavailable — showing latest snapshot.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLive() }, [])

  const providers = useMemo(() => {
    const list = Array.isArray(models) ? models : []
    const set = new Set(list.map((m) => m?.provider).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [models])

  const filtered = useMemo(() => {
    let list = Array.isArray(models) ? models : []
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (m) =>
          String(m?.name || '').toLowerCase().includes(q) ||
          String(m?.provider || '').toLowerCase().includes(q)
      )
    }
    if (provider !== 'all') list = list.filter((m) => m?.provider === provider)
    if (hardwareFilter !== 'all') {
      list = list.filter((m) => estimateVram(m.name).tier === hardwareFilter)
    }
    if (freeOnly) list = list.filter((m) => Boolean(m?.free))
    const dir = sortDir === 'asc' ? 1 : -1
    const sorter = SORTERS[sortKey] || SORTERS.rank
    return [...list].sort((a, b) => sorter(a, b) * dir)
  }, [models, query, provider, hardwareFilter, freeOnly, sortKey, sortDir])

  const stats = useMemo(() => {
    const list = Array.isArray(models) ? models : []
    if (list.length === 0) {
      return { total: 0, avg: 0, free: 0, providers: 0, maxCtx: 0, cheapest: 0 }
    }
    const scores = list.map((m) => Number(m?.score) || 0)
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const free = list.filter((m) => Boolean(m?.free)).length
    const maxCtx = Math.max(0, ...list.map((m) => Number(m?.contextTokens) || 0))
    const paid = list.filter((m) => !m?.free && m?.inputPerM != null && !Number.isNaN(Number(m.inputPerM)))
    const cheapest = paid.length ? Math.min(...paid.map((m) => Number(m.inputPerM) || 0)) : 0
    return { total: list.length, avg, free, providers: providers.length, maxCtx, cheapest }
  }, [models, providers])

  const top10 = useMemo(() => {
    return [...filtered].sort((a, b) => (Number(b?.score) || 0) - (Number(a?.score) || 0)).slice(0, 10)
  }, [filtered])

  const maxScore = useMemo(() => {
    const list = Array.isArray(models) ? models : []
    if (list.length === 0) return 100
    return Math.max(1, ...list.map((m) => Number(m?.score) || 0))
  }, [models])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir(key === 'name' || key === 'provider' ? 'asc' : 'desc') }
  }

  const toggleCompare = (model) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === model.id)
      if (exists) return prev.filter((item) => item.id !== model.id)
      if (prev.length >= 3) return prev
      return [...prev, model]
    })
  }

  const exportCsv = () => {
    const headers = ['Rank', 'Model Name', 'Provider', 'Score', 'Context', 'Input / 1M', 'Output / 1M', 'Estimated VRAM', 'Free Tier']
    const rows = filtered.map((m) => [
      m.rank,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.provider.replace(/"/g, '""')}"`,
      m.score,
      m.context,
      m.input,
      m.output,
      `"${estimateVram(m.name).label}"`,
      m.free ? 'Yes' : 'No'
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `DIT_Open_Models_Leaderboard_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const Arrow = ({ k }) =>
    sortKey === k ? (
      <span className="ml-1 inline-block text-[var(--color-burnt)]">{sortDir === 'asc' ? '▲' : '▼'}</span>
    ) : null

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(status.at)
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
    } catch {
      return ''
    }
  }, [status.at])

  const statusLabel =
    status.kind === 'live'
      ? 'Live · lmmarketcap API'
      : `Snapshot · ${formattedDate}`

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <span className="hover:text-[var(--color-burnt)]">Open Intelligence</span> / Open Model Leaderboard & Deployment Index
            </p>
            <h1 className="max-w-[20ch]">
              The open model <span className="text-[var(--color-burnt)]">leaderboard.</span>
            </h1>
            <p className="text-[1.1rem] max-w-[62ch] mt-5">
              Every ranked open-weight model you can self-host, fine-tune and deploy without vendor lock-in —
              scored, priced, hardware-estimated and sorted for enterprise &amp; African deployment.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
                {status.kind === 'live' ? <Database size={13} className="text-[var(--color-success)]" /> : <Database size={13} />}
                {statusLabel}
              </span>
              <button onClick={loadLive} disabled={loading} className="btn btn-ghost !py-2 !px-4 !text-sm inline-flex items-center gap-2">
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing…' : 'Refresh'}
              </button>
              <button onClick={exportCsv} className="btn btn-ghost !py-2 !px-4 !text-sm inline-flex items-center gap-2">
                Download CSV
              </button>
              <a href={SRC} target="_blank" rel="noreferrer" className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] inline-flex items-center gap-1 no-underline">
                Source: lmmarketcap <ExternalLink size={13} />
              </a>
            </div>
            {status.note && <p className="text-[0.85rem] text-[var(--color-ink-faint)] mt-3">{status.note}</p>}
          </ScrollReveal>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="bg-burnt py-12">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--color-burnt-deep)] border-2 border-[var(--color-burnt-deep)]">
          {[
            { k: 'Open models', v: stats.total, s: '' },
            { k: 'Avg score', v: stats.avg, s: '/100' },
            { k: 'Free to use', v: stats.free, s: '' },
            { k: 'Providers', v: stats.providers, s: '' },
            { k: 'Top context', v: fmtTokens(stats.maxCtx), s: '' },
            { k: 'Cheapest in', v: stats.cheapest ? '$' + stats.cheapest : '—', s: '/1M' },
          ].map((st, i) => (
            <div key={i} className="bg-[var(--color-burnt)] px-5 py-6">
              <div className="font-[var(--font-display)] font-bold text-[var(--color-paper)] text-[2rem] leading-none tabular-nums">
                {st.v}<span className="text-[1rem] opacity-80">{st.s}</span>
              </div>
              <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.16em] text-[var(--color-paper)]/75 mt-2">{st.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP 10 CHART */}
      <section className="bg-cream-2 py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Top of the board</span>
            <h2 className="mt-3 mb-2 flex items-center gap-3"><Trophy size={26} className="text-[var(--color-burnt)]" /> Leading open models by score</h2>
            <p className="text-[1rem] max-w-[56ch] mb-10">The ten highest-scoring open-weight models in the current view.</p>
          </ScrollReveal>
          <div className="border-t-2 border-[var(--color-ink)]">
            {top10.map((m, i) => (
              <div key={m.id || i} className="flex items-center gap-4 py-3 border-b border-[var(--color-line)]">
                <span className="marker w-7 text-right text-[0.95rem]">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-[var(--color-ink)] truncate">{m.name}</span>
                    <span className="font-[var(--font-mono)] text-[0.7rem] text-[var(--color-ink-faint)] shrink-0">{m.provider}</span>
                    <span className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.08em] px-1.5 py-0.5 bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-burnt)] hidden sm:inline-block">
                      {estimateVram(m.name).label}
                    </span>
                  </div>
                  <div className="h-2 mt-1.5 bg-[var(--color-paper-2)] border border-[var(--color-line)]">
                    <div className="h-full bg-[var(--color-burnt)]" style={{ width: `${Math.min(100, Math.max(0, (m.score / maxScore) * 100))}%` }} />
                  </div>
                </div>
                <span className="font-[var(--font-display)] font-bold text-[var(--color-ink)] tabular-nums w-10 text-right text-[1.15rem]">{m.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-cream py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
              <div>
                <span className="eyebrow">Full ranking &amp; deployment specs</span>
                <h2 className="mt-3 mb-1">All {models.length} open models</h2>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{filtered.length} shown · click any column to sort · select models to compare side-by-side</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search model or provider…"
                    className="pl-9 pr-3 py-2.5 w-[210px] max-w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]"
                  />
                </div>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="py-2.5 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]"
                >
                  <option value="all">All providers ({providers.length})</option>
                  {providers.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={hardwareFilter}
                  onChange={(e) => setHardwareFilter(e.target.value)}
                  className="py-2.5 px-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]"
                >
                  <option value="all">All Hardware Tiers</option>
                  <option value="edge">Edge / Local CPU (8GB VRAM)</option>
                  <option value="desktop">Desktop / Mac (16GB VRAM)</option>
                  <option value="workstation">Workstation (24GB VRAM)</option>
                  <option value="enterprise">Enterprise (80GB VRAM)</option>
                  <option value="cluster">Multi-GPU Cluster</option>
                </select>
                <button
                  onClick={() => setFreeOnly((v) => !v)}
                  className={`py-2.5 px-3 border-2 text-sm font-[var(--font-mono)] uppercase tracking-[0.08em] transition-colors ${
                    freeOnly ? 'bg-[var(--color-success)] text-white border-[var(--color-success)]' : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]'
                  }`}
                >
                  Free only
                </button>
                {compareList.length > 0 && (
                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="py-2.5 px-4 bg-[var(--color-burnt)] text-white font-[var(--font-mono)] uppercase tracking-[0.1em] text-sm border-2 border-[var(--color-ink)] shadow-[2px_2px_0px_#1A1712]"
                  >
                    Compare ({compareList.length}/3)
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          <div className="border-2 border-[var(--color-ink)] overflow-x-auto">
            <table className="w-full text-[0.92rem] border-collapse min-w-[840px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] text-left">
                  <th className="px-3 py-3 w-10 text-center font-[var(--font-mono)] text-[0.7rem] uppercase text-[var(--color-ink-faint)]">Compare</th>
                  {[
                    { k: 'rank', label: '#', cls: 'w-12' },
                    { k: 'name', label: 'Model' },
                    { k: 'provider', label: 'Provider', cls: 'w-32' },
                    { k: 'score', label: 'Score', cls: 'w-24' },
                    { k: 'contextTokens', label: 'Context', cls: 'w-24' },
                    { k: 'vram', label: 'Hardware Spec', cls: 'w-36' },
                    { k: 'inputPerM', label: 'In /1M', cls: 'w-24' },
                    { k: 'outputPerM', label: 'Out /1M', cls: 'w-24' },
                  ].map((c) => (
                    <th
                      key={c.k}
                      onClick={() => c.k !== 'vram' && toggleSort(c.k)}
                      className={`px-4 py-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] select-none ${c.k !== 'vram' ? 'cursor-pointer hover:text-[var(--color-burnt)]' : ''} ${c.cls || ''}`}
                    >
                      {c.label}
                      <Arrow k={c.k} />
                    </th>
                  ))}
                  <th className="px-4 py-3 w-16" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const isSelected = compareList.some((item) => item.id === m.id)
                  const vramSpec = estimateVram(m.name)
                  return (
                    <tr key={m.id} className={`border-t border-[var(--color-line)] transition-colors ${isSelected ? 'bg-[var(--color-paper-2)]' : 'hover:bg-[var(--color-paper-2)]/60'}`}>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCompare(m)}
                          className="w-4 h-4 accent-[var(--color-burnt)] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-[var(--font-mono)] text-[var(--color-ink-faint)] tabular-nums">{m.rank}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--color-ink)]">{m.name}</span>
                          {m.free && (
                            <span className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.1em] px-1.5 py-0.5 bg-[var(--color-success)] text-white">Free</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-soft)]">{m.provider}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-[var(--font-display)] font-bold tabular-nums text-[var(--color-ink)]">{m.score}</span>
                          <span className="h-1.5 w-10 bg-[var(--color-paper-2)] border border-[var(--color-line)] hidden sm:inline-block">
                            <span className="block h-full bg-[var(--color-burnt)]" style={{ width: `${Math.min(100, Math.max(0, (m.score / maxScore) * 100))}%` }} />
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.context}</td>
                      <td className="px-4 py-3 font-[var(--font-mono)] text-[0.72rem] text-[var(--color-ink-soft)]">
                        <span className="px-2 py-0.5 border border-[var(--color-line-strong)] bg-[var(--color-paper)]">
                          {vramSpec.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.input}</td>
                      <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.output}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={`https://lmmarketcap.com/model/${m.id}`} target="_blank" rel="noreferrer" className="text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] inline-flex" aria-label="Open on lmmarketcap">
                          <ExternalLink size={15} />
                        </a>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-[var(--color-ink-faint)]">No models match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[0.8rem] text-[var(--color-ink-faint)] mt-5 leading-relaxed">
            Data sourced from <a href={SRC} target="_blank" rel="noreferrer" className="no-underline hover:underline">lmmarketcap.com</a> · scores are the LMC composite (0–100), blending benchmarks, pricing, context and recency.
            Open-weight models only. Hardware requirements estimated for 4-bit/8-bit precision deployment.
          </p>
        </div>
      </section>

      {/* HUGGINGFACE HUB CATALOG — full catalog, computed estimates */}
      <HfCatalog />

      {/* SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1712]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] max-w-[900px] w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_#1A1712]">
            <div className="flex items-center justify-between border-b-2 border-[var(--color-ink)] pb-4 mb-6">
              <div>
                <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">Side-by-Side Model Comparison</span>
                <h3 className="text-2xl font-[var(--font-display)] font-bold">Comparing {compareList.length} Selected Models</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="font-[var(--font-mono)] text-sm uppercase px-3 py-1.5 border-2 border-[var(--color-ink)] hover:bg-[var(--color-burnt)] hover:text-white"
              >
                Close [✕]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {compareList.map((m) => {
                const spec = estimateVram(m.name)
                return (
                  <div key={m.id} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-5 flex flex-col justify-between">
                    <div>
                      <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">Rank #{m.rank}</span>
                      <h4 className="text-xl font-[var(--font-display)] font-bold mt-1 mb-1">{m.name}</h4>
                      <p className="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-ink-faint)] mb-4">{m.provider}</p>

                      <div className="space-y-3 font-[var(--font-mono)] text-sm border-t border-[var(--color-line)] pt-3">
                        <div>
                          <span className="text-[0.7rem] uppercase text-[var(--color-ink-faint)] block">Composite Score</span>
                          <span className="font-bold text-lg text-[var(--color-ink)]">{m.score}/100</span>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase text-[var(--color-ink-faint)] block">Context Window</span>
                          <span className="font-bold text-[var(--color-ink)]">{m.context}</span>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase text-[var(--color-ink-faint)] block">Hardware / VRAM Req</span>
                          <span className="font-bold text-[var(--color-burnt)]">{spec.label}</span>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase text-[var(--color-ink-faint)] block">Input / Output per 1M</span>
                          <span className="font-bold text-[var(--color-ink)]">{m.input} / {m.output}</span>
                        </div>
                        <div>
                          <span className="text-[0.7rem] uppercase text-[var(--color-ink-faint)] block">License &amp; Access</span>
                          <span className="font-bold text-[var(--color-ink)]">{m.free ? 'Free / Open Weight' : 'Commercial API'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCompare(m)}
                      className="mt-6 w-full py-2 border border-[var(--color-ink)] font-[var(--font-mono)] text-xs uppercase hover:bg-[var(--color-danger)] hover:text-white"
                    >
                      Remove from comparison
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

