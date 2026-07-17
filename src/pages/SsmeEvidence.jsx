import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'

const pillars = [
  {
    n: '01',
    title: 'Green energy and power',
    body: [
      'The economics of solar for Nigerian SMEs are not speculative. They are published and current. Solar mini-grid electricity in Nigeria runs at roughly $0.57 per kWh, cheaper than diesel generation at around $0.71 per kWh, and a peer-reviewed techno-economic study found solar-diesel hybrid systems economically viable across a range of Nigerian private-sector industries, including education and hospitality.',
      'A 2026 survey of over 1,000 Nigerian micro, small, and medium enterprises found that while 83% rely on grid electricity, only 17.6% receive it consistently. That gap is what diesel, and now solar, exist to fill. Commercial solar providers report savings of up to 30% versus diesel-only operation.',
      'This is not just modelling. A barbershop owner on a Nigerian solar mini-grid went from spending roughly $1.20 a day on diesel to about $1.20 a month on power, and used the savings to lower his prices and grow his customer base.',
    ],
    sources: [
      { title: 'Economic viability of captive off-grid solar PV and diesel hybrid energy systems for the Nigerian private sector', venue: 'ScienceDirect' },
      { title: 'Solar for SMEs: A Hedge Against Rising Nigerian Diesel Costs', venue: 'Punch' },
      { title: 'For climate and livelihoods, Africa bets big on solar mini-grids', venue: 'Knowable Magazine' },
    ],
  },
  {
    n: '02',
    title: 'Offline digital inventory',
    body: [
      'Digitising stock tracking is one of the better-documented wins in African SME operations. Vendors serving Kenyan retailers report that SMEs moving from manual books to a digital inventory system see an average 12% increase in net profit within the first 90 days.',
      'That figure comes from an inventory-software provider, not an independent academic study, so treat it as an industry benchmark rather than proof, but it is a useful sanity check against our own numbers, and it is consistent with the direction and rough scale of what we have seen at Mama Tunde Provision Store (see case studies).',
    ],
    sources: [
      { title: 'Inventory Management System Kenya', venue: 'SmartBizSystems', note: 'vendor-reported data, included as an industry benchmark, not independent research' },
    ],
  },
  {
    n: '03',
    title: 'Compliance and reporting',
    body: [
      'This is the pillar with the most concrete, time-sensitive case behind it. Nigeria’s FIRS/NRS e-invoicing mandate is rolling out in phases: large taxpayers are already live, medium taxpayers (₦1 to 5 billion turnover) become mandatory around mid-2026, and small businesses follow over 2027. Sources differ on the exact small-business date, so we check FIRS’s own published timeline before quoting one in client conversations, rather than repeat a secondhand figure.',
      'What is not in dispute: a recent Lagos survey found 68% of small businesses were unaware the mandate was coming. That awareness gap is the actual opportunity. Most SMEs subject to this rule do not yet know they will need compliant systems.',
    ],
    sources: [
      { title: 'Nigeria e-invoicing rollout: Key updates for 2026 compliance', venue: 'Global VAT Compliance' },
      { title: 'Nigeria E-Invoicing Mandate 2025: Guide', venue: 'VATit' },
    ],
  },
  {
    n: '04',
    title: 'Bookkeeping and business evaluation',
    body: [
      'This is the pillar with the clearest causal evidence of the six. A study of 156 SME owners in Kampala, Uganda found a strong, statistically significant relationship between financial record-keeping and business performance (r = 0.756, p < 0.001): businesses with comprehensive financial records showed 43% higher profitability, 51% better cash flow management, and 38% higher access to formal credit than businesses with poor records.',
      'The same study found only about a third of SMEs surveyed kept complete financial records at all. Separately, industry reporting on African SME lending shows banks increasingly using digital transaction histories (mobile money, POS records) as an informal substitute for the audited books SMEs often cannot produce, meaning the record-keeping we help set up does not just clarify a business’s own decisions, it can be the difference between qualifying for credit and being turned away.',
    ],
    sources: [
      { title: 'Financial Records Keeping And Performance Of SMEs', venue: 'Kawempe Division study' },
      { title: 'How financial institutions drive SME access to finance in Africa', venue: 'Citi Newsroom' },
    ],
  },
  {
    n: '05',
    title: 'AI decision support',
    body: [
      'The strongest evidence we have for AI-assisted guidance in a Nigerian context comes from education, not retail: a World Bank-backed pilot in Edo State found that students using a teacher-guided AI tutor gained roughly two years of learning in six weeks, with effect sizes outperforming most documented education interventions.',
      'That is real, independently evaluated evidence that AI guidance works in low-resource Nigerian settings, but it is evidence about tutoring, not demand forecasting or pricing. We have not found a directly comparable independent study of AI-driven forecasting for informal African retail specifically, so for now this pillar rests more on our own deployments (see Mama Tunde) than on third-party research. We will update this section if and when that evidence exists. We would rather say that plainly than borrow credibility from a study that is not actually about this.',
    ],
    sources: [
      { title: 'From chalkboards to chatbots: Transforming learning in Nigeria', venue: 'World Bank' },
    ],
  },
  {
    n: '06',
    title: 'Customer relationships and sales & marketing with AI',
    body: [
      'We do not have Nigeria- or Africa-specific research to point to for this pillar. The underlying practice, following up with customers and noticing under-served channels, is standard, well-established small-business advice rather than something backed by a specific study.',
      'We are including it in S-SME because it is part of what makes a business defensible, not because we have a statistic to cite.',
    ],
    sources: [],
  },
]

export default function SsmeEvidence() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              DIT / S-SME
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink)]"></span>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">
              Evidence
            </span>
          </div>
          <h1 className="text-[2.4rem] sm:text-[3.2rem] leading-[1.06] font-[var(--font-display)] font-bold max-w-[20ch] mb-6">
            The Evidence Behind S-SME
          </h1>
          <p className="text-[1.15rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-8">
            Every tool we recommend to an SME costs that business time, money, or both to adopt. Before we ask an
            owner to trust us with any of it, we want our own claims to hold up. This page lays out the independent
            evidence behind each part of S-SME, separate from our own case studies, so a business owner (or anyone
            else) can check our thinking rather than take our word for it.
          </p>

          {/* National scale callout */}
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-6 sm:p-8 mb-14 border-l-[6px] border-[var(--color-burnt)]">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">
              Why this matters at scale
            </span>
            <p className="mt-3 text-[1.05rem] leading-relaxed">
              Small businesses matter at national scale here: SMEs contribute almost half of Nigeria’s GDP and employ
              more than 60 million people. Getting the basics right for one shop is a small thing. Getting it right for
              the sector is not.
            </p>
          </div>
        </ScrollReveal>

        {/* Pillars */}
        <div className="flex flex-col gap-14">
          {pillars.map((p) => (
            <ScrollReveal key={p.n}>
              <div className="flex gap-5 sm:gap-7">
                <div className="shrink-0 pt-1">
                  <span className="inline-flex items-center justify-center w-10 h-10 border-2 border-[var(--color-ink)] font-[var(--font-mono)] text-sm">
                    {p.n}
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-[1.6rem] sm:text-[1.8rem] leading-tight font-[var(--font-display)] font-semibold mb-4">
                    {p.title}
                  </h2>
                  {p.body.map((para, i) => (
                    <p key={i} className="text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[68ch] mb-4">
                      {para}
                    </p>
                  ))}

                  {p.sources.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-[var(--color-line)]">
                      <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] block mb-3">
                        Sources
                      </span>
                      <ul className="flex flex-col gap-2">
                        {p.sources.map((s, j) => (
                          <li key={j} className="font-[var(--font-mono)] text-[0.84rem] leading-relaxed">
                            <span className="text-[var(--color-burnt)]">{s.title}</span>
                            <span className="text-[var(--color-ink-faint)]"> · {s.venue}</span>
                            {s.note && (
                              <span className="text-[var(--color-ink-faint)]"> ({s.note})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Footer nav */}
        <ScrollReveal>
          <div className="mt-16 pt-10 border-t border-[var(--color-line)] flex flex-wrap gap-3">
            <Link to="/s-sme" className="btn btn-primary no-underline">Back to S-SME</Link>
            <Link to="/research" className="btn border-2 border-[var(--color-ink)] text-[var(--color-ink)] no-underline hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">
              The Research Behind OMSF
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
