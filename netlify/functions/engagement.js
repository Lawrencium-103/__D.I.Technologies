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

import { getStore } from '@netlify/blobs'

const STORE = 'dit-engagement'
// Baseline "reports generated" mirrors the pre-built report library on disk.
const SEED_GENERATED = 5

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

// ---------------------------------------------------------------------------
// Live report generation for the DIT OpenModel Report Builder.
// Uses a server-side LLM with web grounding (Gemini googleSearch, or OpenAI
// web search) to produce a sourced OMSF report. Returns 501 when no provider
// key is configured so the client falls back to its offline preview.
// ---------------------------------------------------------------------------

const LADDER = `L0: Open by company policy (no verifiable artifacts)
L1: Open weights, restricted (weights downloadable but under a restrictive/custom license with commercial-user thresholds, e.g. Llama Community License, Gemma Terms)
L2: Open weights, permissive (permissive OSI license such as Apache 2.0 or MIT; free commercial use with attribution)
L3: Open science (weights + evaluation data + training code)
L4: Open source AI (full reproducibility)
L5: Open data (everything open)`

function buildPrompt(model, audience) {
  return `You are the DIT OpenModel Synthesis Framework (OMSF) report engine. Produce a rigorously sourced openness assessment for the AI model "${model}", framed for ${audience} readers.

Use live web search to find the model's actual license, weights availability, parameter count, context length, distribution formats, quantization details, minimum VRAM, tokens/sec (estimate), release date, and publisher. Cite real URLs.

Grade the model on the OMSF Openness Ladder:
${LADDER}

Return ONLY valid minified JSON (no markdown fences, no commentary) matching exactly this schema:
{
  "version": string,
  "publisher": string,
  "releaseDate": string,
  "grade": "L0"|"L1"|"L2"|"L3"|"L4"|"L5",
  "gradeLabel": string,
  "ladderVerdict": { "rung": string, "justification": string, "source": { "title": string, "url": string, "date": string } },
  "license": { "allowed": string[], "notAllowed": string[], "scaleTrigger": string, "commercialNote": string },
  "deployment": { "minHardware": string, "offlineCapable": string, "throughput": string, "verdict": string },
  "technical": { "contextLength": string, "parameters": string, "formats": string[], "precision": string, "quantizationImpact": string, "tokensPerSec": string, "minVramGb": string },
  "series": [ { "name": string, "params": string, "minVramGb": string, "quantOptions": string, "notes": string } ],
  "frames": { "private": { "text": string, "recommendation": "adopt"|"adopt with caution"|"avoid" }, "enterprise": { "text": string, "recommendation": "adopt"|"adopt with caution"|"avoid" }, "nonprofit": { "text": string, "recommendation": "adopt"|"adopt with caution"|"avoid" } },
  "disagreements": string,
  "sources": [ { "title": string, "url": string, "tier": "P1"|"P2", "date": string } ]
}
Every claim must be grounded in web data. Provide 2-5 real source URLs with their publication year.`
}

function str(v, fallback = 'Not available') {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.join(', ')
  return String(v)
}

function arr(v) {
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : str(x)))
  if (typeof v === 'string' && v) return [v]
  return []
}

function normalizeReport(p, model, audience, grounding = []) {
  const f = p.frames || {}
  const frame = (o) => ({
    text: str(o?.text, 'Not available'),
    recommendation: ['adopt', 'avoid', 'adopt with caution'].includes(o?.recommendation)
      ? o.recommendation
      : 'adopt with caution',
  })
  let sources = arr(p.sources).map((s) =>
    typeof s === 'string'
      ? { title: s, url: '', tier: 'P2', date: '' }
      : { title: str(s.title), url: str(s.url, ''), tier: str(s.tier, 'P2'), date: str(s.date, '') }
  )
  grounding.forEach((g) => {
    const u = g?.web?.uri
    if (u && !sources.some((s) => s.url === u)) {
      sources.push({ title: str(g?.web?.title || u), url: u, tier: 'P2', date: '' })
    }
  })
  const lv = p.ladderVerdict || {}
  return {
    model: str(model, model),
    version: str(p.version, ''),
    publisher: str(p.publisher, 'Unknown'),
    releaseDate: str(p.releaseDate, 'Unknown'),
    reportDate: new Date().toISOString().slice(0, 10),
    audience,
    grade: str(p.grade, 'L1'),
    gradeLabel: str(p.gradeLabel, 'Open weights, restricted'),
    preview: false,
    ladderVerdict: {
      rung: str(lv.rung, str(p.grade, 'L1')),
      justification: str(lv.justification, 'No sourced justification available.'),
      source: {
        title: str(lv.source?.title, 'Web sources'),
        url: str(lv.source?.url, ''),
        date: str(lv.source?.date, ''),
      },
    },
    license: {
      allowed: arr(p.license?.allowed),
      notAllowed: arr(p.license?.notAllowed),
      scaleTrigger: str(p.license?.scaleTrigger, 'None stated'),
      commercialNote: str(p.license?.commercialNote, 'Not available'),
    },
    deployment: {
      minHardware: str(p.deployment?.minHardware),
      offlineCapable: str(p.deployment?.offlineCapable),
      throughput: str(p.deployment?.throughput),
      verdict: str(p.deployment?.verdict),
    },
    technical: {
      contextLength: str(p.technical?.contextLength),
      parameters: str(p.technical?.parameters),
      formats: arr(p.technical?.formats),
      precision: str(p.technical?.precision),
      quantizationImpact: str(p.technical?.quantizationImpact),
      tokensPerSec: str(p.technical?.tokensPerSec),
      minVramGb: str(p.technical?.minVramGb),
    },
    series: arr(p.series).map((s) =>
      typeof s === 'string'
        ? { name: s, params: '', minVramGb: '', quantOptions: '', notes: '' }
        : {
            name: str(s.name),
            params: str(s.params),
            minVramGb: str(s.minVramGb),
            quantOptions: str(s.quantOptions),
            notes: str(s.notes),
          }
    ),
    frames: { private: frame(f.private), enterprise: frame(f.enterprise), nonprofit: frame(f.nonprofit) },
    disagreements: str(p.disagreements, 'No major disagreements reported.'),
    comparison: null,
    sources,
  }
}

async function callGemini(model, audience, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: buildPrompt(model, audience) }] }],
    tools: [{ googleSearch: {} }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('Gemini ' + res.status + ': ' + t.slice(0, 200))
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  const grounding = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  if (!text) throw new Error('Empty response from Gemini')
  return { text, grounding }
}

async function callOpenAI(model, audience, key) {
  const url = 'https://api.openai.com/v1/responses'
  const body = {
    model: 'gpt-4o-mini',
    tools: [{ type: 'web_search_preview' }],
    input: buildPrompt(model, audience) + '\n\nReturn ONLY valid JSON.',
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error('OpenAI ' + res.status + ': ' + t.slice(0, 200))
  }
  const data = await res.json()
  const text = data?.output?.find((o) => o.type === 'message')?.content?.find((c) => c.type === 'output_text')?.text
  if (!text) throw new Error('Empty response from OpenAI')
  return { text, grounding: [] }
}

async function buildLiveReport(model, audience, geminiKey, openaiKey) {
  const result = geminiKey
    ? await callGemini(model, audience, geminiKey)
    : await callOpenAI(model, audience, openaiKey)
  let parsed
  try {
    parsed = JSON.parse(result.text)
  } catch {
    throw new Error('Model returned invalid JSON')
  }
  return normalizeReport(parsed, model, audience, result.grounding)
}

async function readState() {
  const store = getStore(STORE)
  const raw = await store.get('state', { type: 'json' })
  if (!raw || typeof raw !== 'object') {
    return { generated: SEED_GENERATED, likes: {}, pdfs: {} }
  }
  return {
    generated: typeof raw.generated === 'number' ? raw.generated : SEED_GENERATED,
    likes: raw.likes && typeof raw.likes === 'object' ? raw.likes : {},
    pdfs: raw.pdfs && typeof raw.pdfs === 'object' ? raw.pdfs : {},
  }
}

async function writeState(state) {
  const store = getStore(STORE)
  await store.set('state', JSON.stringify(state))
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

    if (path === '/api/stats' && method === 'GET') {
      const state = await readState()
      return json(200, { generated: state.generated, likes: state.likes })
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
      const { model, audience } = safeBody(event.body)
      if (!model || !model.trim()) return json(400, { error: 'Model name is required' })
      const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
      const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
      if (!geminiKey && !openaiKey) {
        // No provider key configured on the server: signal the client to use
        // its offline preview so the tool still works end-to-end.
        return json(501, { error: 'Live report generation not configured' })
      }
      try {
        const report = await buildLiveReport(model.trim(), audience || 'general', geminiKey, openaiKey)
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
