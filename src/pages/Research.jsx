import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import OmsfStats from '../components/OmsfStats'

const academic = [
  {
    n: 1,
    authors: 'Solaiman, I.',
    year: '2023',
    title: 'The Gradient of Generative AI Release: Methods and Considerations',
    venue: 'FAccT ’23 (ACM Conference on Fairness, Accountability, and Transparency)',
    url: 'https://doi.org/10.1145/3593013.3593981',
    body:
      'The first peer-reviewed proposal that AI model openness should be graded on a multi-level gradient rather than treated as open-vs-closed. Solaiman’s framework defines six levels of access, from fully closed to fully open. OMSF’s six-rung Openness Ladder follows this same shape and owes its structure to this paper directly — we did not independently arrive at “six levels.”',
  },
  {
    n: 2,
    authors: 'White, M., Haddad, I., Osborne, C., Liu Yanglet, X-Y., Abdelmonsef, A., Varghese, S.',
    year: '2024',
    title:
      'The Model Openness Framework: Promoting Completeness and Openness for Reproducibility, Transparency, and Usability in Artificial Intelligence',
    venue: 'LF AI & Data Foundation, Generative AI Commons · arXiv:2403.13784',
    url: 'https://arxiv.org/abs/2403.13784',
    body:
      'A ranked classification system that grades models by which lifecycle components (code, data, weights, documentation, licensing) are actually released, and under what license — built specifically to counter “openwashing,” where a model is marketed as open but withholds the pieces needed to reproduce or audit it. This is the paper OMSF leans on most heavily. It comes with a companion evaluation tool, the Model Openness Tool (MOT).',
  },
  {
    n: 3,
    authors: 'Liesenfeld, A., Dingemanse, M.',
    year: '2024',
    title: 'Rethinking Open Source Generative AI: Open-Washing and the EU AI Act',
    venue: 'FAccT ’24',
    url: 'https://doi.org/10.1145/3630106.3659005',
    body:
      'Surveyed over 45 generative AI systems across 14 dimensions of openness (training data, documentation, licensing, access method) and found that many models marketed as “open source” are open-weight at best. Its central argument — that openness must be treated as composite (many separate parts) and gradient (a spectrum, not a checkbox) rather than a single binary label — is the reasoning OMSF relies on to justify grading each model on more than just “are the weights downloadable.”',
  },
]

const industry = [
  {
    n: 4,
    name: 'Open Source Initiative — Open Source AI Definition',
    meta: 'v1.0, released October 2024',
    url: 'https://opensource.org/ai',
    body:
      'The Open Source Initiative’s formal definition of what “open source” means when applied to an AI system, not just software. OMSF uses this definition as the test for whether a license actually qualifies as permissive (our L2 rung) rather than merely open-weight with restrictions (L1).',
  },
  {
    n: 5,
    name: 'LF AI & Data Foundation — Model Openness Tool (MOT)',
    meta: 'Companion tool to White et al. (2024), hosted by the Linux Foundation’s Generative AI Commons',
    url: '',
    body:
      'Provides a reference implementation for scoring a model’s completeness and openness against the academic MOF classes.',
  },
  {
    n: 6,
    name: 'Forrester Research — “Forrester’s Open-Source AI Model Openness Framework”',
    meta: 'July 2025',
    url: 'https://www.forrester.com/report/forresters-open-source-ai-model-openness-framework',
    body:
      'A separate, unrelated analyst framework that also uses the name “Model Openness Framework” — a naming coincidence, not the same work as White et al. above. Forrester’s version scores models across roughly a dozen criteria into three tiers (Class I–III) aimed at enterprise buyers. It’s a paywalled analyst report, not a public academic paper. We note it here because its buyer-facing framing (as opposed to the academic MOF’s producer-facing framing) is close in spirit to what OMSF does — but we have not had access to the full report, and we don’t cite specifics from it that we haven’t independently verified.',
  },
]

export default function Research() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">
              DIT / Method
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink)]"></span>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">
              Provenance
            </span>
          </div>
          <h1 className="text-[2.6rem] sm:text-[3.6rem] leading-[1.04] font-[var(--font-display)] font-bold max-w-[18ch] mb-6">
            The Research Behind OMSF
          </h1>
          <p className="text-[1.2rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-8">
            OMSF is not original research. It is a synthesis method built on top of published academic work and
            industry frameworks that already exist. This page names them directly, says what each one contributes,
            and says plainly where OMSF’s own contribution begins and ends.
          </p>

          <OmsfStats />

          {/* Provenance rule */}
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-6 sm:p-8 mb-14 border-l-[6px] border-[var(--color-burnt)]">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">
              The provenance rule
            </span>
            <p className="mt-3 text-[1.05rem] leading-relaxed">
              If a claim on this page can’t be traced to a citation below, we don’t want it on the site. That’s the
              same provenance rule OMSF applies to every model report, applied to ourselves.
            </p>
          </div>
        </ScrollReveal>

        {/* Academic literature */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mb-2">Academic literature</h2>
          <p className="text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-8">
            Three peer-reviewed works supply the shape, the scoring method, and the reasoning behind OMSF.
          </p>
          <div className="flex flex-col gap-5">
            {academic.map((c) => (
              <article key={c.n} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 flex gap-5">
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-sm">
                    [{c.n}]
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-burnt)]">
                    {c.authors} · {c.year}
                  </p>
                  <h3 className="font-[var(--font-display)] font-semibold text-[1.2rem] leading-snug mt-1">
                    “{c.title}”
                  </h3>
                  <p className="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-ink-faint)] mt-1 mb-3">
                    {c.venue}
                  </p>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-[var(--font-mono)] text-[0.8rem] text-[var(--color-burnt)] underline break-all"
                    >
                      {c.url}
                    </a>
                  )}
                  <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)] mt-3">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        {/* Industry frameworks */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mt-16 mb-2">Industry frameworks and standards</h2>
          <p className="text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-8">
            Two standards bodies and one analyst firm round out the method. We name the analyst report only to be
            honest about the naming overlap — and to flag what we have not verified.
          </p>
          <div className="flex flex-col gap-5">
            {industry.map((c) => (
              <article key={c.n} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 flex gap-5">
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center w-9 h-9 bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-sm">
                    [{c.n}]
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-[var(--font-display)] font-semibold text-[1.15rem] leading-snug">
                    {c.name}
                  </h3>
                  <p className="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-ink-faint)] mt-1 mb-3">
                    {c.meta}
                  </p>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-[var(--font-mono)] text-[0.8rem] text-[var(--color-burnt)] underline break-all"
                    >
                      {c.url}
                    </a>
                  )}
                  <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)] mt-3">{c.body}</p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        {/* What OMSF adds */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mt-16 mb-4">What OMSF actually adds</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-5">
            None of the four works above are written for the person deciding whether to adopt a model. Solaiman and
            Liesenfeld &amp; Dingemanse are academic contributions to a policy and transparency debate. White et al.’s
            MOF and the OSI definition tell a model producer what to release to earn a given class. None of them end in
            “so here’s what a school, an enterprise, and a non-profit should each do about it.”
          </p>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-5">
            That’s the actual gap OMSF fills: taking an existing, published openness signal and translating it into
            three audience-specific adoption decisions — private, enterprise, non-profit/public — with the deployment
            and procurement questions each of those buyers actually asks. The ladder isn’t new. The three-lens
            translation, tuned for African schools, SMEs, and non-profits specifically, is what we built.
          </p>
        </ScrollReveal>

        {/* What OMSF does not claim */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mt-16 mb-4">What OMSF does not claim</h2>
          <ul className="flex flex-col gap-3 max-w-[66ch]">
            <li className="flex gap-3 text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)]">
              <span className="text-[var(--color-burnt)] font-[var(--font-mono)]">—</span>
              <span>
                OMSF is not itself a peer-reviewed publication. It has not been through academic review, and its
                per-model reports are advisory content, not research findings.
              </span>
            </li>
            <li className="flex gap-3 text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)]">
              <span className="text-[var(--color-burnt)] font-[var(--font-mono)]">—</span>
              <span>
                OMSF is not a certifying body. A grade on our ladder is our synthesis of public sources at the report
                date, not an authoritative or legally binding classification.
              </span>
            </li>
            <li className="flex gap-3 text-[1.02rem] leading-relaxed text-[var(--color-ink-soft)]">
              <span className="text-[var(--color-burnt)] font-[var(--font-mono)]">—</span>
              <span>
                OMSF is produced by a small team, not a standards consortium. We name our sources so a reader can check
                our work independently — that’s the safeguard we rely on in place of formal peer review.
              </span>
            </li>
          </ul>
        </ScrollReveal>

        {/* Further reading */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mt-16 mb-4">Further reading</h2>
          <ol className="flex flex-col gap-3 max-w-[66ch] list-none pl-0">
            <li className="font-[var(--font-mono)] text-[0.86rem] leading-relaxed text-[var(--color-ink-soft)]">
              Solaiman, I. (2023). The Gradient of Generative AI Release. FAccT ’23.{' '}
              <a href="https://arxiv.org/abs/2302.04844" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">
                arXiv:2302.04844
              </a>
            </li>
            <li className="font-[var(--font-mono)] text-[0.86rem] leading-relaxed text-[var(--color-ink-soft)]">
              White, M. et al. (2024). The Model Openness Framework.{' '}
              <a href="https://arxiv.org/abs/2403.13784" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">
                arXiv:2403.13784
              </a>
            </li>
            <li className="font-[var(--font-mono)] text-[0.86rem] leading-relaxed text-[var(--color-ink-soft)]">
              Liesenfeld, A. &amp; Dingemanse, M. (2024). Rethinking Open Source Generative AI. FAccT ’24.{' '}
              <a href="https://doi.org/10.1145/3630106.3659005" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">
                doi.org/10.1145/3630106.3659005
              </a>
            </li>
            <li className="font-[var(--font-mono)] text-[0.86rem] leading-relaxed text-[var(--color-ink-soft)]">
              Open Source Initiative. The Open Source AI Definition, v1.0.{' '}
              <a href="https://opensource.org/ai" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">
                opensource.org/ai
              </a>
            </li>
          </ol>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/framework" className="btn btn-primary no-underline">See the OMSF framework</Link>
            <Link to="/reports" className="btn border-2 border-[var(--color-ink)] text-[var(--color-ink)] no-underline hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">
              Browse the report library
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
