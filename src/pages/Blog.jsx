import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { blogPosts } from '../data/blogPosts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Blog() {
  return (
    <>
      <section className="bg-cream pt-28 sm:pt-32 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">The DIT Blog</span>
            <h1 className="mt-3 max-w-[16ch]">Notes on open models, local infrastructure and practical AI.</h1>
            <p className="text-[1.1rem] max-w-[60ch] mt-5">
              Written by Lawrence Oladeji. Plain language, no hype. Built to help schools, businesses and
              governments make decisions they can actually own.
            </p>
            <Link
              to="/framework"
              className="inline-flex items-center gap-2 mt-6 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-ink)] border-2 border-[var(--color-ink)] px-4 py-2 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors no-underline"
            >
              Read the OpenModel Synthesis Framework <ArrowUpRight size={15} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-cream-2 py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((p, i) => (
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
        </div>
      </section>
    </>
  )
}
