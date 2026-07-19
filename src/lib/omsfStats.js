// Local-first mirror for OMSF engagement metrics (reports generated, community
// likes, library report downloads). Mirrors the proven SME pattern: counts
// update instantly in the browser and persist in localStorage, then sync with
// the backend via Math.max() so a reachable server (real, cross-user counts)
// always wins and is never lost. Survives local dev where /api/* may be down.
//
// Resilience: we persist the LAST GOOD server payload separately and MERGE it
// with the local optimistic store. That way a fresh browser (or a briefly
// unreachable backend) still shows the real accumulated totals instead of
// dropping to 0. The displayed number for any metric is max(local, server).

const KEY = 'dit-omsf-stats'
const SERVER_KEY = 'dit-omsf-stats-server'
let cache = null // local optimistic store
let serverSnap = null // last good server payload
const listeners = new Set()

function loadLocal() {
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
  cache = { ...cache, likes: { ...cache.likes }, reportDownloads: { ...cache.reportDownloads } }
  return cache
}

function loadServer() {
  if (serverSnap) return serverSnap
  try {
    serverSnap = JSON.parse(localStorage.getItem(SERVER_KEY) || 'null')
  } catch {
    serverSnap = null
  }
  return serverSnap
}

function saveLocal() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* ignore */
  }
}

function saveServer() {
  try {
    localStorage.setItem(SERVER_KEY, JSON.stringify(serverSnap))
  } catch {
    /* ignore */
  }
}

// Display view: max(local, server) for every metric so we never show a stale 0
// when the server holds the real accumulated total.
function merged() {
  const c = loadLocal()
  const s = loadServer() || {}
  const likes = { ...(s.likes || {}) }
  for (const k of Object.keys(c.likes || {})) likes[k] = Math.max(likes[k] || 0, c.likes[k] || 0)
  const rd = { ...(s.reportDownloads || {}) }
  for (const k of Object.keys(c.reportDownloads || {})) rd[k] = Math.max(rd[k] || 0, c.reportDownloads[k] || 0)
  return {
    generated: Math.max(c.generated || 0, s.generated || 0),
    likes,
    reportDownloads: rd,
    pdfs: s.pdfs || {},
  }
}

function emit() {
  const snap = merged()
  for (const l of listeners) l(snap)
}

export function subscribe(fn) {
  listeners.add(fn)
  fn(merged())
  return () => listeners.delete(fn)
}

export function getStats() {
  return merged()
}

export function recordDownload(file) {
  const c = loadLocal()
  c.reportDownloads = { ...c.reportDownloads, [file]: (c.reportDownloads[file] || 0) + 1 }
  saveLocal()
  emit()
}

export function recordLike(id) {
  const c = loadLocal()
  c.likes = { ...c.likes, [id]: (c.likes[id] || 0) + 1 }
  saveLocal()
  emit()
}

export function recordGenerated() {
  const c = loadLocal()
  c.generated = (c.generated || 0) + 1
  saveLocal()
  emit()
}

// Adopt the server's counts without ever decreasing what we already have. We
// also cache the raw server payload so a later refresh / fresh load keeps the
// real totals even if the backend is briefly unreachable.
export function syncFromServer(server) {
  if (!server) return
  serverSnap = server
  saveServer()
  const c = loadLocal()
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
  saveLocal()
  emit()
}

// Try the live backend first; if /api/stats is unreachable (e.g. 502), fall back
// to a committed static baseline so the band always shows consistent, non-zero
// community numbers instead of dropping to 0.
export async function refreshFromServer() {
  const tryUrl = async (url) => {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!r.ok) return null
      const d = await r.json()
      return d && typeof d === 'object' ? d : null
    } catch {
      return null
    }
  }
  const nonEmpty = (o) => o && typeof o === 'object' && Object.keys(o).length > 0
  const baseline = await tryUrl('/omsf-community.json')
  const server = await tryUrl('/api/stats')
  // Prefer the live server only when it carries real (non-seed) data. The
  // engagement store starts from a seed of 5 with empty maps, so when it has
  // nothing accumulated yet we keep the committed community baseline as the floor.
  const hasReal =
    server &&
    (server.generated > 5 || nonEmpty(server.likes) || nonEmpty(server.reportDownloads) || nonEmpty(server.pdfs))
  const effective = hasReal ? server : baseline
  if (effective) syncFromServer(effective)
}
