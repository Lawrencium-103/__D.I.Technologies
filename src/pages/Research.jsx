import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Send, TriangleAlert } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import OmsfStats from '../components/OmsfStats'
import { useSEO } from '../lib/seo'

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

// Expression of Interest form — must stay field-for-field identical to the
// static "research-eoi" form injected into the prerendered /research HTML
// (scripts/prerender.mjs) so Netlify accepts the submissions.
const eoiAreas = [
  'Benchmarking & data analysis',
  'Academic writing & positioning',
  'Field study design (Nigeria school pilot)',
  'Reproducing the study / open dataset',
  'General — keep me posted',
]

export default function Research() {
  useSEO({
    title: 'The research behind OMSF',
    description:
      'The academic and industry sources behind the OpenModel Synthesis Framework, our published Zenodo preprint (DOI 10.5281/zenodo.21965789), and how to cite DIT and OMSF. Register interest in our next study on edge LLM serving.',
  })

  // Expression of Interest — next study (Paper 1: edge LLM serving under
  // off-grid classroom concurrency). Netlify form, same pattern as Contact.
  const [eoi, setEoi] = useState({ name: '', email: '', affiliation: '', area: eoiAreas[0], message: '' })
  const [eoiStatus, setEoiStatus] = useState('idle')

  const handleEoiChange = (e) => {
    const { name, value } = e.target
    setEoi((f) => ({ ...f, [name]: value }))
  }

  const handleEoiSubmit = async (e) => {
    e.preventDefault()
    setEoiStatus('sending')
    const data = new URLSearchParams({
      'form-name': 'research-eoi',
      'bot-field': '',
      name: eoi.name,
      email: eoi.email,
      affiliation: eoi.affiliation || '',
      area: eoi.area,
      message: eoi.message || '',
    })
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      })
      if (!res.ok) throw new Error('Form submission rejected')
      setEoiStatus('sent')
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { form_name: 'research-eoi', area: eoi.area, page_path: window.location.pathname })
      }
    } catch {
      setEoiStatus('error')
    }
  }

  const eoiField =
    'w-full px-4 py-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-burnt)] rounded-none transition-colors'
  const eoiLabel =
    'block font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-paper-2)] mb-2'

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
          <p className="text-[1.2rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[64ch] mb-6">
            OMSF is a buyer-side taxonomy for evaluating AI model openness — published on Zenodo, graded against
            821 open-weight LLMs, and built on top of peer-reviewed work by Solaiman, White et al., and
            Liesenfeld &amp; Dingemanse. This page names those sources directly and says where our own contribution begins.
          </p>

          <a
            href="#eoi"
            className="btn btn-primary no-underline inline-flex items-center gap-2 mb-10 whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('eoi')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Expression of Interest — Next Study
          </a>

          <div className="mb-12">
            <OmsfStats />
          </div>

          {/* Academic Integrity & Research Roadmap */}
          <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-5 sm:p-7 sm:p-8 mb-14 shadow-[6px_6px_0px_#1A1712]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-[var(--color-line)] pb-3">
              <span className="font-[var(--font-mono)] text-[0.65rem] sm:text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] font-bold">
                [ ACADEMIC POSITION &amp; RESEARCH ROADMAP ]
              </span>
              <span className="font-[var(--font-mono)] text-[0.6rem] sm:text-[0.68rem] uppercase tracking-[0.12em] bg-[var(--color-paper)] border border-[var(--color-ink)] px-2 py-0.5">
                Published Preprint
              </span>
            </div>

            <h2 className="text-[1.6rem] font-[var(--font-display)] font-bold leading-tight mb-3">
              Published on Zenodo · Peer review next
            </h2>

            <div className="bg-[var(--color-ink)]/5 border-l-4 border-[var(--color-burnt)] p-4 mb-5">
              <p className="text-[0.95rem] leading-relaxed text-[var(--color-ink)]">
                <span className="font-bold text-[var(--color-burnt)]">Published:</span> <em>The OpenModel Synthesis Framework (OMSF): A Buyer-Side Taxonomy for Evaluating AI Model Openness in Resource-Constrained and Sovereignty-Critical Deployments</em> — DOI <a href="https://doi.org/10.5281/zenodo.21965572" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">10.5281/zenodo.21965572</a>. Graded N = 821 open-weight LLMs from HuggingFace. Chi-squared, Mann–Whitney U, and inter-rater reliability (κ = 0.95) reported. Cross-listing on arXiv and submission to FAccT / EACL are in progress.
              </p>
            </div>

            <p className="text-[1rem] leading-relaxed text-[var(--color-ink-soft)] mb-4">
              OMSF is built on peer-reviewed foundations — Solaiman (2023), White et al. (2024), and Liesenfeld &amp; Dingemanse (2024) — and extends them with a buyer-facing deployment frame that none of those works provide.
            </p>

            <p className="text-[1rem] leading-relaxed text-[var(--color-ink-soft)] mb-5">
              The direction is deliberately international, not Africa-only. Every institution that has to procure or deploy AI — a European ministry working under the EU AI Act, a hospital, a sovereign-cloud operator, a public-sector buyer in the Global South — faces the same gap: existing openness frameworks tell model producers what to release, not buyers what to verify. OMSF is the buyer-side answer: a taxonomy for evaluating how open a model really is before you adopt, license, and run it under your own resource, regulatory, and sovereignty constraints.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#citations" className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)]">
                Review Literature Citations Below ↓
              </a>
            </div>
          </div>

          {/* Provenance rule */}
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-6 sm:p-8 mb-14 border-l-[6px] border-[var(--color-burnt)]">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">
              The provenance rule
            </span>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-[var(--color-paper)]">
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
              <article key={c.n} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-5 sm:p-6 flex gap-3 sm:gap-5">
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-xs sm:text-sm">
                    [{c.n}]
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-burnt)]">
                    {c.authors} · {c.year}
                  </p>
                  <h3 className="font-[var(--font-display)] font-semibold text-[1.05rem] sm:text-[1.2rem] leading-snug mt-1">
                    "{c.title}"
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
              <article key={c.n} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-5 sm:p-6 flex gap-3 sm:gap-5">
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[var(--color-ink)] text-[var(--color-paper)] font-[var(--font-mono)] text-xs sm:text-sm">
                    [{c.n}]
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-[var(--font-display)] font-semibold text-[1.05rem] sm:text-[1.15rem] leading-snug">
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
                OMSF per-model reports are advisory content and synthesis, not formal research findings. OMSF itself is not a peer-reviewed publication and has not been through academic peer review.
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

        {/* African Sovereign AI & Low-Connectivity Deployment Matrix */}
        <ScrollReveal>
          <h2 className="text-[1.9rem] mt-16 mb-4">African Data Sovereignty &amp; Offline Edge Matrix</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-6">
            Global AI literature evaluates models based on hyper-scale cloud availability. DIT operationalizes OMSF specifically for African schools, SMEs, and public institutions operating under strict data localization laws (e.g. Nigeria NDPR, Ghana Data Protection Act, Kenya DPA) and low-bandwidth local hardware constraints.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mb-14">
            <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6">
              <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] font-bold">
                1. Data Sovereignty &amp; Local On-Prem
              </span>
              <h3 className="font-[var(--font-display)] font-semibold text-lg mt-2 mb-2">Zero Foreign Data Egress</h3>
              <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink-soft)]">
                Models graded L2 or higher (permissive open-weight) can be deployed fully air-gapped, with no telemetry or prompt metadata leaving national borders or enterprise data centers. Local inference alone does not constitute total data-protection compliance — consent management, data-subject rights, and storage security remain separate obligations under laws such as the NDPR.
              </p>
            </div>
            <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6">
              <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] font-bold">
                2. Bandwidth &amp; Local Edge Inference
              </span>
              <h3 className="font-[var(--font-display)] font-semibold text-lg mt-2 mb-2">Quantized Local Execution</h3>
              <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink-soft)]">
                Evaluates 4-bit and 8-bit quantized weights (GGUF/AWQ) capable of running locally on consumer hardware or low-power solar appliances (like SomaBox) without live internet.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Academic & Policy Citation Box */}
        <ScrollReveal>
          <h2 id="citations" className="text-[1.9rem] mt-16 mb-4">Citing DIT &amp; OMSF in Research or Policy</h2>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[66ch] mb-6">
            If you are using the OpenModel Synthesis Framework in policy documentation, government RFPs, or academic publications, cite the Zenodo preprint below — that record, by Lawrence Oladeji, is the version of record.
          </p>

          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-6 font-[var(--font-mono)] text-[0.8rem] border-l-4 border-[var(--color-amber)] mb-6 overflow-x-auto select-all">
            <span className="text-[var(--color-amber)] uppercase tracking-[0.14em] text-[0.7rem] block mb-2">BibTeX Citation</span>
            <pre className="whitespace-pre-wrap leading-relaxed text-[var(--color-paper)]/90">{`@misc{oladeji2026omsf,
  author      = {Oladeji, Lawrence},
  title       = {The OpenModel Synthesis Framework (OMSF): A Buyer-Side Taxonomy
                  for Evaluating AI Model Openness in Resource-Constrained and
                  Sovereignty-Critical Deployments},
  year        = {2026},
  publisher   = {Zenodo},
  doi         = {10.5281/zenodo.21965572},
  url         = {https://doi.org/10.5281/zenodo.21965572}
}`}</pre>
          </div>

          <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-5 font-[var(--font-mono)] text-[0.82rem] mb-12">
            <span className="text-[var(--color-burnt)] uppercase tracking-[0.14em] text-[0.7rem] font-bold block mb-2">APA Citation</span>
            <p className="text-[var(--color-ink)] leading-relaxed">
              Oladeji, L. (2026). <em>The OpenModel Synthesis Framework (OMSF): A Buyer-Side Taxonomy for Evaluating AI Model Openness in Resource-Constrained and Sovereignty-Critical Deployments</em>. Zenodo.{' '}
              <a href="https://doi.org/10.5281/zenodo.21965572" target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline break-all">
                https://doi.org/10.5281/zenodo.21965572
              </a>
            </p>
          </div>
        </ScrollReveal>

        {/* Expression of Interest — next study */}
        <ScrollReveal>
          <h2 id="eoi" className="text-[1.9rem] mt-16 mb-4">Expression of Interest — Next Study</h2>

          <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-7 sm:p-8 mb-8">
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] font-bold">
              Paper 2 · Pre-Registered
            </span>
            <h3 className="font-[var(--font-display)] font-semibold text-[1.2rem] leading-snug mt-2 mb-3">
              Edge-LLM Serving under Off-Grid Classroom Concurrency: Priority Scheduling, Disconnect Mitigation, and Thermal-Aware Viability
            </h3>
            <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-soft)] mb-4">
              Measured token throughput, thermals, and power draw when a full class of students hits a locally-hosted model at once — off-grid, no live internet. Pre-registered hypotheses, full telemetry schema, and open dataset on completion.
            </p>

            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">
              Pre-Registered Hypotheses
            </span>
            <ul className="mt-2 mb-4 space-y-2">
              <li className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                <span className="font-[var(--font-mono)] text-[var(--color-burnt)] shrink-0">H1</span>
                <span><strong>Interactive Responsiveness</strong> — ≥60% P95 TTFT reduction for interactive chat arriving during background generation via task preemption.</span>
              </li>
              <li className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                <span className="font-[var(--font-mono)] text-[var(--color-burnt)] shrink-0">H2</span>
                <span><strong>Fairness</strong> — Jain's Fairness Index J ≥ 0.90 (vs J ≤ 0.70 baseline) using sequence-tied FCFS and single-active task limits per student.</span>
              </li>
              <li className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                <span className="font-[var(--font-mono)] text-[var(--color-burnt)] shrink-0">H3</span>
                <span><strong>Ghost Compute</strong> — Ghost-Compute Ratio GCR ≤ 0.02 measured via worker-side task.retire() disconnect tracking.</span>
              </li>
              <li className="flex gap-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                <span className="font-[var(--font-mono)] text-[var(--color-burnt)] shrink-0">H4</span>
                <span><strong>Pedagogical Parity</strong> — 100% quiz key accuracy pass rate and TOST token-length equivalence (±3%).</span>
              </li>
            </ul>

            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">
              Telemetry
            </span>
            <p className="text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)] mt-2">
              Nullable timing fields for rejected/cancelled requests, ghost_tokens, pagefile_used_mb, CPU clock frequency sampling fallback. Full schema published in research/metrics_schema.json.
            </p>
          </div>
          <div className="bg-[var(--color-ink)] p-7 sm:p-8 border-l-4 border-[var(--color-amber)]">
            {eoiStatus === 'sending' ? (
              <div className="text-center py-12">
                <Send size={56} className="text-[var(--color-amber)] mx-auto mb-4 animate-pulse" />
                <h3 className="text-[1.5rem] mb-2 text-[var(--color-paper)]">Sending your registration…</h3>
                <p className="text-[0.95rem] max-w-[40ch] mx-auto mb-6 text-[var(--color-paper)]/80">Please wait a moment.</p>
              </div>
            ) : eoiStatus === 'error' ? (
              <div className="text-center py-12">
                <TriangleAlert size={56} className="text-[var(--color-amber)] mx-auto mb-4" />
                <h3 className="text-[1.5rem] mb-2 text-[var(--color-paper)]">Registration not sent.</h3>
                <p className="text-[0.95rem] max-w-[48ch] mx-auto mb-6 text-[var(--color-paper)]/80">
                  Something went wrong. Email us directly at{' '}
                  <a href="mailto:contact@dintechnologies.com" className="text-[var(--color-amber)] underline">contact@dintechnologies.com</a>{' '}
                  or try again.
                </p>
                <button onClick={() => setEoiStatus('idle')} className="btn btn-primary">Try again</button>
              </div>
            ) : eoiStatus === 'sent' ? (
              <div className="text-center py-12">
                <CheckCircle2 size={56} className="text-[var(--color-amber)] mx-auto mb-4" />
                <h3 className="text-[1.5rem] mb-2 text-[var(--color-paper)]">Registration received.</h3>
                <p className="text-[0.95rem] max-w-[48ch] mx-auto mb-6 text-[var(--color-paper)]/80">
                  Thanks{eoi.name ? `, ${eoi.name}` : ''}. We&rsquo;ll keep you posted as the study progresses — preprint, dataset and field notes.
                </p>
                <button onClick={() => setEoiStatus('idle')} className="btn btn-primary">Register someone else</button>
              </div>
            ) : (
              <form onSubmit={handleEoiSubmit} name="research-eoi" data-netlify="true" data-netlify-honeypot="bot-field" className="space-y-5">
                <input type="hidden" name="form-name" value="research-eoi" />
                <input type="hidden" name="bot-field" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="eoi-name" className={eoiLabel}>Full name</label>
                    <input id="eoi-name" name="name" type="text" required value={eoi.name} onChange={handleEoiChange} className={eoiField} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="eoi-email" className={eoiLabel}>Email</label>
                    <input id="eoi-email" name="email" type="email" required value={eoi.email} onChange={handleEoiChange} className={eoiField} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="eoi-affiliation" className={eoiLabel}>Affiliation (optional)</label>
                  <input id="eoi-affiliation" name="affiliation" type="text" value={eoi.affiliation} onChange={handleEoiChange} className={eoiField} placeholder="University / school / organisation / none" />
                </div>
                <div>
                  <label htmlFor="eoi-area" className={eoiLabel}>How would you like to be involved?</label>
                  <select id="eoi-area" name="area" value={eoi.area} onChange={handleEoiChange} className={`${eoiField} cursor-pointer`}>
                    {eoiAreas.map((a) => (<option key={a} value={a}>{a}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="eoi-message" className={eoiLabel}>Anything else? (optional)</label>
                  <textarea id="eoi-message" name="message" rows={4} value={eoi.message} onChange={handleEoiChange} className={`${eoiField} resize-none`} placeholder="Tell us how the study relates to your work…" />
                </div>
                <button type="submit" disabled={eoiStatus === 'sending'} className="btn btn-primary w-full md:w-auto disabled:opacity-60"><Send size={18} /> {eoiStatus === 'sending' ? 'Sending…' : 'Register interest'}</button>
              </form>
            )}
          </div>
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
