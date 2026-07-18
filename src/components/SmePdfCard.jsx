import { useState } from 'react'

// A single downloadable DIT PDF card. Reports download + like counts through
// the parent-provided handlers. These PDFs are the official fillable tools with
// built-in calculations, so no "leaving the app" warning is shown.

const LIKE_SESSION_KEY = 'dit-sme-pdf-liked-session'

function sessionLiked(file) {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(LIKE_SESSION_KEY) || '[]')).has(file)
  } catch {
    return false
  }
}

export default function SmePdfCard({ file, label, summary = null, achieve = null, counts = {}, onDownload, onLike }) {
  const downloads = counts.downloads || 0
  const likes = counts.likes || 0
  const [liked, setLiked] = useState(() => sessionLiked(file))

  const handleLike = () => {
    if (liked) return
    const set = new Set(JSON.parse(sessionStorage.getItem(LIKE_SESSION_KEY) || '[]'))
    set.add(file)
    try {
      sessionStorage.setItem(LIKE_SESSION_KEY, JSON.stringify([...set]))
    } catch {
      /* ignore */
    }
    setLiked(true)
    if (onLike) onLike(file)
  }

  return (
    <div className="flex flex-col border-2 border-[var(--color-line)] bg-[var(--color-paper-2)] p-5">
      <div className="font-[var(--font-mono)] text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-burnt)] mb-2">
        Fillable PDF - calculates as you fill
      </div>
      <h3 className="font-[var(--font-display)] font-bold text-[1.05rem] leading-tight text-[var(--color-ink)]">
        {label}
      </h3>
      {summary ? (
        <p className="text-[0.9rem] text-[var(--color-ink-faint)] mt-3 flex-1">{summary}</p>
      ) : (
        <div className="flex-1" />
      )}
      {achieve ? (
        <p className="text-[0.82rem] text-[var(--color-ink-soft)] mt-3 border-t border-[var(--color-line)] pt-3">
          <span className="font-[var(--font-mono)] text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-burnt)]">What it helps you achieve: </span>
          {achieve}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3 mt-5">
        <a
          href={file}
          download
          onClick={() => onDownload && onDownload(file)}
          className="btn btn-primary text-[0.9rem] px-5 py-2.5 no-underline"
        >
          Download PDF
        </a>
        <div className="flex items-center gap-2 font-[var(--font-mono)] text-[0.78rem]">
          <span title="Downloads" className="flex items-center gap-1 text-[var(--color-ink-faint)]">&#8595; {downloads}</span>
          <button
            type="button"
            onClick={handleLike}
            disabled={liked}
            aria-pressed={liked}
            className={`flex items-center gap-1.5 rounded-sm px-2.5 py-2 min-h-[40px] min-w-[44px] justify-center transition-colors no-underline ${liked ? 'text-[var(--color-burnt)] cursor-default' : 'text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)] hover:bg-[var(--color-paper)]'}`}
            title={liked ? 'Thanks for the love' : 'Like this tool'}
          >
            <span aria-hidden="true" className="text-[1.1rem] leading-none">{liked ? '♥' : '♡'}</span>
            <span>{likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
