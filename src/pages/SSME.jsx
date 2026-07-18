import { Link } from 'react-router-dom'
import { ArrowRight, Sun, WifiOff, ClipboardCheck, Target, Megaphone, Users, Store, Banknote, Landmark } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import SmePdfCard from '../components/SmePdfCard'
import { useSmePdfs } from '../lib/smePdf'
import { smePdfDownloads, smeMatrix } from '../data/smeToolkit'

const pressures = [
  { title: 'Power you cannot trust', desc: 'Diesel and grid costs eat margin, and outages stop trade.' },
  { title: 'Stock you cannot see', desc: 'Without a live view of inventory, you over-order what sits and run out of what sells. Both cost money.' },
  { title: 'Compliance you cannot prove', desc: 'Tax, records and reporting demands arrive whether or not you have the systems to meet them.' },
  { title: 'Decisions made in the dark', desc: 'Pricing, ordering and staffing guesses repeat the same mistakes because nothing feeds back.' },
  { title: 'Customers you lose quietly', desc: 'A buyer who leaves is cheaper to keep than one to win. Most businesses never notice the leak.' },
  { title: 'Growth you cannot afford', desc: 'Expanding before the base is stable turns a working shop into a stretched one.' },
]

const services = [
  { icon: Sun, title: 'Green energy and power', desc: 'Solar layouts and low-power hardware sized for off-grid and unreliable-grid areas. Cut the electricity bill and keep trading through an outage.' },
  { icon: WifiOff, title: 'Offline digital inventory', desc: 'A stock system that runs without the internet. Know what you have, what is moving and what to reorder before it runs out.' },
  { icon: ClipboardCheck, title: 'Compliance and reporting', desc: 'Records, sales logs and filings produced automatically and kept audit-ready, so regulation is a routine task, not a crisis.' },
  { icon: Target, title: 'AI decision support', desc: 'Demand forecasting and pricing guidance from your own sales data, so choices are backed by evidence.' },
  { icon: Megaphone, title: 'Sales and marketing with AI', desc: 'Training that shows the demand you are missing. Most businesses miss the channels and messages already in front of them.' },
  { icon: Users, title: 'Customer relationships that hold', desc: 'Simple systems to keep buyers and clients close, follow up on time and turn a first purchase into a long one.' },
]

const expansion = [
  { n: '01', title: 'Stability before scale', desc: 'Expand only when the current operation is profitable and documented. Scale a working system, not a hope.' },
  { n: '02', title: 'Cash before capacity', desc: 'New locations and stock need cash headroom first. If the expansion needs the new revenue to survive, it is too early.' },
  { n: '03', title: 'Replicate, do not reinvent', desc: 'Take the inventory, reporting and customer system that already works and copy it. New experiments stay small and separate.' },
  { n: '04', title: 'Keep the sustainability test', desc: 'Every new step must still pass the energy, inventory and compliance checks. Growth that breaks those is not growth.' },
]

const useCases = [
  { title: 'Mama Tunde Provision Store', location: 'Ibadan, Oyo State', problem: 'Small provision store losing track of stock, over-ordering some items, running out of others.', solution: 'Offline inventory system on a Raspberry Pi. AI advisory predicts demand from local patterns.', outcome: 'Stock waste reduced by 28%. Revenue increased 15% in three months. No internet required.' },
  { title: 'Hephzibah College', location: 'Oyo State', problem: 'Private school needed to digitise records but could not afford cloud subscriptions or reliable internet.', solution: 'Local server with SomaBox-style architecture. Records, grading and attendance all offline.', outcome: 'Admin time cut by 60%. Parents receive printed reports. Saved ₦180,000/year on software.' },
]

export default function SSME() {
  const { counts, download, like } = useSmePdfs()
  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> / S-SME
            </p>
            <h1 className="max-w-[18ch]">S-SME: build a <span className="text-[var(--color-burnt)]">sustainable business</span>, not a lucky one.</h1>
            <p className="text-[1.1rem] max-w-[60ch] mt-5">
              We help small and medium business owners run on less power, see their stock, meet compliance, and
              use AI to make decisions they can defend. Six services, one goal: a business that holds up.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contact" className="btn btn-primary">Get a sustainability audit <ArrowRight size={18} /></Link>
              <Link to="/edutech" className="btn btn-ghost">See SomaBox</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PRESSURES */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">What affects your business</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)] max-w-[22ch]">Six pressures decide whether an SME survives.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pressures.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 h-full">
                  <h3 className="text-[1.15rem] mb-2 text-[var(--color-ink)]">{p.title}</h3>
                  <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">The services, coupled</span>
            <h2 className="mt-3 mb-3">One programme. Six working parts.</h2>
            <p className="text-[1.05rem] max-w-[58ch] mb-12">Each service stands alone. Together they are a business that can be audited, defended and grown.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-7 h-full card">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-burnt)] mb-5">
                    <s.icon size={24} className="text-[var(--color-paper)]" />
                  </div>
                  <h3 className="text-[1.25rem] mb-2 text-[var(--color-ink)]">{s.title}</h3>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPANSION */}
      <section className="bg-ink py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Expansion rules and guidelines</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)] max-w-[20ch]">Grow only when the base can carry it.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expansion.map((e, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8 h-full">
                  <span className="marker text-[2.4rem] block mb-3">{e.n}</span>
                  <h3 className="text-[1.3rem] mb-2 text-[var(--color-ink)]">{e.title}</h3>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{e.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 mb-12 max-w-[20ch]">Three steps to a sustainable business.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Audit', desc: 'We assess your energy setup, stock, compliance load and customer flow to find where money leaves.' },
              { num: '02', title: 'Deploy', desc: 'Solar layout, offline inventory, AI advisory and customer systems, installed in one visit.' },
              { num: '03', title: 'Improve', desc: 'Monthly AI insight, quarterly review and clear expansion guidance as the business strengthens.' },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-8 h-full">
                  <span className="marker text-[2.6rem] block mb-4">{s.num}</span>
                  <h3 className="text-[1.4rem] mb-3 text-[var(--color-ink)]">{s.title}</h3>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">Real examples</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">Where this works.</h2>
          </ScrollReveal>
          <div className="space-y-6">
            {useCases.map((uc, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-[1.3rem] text-[var(--color-ink)]">{uc.title}</h3>
                    <span className="px-2.5 py-1 border border-[var(--color-ink)] text-[0.74rem] font-[var(--font-mono)] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">{uc.location}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] block mb-2">Problem</span>
                      <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{uc.problem}</p>
                    </div>
                    <div>
                      <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] block mb-2">Solution</span>
                      <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{uc.solution}</p>
                    </div>
                    <div>
                      <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] block mb-2">Outcome</span>
                      <p className="text-[0.95rem] font-medium text-[var(--color-ink)]">{uc.outcome}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Take it offline</span>
            <h2 className="mt-3 mb-3">Download the fillable DIT PDFs</h2>
            <p className="text-[1.05rem] max-w-[62ch] mb-12">
              Seven printable, fillable tools that calculate your score as you fill them in. Each card shows what
              the tool does and what it helps you achieve.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smePdfDownloads.map((d) => (
              <SmePdfCard
                key={d.file}
                file={d.file}
                label={d.label}
                summary={d.summary}
                achieve={d.achieve}
                counts={counts[d.file] || {}}
                onDownload={download}
                onLike={like}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STANDARDS ALIGNMENT MATRIX */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Standards Alignment Matrix</span>
            <h2 className="mt-3 mb-4 max-w-[20ch]">The proof Nigerian SMEs hand to banks, regulators and donors.</h2>
            <p className="text-[1.05rem] max-w-[62ch] mb-12">
              117 items from the DIT SME Toolkit, each scored against the frameworks that open doors - IFC,
              EU and Nigerian. Show compliance instead of promising it.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-[var(--color-ink)]">
              {[
                { n: '117', l: 'items, individually scored' },
                { n: '4', l: 'global standards frameworks' },
                { n: '14', l: 'Nigerian regulators mapped' },
                { n: 'PS1–8', l: 'IFC Performance Standards covered' },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`p-6 ${i !== 0 ? 'border-l-2 border-[var(--color-ink)]' : ''} ${
                    i >= 2 ? 'border-t-2 lg:border-t-0 border-[var(--color-ink)]' : ''
                  }`}
                >
                  <div className="marker text-[2.2rem] leading-none mb-2">{s.n}</div>
                  <div className="text-[0.85rem] text-[var(--color-ink-soft)]">{s.l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {[
              { icon: Store, tag: 'For SME owners', t: 'Walk into the bank pre-cleared.', d: 'BoI, DBN and CBN screen CAC status, tax clearance and governance before they lend. The matrix shows you pass - and what to fix first.' },
              { icon: Banknote, tag: 'For funders & partners', t: 'One sheet for EU and impact diligence.', d: 'Map your toolkit to ESRS, VSME and the EU Deforestation Regulation in a single view. No consultant, no rebuild.' },
              { icon: Landmark, tag: 'For government & regulators', t: 'Less back-and-forth, more compliance.', d: 'A ready cross-reference to national requirements (CAC, FIRS, NESREA, SMEDAN/FRCN) that speeds registration, licensing and reporting.' },
            ].map((a, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-7 h-full">
                  <div className="w-11 h-11 flex items-center justify-center bg-[var(--color-burnt)] mb-4">
                    <a.icon size={22} className="text-[var(--color-paper)]" />
                  </div>
                  <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)]">{a.tag}</span>
                  <h3 className="text-[1.2rem] mt-2 mb-2 text-[var(--color-ink)]">{a.t}</h3>
                  <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{a.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.1}>
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8 mt-6 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <h3 className="text-[1.35rem] mb-2">{smeMatrix.label}</h3>
                <p className="text-[0.95rem] text-[var(--color-paper)]/85 max-w-[60ch]">
                  117 items, individually scored as Full, Partial, Gap or N/A, with a built-in How-to-use
                  sheet and the full Standards Legend.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={smeMatrix.file}
                  download
                  onClick={() => download(smeMatrix.file)}
                  className="btn btn-primary w-full md:w-auto justify-center no-underline"
                >
                  Download the matrix (Excel) <ArrowRight size={18} />
                </a>
                <p className="text-[0.8rem] text-[var(--color-paper)]/70 mt-3">
                  Opens in Excel, Google Sheets or LibreOffice - no macros required.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="max-w-[18ch] mx-auto">Ready to make your business sustainable?</h2>
            <p className="text-[1.1rem] mt-4 mb-9 max-w-[52ch] mx-auto text-[var(--color-ink-soft)]">
              We audit your setup, design the fix and deploy it, with no internet or technical expertise required
              on your side.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">Book a free audit <ArrowRight size={18} /></Link>
              <Link to="/s-sme/toolkit" className="btn border-2 border-[var(--color-ink)] text-[var(--color-ink)] no-underline hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">Use the SME Toolkit</Link>
              <Link to="/s-sme/evidence" className="btn border-2 border-[var(--color-ink)] text-[var(--color-ink)] no-underline hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">See the evidence behind this</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
