// Front-end engagement for the SME toolkit PDFs: download counts + likes.
// Talks to /api/pdf (GET counts), /api/pdf/download and /api/pdf/like.
//
// Counts are mirrored in localStorage so they keep working (and survive reloads)
// even when the backend is unreachable (e.g. local dev, where Netlify Functions
// don't run). The backend stays the cross-user source of truth; on every
// successful response we adopt its value, otherwise the local mirror is used.

import { useEffect, useState, useCallback } from 'react'

const LOCAL_KEY = 'dit-sme-pdf-counts'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

function saveLocal(obj) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(obj))
  } catch {
    /* ignore */
  }
}

// Backend wins on conflicts, but local-only entries are preserved.
function withBackend(base, backend) {
  const out = { ...base }
  for (const [file, v] of Object.entries(backend || {})) out[file] = v
  return out
}

async function fetchCounts() {
  try {
    const r = await fetch('/api/pdf')
    if (!r.ok) throw new Error('bad status')
    const j = await r.json()
    const merged = withBackend(loadLocal(), j.pdfs || {})
    saveLocal(merged)
    return merged
  } catch {
    return loadLocal()
  }
}

export function useSmePdfs() {
  const [counts, setCounts] = useState(() => loadLocal())

  useEffect(() => {
    let alive = true
    fetchCounts().then((c) => {
      if (alive) setCounts(c)
    })
    return () => {
      alive = false
    }
  }, [])

  // Optimistically bump the local mirror, then sync to the backend. The backend
  // response (authoritative, growing counter) is adopted via max() so we never
  // show fewer than what we already counted locally.
  const bump = useCallback((file, kind) => {
    const local = loadLocal()
    const entry = { downloads: local[file]?.downloads || 0, likes: local[file]?.likes || 0 }
    entry[kind] += 1
    local[file] = entry
    saveLocal(local)
    setCounts({ ...local })

    const endpoint = kind === 'downloads' ? '/api/pdf/download' : '/api/pdf/like'
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j) return
        const l2 = loadLocal()
        const cur = l2[file] || { downloads: 0, likes: 0 }
        l2[file] = {
          downloads: Math.max(cur.downloads, j.downloads || 0),
          likes: Math.max(cur.likes, j.likes || 0),
        }
        saveLocal(l2)
        setCounts({ ...l2 })
      })
      .catch(() => {})
  }, [])

  const download = useCallback((file) => bump(file, 'downloads'), [bump])
  const like = useCallback((file) => bump(file, 'likes'), [bump])

  return { counts, download, like }
}
