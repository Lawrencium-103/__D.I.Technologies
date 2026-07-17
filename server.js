// DIT OpenModel Report Builder - backend
// Serves the built static site (dist/) and exposes POST /api/report.
// Search + synthesis logic lives in lib/omsf.js so the live pipeline and the
// pre-built PDFs (scripts/generate-reports.mjs) stay identical.

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv, buildProviders, webSearch, synthesizeWithFallback, getKnownModel, classifySources, filterVersionSources, getLicenseExcerpt } from './lib/omsf.js'
import { getStats, likeReport, bumpGenerated, getPdfCounts, recordPdfDownload, recordPdfLike } from './lib/engagement.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = process.env.PORT || 3000

loadEnv()

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
}

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(obj))
}

const server = http.createServer(async (req, res) => {
  // Engagement: total reports generated + per-report likes
  if (req.method === 'GET' && req.url === '/api/stats') {
    return sendJson(res, 200, getStats())
  }
  if (req.method === 'GET' && req.url.startsWith('/api/likes/')) {
    const id = decodeURIComponent(req.url.split('/').pop())
    const likes = getStats().likes[id] || 0
    return sendJson(res, 200, { id, likes })
  }
  if (req.method === 'POST' && req.url === '/api/like') {
    let body = ''
    req.on('data', (c) => (body += c))
    await new Promise((r) => req.on('end', r))
    let id
    try { id = (JSON.parse(body).id || '').trim() } catch { id = '' }
    if (!id) return sendJson(res, 400, { error: 'Report id is required' })
    return sendJson(res, 200, { id, likes: likeReport(id) })
  }

  // SME toolkit PDF engagement: counts, download, like
  if (req.method === 'GET' && req.url === '/api/pdf') {
    return sendJson(res, 200, { pdfs: getPdfCounts() })
  }
  if (req.method === 'POST' && (req.url === '/api/pdf/download' || req.url === '/api/pdf/like')) {
    let body = ''
    req.on('data', (c) => (body += c))
    await new Promise((r) => req.on('end', r))
    let file
    try { file = (JSON.parse(body).file || '').trim() } catch { file = '' }
    if (!file) return sendJson(res, 400, { error: 'PDF file is required' })
    const counts = req.url === '/api/pdf/download' ? recordPdfDownload(file) : recordPdfLike(file)
    return sendJson(res, 200, { file, ...counts })
  }

  if (req.method === 'POST' && req.url === '/api/report') {
    let body = ''
    req.on('data', (c) => (body += c))
    await new Promise((r) => req.on('end', r))

    let input
    try {
      input = JSON.parse(body)
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON' })
    }

    const model = (input.model || '').trim()
    const audience = input.audience || 'general'
    if (!model) return sendJson(res, 400, { error: 'Model name is required' })

    const providers = buildProviders()
    if (!providers.length) {
      return sendJson(res, 501, {
        error: 'not_configured',
        message: 'Set DIT_LLM_API_KEY (Groq) or a DIT_NV* key. The site will use a preview report.',
      })
    }

    try {
      const known = getKnownModel(model)
      if (known?.licenseUrl) known.licenseText = await getLicenseExcerpt(known)
      let sources = await webSearch(`${model} open weight AI model license weights GGUF quantization VRAM benchmarks technical specifications`)
      sources = filterVersionSources(sources, known)
      sources = classifySources(sources)
      if (known?.officialSources?.length) sources = [...known.officialSources, ...sources]
      const report = await synthesizeWithFallback(model, audience, sources, known)
      report.model = model
      report.audience = audience
      report.reportDate = new Date().toISOString().slice(0, 10)
      report.preview = false
      if (!('comparison' in report)) report.comparison = null
      bumpGenerated(1)
      sendJson(res, 200, { report })
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) })
    }
    return
  }

  // Static file serving (SPA fallback to index.html)
  let urlPath = req.url.split('?')[0]
  if (urlPath === '/') urlPath = '/index.html'
  const filePath = path.join(DIST, urlPath)
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, 'index.html'), (e, d) => {
        if (e) {
          res.writeHead(404)
          return res.end('Not found')
        }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(d)
      })
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  const providers = buildProviders()
  console.log(`DIT report server running on http://localhost:${PORT}`)
  console.log(`LLM providers configured: ${providers.map((p) => p.name).join(', ') || 'none'}`)
  if (!providers.length) {
    console.log('Note: no LLM key set. /api/report will return 501 and the site uses a preview report.')
  }
})
