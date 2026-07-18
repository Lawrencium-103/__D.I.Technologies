import { useMemo } from 'react'
import { useSmePdfs } from '../lib/smePdf'
import { smePdfDownloads } from '../data/smeToolkit'

// Aggregate SME toolkit impact: total downloads + likes across all fillable PDFs.
export default function SmeStats() {
  const { counts } = useSmePdfs()
  const totalDownloads = useMemo(
    () => Object.values(counts).reduce((s, c) => s + (c?.downloads || 0), 0),
    [counts]
  )
  const totalLikes = useMemo(
    () => Object.values(counts).reduce((s, c) => s + (c?.likes || 0), 0),
    [counts]
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] p-5">
        <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-amber)]">Total downloads</div>
        <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{totalDownloads}</div>
        <div className="text-[0.78rem] text-[var(--color-paper)]/70 mt-1">across all toolkit PDFs</div>
      </div>
      <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-5">
        <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">Total likes</div>
        <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{totalLikes}</div>
        <div className="text-[0.78rem] text-[var(--color-ink-soft)] mt-1">from founders & coaches</div>
      </div>
      <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-5 col-span-2 lg:col-span-1">
        <div className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-burnt)]">Toolkit reach</div>
        <div className="font-[var(--font-display)] font-bold text-[2.2rem] leading-none mt-2">{smePdfDownloads.length}</div>
        <div className="text-[0.78rem] text-[var(--color-ink-soft)] mt-1">fillable, offline-ready PDFs</div>
      </div>
    </div>
  )
}
