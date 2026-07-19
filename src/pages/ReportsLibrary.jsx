import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import OmsfStats from '../components/OmsfStats'
import { subscribe, getStats, recordDownload, recordLike, refreshFromServer } from '../lib/omsfStats'

export default function ReportsLibrary() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [stats, setStats] = useState(() => getStats())
  const [liked, setLiked] = useState({})

  useEffect(() => {
    let active = true
    const unsub = subscribe(setStats)
    fetch('/reports/manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!active) return
        setItems(Array.isArray(data) ? data : [])
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setStatus('error')
      })
    refreshFromServer()
    return () => {
      active = false
      unsub()
    }
  }, [])

  const trackDownload = (file) => {
    recordDownload(file)
    const r = fetch('/api/report/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file }),
    })
    if (r && typeof r.then === 'function') r.catch(() => {})
  }

  const audienceLabel = (a) =>
    ({ general: 'General', private: 'Private / individual', enterprise: 'Enterprise', nonprofit: 'Non-profit / public' }[a] || a)

  const like = (id) => {
    if (liked[id]) return
    setLiked((p) => ({ ...p, [id]: true }))
    recordLike(id)
    fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              DIT / OpenModel
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink)]"></span>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">
              Free downloads
            </span>
          </div>
          <h1 className="text-[2.6rem] sm:text-[3.6rem] leading-[1.04] font-[var(--font-display)] font-bold max-w-[20ch] mb-6">
            OpenModel report library
          </h1>
          <p className="text-[1.2rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[62ch] mb-8">
            Ready-made DIT OpenModel reports for well-known 2025 models. Each is graded on the Openness Ladder,
            sourced from the web, and laid out in our branded DIT report template. Free to read, free to download.
          </p>

          <div className="mb-10">
            <OmsfStats libraryCount={items.length} />
          </div>
        </ScrollReveal>

        {status === 'loading' && (
          <p className="text-[var(--color-ink-soft)]">Loading reports…</p>
        )}
        {status === 'error' && (
          <p className="text-[var(--color-ink-soft)]">
            Could not load the report list. Please try again shortly, or{' '}
            <Link to="/report" className="text-[var(--color-burnt)] underline">build your own report</Link>.
          </p>
        )}

        {status === 'ready' && (
          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            {items.map((it) => {
               const id = it.file
              const count = stats.likes?.[id] || 0
              const downloads = stats.reportDownloads?.[id] || 0
              const isLiked = !!liked[id]
              return (
                <div key={id} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="font-[var(--font-display)] font-bold text-[1.5rem] leading-tight">{it.model}</h2>
                      <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mt-1">
                        {it.publisher} · {it.date}
                      </p>
                    </div>
                    <span className="shrink-0 bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-[0.78rem] px-2.5 py-1 tracking-[0.08em]">
                      {it.grade}
                    </span>
                  </div>
                  <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)] mb-4">
                    {it.gradeLabel}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] border border-[var(--color-ink)] px-2 py-1 text-[var(--color-ink-soft)]">
                      {audienceLabel(it.audience)}
                    </span>
                    <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] border border-[var(--color-ink)] px-2 py-1 text-[var(--color-ink-soft)]">
                      OMSF v1
                    </span>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                     <a
                       href={`/reports/${it.file}`}
                       download
                       onClick={() => trackDownload(it.file)}
                       className="btn btn-primary text-center no-underline"
                     >
                       Download PDF
                     </a>
                     <div className="flex items-center justify-between">
                       <button
                         onClick={() => like(id)}
                         disabled={isLiked}
                         aria-label={`Like ${it.model} report`}
                         className={`inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-2 border-2 transition-colors ${
                           isLiked
                             ? 'border-[var(--color-burnt)] text-[var(--color-burnt)] bg-[var(--color-burnt)]/10 cursor-default'
                             : 'border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]'
                         }`}
                       >
                         <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                         {count} {count === 1 ? 'like' : 'likes'}
                       </button>
                       <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                         {downloads} {downloads === 1 ? 'download' : 'downloads'}
                       </span>
                      <p className="font-[var(--font-mono)] text-[0.6rem] text-[var(--color-ink-faint)] break-all max-w-[55%] text-right">
                        {it.file}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <ScrollReveal>
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
                Your model not here?
              </span>
              <p className="mt-3 text-[1.15rem] leading-relaxed font-[var(--font-display)] font-medium max-w-[52ch]">
                Generate a fresh OpenModel report for any model in seconds. Free, instant, no sign-up.
              </p>
            </div>
            <Link to="/report" className="btn btn-primary shrink-0 no-underline">
              Build your own report
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
