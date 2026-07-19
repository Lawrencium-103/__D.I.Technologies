import { useEffect, useState } from 'react'
import { subscribe, getStats, refreshFromServer } from '../lib/omsfStats'

function sum(obj) {
  return Object.values(obj || {}).reduce((a, b) => a + (b || 0), 0)
}

// The backend tracks report downloads/likes (reportDownloads / likes) AND
// generic PDF downloads/likes (pdfs[file].downloads / .likes). Total both so
// the impact band reflects all real engagement, not just one bucket.
function pdfTotal(pdfs, key) {
  return sum(
    Object.fromEntries(
      Object.entries(pdfs || {}).map(([k, v]) => [k, (v && v[key]) || 0])
    )
  )
}

// OMSF engagement impact band: reports generated, total downloads, community
// likes (plus an optional "in the library" slot on the report-library page).
// Reads from the local-first store so numbers move instantly and survive a
// backend that is unreachable; syncs to the server via Math.max().

export default function OmsfStats({ libraryCount = null }) {
  const [stats, setStats] = useState(() => getStats())

  useEffect(() => {
    const unsub = subscribe(setStats)
    refreshFromServer()
    return unsub
  }, [])

  const totalLikes = sum(stats.likes) + pdfTotal(stats.pdfs, 'likes')
  const totalDownloads = sum(stats.reportDownloads) + pdfTotal(stats.pdfs, 'downloads')

  const cards = [
    { k: 'generated', eyebrow: 'Reports generated', value: stats.generated, note: 'DIT OpenModel reports', accent: true },
    { k: 'downloads', eyebrow: 'Total downloads', value: totalDownloads, note: 'library reports pulled' },
    { k: 'likes', eyebrow: 'Community likes', value: totalLikes, note: 'on published reports' },
  ]
  if (libraryCount != null) {
    cards.push({ k: 'library', eyebrow: 'In the library', value: libraryCount, note: 'ready-made reports' })
  }

  return (
    <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)]">
      <div className="flex items-center justify-between px-5 sm:px-6 pt-3 border-b border-[var(--color-line)]">
        <span className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
          OMSF impact
        </span>
        <span className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">
          live · community-sourced
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.k}
            className={`relative p-5 sm:p-6 ${i !== 0 ? 'border-l border-[var(--color-line)]' : ''} ${
              i >= 2 ? 'border-t border-[var(--color-line)] lg:border-t-0' : ''
            }`}
          >
            <div className="font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
              {c.eyebrow}
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span
                className={`font-[var(--font-display)] font-bold text-[3rem] leading-none tabular-nums ${
                  c.accent ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)]'
                }`}
              >
                {c.value}
              </span>
            </div>
            <div className="text-[0.78rem] text-[var(--color-ink-soft)] mt-1">{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
