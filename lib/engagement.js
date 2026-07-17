// Shared persistence for engagement signals: how many reports have been
// generated, and per-report "likes". Stored as a small JSON file so the
// static site and the report generator agree on a single source of truth.
//
// "generated" is seeded once from the pre-built PDF library and then bumped
// by 1 every time the live tool produces a report. Per-report likes are keyed
// by the report id (the PDF filename, e.g. OMSF-Report-llama-4-L1-2025-04-10.pdf).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const FILE = path.join(DATA_DIR, 'engagement.json')
const REPORTS_DIR = path.join(__dirname, '..', 'public', 'reports')

function seedGenerated() {
  try {
    const files = fs.readdirSync(REPORTS_DIR)
    return files.filter((f) => f.toLowerCase().endsWith('.pdf')).length || 0
  } catch {
    return 0
  }
}

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ generated: seedGenerated(), likes: {} }, null, 2))
  }
}

export function readEngagement() {
  ensure()
  try {
    const d = JSON.parse(fs.readFileSync(FILE, 'utf8'))
    if (typeof d.generated !== 'number') d.generated = seedGenerated()
    if (!d.likes || typeof d.likes !== 'object') d.likes = {}
    if (!d.pdfs || typeof d.pdfs !== 'object') d.pdfs = {}
    return d
  } catch {
    return { generated: seedGenerated(), likes: {} }
  }
}

export function writeEngagement(data) {
  ensure()
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function bumpGenerated(n = 1) {
  const d = readEngagement()
  d.generated = (d.generated || 0) + n
  writeEngagement(d)
  return d.generated
}

export function likeReport(id) {
  if (!id) return 0
  const d = readEngagement()
  d.likes = d.likes || {}
  d.likes[id] = (d.likes[id] || 0) + 1
  writeEngagement(d)
  return d.likes[id]
}

export function getStats() {
  const d = readEngagement()
  return { generated: d.generated || 0, likes: d.likes || {}, pdfs: d.pdfs || {} }
}

// ---- Per-PDF engagement (downloads + likes) for the SME toolkit PDFs ----
// Keyed by the PDF filename, e.g. "DIT_Tool-1-SME-Business-Evaluation.pdf".

function normalizePdf(file) {
  return (file || '').trim()
}

export function getPdfCounts() {
  const d = readEngagement()
  return d.pdfs || {}
}

export function recordPdfDownload(file) {
  const key = normalizePdf(file)
  if (!key) return { downloads: 0, likes: 0 }
  const d = readEngagement()
  d.pdfs = d.pdfs || {}
  d.pdfs[key] = d.pdfs[key] || { downloads: 0, likes: 0 }
  d.pdfs[key].downloads = (d.pdfs[key].downloads || 0) + 1
  writeEngagement(d)
  return { ...d.pdfs[key] }
}

export function recordPdfLike(file) {
  const key = normalizePdf(file)
  if (!key) return { downloads: 0, likes: 0 }
  const d = readEngagement()
  d.pdfs = d.pdfs || {}
  d.pdfs[key] = d.pdfs[key] || { downloads: 0, likes: 0 }
  d.pdfs[key].likes = (d.pdfs[key].likes || 0) + 1
  writeEngagement(d)
  return { ...d.pdfs[key] }
}
