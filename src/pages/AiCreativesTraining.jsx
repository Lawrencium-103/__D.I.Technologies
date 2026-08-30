import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronDown, Download, FileText, Presentation } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { useSEO, SITE_NAME } from '../lib/seo.js'

const TRACK_OPTIONS = [
  'AI Image Generation',
  'Flyer & Poster Design',
  'Social Media Content Packs',
  'Short AI Videos & Reels',
  'Full Campaigns (Capstone)',
  'Everything (all modules)',
]

const MODULES = [
  {
    id: 'module-images',
    n: 1,
    title: 'AI Image Generation for Organisations',
    why: 'Brands need local, high-quality images that look Nigerian and professional for Instagram, websites and adverts. Stock photos look foreign; photoshoots cost hundreds of thousands of naira.',
    what: 'Lifestyle product shots, event images, brand visuals.',
    steps: [
      'Read the client brief carefully',
      'Write a clear AI prompt (Nigerian context, lighting, style)',
      'Generate images with GPT Image 2 and Gemini',
      'Select and improve the best ones',
      'Resize for Instagram and website',
    ],
    client: 'FreshMart Nigeria',
    clientDesc: 'Lagos-based supermarket chain with stores in Ikeja, Lekki and Abuja',
    brief:
      '“We are launching a new ‘Farm Fresh Sundays’ campaign. Create 8 lifestyle images showing young Nigerian families shopping and cooking with our fresh vegetables and fruits. Images must feel warm, local and premium. Deliver in Instagram square size and website banner size.”',
  },
  {
    id: 'module-flyers',
    n: 2,
    title: 'Flyer & Poster Design with AI',
    why: 'Events, promotions and church programmes still depend heavily on well-designed flyers shared on WhatsApp and Instagram. Someone has to design them, and that someone gets paid.',
    what: 'Event flyers, promotional posters, multi-size versions.',
    steps: [
      'Understand the key information (date, venue, offer, colours)',
      'Generate the main visual with AI',
      'Arrange text clearly (big headline, details, call to action)',
      'Add logo and contact details',
      'Create versions for Instagram, WhatsApp Status and print',
    ],
    client: 'Dominion City Church, Port Harcourt',
    clientDesc: 'Church youth ministry hosting an annual career summit',
    brief:
      '“Design a professional flyer for our ‘Youth Career & Entrepreneurship Summit 2026’. Date: 15th November. Venue: Hotel Presidential. Speakers include two well-known Nigerian entrepreneurs. Free registration. Colours: navy blue and gold. We need Instagram post size, WhatsApp Status size, and a printable A5 version.”',
  },
  {
    id: 'module-social',
    n: 3,
    title: 'Social Media Content Packs & Scheduling',
    why: 'Businesses need consistent daily or weekly posts. One good content pack can cover a full week, which is why clients buy them on retainer.',
    what: 'Carousels, single posts, story sets plus a simple posting schedule.',
    steps: [
      'Understand the campaign goal',
      'Plan 5–7 pieces of content',
      'Create the visuals with AI',
      'Write short, Nigerian-friendly captions',
      'Organise everything into a simple weekly schedule',
    ],
    client: 'PayLater NG',
    clientDesc: 'Lagos fintech offering buy-now-pay-later for market women and small shops',
    brief:
      '“Create a 7-day Instagram content pack to promote our new ‘Market Queen’ loan offer for women traders. Tone should be empowering, simple and trustworthy. Include 3 carousels, 2 single image posts and 2 story sets. Also give us a simple posting schedule for the week.”',
  },
  {
    id: 'module-video',
    n: 4,
    title: 'Short AI Videos & Reels',
    why: 'Short video gets the highest engagement on Instagram, TikTok and WhatsApp Status. Most organisations struggle to produce it regularly, so the person who can is valuable.',
    what: '15–45 second promotional Reels and simple product or event videos.',
    steps: [
      'Write a short script',
      'Generate AI video clips or images (Google Flow, GPT Image 2)',
      'Add voice-over or on-screen text',
      'Edit with music and transitions in CapCut',
      'Export in vertical (9:16) format',
    ],
    client: 'MamaPut Express',
    clientDesc: 'Fast-casual Nigerian food chain with branches in Abuja and Lagos',
    brief:
      '“Create a 30-second Reel promoting our new ‘Weekend Family Combo’. Show happy Nigerian families enjoying jollof, chicken and drinks in our restaurant. Make it colourful, appetising and local. Add upbeat Afrobeats-style music and clear text showing the price.”',
  },
  {
    id: 'module-campaign',
    n: 5,
    title: 'Full Campaign Pack (Capstone)',
    why: 'Real clients rarely ask for one design. They ask for a complete set across platforms. Delivering that set, neatly packaged, is what separates a hobbyist from a hire.',
    what: 'Main flyer + social posts + WhatsApp Status designs + short video + content schedule.',
    steps: [
      'Study the full brief',
      'Create the main visual assets',
      'Adapt them for every platform',
      'Write captions',
      'Package everything neatly for the client',
    ],
    client: 'EduBridge Foundation',
    clientDesc: 'Abuja-based NGO focused on secondary school scholarships for girls in Northern Nigeria',
    brief:
      '“We are launching our 2026 Girls Scholarship Programme. Please deliver: 1 main campaign flyer, 5 Instagram posts (a mix of single images and carousels), 3 WhatsApp Status designs, 1 short 25-second promotional video, and a simple 10-day posting schedule. Tone: hopeful, dignified and professional. Colours: deep green and white.”',
  },
]

const FAQS = [
  {
    q: 'Can complete beginners learn AI creatives?',
    a: 'Yes. The training starts from zero: no design degree, no coding and no prior AI experience required. Every module follows the same pattern: understand the brief, follow the step-by-step workflow, deliver the work. If you can use WhatsApp and a web browser, you can finish this training.',
  },
  {
    q: 'Do I need a powerful laptop?',
    a: 'No. The workflows are built around tools that run in the browser or on modest hardware, including options that work well on Nigerian data plans. If your laptop can run a video call, it can run this training.',
  },
  {
    q: 'Is this useful for NYSC corps members?',
    a: 'That is exactly who it is built for. Corps members finish with a portfolio of real client-style deliverables that businesses, churches, NGOs and startups in Lagos, Abuja and beyond pay for. Many learners use it to earn freelance income during and after service.',
  },
  {
    q: 'What kind of organisations need these skills in Nigeria?',
    a: 'Supermarkets, fintechs, churches, schools, NGOs, restaurants, real estate firms and startups need weekly content: images, flyers, Reels and social posts. Most cannot afford an agency, which is why one skilled AI creator is in demand.',
  },
  {
    q: 'What will I walk away with?',
    a: 'A portfolio. Every module ends with a job simulation based on a realistic Nigerian business brief, and the capstone is a complete multi-platform campaign. You leave with the exact artefacts employers and clients ask to see.',
  },
  {
    q: 'Which AI tools will I use?',
    a: 'Groq for fast text and idea generation, Gemini for multimodal planning, GPT Image 2 for high-quality visuals, Google Flow for generative video, CapCut for editing and Canva AI for layout and resizing. We teach workflows, not just buttons.',
  },
]

const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'AI Creatives Training for Nigerian Organisations',
  description:
    'Practical, portfolio-first training in AI image generation, flyer design, social media content packs and short AI videos for Nigerian brands, churches, NGOs and startups. Built for youth and NYSC corps members in Lagos, Abuja and across Nigeria.',
  provider: { '@type': 'Organization', name: SITE_NAME, url: 'https://dintechnologies.com' },
  courseMode: 'online',
  inLanguage: 'en-NG',
  offers: { '@type': 'Offer', category: 'Paid training', availability: 'https://schema.org/InStock' },
  hasCourseInstance: MODULES.map((m) => ({
    '@type': 'CourseInstance',
    name: m.title,
    courseMode: 'online',
    courseWorkload: 'PT2H',
  })),
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

function AiCreativesTraining() {
  const [presetTrack, setPresetTrack] = useState('')

  useSEO({
    title: 'AI Creatives Training for Nigerian Organisations',
    description:
      'Learn practical AI creatives for Nigerian organisations. Master AI images, flyers, social media posts and short videos using Groq, Gemini and GPT Image 2. Built for youth and corps members in Lagos and Abuja. Apply now.',
    path: '/ai-creatives-training-nigeria',
    type: 'Course',
    jsonLd: [courseJsonLd, faqJsonLd],
  })

  const jumpToApply = (track) => {
    setPresetTrack(track || '')
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
  }

  const TRACK_FOR_MODULE = [
    'AI Image Generation',
    'Flyer & Poster Design',
    'Social Media Content Packs',
    'Short AI Videos & Reels',
    'Full Campaigns (Capstone)',
  ]

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> /{' '}
              <Link to="/ai-hub" className="hover:text-[var(--color-burnt)] no-underline">AI Hub</Link> / AI Creatives Training
            </p>
            <h1 className="max-w-[22ch]">
              Master AI Creatives for <span className="text-[var(--color-burnt)]">Nigerian Organisations.</span>
            </h1>
            <p className="text-[1.1rem] max-w-[62ch] mt-5">
              Create the exact images, flyers, videos and social posts that brands, churches, fintechs and NGOs in
              Lagos, Abuja and across Nigeria pay for — no design degree needed. Real client-style briefs, step by
              step, until the work is in your portfolio.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => jumpToApply()} className="btn btn-primary">
                Start now — join the waitlist <ArrowRight size={18} />
              </button>
              <a href="#modules" className="btn btn-ghost">See the 5 modules</a>
            </div>
            <p className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mt-6">
              Built for NYSC corps members, freelancers and young professionals
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* COURSE MATERIALS — downloads */}
      <section id="downloads" className="bg-ink py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">
              Course materials
            </span>
            <h2 className="mt-3 mb-3 text-[var(--color-paper)] max-w-[26ch]">
              Read the brochure. See the pitch deck.
            </h2>
            <p className="text-[var(--color-paper-2)] max-w-[66ch] mb-10">
              Everything you need before applying — free to download and share with anyone planning your training
              budget or approval.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <FileText size={22} />,
                ext: 'PDF',
                size: '8.5 MB',
                title: 'AI Creatives Training Brochure',
                desc: 'The full programme in one document: the 5 modules, the tools, the job simulations and what you leave with.',
                path: '/downloads/dit-ai-creatives-training-brochure.pdf',
              },
              {
                icon: <Presentation size={22} />,
                ext: 'PPTX',
                size: '4.1 MB',
                title: 'AI Creatives Pitch Deck',
                desc: 'A ready-to-present overview for schools, employers, churches and partners who want to run or fund a cohort.',
                path: '/downloads/dit-ai-creatives-training-pitch-deck.pptx',
              },
            ].map((d) => (
              <ScrollReveal key={d.path} delay={0.05}>
                <div className="bg-[var(--color-paper)] border-0 p-7 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-[var(--color-ink)] text-[var(--color-amber)]">
                      {d.icon}
                    </span>
                    <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)]">
                      {d.ext} &middot; {d.size}
                    </span>
                  </div>
                  <h3 className="text-[1.1rem] text-[var(--color-ink)] mb-2">{d.title}</h3>
                  <p className="text-[0.95rem] text-[var(--color-ink-soft)] flex-1 mb-7">{d.desc}</p>
                  <a href={d.path} download className="btn btn-primary mt-auto">
                    Download {d.ext} <Download size={18} />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY + HOW */}
      <section className="bg-cream-2 py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ScrollReveal delay={0.05}>
            <h2 className="max-w-[20ch]">Why learn AI creatives in Nigeria?</h2>
            <ul className="mt-6 space-y-4">
              {[
                'Organisations across Nigeria need professional content every week, but most cannot afford big agencies.',
                'One skilled AI creator can now deliver what used to take a whole design team.',
                'Demand is real for freelance, remote and in-house roles — especially in Lagos and Abuja.',
                'Perfect for corps members and young people who want a skill that earns, not just a certificate.',
              ].map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-[var(--color-burnt)] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="max-w-[22ch]">How the training works</h2>
            <ul className="mt-6 space-y-4">
              {[
                'Short lessons and tool walkthroughs — learn the workflow first.',
                'Then a real-style client brief (a job simulation): you deliver the actual work step by step.',
                'The deliverables become portfolio pieces employers and clients can see.',
                'Finish with a full multi-platform campaign in the capstone module.',
              ].map((t) => (
                <li key={t} className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-[var(--color-burnt)] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="bg-cream py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">The curriculum</span>
            <h2 className="mt-3 mb-3 max-w-[24ch]">5 modules. 5 real Nigerian client briefs.</h2>
            <p className="text-[1.05rem] max-w-[62ch] mb-12">
              Every module teaches the workflow first, then hands you a real-style brief from a realistic Nigerian
              organisation. You deliver the exact work the client asked for — and keep every deliverable for your
              portfolio.
            </p>
          </ScrollReveal>

          {MODULES.map((m, i) => (
            <ScrollReveal key={m.id} delay={i * 0.04}>
              <article id={m.id} className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-7 sm:p-9 mb-8 scroll-mt-28">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="marker text-[1.6rem] shrink-0">0{m.n}</span>
                  <h3 className="text-[1.35rem] sm:text-[1.6rem] text-[var(--color-ink)]">{m.title}</h3>
                </div>
                <p className="text-[0.95rem] text-[var(--color-ink-soft)] max-w-[70ch]">{m.why}</p>
                <p className="text-[0.95rem] text-[var(--color-ink)] mt-3">
                  <strong>What you will create:</strong> {m.what}
                </p>

                <span className="eyebrow block mt-7">The workflow</span>
                <ol className="mt-3 space-y-2 max-w-[70ch]">
                  {m.steps.map((s, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <span className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-burnt)] shrink-0 mt-1">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[0.95rem] text-[var(--color-ink-soft)]">{s}</span>
                    </li>
                  ))}
                </ol>

                <div className="border-2 border-[var(--color-line)] bg-[var(--color-paper-2)] p-6 mt-8">
                  <span className="eyebrow">Job simulation — real client brief</span>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
                    <h4 className="text-[1.05rem] text-[var(--color-ink)]">{m.client}</h4>
                    <span className="text-[0.85rem] text-[var(--color-ink-faint)]">{m.clientDesc}</span>
                  </div>
                  <p className="mt-3 text-[0.95rem] text-[var(--color-ink-soft)] italic max-w-[75ch]">{m.brief}</p>
                </div>

                <button onClick={() => jumpToApply(TRACK_FOR_MODULE[m.n - 1])} className="btn btn-primary mt-7">
                  Start now — I want this module <ArrowRight size={18} />
                </button>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="bg-cream-2 py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Tools you will work with</span>
            <h2 className="mt-3 mb-3 max-w-[26ch]">Groq, Gemini, GPT Image 2 and more.</h2>
            <p className="text-[1rem] max-w-[66ch] mb-9">
              We teach workflows, not buttons — but you get hands-on with the modern AI stack, including options that
              work well on Nigerian data plans and modest laptops.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Groq', use: 'Fast text and idea generation for scripts, captions and content plans' },
              { name: 'Gemini', use: 'Multimodal planning: briefs, storyboards, campaign structures' },
              { name: 'GPT Image 2', use: 'High-quality photorealistic and illustrated visuals' },
              { name: 'Google Flow', use: 'Generative video scenes for Reels and promos' },
              { name: 'CapCut', use: 'Editing: cuts, captions, music, transitions, exports' },
              { name: 'Canva AI', use: 'Layout, resizing and platform-specific versions' },
            ].map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.05}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 h-full">
                  <h3 className="text-[1.05rem] text-[var(--color-ink)] mb-2">{t.name}</h3>
                  <p className="text-[0.9rem] text-[var(--color-ink-soft)]">{t.use}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="bg-ink py-16">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-[var(--color-paper)] max-w-[30ch] mx-auto">Cohort size is capped so every learner gets feedback on their briefs.</h2>
            <p className="text-[var(--color-paper)]/80 text-[1.05rem] mt-4 mb-8">
              Applications are reviewed in the order they arrive. Reserving your place takes one minute — no payment
              details needed at this stage.
            </p>
            <button onClick={() => jumpToApply()} className="btn btn-primary">
              Start now — reserve my place <ArrowRight size={18} />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="bg-cream py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">What you leave with</span>
            <h2 className="mt-3 mb-3 max-w-[26ch]">You finish with a portfolio, not just a certificate.</h2>
            <p className="text-[1.05rem] max-w-[62ch] mb-10">
              Every deliverable you complete in the simulations goes into a personal portfolio you can show employers,
              clients and your NYSC PPA. By the end you will have produced:
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: '8 branded campaign images', d: 'The FreshMart lifestyle set, delivered in Instagram and website sizes.' },
              { t: 'A 3-version flyer pack', d: 'Dominion City summit flyer for Instagram, WhatsApp Status and A5 print.' },
              { t: 'A 7-day content pack', d: 'PayLater NG carousels, single posts, story sets and a posting schedule.' },
              { t: 'A 30-second promotional Reel', d: 'MamaPut Express food promo — scripted, generated and edited by you.' },
              { t: 'A full NGO campaign kit', d: 'EduBridge launch: flyer, posts, status set, video and 10-day schedule.' },
              { t: 'A repeatable AI workflow', d: 'The exact Groq, Gemini and GPT Image 2 process you can rerun for any client.' },
            ].map((p, i) => (
              <ScrollReveal key={p.t} delay={i * 0.05}>
                <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 h-full">
                  <CheckCircle2 size={20} className="text-[var(--color-burnt)] mb-3" />
                  <h3 className="text-[1.05rem] text-[var(--color-ink)] mb-2">{p.t}</h3>
                  <p className="text-[0.9rem] text-[var(--color-ink-soft)]">{p.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20" id="faq">
        <div className="max-w-[820px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Questions</span>
            <h2 className="mt-3 mb-10 max-w-[30ch]">Everything people ask before they apply</h2>
          </ScrollReveal>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <details className="group border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.05rem] text-[var(--color-ink)]">
                    {f.q}
                    <ChevronDown size={18} className="shrink-0 text-[var(--color-burnt)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-[0.95rem] text-[var(--color-ink-soft)]">{f.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY */}
      <ApplySection presetTrack={presetTrack} />
    </>
  )
}

function ApplySection({ presetTrack }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', corps: '', track: '', why: '' })

  // Preselect the track matching the module whose CTA the learner clicked
  useEffect(() => {
    if (presetTrack) setForm((f) => ({ ...f, track: presetTrack }))
  }, [presetTrack])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const body = new URLSearchParams({ 'form-name': 'aitraining', ...form }).toString()
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
      .then(() => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { form_name: 'aitraining', track: form.track })
        }
        setSent(true)
      })
      .catch(() => setSent(true))
  }

  const inputCls =
    'w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-3 text-[var(--color-ink)] focus:outline-none'
  const labelCls =
    'block font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-paper-2)] mb-2'

  return (
    <section className="bg-ink py-20" id="apply">
      <div className="max-w-[640px] mx-auto px-6">
        {sent ? (
          <div className="text-center py-10">
            <CheckCircle2 size={44} className="text-[var(--color-amber)] mx-auto mb-5" />
            <h2 className="text-[var(--color-paper)] mb-4">Application received.</h2>
            <p className="text-[var(--color-paper-2)] max-w-[48ch] mx-auto">
              We will reach you on WhatsApp within 48 hours with next steps, the tool list and the cohort start date.
            </p>
          </div>
        ) : (
          <>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Apply</span>
            <h2 className="mt-3 mb-3 text-[var(--color-paper)]">Ready to start? Reserve your place.</h2>
            <p className="text-[var(--color-paper-2)] mb-8 max-w-[56ch]">
              Cohort places are limited so every learner gets real feedback on their work. Fill this in — it takes one
              minute, costs nothing at this stage, and we reply on WhatsApp.
            </p>
            <form name="aitraining" method="POST" data-netlify="true" onSubmit={submit} className="space-y-5">
              <input type="hidden" name="form-name" value="aitraining" />
              <p className="hidden">
                <label>
                  Do not fill this out: <input name="bot-field" onChange={update('bot')} />
                </label>
              </p>
              <div>
                <label htmlFor="ap-name" className={labelCls}>Full name</label>
                <input id="ap-name" type="text" name="name" required value={form.name} onChange={update('name')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-email" className={labelCls}>Email</label>
                <input id="ap-email" type="email" name="email" required value={form.email} onChange={update('email')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="ap-wa" className={labelCls}>WhatsApp number</label>
                <input id="ap-wa" type="tel" name="whatsapp" required value={form.whatsapp} onChange={update('whatsapp')} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ap-corps" className={labelCls}>Are you currently a corps member?</label>
                  <select id="ap-corps" name="corps" value={form.corps} onChange={update('corps')} className={inputCls}>
                    <option value="">Select one</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Soon">Soon</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ap-track" className={labelCls}>Which skill interests you most?</label>
                  <select id="ap-track" name="track" value={form.track} onChange={update('track')} className={inputCls}>
                    <option value="">Select a track</option>
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="ap-why" className={labelCls}>Tell us briefly why you want to learn this</label>
                <textarea id="ap-why" name="why" required rows={4} value={form.why} onChange={update('why')} className={inputCls} />
              </div>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Submit application <ArrowRight size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default AiCreativesTraining
