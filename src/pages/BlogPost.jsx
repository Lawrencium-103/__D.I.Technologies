import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowUpRight, Mail, Volume2, Pause } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import BlogContent from '../components/BlogContent'
import LikeButton from '../components/LikeButton'
import { blogPosts } from '../data/blogPosts'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getPostText(blocks = []) {
  return blocks
    .map(b => {
      if (b.heading) return b.heading
      if (b.lead) return b.lead
      if (b.text) return b.text
      if (b.quote) return b.quote + (b.attribution ? ' — ' + b.attribution : '')
      if (b.items) return b.items.join('. ')
      if (b.title) return b.title + '. ' + (b.text || '')
      return ''
    })
    .filter(Boolean)
    .join('. ')
}

function AuthorBox({ author }) {
  return (
    <div className="flex items-center gap-3">
      {author.avatar ? (
        <img
          src={author.avatar}
          alt={author.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-[var(--color-ink)]"
        />
      ) : (
        <span className="w-11 h-11 flex items-center justify-center bg-[var(--color-burnt)] text-[var(--color-paper)] font-[var(--font-display)] font-bold">
          {author.initials}
        </span>
      )}
      <div>
        <p className="font-[var(--font-display)] font-semibold text-[var(--color-ink)] leading-tight">{author.name}</p>
        <p className="text-[0.8rem] text-[var(--color-ink-faint)]">{author.role}</p>
      </div>
    </div>
  )
}

function TemplateChip({ label }) {
  return (
    <span className="inline-block border border-[var(--color-ink)] px-2 py-0.5 text-[0.66rem] font-[var(--font-mono)] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
      {label}
    </span>
  )
}

const FEMALE_VOICE_HINTS = [
  'samantha', 'victoria', 'zira', 'aria', 'jenny', 'female',
  'karen', 'moira', 'tessa', 'susan', 'libby', 'natasha', 'google us english',
  'google uk english female', 'google australian english', 'ariaonline',
]

function pickFemaleVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const lower = voices.map((v) => v.name.toLowerCase())
  for (const hint of FEMALE_VOICE_HINTS) {
    const idx = lower.findIndex((n) => n.includes(hint))
    if (idx >= 0) return voices[idx]
  }
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0]
}

function ListenButton({ text }) {
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef(null)

  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    if (!synth) return
    const load = () => {
      voiceRef.current = pickFemaleVoice()
    }
    load()
    synth.addEventListener('voiceschanged', load)
    return () => {
      synth.removeEventListener('voiceschanged', load)
      synth.cancel()
    }
  }, [])

  const toggle = () => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    if (!synth) return
    if (synth.speaking || synth.pending) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.98
    u.pitch = 1.1
    if (voiceRef.current) u.voice = voiceRef.current
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.speak(u)
    setSpeaking(true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className="inline-flex items-center gap-2 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-[0.72rem] font-[var(--font-mono)] uppercase tracking-[0.12em] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors no-underline"
    >
      {speaking ? <Pause size={14} /> : <Volume2 size={14} />}
      {speaking ? 'Pause' : 'Listen'}
    </button>
  )
}

function Cover({ post }) {
  return (
    <ScrollReveal delay={0.1}>
      <div className="aspect-[16/9] overflow-hidden border-2 border-[var(--color-ink)] mb-10">
        <img src={post.cover} alt={post.coverAlt || post.title} className="w-full h-full object-cover" />
      </div>
    </ScrollReveal>
  )
}

function References({ refs }) {
  if (!refs || !refs.length) return null
  return (
    <section className="mt-14 pt-8 border-t border-[var(--color-line)]">
      <h2 className="font-[var(--font-display)] text-[1.5rem] text-[var(--color-ink)] mb-6">References</h2>
      <ul className="space-y-4 max-w-[74ch] list-none pl-0">
        {refs.map((r, i) => (
          <li key={i} className="text-[0.92rem] leading-relaxed text-[var(--color-ink-soft)] font-[var(--font-mono)]">
            {r}
          </li>
        ))}
      </ul>
    </section>
  )
}

function PostFooter({ post }) {
  return (
    <div className="mt-14 pt-8 border-t border-[var(--color-line)]">
      <LikeButton id={post.slug} />
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <AuthorBox author={post.author} />
        <a
          href={`mailto:oladeji.lawrence@gmail.com?subject=${encodeURIComponent('Re: ' + post.title)}`}
          className="btn btn-ghost !py-2.5 !px-5 !text-sm"
        >
          <Mail size={15} /> Discuss this
        </a>
      </div>
    </div>
  )
}

const TEMPLATE_META = {
  standard: { label: 'Explainer' },
  feature: { label: 'Field Report' },
  'field-note': { label: 'Field Note' },
  'deep-dive': { label: 'Technical Deep Dive' },
  briefing: { label: 'Briefing' },
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <section className="bg-cream pt-32 pb-24">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <h1 className="mb-4">Post not found.</h1>
          <Link to="/blog" className="btn btn-primary">Back to the blog</Link>
        </div>
      </section>
    )
  }

  const template = TEMPLATE_META[post.template] ? post.template : 'standard'
  const meta = TEMPLATE_META[template]
  const text = getPostText(post.body)
  const discussHref = `mailto:oladeji.lawrence@gmail.com?subject=${encodeURIComponent('Re: ' + post.title)}`
  const metaRow = (
    <span className="font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
      {formatDate(post.date)} · {post.readingTime}
    </span>
  )

  let layout

  if (template === 'feature') {
    layout = (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        <div className="max-w-[68ch]">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="eyebrow">{post.category}</span>
              <TemplateChip label={meta.label} />
            </div>
            <h1 className="blog-title mt-3 mb-5 max-w-[20ch]">{post.title}</h1>
          </ScrollReveal>
          <Cover post={post} />
          <BlogContent blocks={post.body} />
          <PostFooter post={post} />
        </div>
        <aside className="lg:sticky lg:top-24 h-max">
          <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6">
            <AuthorBox author={post.author} />
            <div className="mt-6 pt-6 border-t border-[var(--color-line)] space-y-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
              <div className="flex justify-between"><span>Published</span><span className="text-[var(--color-ink)]">{formatDate(post.date)}</span></div>
              <div className="flex justify-between"><span>Read</span><span className="text-[var(--color-ink)]">{post.readingTime}</span></div>
              <div className="flex justify-between"><span>Topic</span><span className="text-[var(--color-ink)]">{post.category}</span></div>
            </div>
            <div className="mt-6"><ListenButton text={text} /></div>
            <a href={discussHref} className="btn btn-primary w-full mt-4 !py-2.5 !px-4 !text-sm justify-center">
              <Mail size={15} /> Discuss this
            </a>
          </div>
        </aside>
      </div>
    )
  } else if (template === 'field-note') {
    layout = (
      <div className="mx-auto max-w-[720px]">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">{post.category}</span>
            <TemplateChip label={meta.label} />
          </div>
          <h1 className="blog-title mt-3 mb-5">{post.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <AuthorBox author={post.author} />
            <div className="flex items-center gap-4">
              {metaRow}
              <ListenButton text={text} />
            </div>
          </div>
        </ScrollReveal>
        <Cover post={post} />
        <div className="border-l-4 border-[var(--color-burnt)] pl-6">
          <BlogContent blocks={post.body} />
        </div>
        <PostFooter post={post} />
      </div>
    )
  } else if (template === 'deep-dive') {
    layout = (
      <div className="mx-auto max-w-[860px]">
        <ScrollReveal>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="eyebrow">{post.category}</span>
              <TemplateChip label={meta.label} />
            </div>
            <ListenButton text={text} />
          </div>
          <h1 className="blog-title mt-3 mb-5">{post.title}</h1>
          <div className="flex items-center gap-4 flex-wrap font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] mb-6">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
            <span className="ml-2"><AuthorBox author={post.author} /></span>
          </div>
        </ScrollReveal>
        <Cover post={post} />
        <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-6 sm:p-10">
          <BlogContent blocks={post.body} />
        </div>
        <PostFooter post={post} />
      </div>
    )
  } else if (template === 'briefing') {
    layout = (
      <div className="mx-auto max-w-[780px]">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">{post.category}</span>
            <TemplateChip label={meta.label} />
          </div>
          <h1 className="blog-title mt-3 mb-5">{post.title}</h1>
        </ScrollReveal>
        <div className="bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 mb-8">
          <p className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-3">Briefing</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
            <span>Published <span className="text-[var(--color-ink)]">{formatDate(post.date)}</span></span>
            <span>Read <span className="text-[var(--color-ink)]">{post.readingTime}</span></span>
            <AuthorBox author={post.author} />
          </div>
          <div className="mt-4"><ListenButton text={text} /></div>
        </div>
        <Cover post={post} />
        <BlogContent blocks={post.body} />
        <References refs={post.references} />
        <PostFooter post={post} />
      </div>
    )
  } else {
    layout = (
      <div className="mx-auto max-w-[760px]">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">{post.category}</span>
            <TemplateChip label={meta.label} />
          </div>
          <h1 className="blog-title mt-3 mb-5">{post.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <AuthorBox author={post.author} />
            <div className="flex items-center gap-4">
              {metaRow}
              <ListenButton text={text} />
            </div>
          </div>
        </ScrollReveal>
        <Cover post={post} />
        <BlogContent blocks={post.body} />
        <References refs={post.references} />
        <PostFooter post={post} />
      </div>
    )
  }

  return (
    <article className="bg-cream pt-28 sm:pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <Link to="/blog" className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] no-underline mb-8">
            <ArrowLeft size={14} /> All posts
          </Link>
        </ScrollReveal>

        {layout}
      </div>

      {/* Footer CTA */}
      <div className="max-w-[1200px] mx-auto px-6 mt-20">
        <ScrollReveal>
          <div className="bg-burnt border-2 border-[var(--color-ink)] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-[1.6rem] text-[var(--color-paper)] mb-2">Read more from the team</h2>
              <p className="text-[var(--color-paper)]/80 max-w-[46ch]">Practical writing on open models, offline infrastructure and AI for organisations that need to own their stack.</p>
            </div>
            <Link to="/blog" className="btn btn-primary shrink-0">All posts <ArrowUpRight size={18} /></Link>
          </div>
        </ScrollReveal>
      </div>
    </article>
  )
}
