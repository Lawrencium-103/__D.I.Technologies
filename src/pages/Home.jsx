import { Link } from 'react-router-dom'
import { ArrowRight, WifiOff, BookOpen, Users, ArrowUpRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import StatsBar from '../components/StatsBar'
import Marquee from '../components/Marquee'

export default function Home() {
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
          <Marquee items={['SomaBox', 'Dara AI Hub', 'S-SME', 'Offline-first', 'NERDC curriculum', 'Open source', 'Teacher-built']} />
        </div>
      </section>

      {/* PRODUCTS TEASER */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">What we build</span>
            <h2 className="mt-3 mb-12">One initiative. Every sector.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Link to="/edutech" className="group block bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-8 h-full hover:shadow-[10px_10px_0_var(--color-burnt)] transition-all no-underline">
                <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">EduTech · Live</span>
                <h3 className="text-[1.8rem] mt-3 mb-3 text-[var(--color-ink)]">SomaBox</h3>
                <p className="text-[0.98rem] max-w-[40ch] mb-6">The offline AI tutor turning any classroom into a personalised learning environment.</p>
                <span className="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-burnt)]">View product <ArrowUpRight size={18} /></span>
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link to="/about" className="group block bg-[var(--color-ink)] border-2 border-[var(--color-ink)] p-8 h-full hover:shadow-[10px_10px_0_var(--color-amber)] transition-all no-underline">
                <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-amber)]">Health · Agriculture · Next</span>
                <h3 className="text-[1.8rem] mt-3 mb-3 text-[var(--color-paper)]">New sectors on the horizon</h3>
                <p className="text-[0.98rem] max-w-[40ch] mb-6 text-[var(--color-paper)]/75">The same offline-first model, extended to the communities DIT serves next.</p>
                <span className="inline-flex items-center gap-2 font-[var(--font-display)] font-semibold text-[var(--color-amber)]">Our vision <ArrowUpRight size={18} /></span>
              </Link>
            </ScrollReveal>
          </div>
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
