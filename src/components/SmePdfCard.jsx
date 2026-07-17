import { useState } from 'react'

// A single downloadable DIT PDF card. Reports download + like counts through
// the parent-provided handlers. These PDFs are the official fillable tools with
// built-in calculations, so no "leaving the app" warning is shown.

const LIKE_KEY = 'dit-sme-pdf-liked'

function likedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKE_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export default function SmePdfCard({ file, label, summary = null, achieve = null, counts = {}, onDownload, onLike }) {
  const [busy, setBusy] = useState(false)
  const downloads = counts.downloads || 0
  const likes = counts.likes || 0
  const liked = likedSet().has(file)

  const handleDownload = async () => {
    setBusy(true)
    try {
      if (onDownload) await onDownload(file)
      window.open(file, '_blank', 'noopener')
    } finally {
      setBusy(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    const set = likedSet()
    set.add(file)
    try {
      localStorage.setItem(LIKE_KEY, JSON.stringify([...set]))
    } catch {
      /* ignore */
    }
    if (onLike) await onLike(file)
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
        <button onClick={handleDownload} disabled={busy} className="btn btn-primary text-[0.85rem] px-4 py-2">
          {busy ? 'Opening...' : 'Download PDF'}
        </button>
        <div className="flex items-center gap-3 font-[var(--font-mono)] text-[0.72rem] text-[var(--color-ink-faint)]">
          <span title="Downloads">&#8595; {downloads}</span>
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-1 no-underline ${liked ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink-faint)] hover:text-[var(--color-burnt)]'}`}
            title={liked ? 'Thanks for the love' : 'Like this tool'}
          >
            {liked ? '♥' : '♡'} {likes}
          </button>
        </div>
      </div>
    </div>
  )
}
