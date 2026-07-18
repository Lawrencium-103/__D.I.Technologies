import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import ReportDocument from '../components/ReportDocument'
import OmsfStats from '../components/OmsfStats'
import { getMockReport } from '../data/reportMock'
import { recordGenerated } from '../lib/omsfStats'

const AUDIENCES = [
  { id: 'general', label: 'General / all readers' },
  { id: 'private', label: 'Private / individual' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'nonprofit', label: 'Non-profit / public sector' },
]

export default function ReportBuilder() {
  const [model, setModel] = useState('')
  const [audience, setAudience] = useState('general')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  async function generate(e) {
    e.preventDefault()
    if (!model.trim()) return
    setLoading(true)
    setError('')
    setReport(null)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model.trim(), audience }),
      })
      if (res.ok) {
        const data = await res.json()
        setReport(data.report)
      } else if (res.status === 501) {
        // Backend not configured / live generation failed: show the offline
        // preview but surface the real reason so the issue is diagnosable.
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Live web data is unavailable — showing offline preview.')
        setReport(getMockReport(model.trim(), audience))
      } else {
        throw new Error('Report service returned an error.')
      }
      recordGenerated()
    } catch {
      setReport(getMockReport(model.trim(), audience))
      recordGenerated()
    } finally {
      setLoading(false)
    }
  }

  function slugify(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function downloadPdf() {
    if (report) {
      const prev = document.title
      document.title = `OMSF-Report-${slugify(report.model)}-${report.grade}-${report.date}.pdf`
      window.print()
      document.title = prev
    } else {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-cream text-[var(--color-ink)]">
      {/* Controls (hidden in print) */}
      <div className="no-print max-w-[1080px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
        <ScrollReveal>
          <Link to="/framework" className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] no-underline">
            ← Back to the framework
          </Link>
          <h1 className="text-[2.4rem] sm:text-[3.2rem] leading-[1.04] font-[var(--font-display)] font-bold mt-5 mb-3 max-w-[18ch]">
            DIT OpenModel Report Builder
          </h1>
          <p className="text-[1.1rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[62ch] mb-8">
            Enter any AI model. We pull its license, weights, specs and benchmarks from the web, grade it on the
            Openness Ladder, and return a branded DIT report you can print to PDF. Free, instant, no sign-up.
          </p>
          <OmsfStats />
        </ScrollReveal>

        <ScrollReveal>
          <form onSubmit={generate} className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 sm:p-7 mb-8">
            <label className="block font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] mb-2">
              Model name
            </label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Llama 4, Qwen3, DeepSeek V3, Gemma 3"
              className="w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] px-4 py-3 text-[1.05rem] text-[var(--color-ink)] outline-none focus:border-[var(--color-burnt)] mb-5"
            />

            <label className="block font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] mb-2">
              Frame the report for
            </label>
            <div className="flex flex-wrap gap-2 mb-6">
              {AUDIENCES.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className={`font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.1em] px-3 py-2 border-2 transition-colors ${
                    audience === a.id
                      ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                      : 'bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading || !model.trim()} className="btn btn-primary disabled:opacity-50">
              {loading ? 'Researching…' : 'Generate report'}
            </button>
          </form>
        </ScrollReveal>

        {error && <p className="text-[var(--color-danger)] mb-6">{error}</p>}

        {report && (
          <div className="no-print flex flex-wrap gap-3 mb-6">
            <button onClick={downloadPdf} className="btn btn-primary">Download PDF</button>
            <button onClick={() => { setReport(null); setModel('') }} className="btn btn-ghost">New report</button>
          </div>
        )}
      </div>

      {/* Report (printed) */}
      {report && (
        <div className="px-4 sm:px-8 pb-20">
          <ReportDocument report={report} />
        </div>
      )}
    </div>
  )
}
