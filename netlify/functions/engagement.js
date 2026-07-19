// Netlify Function backing the site's engagement counters (downloads, likes,
// generated reports). Replaces the Node server.js endpoints on static hosting.
// State persists in a Netlify Blob store named "dit-engagement".
//
// Routes:
//   GET  /api/pdf            -> { pdfs: { [file]: { downloads, likes } } }
//   POST /api/pdf/download   -> { file, downloads, likes }
//   POST /api/pdf/like       -> { file, downloads, likes }
//   GET  /api/stats          -> { generated, likes: { [id]: n } }
//   POST /api/like           -> { id, likes }
//   GET  /api/likes/:id      -> { id, likes }
//   POST /api/report         -> { report }  (live OMSF synthesis via lib/omsf.js)

// NOTE: lib/omsf.js (LLM + web search + report synthesis) is imported DYNAMICALLY
// only inside the /api/report route below. Importing it at the top level pulls in
// modelFacts.js and a module-level path computation that can throw during the
// function's module initialization and 502 EVERY route — including the lightweight
// /api/stats, /api/pdf and /api/like routes that don't need it. Keeping it lazy
// keeps those routes alive even if the synthesis chain fails to load.
//
// The @netlify/blobs client is likewise imported lazily inside readState/
// writeState: the function module therefore has NO external top-level imports, so
// it can never fail to initialize (a 502 with an empty body on every route is the
// classic symptom of a module-load crash). Any blob error becomes a runtime error
// we catch and degrade from.

const STORE = 'dit-engagement'
// Baseline "reports generated" mirrors the pre-built report library on disk.
const SEED_GENERATED = 5

const SEED_STATE = { generated: SEED_GENERATED, likes: {}, pdfs: {}, reportDownloads: {} }

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  }
}

function safeBody(body) {
  if (!body) return {}
  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

async function readState() {
  try {
    const { getStore } = await import('@netlify/blobs')
    const store = getStore(STORE)
    const raw = await store.get('state', { type: 'json' })
    if (!raw || typeof raw !== 'object') return { ...SEED_STATE }
    return {
      generated: typeof raw.generated === 'number' ? raw.generated : SEED_GENERATED,
      likes: raw.likes && typeof raw.likes === 'object' ? raw.likes : {},
      pdfs: raw.pdfs && typeof raw.pdfs === 'object' ? raw.pdfs : {},
      reportDownloads:
        raw.reportDownloads && typeof raw.reportDownloads === 'object' ? raw.reportDownloads : {},
    }
  } catch (e) {
    // Blob store unreachable (missing binding, transient error): degrade to the
    // in-memory seed instead of throwing and 502-ing the whole function.
    console.warn('[engagement] readState failed, using seed:', String((e && e.message) || e))
    return { ...SEED_STATE }
  }
}

async function writeState(state) {
  try {
    const { getStore } = await import('@netlify/blobs')
    const store = getStore(STORE)
    await store.set('state', JSON.stringify(state))
  } catch (e) {
    console.warn('[engagement] writeState failed:', String((e && e.message) || e))
  }
}

export default async (event) => {
  const url = new URL(event.rawUrl)
  const path = url.pathname
  const method = event.httpMethod

  try {
    if (path === '/api/pdf' && method === 'GET') {
      const state = await readState()
      return json(200, { pdfs: state.pdfs })
    }

    if (path === '/api/pdf/download' && method === 'POST') {
      const file = (safeBody(event.body).file || '').trim()
      if (!file) return json(400, { error: 'PDF file is required' })
      const state = await readState()
      state.pdfs[file] = state.pdfs[file] || { downloads: 0, likes: 0 }
      state.pdfs[file].downloads += 1
      await writeState(state)
      return json(200, { file, ...state.pdfs[file] })
    }

    if (path === '/api/pdf/like' && method === 'POST') {
      const file = (safeBody(event.body).file || '').trim()
      if (!file) return json(400, { error: 'PDF file is required' })
      const state = await readState()
      state.pdfs[file] = state.pdfs[file] || { downloads: 0, likes: 0 }
      state.pdfs[file].likes += 1
      await writeState(state)
      return json(200, { file, ...state.pdfs[file] })
    }

    if (path === '/api/report/download' && method === 'POST') {
      const file = (safeBody(event.body).file || '').trim()
      if (!file) return json(400, { error: 'Report file is required' })
      const state = await readState()
      state.reportDownloads[file] = (state.reportDownloads[file] || 0) + 1
      await writeState(state)
      return json(200, { file, downloads: state.reportDownloads[file] })
    }

    if (path === '/api/stats' && method === 'GET') {
      const state = await readState()
      return json(200, {
        generated: state.generated,
        likes: state.likes,
        reportDownloads: state.reportDownloads,
        pdfs: state.pdfs,
      })
    }

    if (path === '/api/like' && method === 'POST') {
      const id = (safeBody(event.body).id || '').trim()
      if (!id) return json(400, { error: 'Report id is required' })
      const state = await readState()
      state.likes[id] = (state.likes[id] || 0) + 1
      await writeState(state)
      return json(200, { id, likes: state.likes[id] })
    }

    if (path.startsWith('/api/likes/') && method === 'GET') {
      const id = decodeURIComponent(path.split('/').pop())
      const state = await readState()
      return json(200, { id, likes: state.likes[id] || 0 })
    }

    if (path === '/api/report' && method === 'POST') {
      // Load the synthesis chain only here, so a failure to import it can never
      // take down the stats/pdf/like routes.
      const { loadEnv, webSearch, getKnownModel, synthesizeWithFallback } = await import(
        '../../lib/omsf.js'
      )
      loadEnv()
      const { model, audience } = safeBody(event.body)
      if (!model || !model.trim()) return json(400, { error: 'Model name is required' })
      try {
        const known = getKnownModel(model.trim())
        const sources = await webSearch(
          `${model.trim()} AI model license weights parameters context length release date`
        )
        const synth = await synthesizeWithFallback(model.trim(), audience || 'general', sources, known)
        if (!synth) {
          // No LLM provider configured (no DIT_LLM_API_KEY / DIT_NV*): signal the
          // client to use its offline preview so the tool still works end-to-end.
          return json(501, { error: 'No LLM provider configured' })
        }
        const report = {
          ...synth,
          model: model.trim(),
          reportDate: new Date().toISOString().slice(0, 10),
          audience: audience || 'general',
          preview: false,
        }
        const state = await readState()
        state.generated = (state.generated || 0) + 1
        await writeState(state)
        return json(200, { report })
      } catch (e) {
        return json(501, { error: 'Live generation failed: ' + String((e && e.message) || e) })
      }
    }

    return json(404, { error: 'Not found' })
  } catch (e) {
    return json(500, { error: String((e && e.message) || e) })
  }
}
