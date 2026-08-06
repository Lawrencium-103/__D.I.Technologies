import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, WifiOff, BookOpen, Users, Cpu, Terminal, Sun, ClipboardCheck, Target, Store, Sprout } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import StatsBar from '../components/StatsBar'
import Marquee from '../components/Marquee'
import { useSEO, organizationJsonLd } from '../lib/seo'

export default function Home() {
  useSEO({ title: 'Open models, offline AI & EdTech for Africa', jsonLd: organizationJsonLd() })
  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
            <div>
              <ScrollReveal>
                <span className="eyebrow">Offline AI · Open models · Built in Nigeria</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h1 className="mt-5 mb-6">
                  AI that works where<br />
                  <span className="text-[var(--color-burnt)]">the internet doesn't.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="text-[1.1rem] max-w-[52ch] leading-relaxed mb-9">
                  Dara Initiative Technology builds open, local AI that runs entirely on offline hardware.
                  Open-weight models, on-device inference, edge hardware powered by solar, grid or hybrid.
                  No internet. No cloud. No exception — starting with the classrooms other EdTech left behind.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.24}>
                <div className="flex flex-wrap gap-4">
                  <Link to="/edutech" className="btn btn-primary">Meet SomaBox <ArrowRight size={18} /></Link>
                  <Link to="/about" className="btn btn-ghost">Our Mission</Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Engine panel */}
            <ScrollReveal delay={0.2}>
              <div className="bg-burnt relative p-8 sm:p-10 aspect-[4/5] sm:aspect-auto sm:min-h-[440px] flex flex-col justify-between border-2 border-[var(--color-ink)] shadow-[10px_10px_0_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <span className="font-[var(--font-display)] font-bold text-[var(--color-paper)] text-2xl tracking-tight">DIT Engine</span>
                  <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-paper)]/70">v3.2</span>
                </div>
                <div>
                  <p className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.95]">
                    Zero internet.<br />Local AI.
                  </p>
                  <p className="text-[var(--color-paper)]/85 text-[0.95rem] mt-4 max-w-[34ch]">
                    Open-weight models running on a single box. No cloud. No data plan. No exception.
                  </p>
                </div>
                <div className="font-[var(--font-mono)] text-[0.78rem] text-[var(--color-paper)]/80 space-y-1.5 pt-6 border-t border-[var(--color-paper)]/25">
                  <p>OPEN-WEIGHT MODELS · ON DEVICE</p>
                  <p>LOCAL INFERENCE · NO INTERNET</p>
                  <p>EDGE HARDWARE · SOLAR / GRID / HYBRID</p>
                </div>
                <div className="flex gap-6 pt-6 border-t border-[var(--color-paper)]/25 font-[var(--font-mono)] text-[0.78rem] text-[var(--color-paper)]/80">
                  <span>OFFLINE-FIRST</span>
                  <span>3 SECTORS</span>
                  <span>BUILT IN NIGERIA</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsBar />

      {/* WHY DARA */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <ScrollReveal>
              <h2 className="mb-5">
                The technology was aimed at the<br /><span className="text-[var(--color-burnt)]">wrong classrooms.</span>
              </h2>
              <p className="text-[1.05rem] max-w-[46ch]">
                A child in rural Oyo State can sit in a classroom for six years and never receive personalised
                attention. The fix already exists. It just wasn't built for here.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {[
                { icon: WifiOff, title: 'Offline-first', desc: 'Creates its own Wi-Fi the moment it is plugged in. Grid, solar, or hybrid.' },
                { icon: BookOpen, title: 'Nigerian curriculum', desc: '60+ NERDC textbooks. Answers come from the books students actually study.' },
                { icon: Users, title: 'Built by a teacher & engineer', desc: 'Co-founded by a Nigerian teacher and a Nigerian engineer. For here, by here.' },
              ].map((c, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="card p-5 flex gap-4 items-start">
                    <c.icon size={26} className="text-[var(--color-burnt)] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-[1.05rem] mb-1">{c.title}</h3>
                      <p className="text-[0.92rem]">{c.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-ink py-0">
        <div className="border-y-2 border-[var(--color-paper)]/15 py-1">
          <Marquee items={['Offline-first', 'Open models', 'Local AI', 'SomaBox', 'S-SME', 'NERDC curriculum', 'Edge hardware', 'Built in Nigeria']} />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">What we build</span>
            <h2 className="mt-3 mb-4">One engine. Three bets.</h2>
            <p className="text-[1.05rem] max-w-[70ch] mb-16 text-[var(--color-ink-soft)]">
              Every DIT product is the same bet: the places with the greatest need are the places the internet
              has not reached. The data below is what that bet is built on.
            </p>
          </ScrollReveal>

          {/* SOMABOX */}
          <ScrollReveal>
            <div className="bg-ink border-2 border-[var(--color-ink)] p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <div>
                  <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">01 · EduTech · SomaBox <span className="text-[var(--color-success)]">· Live</span></span>
                  <h3 className="text-[2rem] sm:text-[2.4rem] mt-3 mb-4 text-[var(--color-paper)]">A tutor in a box.</h3>
                  <p className="text-[1rem] max-w-[48ch] mb-8 text-[var(--color-paper)]/75">
                    Sixty NERDC textbooks, 26 slash commands and a personal AI tutor that never sleeps — running
                    entirely offline on a single box. One box, a keyboard and a screen: an entire classroom learns.
                  </p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-9">
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[1.7rem]">18.3M</span><span className="text-[0.88rem] text-[var(--color-paper)]/75">out-of-school children (UNICEF, 2024)</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[1.7rem]">60+</span><span className="text-[0.88rem] text-[var(--color-paper)]/75">NERDC textbooks, all offline</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[1.7rem]">2 yrs</span><span className="text-[0.88rem] text-[var(--color-paper)]/75">learning gain in 6 weeks — World Bank RCT, Edo State</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[1.7rem]">+34%</span><span className="text-[0.88rem] text-[var(--color-paper)]/75">math scores at Odo Oba (our own result)</span></div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/edutech" className="btn btn-primary">View SomaBox <ArrowUpRight size={18} /></Link>
                    <Link to="/contact" className="btn btn-ghost">Request a pilot school</Link>
                  </div>
                </div>

                {/* Mini terminal */}
                <div className="bg-[#120F0B] border-2 border-[var(--color-paper)]/15">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-paper)]/15">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-danger)]" />
                      <div className="w-3 h-3 rounded-full bg-[var(--color-amber)]" />
                      <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                    </div>
                    <span className="text-[0.75rem] text-[var(--color-paper)]/60 font-mono ml-2">soma@box · AI Tutor Terminal</span>
                    <div className="ml-auto flex items-center gap-2">
                      <WifiOff size={12} className="text-[var(--color-success)]" />
                      <span className="text-[0.7rem] text-[var(--color-success)] font-mono">OFFLINE</span>
                    </div>
                  </div>
                  <div className="p-5 font-mono text-[0.85rem] space-y-1.5 leading-relaxed">
                    <p className="text-[var(--color-paper)]/55">SOMABOX AI TUTOR v3.2 — OFFLINE TERMINAL</p>
                    <p className="text-[var(--color-paper)]/55">Status: ONLINE | Internet: NOT REQUIRED</p>
                    <p className="text-[var(--color-paper)]/55">Textbooks: 60+ | Commands: 26 | Students: Unlimited</p>
                    <p className="pt-3 text-[var(--color-amber)]">soma@box ~$ <span className="text-[var(--color-paper)]/85">/explain photosynthesis science ss2</span></p>
                    <p className="text-[var(--color-success)]">AI TUTOR: Photosynthesis</p>
                    <p className="text-[var(--color-paper)]/75">Photosynthesis is how plants make food using sunlight.</p>
                    <p className="text-[var(--color-paper)]/75">6CO2 + 6H2O + light &rarr; C6H12O6 + 6O2</p>
                    <p className="pt-3 text-[var(--color-amber)]">soma@box quiz$ <span className="text-[var(--color-paper)]/85">QUESTION 1 of 5 (NERDC - JSS2 Maths)</span></p>
                    <p className="text-[var(--color-paper)] font-bold">What is the value of 3x + 7 when x = 4?</p>
                    <p className="text-[var(--color-paper)]/70">A) 19&nbsp;&nbsp; B) 21&nbsp;&nbsp; C) 23&nbsp;&nbsp; D) 25</p>
                    <p className="pt-3 text-[var(--color-amber)]">soma@box ~$ <span className="blinking-cursor text-[var(--color-paper)]/80">_</span></p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* S-SME */}
          <ScrollReveal delay={0.05}>
            <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-8 sm:p-12 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <div className="order-2 lg:order-1">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-9">
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.7rem]">~50%</span><span className="text-[0.88rem] text-[var(--color-ink-soft)]">of GDP, ~85% of workforce (SMEDAN / IFC)</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.7rem]">68%</span><span className="text-[0.88rem] text-[var(--color-ink-soft)]">of small businesses unaware of the e-invoicing mandate (Lagos survey)</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.7rem]">r=0.76</span><span className="text-[0.88rem] text-[var(--color-ink-soft)]">record-keeping ↔ business success — 156 SME owners, Kampala</span></div>
                    <div className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.7rem]">−28%</span><span className="text-[0.88rem] text-[var(--color-ink-soft)]">stock waste at Mama Tunde (our own result, 3 months)</span></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-9">
                    {['Solar layouts', 'Offline inventory', 'Compliance & reporting', 'AI decision support'].map((t, i) => (
                      <span key={i} className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.08em] text-[var(--color-ink-soft)] border-2 border-[var(--color-ink)] px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/s-sme" className="btn btn-primary">View S-SME <ArrowUpRight size={18} /></Link>
                    <Link to="/contact" className="btn btn-ghost">Get a sustainability audit</Link>
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">02 · S-SME <span className="text-[var(--color-success)]">· Live</span></span>
                  <h3 className="text-[2rem] sm:text-[2.4rem] mt-3 mb-4 text-[var(--color-ink)]">A business that holds up.</h3>
                  <p className="text-[1rem] max-w-[48ch] mb-8 text-[var(--color-ink-soft)]">
                    Nigeria's MSMEs are the economy — and they run on notebooks. We help them run on less power,
                    see their stock, meet compliance and make decisions they can defend. Six services, one goal.
                  </p>
                  <div className="space-y-3">
                    {[
                      { icon: Sun, title: 'Green energy & power', desc: 'Solar layouts for off-grid and unreliable-grid areas.' },
                      { icon: ClipboardCheck, title: 'Compliance & reporting', desc: 'Records, sales logs and filings, audit-ready by default.' },
                      { icon: Target, title: 'AI decision support', desc: 'Demand forecasting from your own sales data.' },
                      { icon: Store, title: 'Offline digital inventory', desc: 'Know what you have before it runs out — no internet needed.' },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4 items-start bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-4">
                        <s.icon size={22} className="text-[var(--color-burnt)] shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                          <h4 className="text-[1rem] text-[var(--color-ink)]">{s.title}</h4>
                          <p className="text-[0.88rem] text-[var(--color-ink-soft)]">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* AGRITECH */}
          <ScrollReveal delay={0.05}>
            <div className="bg-[var(--color-paper)] border-2 border-dashed border-[var(--color-ink)] p-8 sm:p-12 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <div>
                  <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">03 · Agritech <span className="text-[var(--color-warning)]">· Pending</span></span>
                  <h3 className="text-[2rem] sm:text-[2.4rem] mt-3 mb-4 text-[var(--color-ink)]">The next frontier, honestly.</h3>
                  <p className="text-[1rem] max-w-[48ch] mb-8 text-[var(--color-ink-soft)]">
                    We have not shipped agriculture products yet, so we will not quote DIT results. The market is
                    real, verified, and being validated by government right now — over basic phones, where
                    connectivity is weakest.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-9">
                    <div className="border-2 border-[var(--color-ink)] p-4">
                      <span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.6rem] block">80%</span>
                      <span className="text-[0.85rem] text-[var(--color-ink-soft)]">of Nigerian farmers are smallholders producing ~90% of food</span>
                    </div>
                    <div className="border-2 border-[var(--color-ink)] p-4">
                      <span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.6rem] block">$10.7B</span>
                      <span className="text-[0.85rem] text-[var(--color-ink-soft)]">digital-ag market; 1,000+ solutions reach only ~10% of households</span>
                    </div>
                    <div className="border-2 border-[var(--color-ink)] p-4">
                      <span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)] text-[1.6rem] block">20k</span>
                      <span className="text-[0.85rem] text-[var(--color-ink-soft)]">farmers served by govt voice-first DPAE — scaling to 100k+ in 2026</span>
                    </div>
                  </div>
                  <Link to="/about" className="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-ink-faint)] no-underline">Where DIT goes next <ArrowUpRight size={18} /></Link>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-cream-2 border-2 border-[var(--color-ink)] p-8">
                    <Sprout size={34} className="text-[var(--color-burnt)] mb-5" strokeWidth={1.5} />
                    <p className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-3">The pattern we know</p>
                    <p className="text-[1.05rem] text-[var(--color-ink)] leading-relaxed mb-4">
                      Farms face the same constraint as classrooms: the places that grow the food are the places
                      the internet has not reached.
                    </p>
                    <p className="text-[0.95rem] text-[var(--color-ink-soft)]">
                      Our offline-first engine is built for exactly this. When we ship Agritech, it will not
                      need to be rebuilt for rural connectivity — it already runs there.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <p className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mt-8">
            Sources: UNICEF Nigeria (2024) · DRPC 2026 Budget Analysis · World Bank Policy Research Working Paper 11125 · SMEDAN/IFC · BusinessDay Lagos survey · 60 Decibels / DALI (2025) · US Commercial Service · PxD/ACReSAL DPAE (2026). "Our own result" = DIT-reported, not independently audited.
          </p>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">The founders</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">Built by people who know the classroom.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Lawrence Oladeji', role: 'Co-Founder & Lead Developer', bio: 'A mechanical engineer who taught Maths and Physics, trained as a Solar Engineer, and now works as a Data Associate and Junior AI Engineer. That mix is what lets him build SomaBox to run offline on minimal hardware.' },
              { name: 'Esther Adekambi', role: 'Co-Founder & Head of Education', bio: 'A certified Nigerian teacher with four years of classroom experience. She ensures every SomaBox feature serves teachers, not their workload, and holds the final veto on anything that complicates their day.' },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper)] p-8 h-full border-2 border-[var(--color-ink)]">
                  <h3 className="text-[1.5rem] mb-1 text-[var(--color-ink)]">{f.name}</h3>
                  <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] block mb-4">{f.role}</span>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{f.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-ink py-24">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-[var(--color-paper)]">Quality education should not depend on a <span className="text-[var(--color-amber)]">ZIP code.</span></h2>
            <p className="text-[var(--color-paper)]/75 text-[1.1rem] mt-5 mb-9">
              Partner with us, bring SomaBox to a school, or simply learn more about the work.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/about" className="btn btn-primary">Read our Delivery Pledge</Link>
              <Link to="/contact" className="btn btn-ghost">Get in Touch</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
