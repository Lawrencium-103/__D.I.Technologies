// Front-end engagement for the SME toolkit PDFs: download counts + likes.
// Talks to /api/pdf (GET counts), /api/pdf/download and /api/pdf/like.

import { useEffect, useState, useCallback } from 'react'

let memory = null

async function getCounts() {
  try {
    const r = await fetch('/api/pdf')
    const j = await r.json()
    return j.pdfs || {}
  } catch {
    return memory || {}
  }
}

export function useSmePdfs() {
  const [counts, setCounts] = useState(memory || {})

  useEffect(() => {
    let alive = true
    ;(async () => {
      const c = await getCounts()
      memory = c
      if (alive) setCounts(c)
    })()
    return () => {
      alive = false
    }
  }, [])

  const download = useCallback(async (file) => {
    try {
      const r = await fetch('/api/pdf/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file }),
      })
      const j = await r.json()
      memory = { ...memory, [file]: { downloads: j.downloads, likes: j.likes } }
      setCounts(memory)
      return j
    } catch {
      return null
    }
  }, [])

  const like = useCallback(async (file) => {
    try {
      const r = await fetch('/api/pdf/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file }),
      })
      const j = await r.json()
      memory = { ...memory, [file]: { downloads: j.downloads, likes: j.likes } }
      setCounts(memory)
      return j
    } catch {
      return null
    }
  }, [])

  return { counts, download, like }
}
