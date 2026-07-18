// Local-first mirror for OMSF engagement metrics (reports generated, community
// likes, library report downloads). Mirrors the proven SME pattern: counts
// update instantly in the browser and persist in localStorage, then sync with
// the backend via Math.max() so a reachable server (real, cross-user counts)
// always wins and is never lost. Survives local dev where /api/* may be down.

const KEY = 'dit-omsf-stats'
let cache = null
const listeners = new Set()

function load() {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    cache = null
  }
  if (!cache || typeof cache !== 'object') {
    cache = { generated: 0, likes: {}, reportDownloads: {} }
  }
  cache.likes = cache.likes || {}
  cache.reportDownloads = cache.reportDownloads || {}
  // Publish a fresh reference so React state updates re-render.
  cache = { ...cache, likes: { ...cache.likes }, reportDownloads: { ...cache.reportDownloads } }
  return cache
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* ignore */
  }
}

function emit() {
  // Hand each listener a new reference so React's setState re-renders.
  const snapshot = { ...cache, likes: { ...cache.likes }, reportDownloads: { ...cache.reportDownloads } }
  for (const l of listeners) l(snapshot)
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getStats() {
  return load()
}

export function recordDownload(file) {
  const c = load()
  c.reportDownloads = { ...c.reportDownloads, [file]: (c.reportDownloads[file] || 0) + 1 }
  save()
  emit()
}

export function recordLike(id) {
  const c = load()
  c.likes = { ...c.likes, [id]: (c.likes[id] || 0) + 1 }
  save()
  emit()
}

export function recordGenerated() {
  const c = load()
  c.generated = (c.generated || 0) + 1
  save()
  emit()
}

// Adopt the server's counts without ever decreasing what we already have.
export function syncFromServer(server) {
  if (!server) return
  const c = load()
  c.generated = Math.max(c.generated || 0, server.generated || 0)
  const ld = server.likes || {}
  const likes = { ...c.likes }
  for (const k of Object.keys(ld)) {
    likes[k] = Math.max(likes[k] || 0, ld[k] || 0)
  }
  c.likes = likes
  const rd = server.reportDownloads || {}
  const downloads = { ...c.reportDownloads }
  for (const k of Object.keys(rd)) {
    downloads[k] = Math.max(downloads[k] || 0, rd[k] || 0)
  }
  c.reportDownloads = downloads
  save()
  emit()
}
