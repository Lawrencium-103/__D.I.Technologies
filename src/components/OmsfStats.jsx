import { useEffect, useState } from 'react'

// OMSF engagement impact: reports generated + community likes.
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

export default function OmsfStats({ libraryCount = null }) {
  const [stats, setStats] = useState(() => loadLocal() || { generated: 0, likes: {} })

  useEffect(() => {
    let active = true
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!active) return
        const next = { generated: d.generated || 0, likes: d.likes || {} }
        saveLocal(next)
        setStats(next)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const totalLikes = Object.values(stats.likes || {}).reduce((a, b) => a + (b || 0), 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] p-5">
        <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-amber)]">Reports generated</div>
        <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{stats.generated}</div>
        <div className="text-[0.78rem] text-[var(--color-paper)]/70 mt-1">DIT OpenModel reports</div>
      </div>
      <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-5">
        <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">Community likes</div>
        <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{totalLikes}</div>
        <div className="text-[0.78rem] text-[var(--color-ink-soft)] mt-1">on published reports</div>
      </div>
      {libraryCount != null && (
        <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-5 col-span-2 lg:col-span-1">
          <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">In the library</div>
          <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{libraryCount}</div>
          <div className="text-[0.78rem] text-[var(--color-ink-soft)] mt-1">ready-made reports</div>
        </div>
      )}
    </div>
  )
}
