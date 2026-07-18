import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import OmsfStats from '../components/OmsfStats'
import framework from '../data/contentFramework'

export default function Framework() {
  const f = framework
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              DIT / Method
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink)]"></span>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">
              v{f.version}
            </span>
          </div>
          <h1 className="text-[2.6rem] sm:text-[3.6rem] leading-[1.04] font-[var(--font-display)] font-bold max-w-[18ch] mb-6">
            The {f.name}
          </h1>
          <p className="text-[1.25rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[60ch] mb-10">
            {f.tagline}
          </p>
          <OmsfStats />
        </ScrollReveal>

        {/* Position / moat */}
        <ScrollReveal>
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-7 sm:p-10 mb-16">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              Our position
            </span>
            <p className="mt-4 text-[1.2rem] leading-relaxed font-[var(--font-display)] font-medium max-w-[62ch]">
              {f.position}
            </p>
          </div>
        </ScrollReveal>

        {/* How OMSF differs */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-3">How OMSF differs</h2>
          <p className="text-[1.1rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-8">
            {f.differentiation}
          </p>
        </ScrollReveal>

        {/* Lineage */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-3">Standing on the shoulders</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-8">
            OMSF is a practical adaptation of work that came before it. We name those sources on purpose. It is how we keep our own method honest.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {f.lineage.map((l) => (
              <div key={l.name} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6">
                {l.url ? (
                  <a href={l.url} target="_blank" rel="noreferrer" className="font-[var(--font-display)] font-semibold text-[1.1rem] text-[var(--color-burnt)] no-underline hover:underline">
                    {l.name}
                  </a>
                ) : (
                  <h3 className="font-[var(--font-display)] font-semibold text-[1.1rem] text-[var(--color-ink)]">{l.name}</h3>
                )}
                <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink-soft)] mt-2">{l.detail}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Stages */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-8">The synthesis loop</h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-px bg-[var(--color-ink)] border-2 border-[var(--color-ink)] mb-16">
          {f.stages.map((s) => (
            <div key={s.id} className="bg-[var(--color-paper)] p-6 sm:p-7">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-[var(--font-mono)] text-[0.9rem] text-[var(--color-burnt)]">{s.step}</span>
                <h3 className="text-[1.35rem] font-[var(--font-display)] font-semibold">{s.title}</h3>
              </div>
              <p className="text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[52ch]">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Openness ladder */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-3">The Openness Ladder</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-8">
            A model is only as open as its license lets you use it. Grade before you adopt. Six rungs, from closed to fully open.
          </p>
        </ScrollReveal>
        <div className="border-2 border-[var(--color-ink)] mb-4 hidden md:grid md:grid-cols-[64px_1.1fr_1.4fr_1.6fr] bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em]">
          <div className="p-3">Rung</div>
          <div className="p-3">Name</div>
          <div className="p-3">What is published</div>
          <div className="p-3">License and example</div>
        </div>
        <div className="border-2 border-[var(--color-ink)] border-t-0 mb-16">
          {f.opennessLadder.map((r) => (
            <div
              key={r.rung}
              className="grid md:grid-cols-[64px_1.1fr_1.4fr_1.6fr] border-t-2 border-[var(--color-ink)] first:border-t-0"
            >
              <div className="p-4 sm:p-5 font-[var(--font-mono)] text-[1.1rem] text-[var(--color-burnt)] font-bold bg-[var(--color-paper-2)] flex items-center">
                {r.rung}
              </div>
              <div className="p-4 sm:p-5 font-[var(--font-display)] font-semibold text-[1.15rem] border-t md:border-t-0 border-[var(--color-ink-faint)]">
                {r.name}
              </div>
              <div className="p-4 sm:p-5 text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)] border-t md:border-t-0 border-[var(--color-ink-faint)]">
                {r.published}
              </div>
              <div className="p-4 sm:p-5 text-[0.98rem] leading-relaxed text-[var(--color-ink)] border-t md:border-t-0 border-[var(--color-ink-faint)]">
                <span className="block mb-1">{r.license}</span>
                <span className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.08em] text-[var(--color-ink-faint)]">
                  {r.example}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Source tiers */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-3">Source tiers</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-8">
            Not all sources earn the same trust. Every claim in an OMSF post is tagged with a tier and a date.
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {f.sourceTiers.map((t) => (
            <div key={t.tier} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-[var(--font-mono)] text-[1.2rem] text-[var(--color-burnt)]">{t.tier}</span>
                <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                  {t.trust}
                </span>
              </div>
              <h3 className="text-[1.2rem] font-[var(--font-display)] font-semibold mb-3">{t.name}</h3>
              <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink-soft)] mb-3">{t.includes}</p>
              <p className="text-[0.92rem] leading-relaxed text-[var(--color-ink)] border-t border-[var(--color-ink-faint)] pt-3">
                {t.rule}
              </p>
            </div>
          ))}
        </div>

        {/* Audience lenses */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-3">Three decision frames</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-8">
            One research base, rewritten for three buyers. The same fact lands differently for each.
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {f.audienceLenses.map((a) => (
            <div key={a.lens} className="border-2 border-[var(--color-ink)] p-6">
              <h3 className="text-[1.25rem] font-[var(--font-display)] font-semibold mb-2">{a.lens}</h3>
              <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-burnt)] mb-4">
                {a.frame}
              </p>
              <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)]">{a.questions}</p>
            </div>
          ))}
        </div>

        {/* Consultancy */}
        <ScrollReveal>
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-7 sm:p-10">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              Consultancy
            </span>
            <h2 className="mt-4 text-[1.9rem] font-[var(--font-display)] font-bold mb-4">{f.consultancy.title}</h2>
            <p className="text-[1.1rem] leading-relaxed text-[var(--color-paper-soft)] max-w-[62ch] mb-7">
              {f.consultancy.body}
            </p>
            <Link
              to="/contact"
              className="inline-block font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-ink)] bg-[var(--color-burnt)] px-6 py-3 hover:bg-[var(--color-paper)] transition-colors"
            >
              {f.consultancy.cta}
            </Link>
            <Link
              to="/report"
              className="inline-block font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-paper)] border-2 border-[var(--color-paper)] px-6 py-3 hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] transition-colors ml-3"
            >
              Try the report builder
            </Link>
            <Link
              to="/reports"
              className="inline-block font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] px-6 py-3 hover:text-[var(--color-paper)] transition-colors ml-3"
            >
              Browse the report library
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-10 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
            {f.moatMarker}
          </p>
        </ScrollReveal>
      </div>
    </div>
  )
}
