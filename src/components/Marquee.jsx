export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee-paused overflow-hidden select-none ${className}`}>
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-[var(--font-display)] font-semibold text-[clamp(1.4rem,3vw,2.4rem)] tracking-tight px-6 py-4">
              {item}
            </span>
            <span className="text-[var(--color-amber)] text-2xl leading-none">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
