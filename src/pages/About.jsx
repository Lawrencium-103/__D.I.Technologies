import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, GraduationCap, Building2, Shield, Eye, Zap, Users, Target, MapPin, Mail } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const pillars = [
  { icon: BookOpen, title: 'EduTech', subtitle: 'SomaBox', desc: ['Offline AI tutor', '60+ NERDC textbooks', '26 slash commands', 'Zero internet required'], link: '/edutech', tone: 'burnt' },
  { icon: GraduationCap, title: 'AI Hub', subtitle: 'Dara AI Hub', desc: ['9 training tracks', 'Corporate & creative', 'Hands-on workshops', 'Nigerian context'], link: '/ai-hub', tone: 'ink' },
  { icon: Building2, title: 'S-SME', subtitle: 'Sustainable SMEs', desc: ['Green energy layouts', 'Offline inventory', 'AI advisory', 'Local digitisation'], link: '/s-sme', tone: 'amber' },
]

const timeline = [
  { num: '01', title: 'Deploy', desc: 'Install SomaBox with zero internet; train two teachers in 15 minutes.', outcome: 'Students gain an AI tutor aligned to NERDC.' },
  { num: '02', title: 'Engage', desc: 'Students use it daily for homework, revision, quizzes.', outcome: 'A culture of self-directed learning takes root.' },
  { num: '03', title: 'Improve', desc: 'Track scores and command usage every term.', outcome: 'Measurably higher exam performance.' },
  { num: '04', title: 'Scale', desc: 'Use results for grants, SUBEB approval, partnerships.', outcome: 'From 5 pilot schools to 50, then 500.' },
  { num: '05', title: 'Sustain', desc: 'Train local technicians; build a maintenance pipeline.', outcome: 'Schools run SomaBox independently.' },
]

const pledges = [
  { icon: Shield, title: 'Hardware reliability', desc: 'Every unit tested 48 hours before deployment; Lawrence signs off on each shipped box.' },
  { icon: GraduationCap, title: 'Teacher training', desc: 'At least two hours in-person training plus a printed quick-reference guide.' },
  { icon: Eye, title: 'Data transparency', desc: 'Usage and performance data shared with schools every term.' },
  { icon: Zap, title: 'Software updates', desc: 'At least one update per term, with new features and curriculum content.' },
  { icon: Users, title: 'Support', desc: 'Any technical issue gets a response within 48 hours.' },
  { icon: Target, title: 'No abandoned deployments', desc: 'If a school cannot continue, the box is retrieved and redeployed.' },
]

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> / About Us
            </p>
            <h1 className="max-w-[18ch]">About <span className="text-[var(--color-burnt)]">Dara Initiative Technology</span></h1>
            <p className="text-[1.1rem] max-w-[60ch] mt-5">
              We exist because 10.5 million Nigerian children deserve the same quality of education that
              internet-connected students take for granted, and we refused to wait for the internet to arrive.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* MISSION & PURPOSE */}
      <section className="bg-ink py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal>
              <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Our mission</span>
              <p className="text-[var(--color-paper)] text-[1.4rem] leading-relaxed mt-4 font-[var(--font-display)] font-medium">
                To deliver AI-powered, curriculum-aligned education to every underserved school in Nigeria through
                affordable, offline-first technology that requires zero internet.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Our purpose</span>
              <p className="text-[var(--color-paper)]/80 text-[1.05rem] leading-relaxed mt-4">
                To prove the digital divide in education is a priority problem, not a technology problem. The
                technology exists. The curriculum exists. The need is undeniable. What was missing was an
                organisation willing to build the bridge between what AI can do and what rural Nigerian schools
                actually need. Dara Initiative Technology is that bridge.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHY DARA */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Why &ldquo;Dara&rdquo;</span>
            <h2 className="mt-3 mb-6 max-w-[20ch]">A word every Yoruba speaker understands instantly.</h2>
            <p className="text-[1.1rem] max-w-[64ch]">
              &ldquo;Dara&rdquo; means <span className="text-[var(--color-burnt)] font-semibold">it is good</span>. It is not an acronym and not a foreign word repackaged.
              When a mother tastes food and says &ldquo;dara,&rdquo; she means this is right, this is what should be.
              That is the standard we hold ourselves to: if it is not genuinely good for the students and teachers
              we serve, we do not do it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">DIT Ecosystem</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">Three pillars. One mission.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Link to={p.link} className="group block bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-7 h-full hover:shadow-[8px_8px_0_var(--color-ink)] transition-all no-underline">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-none flex items-center justify-center bg-[var(--color-burnt)]">
                      <p.icon size={22} className="text-[var(--color-paper)]" />
                    </div>
                    <div>
                      <h3 className="text-[1.15rem] text-[var(--color-ink)]">{p.title}</h3>
                      <span className="text-[0.75rem] text-[var(--color-ink-faint)]">{p.subtitle}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {p.desc.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-[var(--color-ink-soft)] text-[0.92rem]">
                        <span className="text-[var(--color-burnt)] mt-0.5">→</span>{f}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 font-[var(--font-display)] font-semibold text-[var(--color-burnt)] text-sm">Learn more <ArrowRight size={14} /></span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* THEORY OF CHANGE */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[820px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Theory of change</span>
            <h2 className="mt-3 mb-14">From a small box to systemic improvement.</h2>
          </ScrollReveal>
          <div className="space-y-px">
            {timeline.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[80px_1fr] gap-5 py-7 border-t border-[var(--color-line)] first:border-t-0">
                  <span className="marker text-[2rem] leading-none">{s.num}</span>
                  <div>
                    <h3 className="text-[1.3rem] mb-1.5">{s.title}</h3>
                    <p className="text-[0.98rem] mb-1.5">{s.desc}</p>
                    <p className="text-[var(--color-burnt)] text-[0.9rem] font-medium">→ {s.outcome}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">Future impact</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">The long game.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8 h-full">
                <h3 className="text-[1.4rem] mb-3 text-[var(--color-ink)]">Three-year horizon</h3>
                <p className="text-[0.98rem]">SomaBox in 100+ schools across Oyo, Osun and Ogun; verifiable outcome data from thousands of students; a published impact report; academic advisors from Nigerian universities.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-[var(--color-ink)] border-2 border-[var(--color-ink)] p-8 h-full">
                <h3 className="text-[1.4rem] mb-3 text-[var(--color-paper)]">Ten-year vision</h3>
                <p className="text-[0.98rem] text-[var(--color-paper)]/80">No rural Nigerian school without AI tutoring. A SomaBox Academy trains local technicians in every state, so DIT becomes unnecessary by building local capacity that runs without us.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">The founders</span>
            <h2 className="mt-3 mb-12">Meet the people behind DIT.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Lawrence Oladeji',
                role: 'Co-Founder & Lead Developer',
                img: '/Lawrence.png',
                bio: 'Lawrence holds a B.Eng in Mechanical Engineering from FUNAAB and an M.Sc in Mechanical Engineering from the University of Ibadan (2024). His route into education technology runs through the classroom: he taught Mathematics and Physics as a PTA teacher, trained and practised as a Solar Engineer, and now works as a Data Associate and Junior AI Engineer, building the machine-learning systems behind SomaBox.',
              },
              {
                name: 'Esther Opeyemi Adekanmbi',
                role: 'Co-Founder & Teacher',
                img: '/Esther.jpeg',
                bio: 'A certified Nigerian teacher, Esther graduated from Olabisi Onabanjo University with a degree in Child Education and brings over four years of classroom experience. She knows overcrowded, under-resourced classrooms first-hand, and makes sure every SomaBox feature serves a teacher instead of adding to their load. Her classroom authority gives her the final say to veto any feature that complicates a teacher’s day.',
              },
            ].map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] h-full flex flex-col group hover:shadow-[8px_8px_0_var(--color-ink)] transition-all">
                  <div className="border-b-2 border-[var(--color-ink)] overflow-hidden bg-[var(--color-cream)]">
                    <img src={f.img} alt={f.name} className="w-full h-80 object-contain object-center" loading="lazy" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-[1.5rem] mb-1 text-[var(--color-ink)]">{f.name}</h3>
                    <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] block mb-4">{f.role}</span>
                    <p className="text-[0.95rem] text-[var(--color-ink-soft)]">{f.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY PLEDGE */}
      <section className="bg-ink py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">The Delivery Pledge</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">Binding operational standards, not marketing.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pledges.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 h-full">
                  <p.icon size={24} className="text-[var(--color-burnt)] mb-3" strokeWidth={1.5} />
                  <h3 className="text-[1.1rem] mb-2 text-[var(--color-ink)]">{p.title}</h3>
                  <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p className="text-[var(--color-paper)]/75 text-[1rem] max-w-[52ch]">
                Lawrence and Esther put their personal reputations behind every SomaBox. If a school is unhappy,
                it deals with the founders directly, not a call centre.
              </p>
              <Link to="/edutech" className="btn btn-primary shrink-0">See what we build <ArrowRight size={18} /></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHERE WE ARE */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Where we are</span>
            <h2 className="mt-3 mb-12 max-w-[18ch]">Based in Oyo State. Working across Nigeria.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <ScrollReveal delay={0.1}>
              <div className="border-2 border-[var(--color-ink)] h-full min-h-[360px]">
                <iframe
                  title="DIT Dara Initiative Tech location, Oyo State, Nigeria"
                  src="https://www.google.com/maps?q=Ibadan,%20Oyo%20State,%20Nigeria&z=9&output=embed"
                  className="w-full h-full min-h-[360px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-[var(--color-ink)] border-2 border-[var(--color-ink)] p-8 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin size={22} className="text-[var(--color-amber)] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-paper)]/60 block mb-1">Based in</span>
                    <p className="text-[var(--color-paper)] text-[1.05rem]">Oyo State, Nigeria</p>
                    <p className="text-[var(--color-paper)]/60 text-[0.88rem] mt-1">Priority regions: Oyo, Ogun and Lagos.</p>
                  </div>
                </div>
                <p className="text-[var(--color-paper)]/75 text-[0.98rem] leading-relaxed mb-7">
                  Drop us a line from anywhere. Messages go straight to the founders and are answered within 48 hours.
                </p>
                <a
                  href="mailto:oladeji.lawrence@gmail.com?subject=DIT%20Dara%20Initiative%20Tech%20enquiry&body=Hello%20DIT%2C%0A%0AMy%20name%20is%20%5Byour%20name%5D%20and%20I%20am%20writing%20from%20%5Blocation%5D.%0A%0AI%20would%20like%20to%20talk%20about%3A%0A"
                  className="btn btn-primary w-full justify-center mt-auto"
                >
                  <Mail size={18} /> Send us a message
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
