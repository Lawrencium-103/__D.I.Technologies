import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import SmePdfCard from '../components/SmePdfCard'
import { useSmePdfs } from '../lib/smePdf'
import {
  ratingScale,
  ratingStatus,
  tierFor,
  scoringTools,
  kpis,
  fundingSections,
  fundingWhere,
  monthlyObligations,
  annualObligations,
  smePdfDownloads,
} from '../data/smeToolkit'

const STORE_KEY = 'dit-sme-toolkit-v1'

function statusClasses(status) {
  switch (status) {
    case 'red':
      return 'bg-red-600 text-white'
    case 'yellow':
      return 'bg-amber-400 text-[var(--color-ink)]'
    case 'green':
      return 'bg-emerald-600 text-white'
    case 'emerald':
      return 'bg-emerald-700 text-white'
    default:
      return 'bg-[var(--color-paper-2)] text-[var(--color-ink-faint)]'
  }
}

function statusBorder(status) {
  switch (status) {
    case 'red':
      return 'border-red-600'
    case 'yellow':
      return 'border-amber-400'
    case 'green':
      return 'border-emerald-600'
    case 'emerald':
      return 'border-emerald-700'
    default:
      return 'border-[var(--color-line)]'
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
  return { ratings: {}, kpi: {}, funding: {}, calendar: {} }
}

function ScoringTool({ tool, ratings, setRating }) {
  const max = tool.maxWeightSum * 5
  let total = 0
  let answered = 0
  tool.items.forEach((it) => {
    const r = ratings[`${tool.id}:${it.n}`]
    if (r) {
      total += r * it.weight
      answered += 1
    }
  })
  const pct = max ? (total / max) * 100 : 0
  const tier = tierFor(pct)
  const complete = answered === tool.items.length

  return (
    <section id={tool.id} className="scroll-mt-32 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream-2)]">
        <div>
          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">{tool.id.toUpperCase()}</span>
          <h2 className="text-[1.5rem] leading-tight mt-1">{tool.title}</h2>
        </div>
        <div className={`shrink-0 px-4 py-3 border-2 ${answered > 0 ? statusBorder(tier.color) : 'border-[var(--color-line)]'} ${answered > 0 ? statusClasses(tier.color) : 'bg-[var(--color-paper-2)] text-[var(--color-ink-faint)]'} text-center`}>
          <div className="font-[var(--font-display)] font-bold text-[1.3rem] leading-none">
            {`${Math.round(pct)}%`}
          </div>
          <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] mt-1">
            {answered > 0 ? `${tier.label} · ${answered}/${tool.items.length}` : 'not started'}
          </div>
        </div>
      </div>

      <p className="p-6 pb-0 text-[0.98rem] text-[var(--color-ink-soft)] max-w-[80ch]">{tool.intro}</p>

      <div className="p-6">
        {/* legend */}
        <div className="flex flex-wrap gap-4 mb-5 font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)] no-print">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-600 inline-block"></span> 1-2 risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-400 inline-block"></span> 3 starting</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-600 inline-block"></span> 4-5 strong</span>
        </div>

        <div className="flex flex-col">
          {tool.items.map((it) => {
            const r = ratings[`${tool.id}:${it.n}`] || 0
            const wScore = r ? r * it.weight : 0
            return (
              <div key={it.n} className="grid grid-cols-1 md:grid-cols-[28px_1fr_120px_150px] gap-3 md:gap-4 py-4 border-t border-[var(--color-line)] items-start md:items-center">
                <div className="font-[var(--font-mono)] text-[0.8rem] text-[var(--color-ink-faint)]">{it.n}</div>
                <div>
                  <p className="text-[0.95rem] text-[var(--color-ink)]">{it.text}</p>
                  <p className="text-[0.8rem] text-[var(--color-ink-faint)] mt-1">{it.note}</p>
                </div>
                <div className="font-[var(--font-mono)] text-[0.72rem] text-[var(--color-ink-soft)]">
                  Wt <span className="text-[var(--color-ink)] font-semibold">{it.weight}</span>
                  {r > 0 && <span className="block mt-0.5">= {wScore} pts</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 no-print">
                    {ratingScale.map((s) => {
                      const st = ratingStatus(s.v)
                      const selected = r === s.v
                      return (
                        <button
                          key={s.v}
                          type="button"
                          onClick={() => setRating(tool.id, it.n, selected ? 0 : s.v)}
                          title={`${s.v} - ${s.label}`}
                          className={`w-7 h-7 text-[0.78rem] font-[var(--font-mono)] border-2 ${statusClasses(st)} ${selected ? 'ring-2 ring-[var(--color-ink)] ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        >
                          {s.v}
                        </button>
                      )
                    })}
                  </div>
                  <span className="font-[var(--font-mono)] text-[0.8rem] text-[var(--color-ink)]">
                    {r ? `${r}/5` : '–'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {answered > 0 && (
          <div className={`mt-6 p-5 border-l-[6px] ${statusBorder(tier.color)} ${statusClasses(tier.color)}`}>
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em]">Tier: {tier.label} ({Math.round(pct)}%)</span>
            <p className="mt-2 text-[0.95rem] leading-relaxed">{tier.advice}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function KpiTracker({ kpi, setKpi }) {
  return (
    <section id="t5" className="scroll-mt-32 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mb-8">
      <div className="p-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream-2)]">
        <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">T5 · BONUS</span>
        <h2 className="text-[1.5rem] leading-tight mt-1">Tool 5 - Sustainability KPI Tracker</h2>
        <p className="text-[0.98rem] text-[var(--color-ink-soft)] max-w-[80ch] mt-2">
          Not scored. Fill Target once at the start of the year and Actual each month. Variance = Actual minus Target; a negative number means you used less than planned.
        </p>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[640px]">
          <thead>
            <tr className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              <th className="border-b-2 border-[var(--color-ink)] py-3 pr-4">KPI</th>
              <th className="border-b-2 border-[var(--color-ink)] py-3 px-3">Unit</th>
              <th className="border-b-2 border-[var(--color-ink)] py-3 px-3">Target</th>
              <th className="border-b-2 border-[var(--color-ink)] py-3 px-3">Actual</th>
              <th className="border-b-2 border-[var(--color-ink)] py-3 px-3">Variance</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((k) => {
              const target = kpi[`${k.key}:t`]
              const actual = kpi[`${k.key}:a`]
              const t = parseFloat(target)
              const a = parseFloat(actual)
              const v = !isNaN(t) && !isNaN(a) ? a - t : null
              const vStatus = v === null ? 'none' : v <= 0 ? 'green' : 'red'
              return (
                <tr key={k.key} className="border-b border-[var(--color-line)]">
                  <td className="py-3 pr-4">
                    <span className="text-[0.95rem] text-[var(--color-ink)]">{k.label}</span>
                    <span className="block text-[0.76rem] text-[var(--color-ink-faint)]">{k.note}</span>
                  </td>
                  <td className="py-3 px-3 font-[var(--font-mono)] text-[0.8rem] text-[var(--color-ink-soft)]">{k.unit}</td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={target || ''}
                      onChange={(e) => setKpi(k.key, 't', e.target.value)}
                      className="w-24 bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] px-2 py-1.5 text-[0.9rem] no-print"
                      placeholder="0"
                    />
                    <span className="hidden print:inline">{target || '-'}</span>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={actual || ''}
                      onChange={(e) => setKpi(k.key, 'a', e.target.value)}
                      className="w-24 bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] px-2 py-1.5 text-[0.9rem] no-print"
                      placeholder="0"
                    />
                    <span className="hidden print:inline">{actual || '-'}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 font-[var(--font-mono)] text-[0.8rem] ${statusClasses(vStatus)}`}>
                      {v === null ? '-' : (v > 0 ? '+' : '') + Math.round(v * 100) / 100}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="text-[0.8rem] text-[var(--color-ink-faint)] mt-4">
          Carbon estimate uses: diesel litres x 2.68 + grid kWh x 0.40 (NERC factor). Both are indicative for SME-level tracking.
        </p>
      </div>
    </section>
  )
}

function FundingChecklist({ funding, setFunding }) {
  const totalItems = useMemo(() => fundingSections.reduce((s, sec) => s + sec.items.length, 0), [])
  const done = useMemo(
    () => Object.values(funding).filter(Boolean).length,
    [funding]
  )
  const pct = totalItems ? Math.round((done / totalItems) * 100) : 0

  return (
    <section id="t6" className="scroll-mt-32 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mb-8">
      <div className="p-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">T6 · BONUS</span>
          <h2 className="text-[1.5rem] leading-tight mt-1">Tool 6 - Funding Application Checklist</h2>
        </div>
        <div className="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-ink-soft)]">
          {done}/{totalItems} ready · {pct}%
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fundingSections.map((sec) => (
          <div key={sec.title} className="border-2 border-[var(--color-line)] p-5">
            <h3 className="text-[1.05rem] mb-3 text-[var(--color-ink)]">{sec.title}</h3>
            <ul className="space-y-2">
              {sec.items.map((item, i) => {
                const key = `${sec.title}:${i}`
                const checked = !!funding[key]
                return (
                  <li key={i} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setFunding(key)}
                      className="mt-1 w-4 h-4 accent-[var(--color-burnt)] no-print"
                    />
                    <span className={`text-[0.92rem] ${checked ? 'text-[var(--color-ink-faint)] line-through' : 'text-[var(--color-ink-soft)]'}`}>
                      {checked ? '✓ ' : ''}{item}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="px-6 pb-6">
        <h3 className="text-[1.05rem] mb-3 text-[var(--color-ink)]">Where to apply</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[560px]">
            <thead>
              <tr className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                <th className="border-b-2 border-[var(--color-ink)] py-2 pr-4">Institution</th>
                <th className="border-b-2 border-[var(--color-ink)] py-2 px-3">Window</th>
                <th className="border-b-2 border-[var(--color-ink)] py-2 px-3">Best for</th>
                <th className="border-b-2 border-[var(--color-ink)] py-2 px-3">Portal</th>
              </tr>
            </thead>
            <tbody>
              {fundingWhere.map((w) => (
                <tr key={w.inst} className="border-b border-[var(--color-line)]">
                  <td className="py-2.5 pr-4 text-[0.92rem] text-[var(--color-ink)]">{w.inst}</td>
                  <td className="py-2.5 px-3 text-[0.88rem] text-[var(--color-ink-soft)]">{w.window}</td>
                  <td className="py-2.5 px-3 text-[0.88rem] text-[var(--color-ink-soft)]">{w.best}</td>
                  <td className="py-2.5 px-3 font-[var(--font-mono)] text-[0.8rem] text-[var(--color-burnt)]">{w.url || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function ComplianceCalendar({ calendar, setCalendar }) {
  const Cell = ({ id }) => {
    const checked = !!calendar[id]
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setCalendar(id)}
        className="mt-0.5 w-4 h-4 accent-[var(--color-burnt)] no-print"
      />
    )
  }
  return (
    <section id="t7" className="scroll-mt-32 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] mb-8">
      <div className="p-6 border-b-2 border-[var(--color-ink)] bg-[var(--color-cream-2)]">
        <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">T7 · BONUS</span>
        <h2 className="text-[1.5rem] leading-tight mt-1">Tool 7 - Risk and Compliance Calendar</h2>
        <p className="text-[0.98rem] text-[var(--color-ink-soft)] max-w-[80ch] mt-2">
          Tick items off as you complete them each period. Confirm exact dates with the relevant agency, especially state-level items.
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-[var(--color-line)] p-5">
          <h3 className="text-[1.05rem] mb-3 text-[var(--color-ink)]">Monthly obligations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[460px]">
              <thead>
                <tr className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                  <th className="border-b-2 border-[var(--color-ink)] py-2 w-8"></th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Obligation</th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Agency</th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {monthlyObligations.map((o) => (
                  <tr key={o.n} className="border-b border-[var(--color-line)] align-top">
                    <td className="py-2 pr-2"><Cell id={`m:${o.n}`} /></td>
                    <td className="py-2 pr-3 text-[0.88rem] text-[var(--color-ink)]">{o.obligation}</td>
                    <td className="py-2 px-2 text-[0.82rem] text-[var(--color-ink-soft)]">{o.agency}</td>
                    <td className="py-2 px-2 font-[var(--font-mono)] text-[0.76rem] text-[var(--color-ink-faint)]">{o.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="border-2 border-[var(--color-line)] p-5">
          <h3 className="text-[1.05rem] mb-3 text-[var(--color-ink)]">Annual obligations by month</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[460px]">
              <thead>
                <tr className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                  <th className="border-b-2 border-[var(--color-ink)] py-2 w-8"></th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Month</th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Obligation</th>
                  <th className="border-b-2 border-[var(--color-ink)] py-2">Agency</th>
                </tr>
              </thead>
              <tbody>
                {annualObligations.map((o, i) => (
                  <tr key={i} className="border-b border-[var(--color-line)] align-top">
                    <td className="py-2 pr-2"><Cell id={`a:${i}`} /></td>
                    <td className="py-2 pr-3 font-[var(--font-mono)] text-[0.76rem] text-[var(--color-ink-faint)]">{o.month}</td>
                    <td className="py-2 pr-3 text-[0.88rem] text-[var(--color-ink)]">{o.obligation}</td>
                    <td className="py-2 px-2 text-[0.82rem] text-[var(--color-ink-soft)]">{o.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SsmeToolkit() {
  const [state, setState] = useState(loadState)
  const { counts, download, like } = useSmePdfs()

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const setRating = (toolId, n, v) =>
    setState((s) => ({ ...s, ratings: { ...s.ratings, [`${toolId}:${n}`]: v } }))
  const setKpi = (key, sub, v) =>
    setState((s) => ({ ...s, kpi: { ...s.kpi, [`${key}:${sub}`]: v } }))
  const setFunding = (key) =>
    setState((s) => ({ ...s, funding: { ...s.funding, [key]: !s.funding[key] } }))
  const setCalendar = (key) =>
    setState((s) => ({ ...s, calendar: { ...s.calendar, [key]: !s.calendar[key] } }))

  const reset = () => {
    if (window.confirm('Clear all your answers for this toolkit?')) {
      setState({ ratings: {}, kpi: {}, funding: {}, calendar: {} })
    }
  }

  // Dashboard summary for scored tools
  const summary = scoringTools.map((tool) => {
    const max = tool.maxWeightSum * 5
    let total = 0
    let answered = 0
    tool.items.forEach((it) => {
      const r = state.ratings[`${tool.id}:${it.n}`]
      if (r) {
        total += r * it.weight
        answered += 1
      }
    })
    const pct = max ? (total / max) * 100 : 0
    const complete = answered === tool.items.length
    return { tool, total, max, pct, complete, answered, tier: tierFor(pct) }
  })

  const navTools = [
    { id: 't1', label: 'Tool 1 · Business' },
    { id: 't2', label: 'Tool 2 · Energy' },
    { id: 't3', label: 'Tool 3 · Location' },
    { id: 't4', label: 'Tool 4 · Operations' },
    { id: 't5', label: 'Tool 5 · KPI' },
    { id: 't6', label: 'Tool 6 · Funding' },
    { id: 't7', label: 'Tool 7 · Calendar' },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* HEADER */}
      <section className="bg-cream pt-28 sm:pt-32 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/s-sme" className="hover:text-[var(--color-burnt)] no-underline">S-SME</Link> / Sustainable SME Toolkit
            </p>
            <h1 className="max-w-[20ch]">Sustainable SME Toolkit for Nigeria</h1>
            <p className="text-[1.1rem] max-w-[64ch] mt-5">
              Seven practical tools for evaluation, compliance, and green growth, built for the Nigerian SME reality.
              Score Tools 1-4 to see your maturity tier in green, yellow, or red. Your answers are saved in this browser.
            </p>
            <p className="text-[0.9rem] text-[var(--color-ink-faint)] mt-4 font-[var(--font-mono)] uppercase tracking-[0.1em]">
              Prepared by Jasmmycreativity Digital Hub · Audience: SME owners, sustainability champions, business coaches · Version 1.0 · 2026
            </p>
            <div className="flex flex-wrap gap-3 mt-7 no-print">
              <button onClick={() => window.print()} className="btn btn-primary">Download / Print to PDF</button>
              <button onClick={reset} className="btn border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">
                Clear my answers
              </button>
              <Link to="/s-sme/evidence" className="btn btn-ghost">See the evidence</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STICKY NAV */}
        <div className="sticky top-16 sm:top-[72px] z-30 bg-[var(--color-ink)] border-b-2 border-[var(--color-ink)] no-print">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {navTools.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="whitespace-nowrap px-3 py-1.5 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.08em] text-[var(--color-paper)]/80 hover:text-[var(--color-amber)]">
              {n.label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* DASHBOARD */}
        <ScrollReveal>
          <h2 className="text-[1.4rem] mb-5">Your scoreboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {summary.map((s) => (
              <div key={s.tool.id} className={`border-2 ${s.answered > 0 ? statusBorder(s.tier.color) : 'border-[var(--color-line)]'} ${s.answered > 0 ? statusClasses(s.tier.color) : 'bg-[var(--color-paper-2)] text-[var(--color-ink)]'} p-5`}>
                <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] opacity-80">{s.tool.id.toUpperCase()}</div>
                <div className="font-[var(--font-display)] font-bold text-[1.6rem] leading-none mt-2">
                  {`${Math.round(s.pct)}%`}
                </div>
                <div className="text-[0.82rem] mt-1 font-medium">
                  {s.answered > 0 ? s.tier.label : 'Not started'}
                </div>
                <div className="text-[0.72rem] mt-1 opacity-80">{s.answered}/{s.tool.items.length} · {s.total}/{s.max} pts</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <h2 className="text-[1.4rem] mb-3 mt-2">Fillable DIT PDFs</h2>
          <p className="text-[0.95rem] text-[var(--color-ink-faint)] max-w-[64ch] mb-5">
            Prefer pen-and-paper or a printable form? Download each tool as a fillable, DIT-branded PDF and use it offline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smePdfDownloads.map((d) => (
              <SmePdfCard
                key={d.file}
                file={d.file}
                label={d.label}
                summary={d.summary}
                achieve={d.achieve}
                counts={counts[d.file] || {}}
                onDownload={download}
                onLike={like}
              />
            ))}
          </div>
        </ScrollReveal>

        {scoringTools.map((tool) => (
          <ScoringTool key={tool.id} tool={tool} ratings={state.ratings} setRating={setRating} />
        ))}

        <KpiTracker kpi={state.kpi} setKpi={setKpi} />
        <FundingChecklist funding={state.funding} setFunding={setFunding} />
        <ComplianceCalendar calendar={state.calendar} setCalendar={setCalendar} />

        <div className="mt-10 flex flex-wrap gap-3 no-print">
          <button onClick={() => window.print()} className="btn btn-primary">Download / Print to PDF</button>
          <Link to="/s-sme" className="btn btn-ghost">Back to S-SME</Link>
        </div>
      </div>
    </div>
  )
}
