// Shared OMSF backend logic: env loading, LLM provider chain, web search,
// and the report synthesis prompt. Used by both server.js and the report
// generation script so the live pipeline and the pre-built PDFs stay identical.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getKnownModel } from './modelFacts.js'

export { getKnownModel }

// Publisher / primary-source domains that earn automatic P1 tiering.
const P1_DOMAINS = [
  'huggingface.co', 'github.com', 'meta.com', 'llama.com', 'ai.meta.com',
  'qwenlm.github.io', 'ai.google.dev', 'google.com', 'mistral.ai',
  'deepseek.com', 'deepseek.ai', 'arxiv.org', 'modelscope.cn',
]
// Low-quality / SEO-farm aggregators: dropped unless they are the only source.
const LOW_QUALITY = [
  'bmdpat.com', 'promptquorum.com', 'apxml.com', 'willitrunai.com',
  'kingy.ai', 'dev.to', 'medium.com', 'substack.com',
]

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

export function classifySources(sources) {
  const list = sources || []
  const out = []
  for (const s of list) {
    const d = domainOf(s.url || '')
    if (LOW_QUALITY.includes(d) && list.length > 2) continue
    const tier = P1_DOMAINS.includes(d) ? 'P1' : s.tier || 'P2'
    out.push({ ...s, tier })
  }
  return out
}

export function filterVersionSources(sources, known) {
  if (!known?.excludeVersions?.length) return sources || []
  const ex = known.excludeVersions.map((v) => v.toLowerCase())
  return (sources || []).filter((s) => {
    const hay = `${s.title || ''} ${s.url || ''}`.toLowerCase()
    return !ex.some((v) => hay.includes(v))
  })
}

async function fetchText(url, max = 1800) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'DIT-OMSF/1.0' }, signal: AbortSignal.timeout(8000) })
    if (!r.ok) return ''
    const t = await r.text()
    const text = t
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return text.slice(0, max)
  } catch {
    return ''
  }
}

export async function getLicenseExcerpt(known) {
  if (!known?.licenseUrl) return ''
  return fetchText(known.licenseUrl, 1800)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Minimal .env loader (no external dependency)
export function loadEnv() {
  try {
    const txt = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8')
    for (const line of txt.split('\n')) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) {
        let v = m[2]
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
        process.env[m[1]] = v
      }
    }
  } catch {
    /* no .env file; rely on real env */
  }
}

export function buildProviders() {
  const list = []
  if (process.env.DIT_LLM_API_KEY) {
    list.push({
      name: 'groq',
      base: process.env.DIT_LLM_BASE_URL || 'https://api.groq.com/openai/v1',
      key: process.env.DIT_LLM_API_KEY,
      model: process.env.DIT_LLM_MODEL || 'llama-3.3-70b-versatile',
    })
  }
  const nv = [
    { k: process.env.DIT_NV1, m: process.env.DIT_NV1_MODEL || 'nvidia/nemotron-3-super-120b-a12b' },
    { k: process.env.DIT_NV2, m: process.env.DIT_NV2_MODEL || 'meta/llama-3.2-1b-instruct' },
    { k: process.env.DIT_NV3, m: process.env.DIT_NV3_MODEL || 'openai/gpt-oss-120b' },
  ]
  for (const x of nv) {
    if (x.k) list.push({ name: 'nvidia', base: 'https://integrate.api.nvidia.com/v1', key: x.k, model: x.m })
  }
  return list
}

export async function webSearch(query) {
  const key = process.env.DIT_SEARCH_API_KEY
  if (key) {
    try {
      const r = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key, query, max_results: 8, search_depth: 'advanced' }),
      })
      const j = await r.json()
      return (j.results || []).map((x) => ({ title: x.title, url: x.url, content: x.content || '' }))
    } catch {
      /* fall through to DuckDuckGo */
    }
  }
  try {
    const u = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    const r = await fetch(u, { headers: { 'User-Agent': 'DIT-ReportBuilder/1.0' } })
    const j = await r.json()
    const out = []
    if (j.AbstractText) out.push({ title: j.Heading || query, url: j.AbstractURL || '', content: j.AbstractText })
    for (const t of j.RelatedTopics || []) {
      if (t.Text) out.push({ title: t.Text.slice(0, 80), url: t.FirstURL || '', content: t.Text })
      if (t.Topics) for (const s of t.Topics) if (s.Text) out.push({ title: s.Text.slice(0, 80), url: s.FirstURL || '', content: s.Text })
    }
    return out.slice(0, 8)
  } catch {
    return []
  }
}

export function buildPrompt(model, audience, sources, known) {
  const sourceText = sources.length
    ? sources.map((s, i) => `[${i + 1}] ${s.title} (${s.url}):\n${(s.content || '').slice(0, 700)}`).join('\n\n')
    : 'No web sources were returned. State clearly that technical figures are not available.'

  const knownBlock = known
    ? `

AUTHORITATIVE FACTS (verified from the model owner's official license and model card). Treat these as ground truth and DO NOT contradict them:
- Official license: ${known.license?.name}.
- Commercial use: ${known.license?.permitsCommercial ? 'PERMITTED' : 'RESTRICTED'} - ${known.license?.commercialNote}
- License allows: ${known.license?.allowed?.join('; ')}.
- License restricts: ${known.license?.notAllowed?.join('; ')}.
- Scale / commercial trigger: ${known.license?.scaleTrigger}.
- Headline specs: ${JSON.stringify(known.technical || {})}.
- OFFICIAL LICENSE TEXT (verbatim excerpt from the publisher's license file; use THIS to write Section 2, do not infer clauses from the license name alone):
"""${known.licenseText || '(not fetched; rely on the authoritative facts above and the official source URL)'}"""
Use these exact values for license.allowed / license.notAllowed / license.scaleTrigger / license.permitsCommercial / license.commercialNote and the technical fields. If live web sources disagree with the above, keep the AUTHORITATIVE FACTS and note the discrepancy in "disagreements" instead of overwriting them.
`
    : ''

  return `You are the DIT OpenModel Synthesis Framework (OMSF). Produce a structured model report for "${model}", framed for a ${audience} audience, following the OMSF Model Report template.

Use ONLY the sources below. If a figure is not in the sources, write "Not available". Never guess VRAM, tok/s or parameter counts.
Grade openness on the OMSF Openness Ladder: L0 closed API, L1 open weights with a restricted/custom license, L2 open weights under a permissive license (Apache 2.0 / MIT), L3 open code, L4 open data, L5 fully open.

CRITICAL LICENSE RULE: Never state that commercial use is prohibited unless the actual license text explicitly prohibits it. Most open-weight licenses (Llama Community, Qwen/DeepSeek Apache or MIT, Gemma Terms) PERMIT commercial use subject to a user-count threshold. Quote the exact threshold (e.g. "above 700M monthly active users a separate Meta license is required"). Do NOT write "no commercial use without permission" for a normal enterprise.

DO NOT FABRICATE license clauses. Only list allowed / notAllowed / scaleTrigger that appear in the official license text below or the authoritative facts below. If a clause is not present in the license text, write "Not specified in the license text" rather than inventing a plausible-sounding restriction (e.g. do not invent "private modification" or "restrictive use" clauses).

VERSION DISCIPLINE: Report strictly on "${model}". If a source refers to a different version (e.g. a later .5 / .6 / .2 release), do NOT blend it into this report. Either exclude it, or if you must mention it, prefix the claim with that exact version (e.g. "DeepSeek-V3.2 ...").

DECISION FRAMES: For each frame, name the actual restrictions that matter to that audience (user-count thresholds, use-based prohibitions such as military / surveillance bans, export controls). Do not write a bare "adopt with caution" without stating the specific caution.

Return STRICT JSON with exactly these keys:
{
  "version": "specific size or variant evaluated (e.g. '32B', 'Scout'); if the whole family, write 'family'. Do not repeat the model name.",
  "publisher": "",
  "releaseDate": "",
  "grade": "L0".."L5",
  "gradeLabel": "short label for the rung",
  "ladderVerdict": { "rung": "L2", "justification": "one paragraph quoting the specific license clause that earns or caps the grade", "source": { "title": "", "url": "", "date": "" } },
  "license": { "name": "", "allowed": [""], "notAllowed": [""], "scaleTrigger": "MAU/revenue cap or 'None'", "permitsCommercial": true, "commercialNote": "one sentence on commercial-use permission and any threshold" },
  "deployment": { "minHardware": "", "offlineCapable": "Yes / No / with caveats", "throughput": "P2 sourced, state conditions", "verdict": "runs on a single consumer GPU | needs a small server | cloud-only in practice" },
  "technical": {
    "contextLength": "",
    "parameters": "total / active for MoE",
    "formats": ["GGUF","Safetensors"],
    "precision": "BF16 / FP16 / FP8 / INT4",
    "quantizationImpact": "how quantization changes VRAM, with numbers, or 'Not available'",
    "tokensPerSec": "P2 measured tok/s with conditions, or 'Not available'",
    "minVramGb": ""
  },
  "series": [ { "name": "", "params": "", "minVramGb": "", "quantOptions": "", "notes": "" } ],
  "frames": {
    "private": { "text": "", "recommendation": "adopt | adopt with caution | avoid" },
    "enterprise": { "text": "", "recommendation": "adopt | adopt with caution | avoid" },
    "nonprofit": { "text": "", "recommendation": "adopt | adopt with caution | avoid" }
  },
  "disagreements": "state conflicts; flag any claim resting on a single tertiary (P3) source as unconfirmed",
  "comparison": null,
  "sources": [ { "title": "", "url": "", "tier": "P1|P2|P3", "date": "" } ]
}

Series rule: if the model ships as a family (multiple sizes/variants), list each variant in "series" with its own VRAM and quant options. If no series info is available, return an empty array.
Technical rule: for "quantizationImpact" explain how moving from full precision (BF16/FP16) to INT4 (GGUF Q4_K_M) changes VRAM, with example sizes. For "tokensPerSec" only state measured figures with hardware conditions; otherwise "Not available".
Section 2 (ladderVerdict) must use a P1 source only (license text / model card). Section 4 throughput must be P2 with conditions. Section 6 must be honest even when inconvenient.${knownBlock}

SOURCES:
${sourceText}`
}

export function mergeKnown(report, known) {
  if (!known || !report) return report
  if (known.grade) {
    report.grade = known.grade
    report.gradeLabel = known.gradeLabel
  }
  if (known.publisher) report.publisher = known.publisher
  if (known.releaseDate) report.releaseDate = known.releaseDate
  if (known.license) {
    report.license = report.license || {}
    if (known.license.name) report.license.name = known.license.name
    if (known.license.allowed) report.license.allowed = known.license.allowed
    if (known.license.notAllowed) report.license.notAllowed = known.license.notAllowed
    if (known.license.scaleTrigger) report.license.scaleTrigger = known.license.scaleTrigger
    if (typeof known.license.permitsCommercial === 'boolean') report.license.permitsCommercial = known.license.permitsCommercial
    if (known.license.commercialNote) report.license.commercialNote = known.license.commercialNote
  }
  if (known.technical) {
    report.technical = report.technical || {}
    for (const k of ['contextLength', 'parameters', 'formats', 'precision']) {
      if (known.technical[k]) report.technical[k] = known.technical[k]
    }
    if (known.technical.series && (!Array.isArray(report.series) || report.series.length === 0)) {
      report.series = known.technical.series
    }
  }
  if (known.licenseUrl) {
    report.ladderVerdict = report.ladderVerdict || {}
    report.ladderVerdict.source = { title: `${known.license?.name || 'Official license'} (P1)`, url: known.licenseUrl, date: known.releaseDate || '' }
  }
  return report
}

function buildFrames(known) {
  const lic = known?.license || {}
  const thr = lic.scaleTrigger && !/none/i.test(String(lic.scaleTrigger))
    ? ` A separate arrangement is required above ${String(lic.scaleTrigger)
      .replace(/^Separate .* required /i, '')
      .replace(/^Google license required above /i, '')
      .replace(/\.$/, '')}.`
    : ''
  const comm = lic.permitsCommercial ? 'Commercial use is permitted.' : 'Commercial use is restricted.'
  const base = `${comm}${thr}`
  const adopt = lic.permitsCommercial ? 'adopt' : 'adopt with caution'
  return {
    private: { text: `For an individual: ${base} You may use, fine-tune and self-host the model freely.`, recommendation: adopt },
    enterprise: { text: `For an enterprise: ${base} Retain license notices and follow the Acceptable Use Policy; mind any user-count threshold.`, recommendation: lic.permitsCommercial ? 'adopt with caution' : 'avoid' },
    nonprofit: { text: `For a non-profit or public body: ${base} Treat as an individual user unless the deployment exceeds the public threshold.`, recommendation: adopt },
  }
}

function buildDeployment(known, report) {
  const series = report.series || known?.technical?.series || []
  const nums = series
    .map((s) => { const m = String(s.minVramGb || '').match(/[\d.]+/); return m ? parseFloat(m[0]) : NaN })
    .filter((n) => !isNaN(n))
  const min = nums.length ? Math.min(...nums) : null
  return {
    minHardware: min ? `Depends on quantization; ~${min} GB VRAM (smallest variant)` : 'Not available',
    offlineCapable: 'Yes',
    throughput: 'Not available (model did not return measured throughput)',
    verdict: min && min <= 24 ? 'runs on a single consumer GPU' : min && min <= 80 ? 'needs a small server' : 'cloud-only in practice',
  }
}

export function qaReport(report, known) {
  if (!report) return report
  // frames/sources under `license`. Hoist them back to the top level so the renderer
  // and live tool see a consistent shape.
  const L = report.license
  if (L && typeof L === 'object') {
    for (const key of ['deployment', 'series', 'frames', 'disagreements', 'sources', 'comparison']) {
      if (L[key] !== undefined && report[key] === undefined) report[key] = L[key]
    }
    if (L.technical) report.technical = Object.assign({}, L.technical, report.technical || {})
  }
  // Fallbacks from authoritative facts when the model omits required sections.
  if (!report.frames || !report.frames.private) report.frames = buildFrames(known)
  if (!report.deployment || !report.deployment.minHardware) {
    report.deployment = Object.assign(buildDeployment(known, report), report.deployment || {})
  }
  if (!Array.isArray(report.sources) || report.sources.length === 0) {
    report.sources = (known?.officialSources || []).map((s) => ({ ...s }))
  }
  // Contradiction: technical.minVramGb missing while the series table has VRAM.
  const t = report.technical || {}
  if ((!t.minVramGb || /not available/i.test(String(t.minVramGb))) && Array.isArray(report.series) && report.series.length) {
    const nums = report.series
      .map((s) => {
        const m = String(s.minVramGb || '').match(/[\d.]+/)
        return m ? parseFloat(m[0]) : NaN
      })
      .filter((n) => !isNaN(n))
    if (nums.length) {
      const min = Math.min(...nums)
      t.minVramGb = `~${min} GB (smallest variant; see series table)`
    }
  }
  // Contradiction: L1 (restricted) but scaleTrigger says "None".
  if (report.grade === 'L1' && report.license?.scaleTrigger && /none/i.test(report.license.scaleTrigger) && report.license?.commercialNote) {
    report.license.scaleTrigger = report.license.commercialNote
  }
  // Contradiction: min hardware blank but VRAM is known.
  const dh = report.deployment?.minHardware
  if ((!dh || /not available|not specified/i.test(String(dh))) && t.minVramGb && !/not available/i.test(String(t.minVramGb))) {
    report.deployment = report.deployment || {}
    report.deployment.minHardware = `Depends on quantization; ${t.minVramGb}`
  }
  // Re-classify the report's own source list (force P1 for publishers, drop farms).
  if (Array.isArray(report.sources)) report.sources = classifySources(report.sources)
  return report
}

export async function synthesizeWithFallback(model, audience, sources, known) {
  const providers = buildProviders()
  if (!providers.length) return null
  const prompt = buildPrompt(model, audience, sources, known)
  let lastErr
  for (const p of providers) {
    try {
      const r = await fetch(`${p.base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.key}` },
        body: JSON.stringify({
          model: p.model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are a precise JSON-only report generator. Never add commentary outside the JSON.' },
            { role: 'user', content: prompt },
          ],
        }),
      })
      if (!r.ok) {
        const t = await r.text()
        throw new Error(`HTTP ${r.status}: ${t.slice(0, 200)}`)
      }
      const j = await r.json()
      if (!j.choices || !j.choices[0]) throw new Error('LLM returned no content')
      const report = JSON.parse(j.choices[0].message.content)
      return qaReport(mergeKnown(report, known), known)
    } catch (e) {
      lastErr = e
      console.warn(`LLM provider ${p.name} failed: ${e.message}`)
    }
  }
  throw lastErr || new Error('no LLM providers available')
}
