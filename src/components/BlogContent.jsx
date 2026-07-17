import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

function Block({ block }) {
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-[1.3rem] leading-relaxed text-[var(--color-ink)] font-[var(--font-display)] font-medium max-w-[64ch] mb-10">
          {block.text}
        </p>
      )
    case 'heading':
      return <h2 className="text-[1.8rem] mt-14 mb-5 text-[var(--color-ink)]">{block.text}</h2>
    case 'paragraph':
      return <p className="text-[1.05rem] leading-relaxed text-[var(--color-ink-soft)] max-w-[68ch] mb-6">{block.text}</p>
    case 'image':
      return (
        <figure className="my-12">
          <img src={block.src} alt={block.alt || ''} loading="lazy" className="w-full border-2 border-[var(--color-ink)]" />
          {block.caption && <figcaption className="mt-3 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">{block.caption}</figcaption>}
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="my-12 border-l-4 border-[var(--color-burnt)] pl-6 py-1">
          <p className="text-[1.5rem] leading-snug font-[var(--font-display)] font-semibold text-[var(--color-ink)] max-w-[60ch]">{block.text}</p>
          {block.cite && <cite className="block mt-3 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] not-italic">{block.cite}</cite>}
        </blockquote>
      )
    case 'list':
      return (
        <ul className="my-8 space-y-3 max-w-[68ch]">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[1.02rem] text-[var(--color-ink-soft)] leading-relaxed">
              <span className="marker text-[1.1rem] leading-7 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div className="my-10 bg-[var(--color-paper-2)] border-2 border-[var(--color-ink)] p-6 sm:p-7">
          {block.title && <h3 className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-burnt)] mb-2">{block.title}</h3>}
          <p className="text-[1.05rem] text-[var(--color-ink)] leading-relaxed">{block.text}</p>
        </div>
      )
    case 'tldr':
      return (
        <div className="my-10 border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] p-6 sm:p-7">
          <div className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-burnt)] mb-3">TL;DR</div>
          <p className="text-[1.05rem] leading-relaxed text-[var(--color-paper)]">{block.text}</p>
        </div>
      )
    case 'framework':
      return (
        <div className="my-12 bg-[var(--color-ink)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-burnt)]">OMSF</span>
            <span className="h-px flex-1 bg-[var(--color-paper-faint)]"></span>
          </div>
          <p className="text-[1rem] leading-relaxed text-[var(--color-paper-soft)]">{block.text}</p>
          <Link
            to="/framework"
            className="inline-block mt-4 font-[var(--font-mono)] text-[0.74rem] uppercase tracking-[0.14em] text-[var(--color-paper)] border border-[var(--color-paper-faint)] px-4 py-2 hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] transition-colors"
          >
            Read the framework
          </Link>
        </div>
      )
    default:
      return null
  }
}

export default function BlogContent({ blocks }) {
  return (
    <div>
      {blocks.map((b, i) => (
        <ScrollReveal key={i} delay={Math.min(i * 0.03, 0.2)}>
          <Block block={b} />
        </ScrollReveal>
      ))}
    </div>
  )
}
