import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

const API = '/.netlify/functions/engagement'
const localKey = (id) => `dit-like-${id}`

export default function LikeButton({ id, label = 'Like this post' }) {
  const [count, setCount] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const stored = Number(localStorage.getItem(localKey(id)) || '0')
    if (Number.isFinite(stored) && stored > 0) setCount(stored)
    let alive = true
    fetch(`${API}/likes/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return
        const srv = d && typeof d.likes === 'number' ? d.likes : 0
        const next = Math.max(stored, srv)
        setCount(next)
        localStorage.setItem(localKey(id), String(next))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [id])

  const like = () => {
    setCount((c) => {
      const next = c + 1
      localStorage.setItem(localKey(id), String(next))
      return next
    })
    setPulse(true)
    setTimeout(() => setPulse(false), 220)
    fetch(`${API}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.likes === 'number') {
          setCount((c) => {
            const v = Math.max(c, d.likes)
            localStorage.setItem(localKey(id), String(v))
            return v
          })
        }
      })
      .catch(() => {})
  }

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={like}
        aria-label={label}
        className="group inline-flex items-center gap-3 bg-[var(--color-burnt)] text-[var(--color-paper)] border-2 border-[var(--color-burnt)] px-7 py-4 hover:bg-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
      >
        <Heart size={26} className={`transition-transform duration-200 ${pulse ? 'scale-125' : ''}`} />
        <span className="font-[var(--font-display)] font-bold text-lg uppercase tracking-wide">{label}</span>
      </button>
      <div className="flex items-baseline gap-2">
        <span className="font-[var(--font-mono)] text-4xl font-bold text-[var(--color-ink)] tabular-nums leading-none">{count}</span>
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">likes</span>
      </div>
    </div>
  )
}
