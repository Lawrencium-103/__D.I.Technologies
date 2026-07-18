import { useEffect, useState } from 'react'

// OMSF engagement impact: reports generated, total downloads, community likes.
// Mirrors /api/stats in localStorage so the numbers stay visible (and keep
// their last value) even when the backend is unreachable (e.g. local dev).

const LOCAL_KEY = 'dit-omsf-stats'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null')
  } catch {
    return null
  }
}
function saveLocal(v) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}
function sum(obj) {
  return Object.values(obj || {}).reduce((a, b) => a + (b || 0), 0)
}

export default function OmsfStats({ libraryCount = null }) {
  const [stats, setStats] = useState(() => loadLocal() || { generated: 0, likes: {}, reportDownloads: {} })

  useEffect(() => {
    let active = true
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!active) return
        const next = {
          generated: d.generated || 0,
          likes: d.likes || {},
          reportDownloads: d.reportDownloads || {},
        }
        saveLocal(next)
        setStats(next)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const totalLikes = sum(stats.likes)
  const totalDownloads = sum(stats.reportDownloads)

  const cards = [
    {
      k: 'generated',
      eyebrow: 'Reports generated',
      value: stats.generated,
      desc: 'DIT OpenModel reports',
      dark: true,
    },
    {
      k: 'downloads',
      eyebrow: 'Total downloads',
      value: totalDownloads,
      desc: 'library reports pulled',
    },
    {
      k: 'likes',
      eyebrow: 'Community likes',
      value: totalLikes,
      desc: 'on published reports',
    },
  ]
  if (libraryCount != null) {
    cards.push({ k: 'library', eyebrow: 'In the library', value: libraryCount, desc: 'ready-made reports' })
  }

  return (
    <div className={`grid gap-4 grid-cols-2 ${libraryCount != null ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {cards.map((c) => (
        <div
          key={c.k}
          className={`relative border-2 border-[var(--color-ink)] p-5 ${
            c.dark ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'bg-[var(--color-paper-2)]'
          }`}
        >
          <span
            className={`absolute top-0 left-0 h-1.5 w-full ${c.dark ? 'bg-[var(--color-amber)]' : 'bg-[var(--color-burnt)]'}`}
          ></span>
          <div
            className={`font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.16em] ${
              c.dark ? 'text-[var(--color-amber)]' : 'text-[var(--color-burnt)]'
            }`}
          >
            {c.eyebrow}
          </div>
          <div className="font-[var(--font-display)] font-bold text-[2.6rem] leading-none mt-3 tabular-nums">
            {c.value}
          </div>
          <div
            className={`text-[0.78rem] mt-1 ${
              c.dark ? 'text-[var(--color-paper)]/70' : 'text-[var(--color-ink-soft)]'
            }`}
          >
            {c.desc}
          </div>
        </div>
      ))}
    </div>
  )
}
