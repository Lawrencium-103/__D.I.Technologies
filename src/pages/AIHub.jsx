import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Users, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { tracks } from '../data/aiHubTracks'

const audiences = [
  { label: 'Corporate Teams', desc: 'Upskill staff in practical AI workflows.', icon: Users },
  { label: 'Creatives & Marketers', desc: 'AI for content, branding and campaigns.', icon: GraduationCap },
  { label: 'Students & Graduates', desc: 'Hands-on AI skills beyond university.', icon: BookOpen },
  { label: 'Educators & Schools', desc: 'AI-powered teaching and administration.', icon: Users },
]

export default function AIHub() {
  const [active, setActive] = useState(null)
  const indexOf = (id) => tracks.findIndex(t => t.id === id) + 1

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> / AI Training Hub
            </p>
            <h1 className="max-w-[18ch]">Dara AI Training Hub: <span className="text-[var(--color-burnt)]">AI skills for Nigeria.</span></h1>
            <p className="text-[1.1rem] max-w-[58ch] mt-5">
              Not lectures about AI. Real, hands-on training that gives you AI skills you can use tomorrow, in your
              workplace, your business, your classroom.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#tracks" className="btn btn-primary">Explore 9 tracks <ArrowRight size={18} /></a>
              <Link to="/contact" className="btn btn-ghost">Book a corporate session</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">Who it is for</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">AI skills tailored to Nigerian realities.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audiences.map((a, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 h-full">
                  <div className="w-12 h-12 mb-4 flex items-center justify-center bg-[var(--color-burnt)]">
                    <a.icon size={24} className="text-[var(--color-paper)]" />
                  </div>
                  <h3 className="text-[1.1rem] mb-2 text-[var(--color-ink)]">{a.label}</h3>
                  <p className="text-[0.9rem] text-[var(--color-ink-soft)]">{a.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 TRACKS */}
      <section className="bg-cream-2 py-24" id="tracks">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Training tracks</span>
            <h2 className="mt-3 mb-3">9 tracks. Hands-on.</h2>
            <p className="text-[1.05rem] max-w-[56ch] mb-12">Every track is project-based and ends with a real artifact you can use. Expand a track for its curriculum, outcome and format.</p>
          </ScrollReveal>

          <div className="border-t-2 border-[var(--color-ink)]">
            {tracks.map((track) => {
              const open = active === track.id
              const n = String(indexOf(track.id)).padStart(2, '0')
              return (
                <ScrollReveal key={track.id}>
                  <div className={`border-b-2 border-[var(--color-ink)] ${open ? 'bg-[var(--color-paper-2)]' : ''}`}>
                    <button
                      onClick={() => setActive(open ? null : track.id)}
                      className="w-full flex items-center gap-4 sm:gap-6 py-6 text-left bg-transparent border-0 cursor-pointer group"
                      aria-expanded={open}
                    >
                      <span className="marker text-[1.4rem] shrink-0 w-10">{n}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[1.3rem] sm:text-[1.5rem] text-[var(--color-ink)] group-hover:text-[var(--color-burnt)] transition-colors">{track.title}</h3>
                        <p className="text-[0.95rem] text-[var(--color-ink-soft)] mt-1 max-w-[60ch]">{track.what}</p>
                      </div>
                      <span className="hidden lg:block font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-burnt)] shrink-0 max-w-[12ch] text-right">{track.how}</span>
                      <span className="hidden sm:block font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] shrink-0">{track.audience}</span>
                      <ChevronRight size={22} className={`text-[var(--color-burnt)] shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                    </button>

                    {open && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-9 px-2">
                        <div>
                          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)]">Why this track</span>
                          <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] mb-7">{track.why}</p>

                          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)]">Curriculum</span>
                          <ul className="mt-4 space-y-4">
                            {track.curriculum.map((m, j) => (
                              <li key={j} className="flex items-start gap-3">
                                <CheckCircle2 size={16} className="text-[var(--color-burnt)] mt-0.5 shrink-0" />
                                <div>
                                  <div className="text-[0.95rem] text-[var(--color-ink)] font-medium">{m.module}</div>
                                  <div className="text-[0.88rem] text-[var(--color-ink-soft)]">{m.topics}</div>
                                  {m.tool && m.tool !== 'None' && (
                                    <span className="inline-block mt-1 font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.08em] text-[var(--color-ink-faint)] border border-[var(--color-line)] px-2 py-0.5">
                                      {m.tool}
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t-2 md:border-t-0 md:border-l-2 border-[var(--color-line)] md:pl-8 pt-7 md:pt-0">
                          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)]">Outcome</span>
                          <p className="mt-3 text-[1.05rem] text-[var(--color-ink)] font-medium leading-snug">{track.outcome}</p>

                          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)] block mt-7">Format &amp; duration</span>
                          <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)]">{track.how}</p>

                          <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-burnt)] block mt-7">For</span>
                          <p className="mt-2 text-[0.95rem] text-[var(--color-ink-soft)]">{track.audience}</p>

                          <Link to="/contact" className="btn btn-primary !py-2.5 !px-5 !text-sm mt-7">Book this track <ArrowRight size={16} /></Link>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY DIT AI HUB */}
      <section className="bg-ink py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Why DIT AI Training Hub</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">Built for Nigeria, not imported.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Nigerian context', desc: 'Every case study, dataset and example uses Nigerian businesses, schools and scenarios. Not generic American startups.' },
              { title: 'Zero to working', desc: 'You build real things in every session, AI automations, voice agents, chatbots, dashboards. Not PowerPoint about AI.' },
              { title: 'Built by practitioners', desc: 'Lawrence builds AI systems daily. Esther designs AI-powered curricula. They teach what they use.' },
            ].map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-7 h-full">
                  <span className="marker text-[1.8rem] block mb-3">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-[1.2rem] mb-3 text-[var(--color-ink)]">{b.title}</h3>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO TEACHES */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Who teaches the tracks</span>
            <h2 className="mt-3 mb-3">Run by people who build and use AI.</h2>
            <p className="text-[1.05rem] max-w-[58ch] mb-12">Every Dara AI Training Hub session is led by the founders, not a roster of guest speakers. You learn from the people doing the work.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Lawrence Oladeji',
                role: 'AI Engineer, DIT',
                img: '/Lawrence.png',
                bio: 'Lawrence designs and ships the AI systems behind DIT. He builds dashboards and agentic workflows, engineers prompts, and hardens agents against injection before they ever reach a user.',
                skills: [
                  'AI dashboards and data tools',
                  'Agentic workflows and automation',
                  'Prompt engineering',
                  'Anti-injection and AI safety hardening',
                  'End-to-end AI agent orchestration',
                  'Domain testing, QA and simulation',
                  'Productivity systems powered by AI',
                  'Model evaluation',
                  'Open-source and private AI design',
                  'AI ethics and safety for enterprise use',
                ],
              },
              {
                name: 'Esther Opeyemi Adekanmbi',
                role: 'AI Creator & Coach, DIT',
                img: '/Esther.jpeg',
                bio: 'Esther is a creative, hands-on AI creator and coach with over two years helping individuals and businesses actually put AI to work. She teaches it in plain language that fits a Nigerian context.',
                skills: [
                  'AI content creation',
                  'Prompt engineering',
                  'Graphic design',
                  'Video production',
                  'Automation',
                  'Branding',
                  'Digital marketing',
                ],
              },
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] h-full flex flex-col group hover:shadow-[8px_8px_0_var(--color-ink)] transition-all">
                  <div className="border-b-2 border-[var(--color-ink)] overflow-hidden bg-[var(--color-cream)]">
                    <img src={t.img} alt={t.name} className="w-full h-80 object-contain object-center" loading="lazy" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-[1.4rem] mb-1 text-[var(--color-ink)]">{t.name}</h3>
                    <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] block mb-4">{t.role}</span>
                    <p className="text-[0.95rem] text-[var(--color-ink-soft)] mb-6">{t.bio}</p>
                    <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] block mb-3">Works across</span>
                    <ul className="flex flex-wrap gap-2">
                      {t.skills.map((s, j) => (
                        <li key={j} className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.04em] text-[var(--color-ink-soft)] border-2 border-[var(--color-ink)] px-2.5 py-1">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-burnt py-24">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-[var(--color-paper)]">Ready to build AI skills?</h2>
            <p className="text-[var(--color-paper)]/80 text-[1.1rem] mt-4 mb-9 max-w-[50ch] mx-auto">
              Choose a track or contact us for a customised corporate session. Every session is hands-on,
              project-based and designed for immediate application.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">Book a session <ArrowRight size={18} /></Link>
              <Link to="/edutech" className="btn btn-ghost">Explore SomaBox</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
