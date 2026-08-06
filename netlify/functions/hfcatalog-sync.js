// Netlify scheduled function: periodic delta sync of the HF catalog into the
// "hfcatalog" blob store. Runs the same pull core as the backfill script
// (lib/hfCatalog.js) but on a smaller window, then merges the fresh rows into
// the previously stored snapshot: updated rows replace, new ids are added,
// stale ids are dropped once the merged catalog exceeds the cap.
//
// Schedule (netlify.toml): daily 06:00 UTC. Sizes are env-tunable:
//   HF_SYNC_MODELS (default 500)  HF_SYNC_CONFIG_LIMIT (default 60)
//   HF_SYNC_RAW_CAP (default 2000) HF_SYNC_CAP (default 3000)

import { getStore } from '@netlify/blobs'
import { pullCatalog, mergeCatalog, BLOB_STORE, BLOB_KEY } from '../../lib/hfCatalog.js'

const envInt = (name, fallback) => {
  const v = Number(process.env[name])
  return Number.isFinite(v) && v > 0 ? v : fallback
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export default async () => {
  const maxModels = envInt('HF_SYNC_MODELS', 500)
  const configLimit = envInt('HF_SYNC_CONFIG_LIMIT', 60)
  const rawCap = envInt('HF_SYNC_RAW_CAP', 2000)
  const cap = envInt('HF_SYNC_CAP', 3000)

  try {
    const store = getStore(BLOB_STORE)
    const prev = await store.get(BLOB_KEY, { type: 'json' }).catch(() => null)

    const { payload: fresh, raw, excluded } = await pullCatalog({ maxModels, configLimit, rawCap })
    const merged = prev && Array.isArray(prev?.models) ? mergeCatalog(prev, fresh, cap) : fresh

    await store.set(BLOB_KEY, JSON.stringify(merged))
    return json(200, {
      ok: true,
      syncedAt: merged.fetchedAt,
      rawPulled: raw,
      excluded,
      prevCount: prev?.models?.length || 0,
      newCount: merged.count,
      added: merged.models.length - (prev?.models?.length || 0),
      coverage: merged.coverage,
    })
  } catch (e) {
    return json(500, { ok: false, error: String((e && e.message) || e) })
  }
}