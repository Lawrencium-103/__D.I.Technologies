import { Link } from 'react-router-dom'
import { ArrowRight, WifiOff, BookOpen, Users, ArrowUpRight } from 'lucide-react'
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
                <span className="eyebrow">AI · Open Source · Offline</span>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h1 className="mt-5 mb-6">
                  Education that works<br />
                  <span className="text-[var(--color-burnt)]">where nothing else does.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="text-[1.1rem] max-w-[52ch] leading-relaxed mb-9">
                  Dara Initiative Technology puts a personal AI tutor inside a single box any school can afford.
                  No internet. No expensive tablets. Just curriculum-aligned learning for every child, starting
                  in the classrooms other EdTech left behind.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.24}>
                <div className="flex flex-wrap gap-4">
                  <Link to="/edutech" className="btn btn-primary">Meet SomaBox <ArrowRight size={18} /></Link>
                  <Link to="/about" className="btn btn-ghost">Our Mission</Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Poster panel */}
            <ScrollReveal delay={0.2}>
              <div className="bg-burnt relative p-8 sm:p-10 aspect-[4/5] sm:aspect-auto sm:min-h-[440px] flex flex-col justify-between border-2 border-[var(--color-ink)] shadow-[10px_10px_0_var(--color-ink)]">
                <div className="flex items-center justify-between">
                  <span className="font-[var(--font-display)] font-bold text-[var(--color-paper)] text-2xl tracking-tight">SomaBox</span>
                  <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-paper)]/70">v3.2</span>
                </div>
                <div>
                  <p className="font-[var(--font-display)] font-bold text-[var(--color-amber)] text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.95]">
                    Zero<br />internet.<br />One box.
                  </p>
                  <p className="text-[var(--color-paper)]/85 text-[0.95rem] mt-4 max-w-[34ch]">
                    Forty students. Sixty NERDC textbooks. A tutor that never sleeps.
                  </p>
                </div>
                <div className="flex gap-6 pt-6 border-t border-[var(--color-paper)]/25 font-[var(--font-mono)] text-[0.78rem] text-[var(--color-paper)]/80">
                  <span>60+ BOOKS</span>
                  <span>26 CMDS</span>
                  <span>OFFLINE</span>
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
          <Marquee items={['SomaBox', 'Dara AI Training Hub', 'S-SME', 'Offline-first', 'NERDC curriculum', 'Open source', 'Teacher-built']} />
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Where we build</span>
            <h2 className="mt-3 mb-4">Three sectors. One offline-first engine.</h2>
            <p className="text-[1.05rem] max-w-[70ch] mb-12 text-[var(--color-ink-soft)]">
              Every DIT product is the same bet: the places with the greatest need are the places the internet has not reached. The data below is what that bet is built on.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* EduTech */}
            <ScrollReveal delay={0.05}>
              <div className="h-full bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-8 flex flex-col">
                <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">EduTech · SomaBox · Live</span>
                <h3 className="text-[1.8rem] mt-3 mb-3 text-[var(--color-ink)]">18.3M children out of school.</h3>
                <p className="text-[0.98rem] max-w-[42ch] mb-6 text-[var(--color-ink-soft)]">
                  The highest of any country on earth. ~66% of them are in the North-West and North-East — where connectivity and power are weakest, and where an offline box is the only option that works.
                </p>
                <ul className="space-y-2 text-[0.92rem] mb-6 text-[var(--color-ink)]">
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">18.3M</span> out-of-school children (UNICEF, 2024)</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">6.1%</span> of 2026 federal budget to education — below UNESCO's 15–20%</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">2 yrs</span> learning gain in 6 weeks — World Bank RCT, Edo State</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">+34%</span> math scores at Odo Oba (our own result, one term)</li>
                </ul>
                <Link to="/edutech" className="mt-auto inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-burnt)] no-underline">View SomaBox <ArrowUpRight size={18} /></Link>
              </div>
            </ScrollReveal>

            {/* S-SME */}
            <ScrollReveal delay={0.15}>
              <div className="h-full bg-[var(--color-ink)] border-2 border-[var(--color-ink)] p-8 flex flex-col">
                <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">S-SME · Sustainable SMEs · Live</span>
                <h3 className="text-[1.8rem] mt-3 mb-3 text-[var(--color-paper)]">~50% of GDP. 60M+ workers.</h3>
                <p className="text-[0.98rem] max-w-[42ch] mb-6 text-[var(--color-paper)]/75">
                  Nigeria's MSMEs are the economy — and they run on notebooks. E-invoicing is coming to them over 2026–2027, and 68% don't know it yet. That gap is a product.
                </p>
                <ul className="space-y-2 text-[0.92rem] mb-6 text-[var(--color-paper)]">
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)]">~50%</span> of GDP, ~85% of workforce (SMEDAN / IFC)</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)]">68%</span> of small businesses unaware of the e-invoicing mandate (Lagos survey)</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)]">r=0.76</span> record-keeping ↔ business success — 156 SME owners, Kampala (Kawempe)</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-amber)]">−28%</span> stock waste at Mama Tunde (our own result, 3 months)</li>
                </ul>
                <Link to="/s-sme" className="mt-auto inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-amber)] no-underline">View S-SME <ArrowUpRight size={18} /></Link>
              </div>
            </ScrollReveal>

            {/* Agritech */}
            <ScrollReveal delay={0.25}>
              <div className="h-full bg-[var(--color-paper)] border-2 border-dashed border-[var(--color-ink)] p-8 flex flex-col">
                <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-ink-faint)]">Agritech · Pending · No DIT results yet</span>
                <h3 className="text-[1.8rem] mt-3 mb-3 text-[var(--color-ink)]">The next frontier, honestly.</h3>
                <p className="text-[0.98rem] max-w-[42ch] mb-6 text-[var(--color-ink-soft)]">
                  We have not shipped agriculture products yet, so we will not quote DIT results. The opportunity itself is real, verified, and matches our offline-first model.
                </p>
                <ul className="space-y-2 text-[0.92rem] mb-6 text-[var(--color-ink)]">
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">80%</span> of Nigerian farmers are smallholders producing ~90% of food</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">$10.7B</span> digital-agriculture market; 1,000+ solutions reach only ~10% of smallholder households</li>
                  <li className="flex gap-2 items-baseline"><span className="font-[var(--font-display)] font-bold text-[var(--color-burnt)]">20k</span> farmers already served by Nigeria's govt voice-first DPAE platform (2025–26)</li>
                </ul>
                <Link to="/about" className="mt-auto inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-ink-faint)] no-underline">Where DIT goes next <ArrowUpRight size={18} /></Link>
              </div>
            </ScrollReveal>
          </div>
          <p className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mt-8">
            Sources: UNICEF Nigeria (2024) · DRPC 2026 Budget Analysis · World Bank Policy Research Working Paper 11125 · SMEDAN/IFC · BusinessDay Lagos survey · PxD/ACReSAL DPAE (2026). "Our own result" = DIT-reported, not independently audited.
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
