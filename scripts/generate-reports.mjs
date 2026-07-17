// Pre-build OMSF model report PDFs for a fixed set of 2025 models.
// Output: public/reports/<clear-name>.pdf  +  .json  +  manifest.json
// Run: node scripts/generate-reports.mjs   (after npm run build)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'
import { loadEnv, buildProviders, webSearch, synthesizeWithFallback, getKnownModel, classifySources, filterVersionSources, getLicenseExcerpt } from '../lib/omsf.js'
import { readEngagement } from '../lib/engagement.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'reports')
fs.mkdirSync(OUT, { recursive: true })

loadEnv()
readEngagement() // seed the generated-count from the existing PDF library
const providers = buildProviders()
if (!providers.length) {
  console.error('No LLM providers configured. Add Groq/NVIDIA keys to .env.')
  process.exit(1)
}

// 2025 models, each framed for a different buyer (matches the framework's three lenses)
const TARGETS = [
  { name: 'Llama 4', audience: 'enterprise', date: '2025-04-10' },
  { name: 'Qwen3', audience: 'private', date: '2025-05-12' },
  { name: 'DeepSeek V3', audience: 'nonprofit', date: '2025-01-28' },
  { name: 'Gemma 3', audience: 'enterprise', date: '2025-03-15' },
  { name: 'Mistral', audience: 'private', date: '2025-07-22' },
]

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
function audienceLabel(a) {
  return (a || 'general')
    .replace('general', 'General / all readers')
    .replace('private', 'Private / individual')
    .replace('enterprise', 'Enterprise')
    .replace('nonprofit', 'Non-profit / public sector')
}

const C = {
  paper: '#FBF7EF', ink: '#1A1712', soft: '#3A332B', faint: '#6E6356',
  burnt: '#C55221', line: '#D8CDB8', amber: '#E0A93B', zebra: '#F3ECDD',
}
const ML = 50
const MR = 50

function clean(s) {
  if (s == null) return ''
  return String(s)
    .replace(/[\u2014]/g, ' - ')
    .replace(/[\u2013]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

// Framework-tied colour system: openness rungs (red -> green) and recommendations.
const RUNG = { L0: '#B23A2E', L1: '#C55221', L2: '#E0A93B', L3: '#8AAE5D', L4: '#5E8C3E', L5: '#3F7A2E' }
const REC = { adopt: '#3F7A2E', 'adopt with caution': '#E0A93B', avoid: '#B23A2E' }
function rungColor(g) { return RUNG[g] || '#6E6356' }
function recColor(r) { return REC[String(r || '').toLowerCase().trim()] || '#6E6356' }
function tierColor(t) { return t === 'P1' ? '#3F7A2E' : t === 'P2' ? '#E0A93B' : '#B23A2E' }

function pill(doc, x, y, text, color, w) {
  const tw = doc.widthOfString(String(text).toUpperCase(), { fontSize: 8 })
  const pw = w || tw + 18
  const ph = 16
  doc.roundedRect(x, y, pw, ph, 8).fill(color)
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8).text(String(text).toUpperCase(), x + 9, y + 4, { width: pw - 18, align: 'center' })
  return pw
}

function ladder(doc, x, y, w, h, grade) {
  const n = 6
  const gap = 3
  const bh = (h - gap * (n - 1)) / n
  for (let i = n - 1; i >= 0; i--) {
    const ry = y + (n - 1 - i) * (bh + gap)
    const g = 'L' + i
    const on = g === grade
    doc.roundedRect(x, ry, w, bh, 2).fill(on ? rungColor(g) : '#E5DCC8')
    doc.fillColor(on ? '#FFFFFF' : C.faint).font('Helvetica-Bold').fontSize(7).text(g, x + 5, ry + bh / 2 - 3.5)
  }
}

function barChart(doc, S, items) {
  const vals = items.map((i) => i.value).filter((v) => v > 0)
  const max = vals.length ? Math.max(...vals) : 1
  const labelW = 100
  const barX = ML + labelW
  const barMaxW = (doc.page.width - ML - MR) - labelW - 12
  for (const it of items) {
    ensure(S, doc, 18)
    doc.fillColor(C.ink).font('Helvetica').fontSize(8).text(it.label, ML, S.y + 2, { width: labelW - 8 })
    const bw = it.value > 0 ? Math.max((it.value / max) * barMaxW, 4) : 4
    doc.roundedRect(barX, S.y, bw, 12, 2).fill(rungColor('L2'))
    const label = it.note || `${it.value} GB`
    if (bw > 64) {
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7).text(label, barX + 5, S.y + 2, { width: bw - 10 })
    } else {
      doc.fillColor(C.ink).font('Helvetica-Bold').fontSize(7).text(label, barX + bw + 4, S.y + 2)
    }
    S.y += 17
  }
}

function ensure(S, doc, h) {
  const fb = doc.page.height - 46
  if (S.y + h > fb) doc.addPage()
}

function letterhead(doc, S) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.paper)
  doc.rect(0, 0, doc.page.width, 40).fill(C.ink)
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(12).text('DIT', ML, 14)
  doc.fillColor(C.amber).font('Helvetica-Bold').fontSize(7).text('DARA INITIATIVE TECH', ML + 30, 17)
  doc.fillColor(C.paper).font('Helvetica').fontSize(7.5).text('OMSF Model Report', doc.page.width - MR - 110, 16, { width: 110, align: 'right' })
  doc.rect(0, 40, doc.page.width, 1.5).fill(C.burnt)
  S.y = 56
}

function makeDoc() {
  const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true })
  const S = { y: 56 }
  doc.on('pageAdded', () => letterhead(doc, S))
  letterhead(doc, S)
  return { doc, S }
}

function subhead(doc, S, text) {
  ensure(S, doc, 22)
  doc.fillColor(C.burnt).font('Helvetica-Bold').fontSize(10).text(clean(text).toUpperCase(), ML, S.y, { characterSpacing: 0.5 })
  S.y = doc.y + 6
}

function P(doc, S, text) {
  ensure(S, doc, 30)
  doc.fillColor(C.soft).font('Helvetica').fontSize(9.5).text(clean(text) || 'Not available', ML, S.y, { width: doc.page.width - ML - MR, lineGap: 2 })
  S.y = doc.y + 8
}

function field(doc, S, label, value) {
  if (!value || /not available|none/i.test(String(value).trim())) return
  ensure(S, doc, 16)
  doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(7.5).text(clean(label).toUpperCase(), ML, S.y)
  S.y = doc.y + 2
  doc.fillColor(C.ink).font('Helvetica').fontSize(9.5).text(clean(value), ML, S.y, { width: doc.page.width - ML - MR, lineGap: 2 })
  S.y = doc.y + 7
}

function bullets(doc, S, label, items) {
  if (!items || !items.length) return
  ensure(S, doc, 16)
  if (label) {
    doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(7.5).text(clean(label).toUpperCase(), ML, S.y)
    S.y = doc.y + 3
  }
  doc.font('Helvetica').fontSize(9.5)
  for (const it of items) {
    ensure(S, doc, 14)
    doc.fillColor(C.burnt).font('Helvetica-Bold').fontSize(9).text('•', ML, S.y)
    doc.fillColor(C.ink).font('Helvetica').fontSize(9.5).text(clean(it), ML + 12, S.y, { width: doc.page.width - ML - MR - 12, lineGap: 2 })
    S.y = doc.y + 3
  }
  S.y += 5
}

function sub(doc, S, text) {
  ensure(S, doc, 18)
  doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(8.5).text(clean(text).toUpperCase(), ML, S.y)
  S.y = doc.y + 5
}

function srcLine(doc, S, s) {
  ensure(S, doc, 14)
  const tier = s.tier || 'P2'
  doc.font('Helvetica-Bold').fontSize(8)
  doc.fillColor(tierColor(tier)).text(`[${tier}] `, ML, S.y)
  const tw = doc.widthOfString(`[${tier}] `)
  doc.fillColor(C.soft).font('Helvetica').fontSize(8).text(
    `${clean(s.title) || ''} ${clean(s.url) || ''}${s.date ? '  ·  ' + clean(s.date) : ''}`,
    ML + tw, S.y, { width: doc.page.width - ML - MR - tw, lineGap: 2 },
  )
  S.y = doc.y + 4
}

function table(doc, S, headers, rows, weights) {
  const CW = doc.page.width - ML - MR
  const pad = 5
  const w = weights || headers.map(() => 1)
  const tot = w.reduce((a, b) => a + b, 0)
  const cws = w.map((x) => (CW * x) / tot)
  ensure(S, doc, 24)
  let x = ML
  doc.rect(ML, S.y, CW, 18).fill(C.ink)
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(7.5)
  headers.forEach((h, i) => { doc.text(clean(h), x + pad, S.y + 5, { width: cws[i] - pad * 2 }); x += cws[i] })
  S.y += 18
  doc.font('Helvetica').fontSize(8)
  for (const row of rows) {
    let h = 0
    row.forEach((c, i) => { const hh = doc.heightOfString(clean(c) || '—', { width: cws[i] - pad * 2, fontSize: 8 }); if (hh > h) h = hh })
    const rh = Math.ceil(h) + pad * 2 + 2
    ensure(S, doc, rh)
    x = ML
    doc.rect(ML, S.y, CW, rh).fill(C.zebra)
    row.forEach((c, i) => {
      doc.fillColor(C.ink).text(clean(c) || '—', x + pad, S.y + pad, { width: cws[i] - pad * 2, ellipsis: true })
      x += cws[i]
    })
    doc.strokeColor(C.line).lineWidth(0.5).moveTo(ML, S.y + rh).lineTo(ML + CW, S.y + rh).stroke()
    S.y += rh
  }
}

function licenseShort(report) {
  const lt = report.license?.scaleTrigger
  if (lt && !/none/i.test(lt)) return lt
  if (report.license?.permitsCommercial === true) return 'Commercial use permitted'
  if (report.license?.permitsCommercial === false) return 'Commercial use restricted'
  return report.gradeLabel || 'Not available'
}

function sectionHeader(doc, S, num, title) {
  const CW = doc.page.width - ML - MR
  ensure(S, doc, 40)
  const chipW = 24
  doc.rect(ML, S.y, chipW, 24).fill(C.burnt)
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(11).text(String(num).padStart(2, '0'), ML + 5, S.y + 6)
  doc.fillColor(C.ink).font('Helvetica-Bold').fontSize(13).text(clean(title), ML + chipW + 10, S.y + 4, { width: CW - chipW - 10 })
  S.y = doc.y + 3
  doc.rect(ML, S.y, CW, 0.75).fill(C.line)
  S.y += 12
}

function statGrid(doc, S, items) {
  const CW = doc.page.width - ML - MR
  const cols = 3
  const gap = 8
  const cw = (CW - gap * (cols - 1)) / cols
  const ch = 52
  const rows = Math.ceil(items.length / cols)
  ensure(S, doc, rows * (ch + gap) + 6)
  for (let i = 0; i < items.length; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = ML + c * (cw + gap)
    const y = S.y + r * (ch + gap)
    doc.roundedRect(x, y, cw, ch, 3).fillAndStroke(C.paper, C.line)
    doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(6.8).text(clean(items[i].label).toUpperCase(), x + 8, y + 8, { width: cw - 16 })
    doc.fillColor(C.ink).font('Helvetica-Bold').fontSize(10).text(clean(items[i].value) || 'Not available', x + 8, y + 22, { width: cw - 16, lineGap: 1 })
  }
  S.y += rows * (ch + gap) + 8
}

function srcList(doc, S, list) {
  const items = list || []
  if (!items.length) { P(doc, S, 'No external sources were captured for this report.'); return }
  items.forEach((s, i) => {
    ensure(S, doc, 16)
    const tier = s.tier || 'P2'
    doc.font('Helvetica-Bold').fontSize(8)
    doc.fillColor(tierColor(tier)).text(`[${tier}] `, ML, S.y)
    const tw = doc.widthOfString(`[${tier}] `)
    const line = `${i + 1}.  ${clean(s.title) || 'Untitled'}${s.url ? '  ' + clean(s.url) : ''}${s.date ? '  ·  ' + clean(s.date) : ''}`
    doc.fillColor(C.ink).font('Helvetica').fontSize(8).text(line, ML + tw, S.y, { width: doc.page.width - ML - MR - tw, lineGap: 2 })
    S.y = doc.y + 4
  })
}

function finalizePages(doc) {
  const range = doc.bufferedPageRange()
  const CW = doc.page.width - ML - MR
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i)
    const fy = doc.page.height - 32
    doc.strokeColor(C.line).lineWidth(0.5).moveTo(ML, fy).lineTo(ML + CW, fy).stroke()
    doc.fillColor(C.faint).font('Helvetica').fontSize(7)
    doc.text('DIT · OpenModel Synthesis Framework (OMSF) · confidential advisory', ML, fy + 5, { width: CW * 0.66 })
    doc.text(`Page ${i + 1} of ${range.count}`, ML + CW * 0.66, fy + 5, { width: CW * 0.34, align: 'right' })
  }
}

function cover(doc, S, report) {
  const CW = doc.page.width - ML - MR
  ensure(S, doc, 40)
  doc.fillColor(C.burnt).font('Helvetica-Bold').fontSize(8).text('OPEN-SOURCE MODEL ASSESSMENT', ML, S.y, { characterSpacing: 1 })
  S.y += 17
  const title = clean(report.model) + (report.version && report.version !== 'family' ? ` ${clean(report.version)}` : '')
  const titleW = CW - 150
  doc.fillColor(C.ink).font('Helvetica-Bold').fontSize(24).text(title, ML, S.y, { width: titleW })
  const titleBottom = doc.y
  // Openness ladder graphic (right of title)
  const lw = 120
  const lh = 72
  const lx = doc.page.width - MR - lw
  ladder(doc, lx, S.y, lw, lh, report.grade)
  doc.fillColor(rungColor(report.grade)).font('Helvetica-Bold').fontSize(8).text(`${report.grade} · ${clean(report.gradeLabel)}`, lx, S.y + lh + 4, { width: lw, align: 'center' })
  S.y = Math.max(titleBottom, S.y + lh + 18)

  ensure(S, doc, 20)
  doc.fillColor(C.faint).font('Helvetica').fontSize(9).text(
    `${clean(report.publisher) || '—'}   ·   Released ${clean(report.releaseDate) || '—'}   ·   Prepared for ${audienceLabel(report.audience)}   ·   Report date ${clean(report.reportDate) || '—'}`,
    ML, S.y, { width: CW },
  )
  S.y = doc.y + 12
  doc.rect(ML, S.y, CW, 1).fill(C.line)
  S.y += 14

  subhead(doc, S, 'Executive summary')
  const rec = report.frames?.[report.audience]?.recommendation || 'not assessed'
  const recPill = String(rec).split('(')[0].trim()
  const art = /^[aeiou]/i.test(audienceLabel(report.audience)) ? 'an' : 'a'
  const execText = `${clean(report.ladderVerdict?.justification) || 'No ladder verdict provided.'}  For ${art} ${audienceLabel(report.audience).toLowerCase()} reader, DIT recommends: ${clean(rec)}.`
  P(doc, S, execText)

  // Traffic-light recommendation pill (prepared audience)
  doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(8).text('OUR RECOMMENDATION', ML, S.y)
  S.y += 13
  pill(doc, ML, S.y, recPill, recColor(rec), 210)
  S.y += 26

  // Compact verdict scorecard (verdict-level only - raw specs live in the body)
  statGrid(doc, S, [
    { label: 'Openness grade', value: `${report.grade || '—'} · ${clean(report.gradeLabel) || '—'}` },
    { label: 'License posture', value: licenseShort(report) },
  ])

  // Decision at a glance: all three audiences
  subhead(doc, S, 'Decision at a glance')
  const frames = [['Private', 'private'], ['Enterprise', 'enterprise'], ['Non-profit', 'nonprofit']]
  const cardW = (CW - 16) / 3
  frames.forEach(([lbl, key], i) => {
    const f = report.frames?.[key] || {}
    const x = ML + i * (cardW + 8)
    const y = S.y
    doc.roundedRect(x, y, cardW, 42, 3).fillAndStroke(C.paper, C.line)
    doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(7).text(lbl.toUpperCase(), x + 8, y + 7)
    pill(doc, x + 8, y + 18, String(f.recommendation || '—').split('(')[0].trim(), recColor(f.recommendation), cardW - 16)
  })
  S.y += 50
}

function drawBody(S, doc, report) {
  sectionHeader(doc, S, 1, 'Openness Ladder verdict')
  P(doc, S, `${report.grade || '—'} · ${clean(report.gradeLabel) || ''}`)
  P(doc, S, report.ladderVerdict?.justification)
  if (report.ladderVerdict?.source?.url) {
    sub(doc, S, 'Primary source')
    srcLine(doc, S, { tier: 'P1', title: report.ladderVerdict.source.title, url: report.ladderVerdict.source.url, date: report.ladderVerdict.source.date })
  }

  sectionHeader(doc, S, 2, 'License summary')
  bullets(doc, S, 'You are allowed to', report.license?.allowed)
  bullets(doc, S, 'You are not allowed to', report.license?.notAllowed)
  field(doc, S, 'Commercial use', report.license?.commercialNote)
  field(doc, S, 'Scale / commercial trigger', report.license?.scaleTrigger)

  sectionHeader(doc, S, 3, 'Deployment and technical profile')
  field(doc, S, 'Minimum hardware', report.deployment?.minHardware)
  field(doc, S, 'Runs fully offline', report.deployment?.offlineCapable)
  field(doc, S, 'Throughput (P2)', report.deployment?.throughput)
  field(doc, S, 'Deployment verdict', report.deployment?.verdict)
  sub(doc, S, 'Technical detail')
  field(doc, S, 'Context length', report.technical?.contextLength)
  field(doc, S, 'Parameters', report.technical?.parameters)
  field(doc, S, 'Distribution formats', (report.technical?.formats || []).join(', '))
  field(doc, S, 'Precision', report.technical?.precision)
  field(doc, S, 'Quantization impact on VRAM', report.technical?.quantizationImpact)
  field(doc, S, 'Tokens / sec (P2)', report.technical?.tokensPerSec)
  field(doc, S, 'Minimum VRAM', report.technical?.minVramGb)
  if (report.series?.length) {
    sub(doc, S, 'VRAM by variant (min, quantized)')
    const chartItems = report.series
      .map((s) => { const m = String(s.minVramGb || '').match(/[\d.]+/); return { label: clean(s.name), value: m ? parseFloat(m[0]) : 0, note: clean(s.minVramGb) } })
      .filter((i) => i.value > 0)
    if (chartItems.length) barChart(doc, S, chartItems)
    sub(doc, S, 'Model series')
    table(doc, S, ['Variant', 'Parameters', 'Min VRAM', 'Quant options', 'Notes'],
      report.series.map((s) => [s.name, s.params, s.minVramGb, s.quantOptions, s.notes]),
      [1.1, 1, 0.9, 1.1, 1.6])
  }

  sectionHeader(doc, S, 4, 'Decision frames')
  for (const [lbl, key] of [['Private / individual', 'private'], ['Enterprise', 'enterprise'], ['Non-profit / public', 'nonprofit']]) {
    const f = report.frames?.[key] || {}
    ensure(S, doc, 56)
    const cardH = 50
    const cw = doc.page.width - ML - MR
    doc.roundedRect(ML, S.y, cw, cardH, 3).fillAndStroke(C.paper, C.line)
    doc.fillColor(C.faint).font('Helvetica-Bold').fontSize(8).text(lbl.toUpperCase(), ML + 10, S.y + 8)
    doc.fillColor(C.ink).font('Helvetica').fontSize(8.5).text(clean(f.text) || '—', ML + 10, S.y + 22, { width: cw - 180, lineGap: 1 })
    pill(doc, doc.page.width - MR - 150, S.y + 17, String(f.recommendation || '—').split('(')[0].trim(), recColor(f.recommendation), 140)
    S.y += cardH + 8
  }

  sectionHeader(doc, S, 5, 'Where sources disagree')
  P(doc, S, report.disagreements)

  sectionHeader(doc, S, 6, 'Sources and attribution')
  P(doc, S, 'This report was synthesized with the DIT OpenModel Synthesis Framework (OMSF), a practical, buyer-side adaptation of the Model Openness Framework (LF AI and Data Foundation, 2024; arXiv:2403.13784) and the OSI Open Source AI Definition. Figures are sourced from the web at report date and reflect publicly available information only.')
  srcList(doc, S, report.sources)
}

function pipePdf(doc, file) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(file)
    doc.pipe(ws)
    doc.end()
    ws.on('finish', resolve)
    ws.on('error', reject)
  })
}

async function generateOne(t) {
  const known = getKnownModel(t.name)
  if (known?.licenseUrl) known.licenseText = await getLicenseExcerpt(known)
  let sources = await webSearch(`${t.name} open weight AI model license weights GGUF quantization VRAM benchmarks technical specifications`)
  sources = filterVersionSources(sources, known)
  sources = classifySources(sources)
  if (known?.officialSources?.length) sources = [...known.officialSources, ...sources]
  const report = await synthesizeWithFallback(t.name, t.audience, sources, known)
  report.model = t.name
  report.audience = t.audience
  report.reportDate = new Date().toISOString().slice(0, 10)
  report.preview = false
  if (!('comparison' in report)) report.comparison = null

  const fname = `OMSF-Report-${slugify(t.name)}-${report.grade}-${t.date}`
  const { doc, S } = makeDoc()
  cover(doc, S, report)
  drawBody(S, doc, report)
  finalizePages(doc)
  await pipePdf(doc, path.join(OUT, fname + '.pdf'))
  fs.writeFileSync(path.join(OUT, fname + '.json'), JSON.stringify(report, null, 2))
  console.log(`Built ${fname}.pdf  (grade ${report.grade}, ${report.sources?.length || 0} sources)`)
  return {
    file: fname + '.pdf',
    model: t.name,
    grade: report.grade,
    gradeLabel: report.gradeLabel,
    date: t.date,
    audience: t.audience,
    publisher: report.publisher,
  }
}

const manifest = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function generateOneWithRetry(t, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      return await generateOne(t)
    } catch (e) {
      console.error(`Attempt ${i} failed for ${t.name}: ${e.message}`)
      if (i < tries) await sleep(20000)
    }
  }
  throw new Error(`Gave up on ${t.name}`)
}

for (const t of TARGETS) {
  try {
    manifest.push(await generateOneWithRetry(t))
  } catch (e) {
    console.error(`Failed ${t.name}: ${e.message}`)
  }
  await sleep(15000) // ease Tavily / Groq rate limits between models
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`\nDone. ${manifest.length} reports in public/reports/`)
