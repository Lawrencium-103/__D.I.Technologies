import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Search, RefreshCw, Trophy, Database } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import snapshot from '../data/openModels.json'

const LIVE_URL = 'https://lmmarketcap.com/api/models'
const SRC = 'https://lmmarketcap.com/open-source-ai-models'

// Defensive live mapper — tolerates several plausible API shapes and drops anything invalid.
function parseCtx(s) {
  if (!s || s === '-') return null
  const m = String(s).match(/([\d.]+)\s*([KM])?/i)
  if (!m) return null
  let n = parseFloat(m[1])
  if (m[2] === 'K') n *= 1e3
  if (m[2] === 'M') n *= 1e6
  return n
}

function mapLiveApi(data) {
  const arr = Array.isArray(data) ? data : data?.models || data?.data || []
  if (!Array.isArray(arr)) return []
  const out = []
  for (const m of arr) {
    const provider = m.provider || m.org || m.organization || ''
    const open = m.openSource ?? m.open_source ?? m.openWeights ?? m.open_weights
    if (open === false) continue
    const name = m.name || m.model || m.id || ''
    const score = Number(m.score ?? m.lmcScore ?? m.lmc_score ?? null)
    const rank = Number(m.rank ?? m.lmcRank ?? m.lmc_rank ?? null)
    if (!name || !provider) continue
    if (Number.isNaN(score) && Number.isNaN(rank)) continue
    const ctx = m.contextWindow ?? m.context_window ?? m.context ?? null
    const input = Number(m.pricing?.input ?? m.pricing?.prompt ?? null)
    const output = Number(m.pricing?.output ?? m.pricing?.completion ?? null)
    out.push({
      id: m.id || name.toLowerCase().replace(/\s+/g, '-'),
      rank: Number.isNaN(rank) ? 9999 : rank,
      name,
      provider,
      score: Number.isNaN(score) ? 0 : score,
      context: ctx == null ? '-' : String(ctx),
      contextTokens: typeof ctx === 'number' ? ctx : parseCtx(String(ctx)),
      input: input == null ? '-' : '$' + input,
      output: output == null ? '-' : '$' + output,
      inputPerM: Number.isNaN(input) ? 0 : input,
      outputPerM: Number.isNaN(output) ? 0 : output,
      free: Boolean(m.free ?? m.freeTier ?? m.free_tier),
    })
  }
  return out
}

function fmtTokens(n) {
  if (n == null) return '-'
  if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M'
  if (n >= 1e3) return Math.round(n / 1e3) + 'K'
  return String(n)
}

const SORTERS = {
  rank: (a, b) => a.rank - b.rank,
  name: (a, b) => a.name.localeCompare(b.name),
  provider: (a, b) => a.provider.localeCompare(b.provider),
  score: (a, b) => b.score - a.score,
  contextTokens: (a, b) => (b.contextTokens || 0) - (a.contextTokens || 0),
  inputPerM: (a, b) => a.inputPerM - b.inputPerM,
  outputPerM: (a, b) => a.outputPerM - b.outputPerM,
}

export default function OpenModels() {
  const [models, setModels] = useState(snapshot.models)
  const [status, setStatus] = useState({ kind: 'snapshot', at: snapshot.fetchedAt })
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [sortKey, setSortKey] = useState('rank')
  const [sortDir, setSortDir] = useState('asc')
  const [loading, setLoading] = useState(false)

  const loadLive = async () => {
    setLoading(true)
    try {
      const res = await fetch(LIVE_URL, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      const mapped = mapLiveApi(data)
      const valid = mapped.filter((m) => m.score > 0)
      if (valid.length >= 20) {
        const sorted = [...valid].sort((a, b) => a.rank - b.rank)
        setModels(sorted)
        setStatus({ kind: 'live', at: new Date().toISOString() })
      } else {
        setStatus({ kind: 'snapshot', at: snapshot.fetchedAt, note: 'Live format unrecognized — showing snapshot.' })
      }
    } catch {
      setStatus({ kind: 'snapshot', at: snapshot.fetchedAt, note: 'Live update unavailable — showing latest snapshot.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLive() /* attempt live on mount; safe fallback to snapshot */ }, [])

  const providers = useMemo(() => {
    const set = new Set(models.map((m) => m.provider))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [models])

  const filtered = useMemo(() => {
    let list = models
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q))
    }
    if (provider !== 'all') list = list.filter((m) => m.provider === provider)
    if (freeOnly) list = list.filter((m) => m.free)
    const dir = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => SORTERS[sortKey](a, b) * dir)
  }, [models, query, provider, freeOnly, sortKey, sortDir])

  const stats = useMemo(() => {
    const scores = models.map((m) => m.score)
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const free = models.filter((m) => m.free).length
    const maxCtx = Math.max(...models.map((m) => m.contextTokens || 0))
    const paid = models.filter((m) => !m.free && m.inputPerM != null)
    const cheapest = paid.length ? Math.min(...paid.map((m) => m.inputPerM)) : 0
    return { total: models.length, avg, free, providers: providers.length, maxCtx, cheapest }
  }, [models, providers])

  const top10 = useMemo(
    () => [...filtered].sort((a, b) => b.score - a.score).slice(0, 10),
    [filtered]
  )
  const maxScore = useMemo(() => Math.max(...models.map((m) => m.score), 1), [models])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir(key === 'name' || key === 'provider' ? 'asc' : 'desc') }
  }

  const Arrow = ({ k }) =>
    sortKey === k ? (
      <span className="ml-1 inline-block text-[var(--color-burnt)]">{sortDir === 'asc' ? '▲' : '▼'}</span>
    ) : null

  const statusLabel =
    status.kind === 'live'
      ? 'Live · lmmarketcap API'
      : `Snapshot · ${new Date(status.at).toLocaleDateString()}`

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <span className="hover:text-[var(--color-burnt)]">Open Intelligence</span> / Open Model Leaderboard
            </p>
            <h1 className="max-w-[20ch]">
              The open model <span className="text-[var(--color-burnt)]">leaderboard.</span>
            </h1>
            <p className="text-[1.1rem] max-w-[62ch] mt-5">
              Every ranked open-weight model you can self-host, fine-tune and deploy without vendor lock-in —
              scored, priced and sorted so you can pick the right model in seconds.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)]">
                {status.kind === 'live' ? <Database size={13} className="text-[var(--color-success)]" /> : <Database size={13} />}
                {statusLabel}
              </span>
              <button onClick={loadLive} disabled={loading} className="btn btn-ghost !py-2 !px-4 !text-sm inline-flex items-center gap-2">
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing…' : 'Refresh'}
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
              <div key={m.id} className="flex items-center gap-4 py-3 border-b border-[var(--color-line)]">
                <span className="marker w-7 text-right text-[0.95rem]">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-[var(--color-ink)] truncate">{m.name}</span>
                    <span className="font-[var(--font-mono)] text-[0.7rem] text-[var(--color-ink-faint)] shrink-0">{m.provider}</span>
                  </div>
                  <div className="h-2 mt-1.5 bg-[var(--color-paper-2)] border border-[var(--color-line)]">
                    <div className="h-full bg-[var(--color-burnt)]" style={{ width: `${(m.score / maxScore) * 100}%` }} />
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
                <span className="eyebrow">Full ranking</span>
                <h2 className="mt-3 mb-1">All {models.length} open models</h2>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{filtered.length} shown · click any column to sort</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search model or provider…"
                    className="pl-9 pr-3 py-2.5 w-[230px] max-w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] text-sm outline-none focus:border-[var(--color-burnt)]"
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
                <button
                  onClick={() => setFreeOnly((v) => !v)}
                  className={`py-2.5 px-3 border-2 text-sm font-[var(--font-mono)] uppercase tracking-[0.08em] transition-colors ${
                    freeOnly ? 'bg-[var(--color-success)] text-white border-[var(--color-success)]' : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)]'
                  }`}
                >
                  Free only
                </button>
              </div>
            </div>
          </ScrollReveal>

          <div className="border-2 border-[var(--color-ink)] overflow-x-auto">
            <table className="w-full text-[0.92rem] border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[var(--color-paper-2)] text-left">
                  {[
                    { k: 'rank', label: '#', cls: 'w-12' },
                    { k: 'name', label: 'Model' },
                    { k: 'provider', label: 'Provider', cls: 'w-36' },
                    { k: 'score', label: 'Score', cls: 'w-24' },
                    { k: 'contextTokens', label: 'Context', cls: 'w-24' },
                    { k: 'inputPerM', label: 'In /1M', cls: 'w-24' },
                    { k: 'outputPerM', label: 'Out /1M', cls: 'w-24' },
                  ].map((c) => (
                    <th
                      key={c.k}
                      onClick={() => toggleSort(c.k)}
                      className={`px-4 py-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] cursor-pointer select-none hover:text-[var(--color-burnt)] ${c.cls || ''}`}
                    >
                      {c.label}
                      <Arrow k={c.k} />
                    </th>
                  ))}
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-t border-[var(--color-line)] hover:bg-[var(--color-paper-2)] transition-colors">
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
                        <span className="h-1.5 w-12 bg-[var(--color-paper-2)] border border-[var(--color-line)] hidden sm:inline-block">
                          <span className="block h-full bg-[var(--color-burnt)]" style={{ width: `${(m.score / maxScore) * 100}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.context}</td>
                    <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.input}</td>
                    <td className="px-4 py-3 font-[var(--font-mono)] tabular-nums text-[var(--color-ink-soft)]">{m.output}</td>
                    <td className="px-4 py-3 text-right">
                      <a href={`https://lmmarketcap.com/model/${m.id}`} target="_blank" rel="noreferrer" className="text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] inline-flex" aria-label="Open on lmmarketcap">
                        <ExternalLink size={15} />
                      </a>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-[var(--color-ink-faint)]">No models match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[0.8rem] text-[var(--color-ink-faint)] mt-5 leading-relaxed">
            Data sourced from <a href={SRC} target="_blank" rel="noreferrer" className="no-underline hover:underline">lmmarketcap.com</a> · scores are the LMC composite (0–100), blending benchmarks, pricing, context and recency.
            Open-weight models only. Verify specifics on the source before production decisions.
          </p>
        </div>
      </section>
    </>
  )
}
