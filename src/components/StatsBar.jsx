import { useEffect, useRef, useState } from 'react'
import ScrollReveal from './ScrollReveal'

function Counter({ target, suffix = '' }) {
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

  return (
    <span ref={ref} className="font-[var(--font-display)] font-bold text-[clamp(2.4rem,5vw,3.6rem)] text-[var(--color-amber)] leading-none tracking-tight tabular-nums">
      {val.toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { target: 10500000, suffix: '+', label: 'Nigerian children out of school' },
  { target: 60, suffix: '+', label: 'NERDC textbooks in the box' },
  { target: 0, suffix: '', label: 'Internet required' },
  { target: 26, suffix: '', label: 'Slash commands teachers use' },
]

export default function StatsBar() {
  return (
    <ScrollReveal className="bg-burnt">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`text-center px-5 py-12 ${i !== 0 ? 'md:border-l border-[var(--color-paper)]/25' : ''} ${i === 2 || i === 3 ? 'border-t md:border-t-0 border-[var(--color-paper)]/25' : ''}`}
          >
            <Counter target={s.target} suffix={s.suffix} />
            <span className="block text-[var(--color-paper)]/80 text-[0.85rem] mt-3 leading-snug max-w-[22ch] mx-auto">{s.label}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  )
}
