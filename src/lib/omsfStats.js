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
  for (const l of listeners) l(cache)
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getStats() {
  return load()
}

export function recordDownload(file) {
  load()
  cache.reportDownloads[file] = (cache.reportDownloads[file] || 0) + 1
  save()
  emit()
}

export function recordLike(id) {
  load()
  cache.likes[id] = (cache.likes[id] || 0) + 1
  save()
  emit()
}

export function recordGenerated() {
  load()
  cache.generated = (cache.generated || 0) + 1
  save()
  emit()
}

// Adopt the server's counts without ever decreasing what we already have.
export function syncFromServer(server) {
  if (!server) return
  load()
  cache.generated = Math.max(cache.generated || 0, server.generated || 0)
  const ld = server.likes || {}
  for (const k of Object.keys(ld)) {
    cache.likes[k] = Math.max(cache.likes[k] || 0, ld[k] || 0)
  }
  const rd = server.reportDownloads || {}
  for (const k of Object.keys(rd)) {
    cache.reportDownloads[k] = Math.max(cache.reportDownloads[k] || 0, rd[k] || 0)
  }
  save()
  emit()
}
