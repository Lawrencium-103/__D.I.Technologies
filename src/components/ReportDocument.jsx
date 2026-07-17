function recommendationClass(rec) {
  if (rec === 'adopt') return 'bg-[var(--color-success)] text-white'
  if (rec === 'avoid') return 'bg-[var(--color-danger)] text-white'
  return 'bg-[var(--color-warning)] text-[var(--color-ink)]'
}

function Sub({ label, items, tone }) {
  return (
    <div className="border-t border-[var(--color-line)] py-2">
      <div className={`font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] mb-1 ${tone || 'text-[var(--color-burnt)]'}`}>{label}</div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-[0.95rem] text-[var(--color-ink)] leading-snug">{it}</li>
        ))}
      </ul>
    </div>
  )
}

export default function ReportDocument({ report }) {
  const r = report
  const audienceLabel = (r.audience || 'general')
    .replace('general', 'General / all readers')
    .replace('private', 'Private / individual')
    .replace('enterprise', 'Enterprise')
    .replace('nonprofit', 'Non-profit / public sector')

  const frames = [
    ['Private', r.frames?.private],
    ['Enterprise', r.frames?.enterprise],
    ['Non-profit', r.frames?.nonprofit],
  ]

  return (
    <div className="report-sheet bg-[var(--color-paper)] border-2 border-[var(--color-ink)] mx-auto" style={{ maxWidth: '820px' }}>
      {/* 1. Header block */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-[var(--color-ink)] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 flex items-center justify-center bg-[var(--color-burnt)] text-[var(--color-paper)] font-[var(--font-display)] font-bold text-xl leading-none">D</span>
          <span className="font-[var(--font-display)] font-bold text-[var(--color-ink)] text-lg leading-none">
            DIT
            <small className="block text-[0.5rem] font-medium tracking-[0.22em] uppercase text-[var(--color-amber)] -mt-0.5">Dara Initiative Tech</small>
          </span>
        </div>
        <div className="text-right font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] leading-relaxed">
          <div>OMSF Model Report</div>
          <div>v1.0</div>
          <div>Report date: {r.reportDate}</div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {r.preview && (
          <div className="mb-5 bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-3 font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-ink)]">
            Preview mode · no live web data · configure API keys for a sourced report
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <h1 className="text-[2rem] sm:text-[2.5rem] leading-[1.02] font-[var(--font-display)] font-bold text-[var(--color-ink)] max-w-[20ch]">
            {r.model}{r.version ? ` (${r.version})` : ''}
          </h1>
          <div className="text-right">
            <div className="inline-block bg-[var(--color-ink)] text-[var(--color-paper)] px-3 py-1.5">
              <span className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">Openness {r.grade}</span>
              <div className="text-[0.95rem] font-[var(--font-display)] font-semibold">{r.gradeLabel}</div>
            </div>
          </div>
        </div>
        <div className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] mb-6">
          {r.publisher} · Released {r.releaseDate} · For: {audienceLabel}
        </div>

        {/* 2. Openness Ladder verdict */}
        <Section n="2" title="Openness Ladder verdict">
          <div className="font-[var(--font-display)] font-bold text-[1.3rem] text-[var(--color-ink)] mb-2">{r.ladderVerdict?.rung}: {r.gradeLabel}</div>
          <p className="text-[1rem] leading-relaxed text-[var(--color-ink-soft)] mb-2">{r.ladderVerdict?.justification}</p>
          {r.ladderVerdict?.source?.url && (
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-ink-faint)]">
              Source (P1): <a href={r.ladderVerdict.source.url} target="_blank" rel="noreferrer" className="text-[var(--color-burnt)] underline">{r.ladderVerdict.source.title}</a> · {r.ladderVerdict.source.date}
            </p>
          )}
        </Section>

        {/* 3. Plain-language license summary */}
        <Section n="3" title="Plain-language license summary">
          <dl className="grid sm:grid-cols-2 gap-x-8">
            <Sub label="You are allowed to" items={r.license?.allowed || []} />
            <Sub label="You are not allowed to" items={r.license?.notAllowed || []} tone="text-[var(--color-danger)]" />
            <div className="sm:col-span-2 border-t border-[var(--color-line)] py-2 mt-1">
              <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-1">Scale trigger</div>
              <p className="text-[0.95rem] text-[var(--color-ink)] leading-snug">{r.license?.scaleTrigger || 'None stated'}</p>
            </div>
            {r.license?.commercialNote && (
              <div className="sm:col-span-2 border-t border-[var(--color-line)] py-2">
                <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-1">Commercial use</div>
                <p className="text-[0.95rem] text-[var(--color-ink)] leading-snug">{r.license.commercialNote}</p>
              </div>
            )}
          </dl>
        </Section>

        {/* 4. Deployment reality check + technical detail */}
        <Section n="4" title="Deployment reality check">
          <dl className="grid sm:grid-cols-2 gap-x-8">
            <Field label="Minimum hardware" value={r.deployment?.minHardware} />
            <Field label="Runs fully offline" value={r.deployment?.offlineCapable} />
            <Field label="Throughput (P2)" value={r.deployment?.throughput} />
            <div className="border-t border-[var(--color-line)] py-2">
              <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-1">Verdict</div>
              <p className="text-[0.98rem] text-[var(--color-ink)] font-[var(--font-display)] font-semibold leading-snug">{r.deployment?.verdict}</p>
            </div>
          </dl>

          <h3 className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mt-6 mb-2">Technical detail</h3>
          <dl className="grid sm:grid-cols-2 gap-x-8">
            <Field label="Context length" value={r.technical?.contextLength} />
            <Field label="Parameters" value={r.technical?.parameters} />
            <Field label="Distribution formats" value={(r.technical?.formats || []).join(', ')} />
            <Field label="Precision" value={r.technical?.precision} />
            <div className="sm:col-span-2 border-t border-[var(--color-line)] py-2">
              <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-1">Quantization impact on VRAM</div>
              <p className="text-[0.95rem] text-[var(--color-ink)] leading-snug">{r.technical?.quantizationImpact}</p>
            </div>
            <Field label="Tokens / sec (P2)" value={r.technical?.tokensPerSec} />
            <Field label="Minimum VRAM" value={r.technical?.minVramGb} />
          </dl>

          {r.series?.length > 0 && (
            <>
              <h3 className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mt-6 mb-2">Model series</h3>
              <table className="w-full border-2 border-[var(--color-ink)] text-[0.82rem]">
                <thead className="bg-[var(--color-ink)] text-[var(--color-paper)]">
                  <tr>
                    {['Variant', 'Params', 'Min VRAM', 'Quant options', 'Notes'].map((h) => (
                      <th key={h} className="text-left font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.1em] p-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.series.map((s, i) => (
                    <tr key={i} className="border-t border-[var(--color-line)]">
                      <td className="p-2 font-[var(--font-display)] font-semibold text-[var(--color-ink)]">{s.name}</td>
                      <td className="p-2 text-[var(--color-ink-soft)]">{s.params}</td>
                      <td className="p-2 text-[var(--color-ink-soft)]">{s.minVramGb}</td>
                      <td className="p-2 text-[var(--color-ink-soft)]">{s.quantOptions}</td>
                      <td className="p-2 text-[var(--color-ink-soft)]">{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Section>

        {/* 5. Three decision frames */}
        <Section n="5" title="Three decision frames">
          <div className="grid sm:grid-cols-3 gap-px bg-[var(--color-ink)] border-2 border-[var(--color-ink)]">
            {frames.map(([label, f]) => (
              <div key={label} className="bg-[var(--color-paper)] p-4">
                <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-1">{label}</div>
                <p className="text-[0.92rem] leading-snug text-[var(--color-ink)] mb-3 min-h-[3rem]">{f?.text}</p>
                <span className={`inline-block font-[var(--font-mono)] text-[0.64rem] uppercase tracking-[0.1em] px-2 py-1 ${recommendationClass(f?.recommendation)}`}>{f?.recommendation}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 6. Where sources disagree */}
        <Section n="6" title="Where sources disagree">
          <p className="text-[1rem] leading-relaxed text-[var(--color-ink-soft)]">{r.disagreements}</p>
        </Section>

        {/* 7. Comparison snapshot (batch only) */}
        {r.comparison && (
          <Section n="7" title="Comparison snapshot">
            <table className="w-full border-2 border-[var(--color-ink)] text-[0.85rem]">
              <thead className="bg-[var(--color-ink)] text-[var(--color-paper)]">
                <tr>
                  {r.comparison.headers.map((h, i) => (
                    <th key={i} className="text-left font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.1em] p-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-t border-[var(--color-line)]">
                    {row.map((c, j) => (
                      <td key={j} className="p-2 text-[var(--color-ink)]">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* 8. Attribution footer */}
        <div className="border-t-2 border-[var(--color-ink)] pt-4 mt-2">
          <p className="text-[0.82rem] leading-relaxed text-[var(--color-ink)] mb-3">
            Synthesized using the DIT OpenModel Synthesis Framework (OMSF), which builds on the Model Openness Framework (LF AI &amp; Data Foundation, arXiv:2403.13784) and the OSI Open Source AI Definition.
          </p>
          {r.sources?.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {r.sources.map((s, i) => (
                <li key={i} className="text-[0.8rem] text-[var(--color-ink-soft)] break-words">
                  <span className="font-[var(--font-mono)] text-[var(--color-ink-faint)]">[{s.tier || 'P2'}]</span> {s.title} ({s.url}) · {s.date}
                </li>
              ))}
            </ul>
          )}
          <a
            href="mailto:oladeji.lawrence@gmail.com?subject=OMSF%20model%20review"
            className="inline-block font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.12em] text-[var(--color-paper)] bg-[var(--color-burnt)] border-2 border-[var(--color-ink)] px-4 py-2 no-underline"
          >
            Book a review
          </a>
        </div>
      </div>
    </div>
  )
}

function Section({ n, title, children }) {
  return (
    <section className="mb-6">
      <h2 className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)] mb-2">
        {n}. {title}
      </h2>
      {children}
    </section>
  )
}

function Field({ label, value }) {
  return (
    <div className="border-t border-[var(--color-line)] py-2">
      <dt className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">{label}</dt>
      <dd className="text-[0.95rem] text-[var(--color-ink)] leading-snug mt-0.5">{value}</dd>
    </div>
  )
}
