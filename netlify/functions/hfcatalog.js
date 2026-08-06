// Netlify Function: serves the latest HF catalog snapshot from the "hfcatalog"
// blob store. The scheduled hfcatalog-sync function keeps the blob fresh; this
// endpoint returns it to the browser. If no blob exists yet (first deploy), it
// returns 404 so HfCatalog.jsx falls back to the build-time static snapshot at
// /data/hf-catalog.json.

import { getStore } from '@netlify/blobs'
import { BLOB_STORE, BLOB_KEY } from '../../lib/hfCatalog.js'

function json(status, body, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=1800',
      ...extra,
    },
  })
}

export default async () => {
  try {
    const store = getStore(BLOB_STORE)
    const raw = await store.get(BLOB_KEY, { type: 'json' })
    if (!raw || !Array.isArray(raw?.models)) {
      return json(404, { error: 'no catalog snapshot stored yet' })
    }
    return json(200, raw)
  } catch (e) {
    return json(502, { error: 'hfcatalog: ' + String((e && e.message) || e) })
  }
}