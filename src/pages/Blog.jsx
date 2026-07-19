import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { blogPosts } from '../data/blogPosts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]
const years = ['All', ...Array.from(new Set(blogPosts.map((p) => new Date(p.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))]

export default function Blog() {
  const [activeCat, setActiveCat] = useState('All')
  const [activeYear, setActiveYear] = useState('All')

  const filtered = useMemo(
    () =>
      blogPosts.filter((p) => {
        const catOk = activeCat === 'All' || p.category === activeCat
        const yearOk = activeYear === 'All' || new Date(p.date).getFullYear().toString() === activeYear
        return catOk && yearOk
      }),
    [activeCat, activeYear]
  )

  const filtBtn = (active, onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className={`font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] px-3 py-1.5 border-2 transition-colors ${
        active
          ? 'bg-[var(--color-burnt)] text-[var(--color-paper)] border-[var(--color-burnt)]'
          : 'border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]'
      }`}
    >
      {label}
    </button>
  )

  return (
    <>
      <section className="bg-cream pt-28 sm:pt-32 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">The DIT Blog</span>
            <h1 className="mt-3 max-w-[18ch]">Notes on open models, local infrastructure and practical AI.</h1>
            <p className="text-[1.1rem] max-w-[52ch] mt-5">
              Written by Lawrence Oladeji. Plain language, no hype.
            </p>
            <div className="mt-7">
              <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mb-3">
                How we grade open models
              </p>
              <Link
                to="/framework"
                className="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[0.82rem] uppercase tracking-[0.1em] text-[var(--color-paper)] bg-[var(--color-burnt)] border-2 border-[var(--color-burnt)] px-5 py-3 hover:bg-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors no-underline"
              >
                OpenModel Synthesis Framework (OMSF) <ArrowUpRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-cream-2 pt-4 pb-8 border-b-2 border-[var(--color-ink)]">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow mr-1">Topic</span>
            {categories.map((c) => filtBtn(activeCat === c, () => setActiveCat(c), c))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow mr-1">Year</span>
            {years.map((y) => filtBtn(activeYear === y, () => setActiveYear(y), y))}
          </div>
        </div>
      </section>

      <section className="bg-cream-2 py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mb-6">
            {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
            {activeCat !== 'All' || activeYear !== 'All' ? ' · filtered' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 0.06}>
                <Link to={`/blog/${p.slug}`} className="group block bg-[var(--color-paper)] border-2 border-[var(--color-ink)] h-full hover:shadow-[8px_8px_0_var(--color-burnt)] transition-all no-underline">
                  <div className="aspect-[16/9] overflow-hidden border-b-2 border-[var(--color-ink)]">
                    <img src={p.cover} alt={p.coverAlt || p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mb-3">
                      <span className="text-[var(--color-burnt)]">Written by Lawrence Oladeji</span>
                      <span>{formatDate(p.date)}</span>
                    </div>
                    <h2 className="text-[1.35rem] leading-tight mb-3 text-[var(--color-ink)] group-hover:text-[var(--color-burnt)] transition-colors">{p.title}</h2>
                    <p className="text-[0.95rem] text-[var(--color-ink-soft)] mb-5">{p.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 font-[var(--font-display)] font-semibold text-[var(--color-burnt)] text-sm">Read <ArrowUpRight size={16} /></span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="font-[var(--font-mono)] text-[0.8rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] py-12 text-center">
              No posts match this filter.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
