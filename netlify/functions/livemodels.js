// Netlify Function: proxies lmmarketcap's open-model API to the browser.
//
// The upstream API (https://lmmarketcap.com/api/models) sends NO CORS headers,
// so the browser cannot fetch it directly and OpenModels.jsx falls back to its
// build-time snapshot ("Live update unavailable"). This function fetches the
// data server-side (no CORS there) and returns it with a permissive CORS header,
// so the leaderboard can show LIVE data.
//
// Response is cached in-memory for ~5 minutes to avoid hammering the upstream
// and to keep page loads fast. This is deliberately a pure proxy (no @netlify/
// blobs, no lib/omsf import) so it stays trivial to build and deploy.
const UPSTREAM = 'https://lmmarketcap.com/api/models'
const TTL_MS = 5 * 60 * 1000

let cache = { at: 0, body: null }

export default async () => {
  const now = Date.now()
  if (cache.body && now - cache.at < TTL_MS) {
    return json(200, cache.body)
  }
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(UPSTREAM, {
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = await res.json()
    cache = { at: now, body: data }
    return json(200, data)
  } catch (e) {
    // Upstream down/slow: serve stale cache if we have it, else 502 so the
    // client gracefully falls back to its build-time snapshot.
    if (cache.body) return json(200, cache.body)
    return json(502, { error: 'livemodels proxy failed: ' + String((e && e.message) || e) })
  }
}

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60',
    },
    body: JSON.stringify(body),
  }
}
