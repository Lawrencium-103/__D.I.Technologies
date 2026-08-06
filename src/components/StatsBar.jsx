import { useEffect, useRef, useState } from 'react'
import ScrollReveal from './ScrollReveal'

function Counter({ target, suffix = '', compact = false }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const dur = 1800
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.floor(eased * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  const formatValue = (v) => {
    if (compact) {
      if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M'
      if (v >= 1_000) return Math.floor(v / 1_000) + 'K'
      return v.toString()
    }
    return v.toLocaleString()
  }

  return (
    <span ref={ref} className="font-[var(--font-display)] font-bold text-[clamp(2.4rem,5vw,3.6rem)] text-[var(--color-amber)] leading-none tracking-tight tabular-nums">
      {formatValue(val)}{suffix}
    </span>
  )
}

const stats = [
  { target: 18300000, suffix: '+', label: 'Nigerian children out of school', source: 'UNICEF Nigeria, 2024', compact: true },
  { target: 50, suffix: '%', label: 'of Nigeria\u2019s GDP from MSMEs', source: 'SMEDAN National MSME Survey', compact: false },
  { target: 80, suffix: '%', label: 'of farmers are smallholders \u2014 90% of food produced by them', source: 'US Commercial Service / NBS NASS', compact: false },
  { target: 0, suffix: '', label: 'Internet required. Offline-first by design.', source: null, compact: false },
]

export default function StatsBar() {
  return (
    <ScrollReveal className="bg-burnt">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`text-center px-5 py-10 md:py-12 ${i !== 0 ? 'md:border-l border-[var(--color-paper)]/25' : ''} ${i === 2 || i === 3 ? 'border-t md:border-t-0 border-[var(--color-paper)]/25' : ''}`}
          >
            <Counter target={s.target} suffix={s.suffix} compact={s.compact} />
            <span className="block text-[var(--color-paper)]/80 text-[0.85rem] mt-3 leading-snug max-w-[24ch] mx-auto">{s.label}</span>
            {s.source && (
              <span className="block font-[var(--font-mono)] text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-paper)]/55 mt-3 max-w-[26ch] mx-auto leading-snug">{s.source}</span>
            )}
          </div>
        ))}
      </div>
    </ScrollReveal>
  )
}
