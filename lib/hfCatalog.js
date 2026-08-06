// Shared core for the HuggingFace Hub catalog pipeline. Used by:
//   - scripts/build-hf-catalog.mjs  (one-time backfill, writes data/hf-catalog.json)
//   - netlify/functions/hfcatalog.js        (serves the latest snapshot from Blobs)
//   - netlify/functions/hfcatalog-sync.js   (scheduled delta sync into Blobs)

export const DEFAULT_MAX_MODELS = 3000
export const DEFAULT_CONFIG_LIMIT = 400
export const DEFAULT_RAW_CAP = 5000
export const DEFAULT_CTX = 4096
export const BYTES_PER_PARAM = { fp16: 2.0, q8: 1.0, q4km: 0.56 }
export const BLOB_STORE = 'hfcatalog'
export const BLOB_KEY = 'catalog'

const UPSTREAM = 'https://huggingface.co/api/models'
const PER_MODEL = 'https://huggingface.co/api/models/{id}?full=true'
const RAW_CONFIG = 'https://huggingface.co/{id}/raw/main/config.json'
const PER_PAGE = 1000
const CONCURRENCY = 6
const RETRIES = 3
const RETRY_DELAY_MS = [1500, 4000]

const MIRROR_ORGS = new Set(['mlx-community'])
const MIRROR_RE = /(^|[-_/.])(gguf|awq|gptq|exl2|mlx|int4|int8|fp8|bf16|fp16|f16|8bit|4bit|quant|quantized|imatrix|bundle|bnb|dynamic)([-_/.]|$)/i
const TEST_RE = /(^|[-_/.])(test|tests|testing|ci|dummy|fixture|sandbox|scratch|playground|staging)([-_/.]|$)|^hf-(internal-)?(test|trial)/i

const MODALITY = {
  'text-generation': 'text', 'text2text-generation': 'text', 'fill-mask': 'text',
  'text-classification': 'text', 'token-classification': 'text',
  'question-answering': 'text', 'summarization': 'text', 'translation': 'text',
  'text-to-text': 'text', 'sentence-similarity': 'text', 'feature-extraction': 'text',
  'zero-shot-classification': 'text', 'conversational': 'text',
  'table-question-answering': 'text',
  'image-classification': 'image', 'image-segmentation': 'image',
  'object-detection': 'image', 'image-to-image': 'image', 'text-to-image': 'image',
  'depth-estimation': 'image', 'image-feature-extraction': 'image',
  'zero-shot-image-classification': 'image',
  'audio-classification': 'audio', 'text-to-speech': 'audio',
  'text-to-audio': 'audio', 'automatic-speech-recognition': 'audio',
  'audio-to-audio': 'audio', 'voice-activity-detection': 'audio',
  'image-to-text': 'multimodal', 'image-text-to-text': 'multimodal',
  'video-text-to-text': 'multimodal', 'visual-question-answering': 'multimodal',
  'document-question-answering': 'multimodal',
  'text-to-video': 'video', 'image-to-video': 'video', 'video-to-text': 'video',
  'video-classification': 'video', 'text-to-3d': '3d', '3d-to-text': '3d',
  'graph-ml': 'other',
}

const FAMILIES = [
  [/gpt-oss/i, 'GPT-OSS'],
  [/qwen/i, 'Qwen'],
  [/llama/i, 'Llama'],
  [/mistral|mixtral/i, 'Mistral'],
  [/gemma/i, 'Gemma'],
  [/deepseek/i, 'DeepSeek'],
  [/phi-/i, 'Phi'],
  [/smollm/i, 'SmolLM'],
  [/olmo/i, 'OLMo'],
  [/granite/i, 'Granite'],
  [/glm/i, 'GLM'],
  [/internlm/i, 'InternLM'],
  [/falcon/i, 'Falcon'],
  [/minimax/i, 'MiniMax'],
  [/kimi|moonshot/i, 'Moonshot'],
  [/command-r|cohere/i, 'Cohere'],
  [/mamba|ssm/i, 'Mamba'],
  [/whisper/i, 'Whisper'],
  [/stable-diffusion|sdxl|flux|pixart|kolors/i, 'Diffusion'],
  [/vit|clip|siglip|dino/i, 'Vision (ViT/CLIP)'],
  [/t5|flan-t5|mt5/i, 'T5'],
  [/bert|roberta|albert|deberta|electra|distilbert|xlm|squeezebert|mobilebert/i, 'BERT-family'],
  [/gpt2|gpt-2/i, 'GPT-2'],
]

export function isExcluded(id) {
  if (MIRROR_ORGS.has(id.split('/')[0])) return 'mirror-org'
  const name = id.includes('/') ? id.split('/').slice(1).join('/') : id
  if (MIRROR_RE.test(name)) return 'quant-mirror'
  if (TEST_RE.test(id)) return 'test-fixture'
  return null
}

export function modalityOf(pipelineTag) {
  return MODALITY[pipelineTag] || 'other'
}

export function familyOf(id) {
  const name = id.includes('/') ? id.split('/').slice(1).join('/') : id
  for (const [re, label] of FAMILIES) if (re.test(name)) return label
  return 'Other'
}

export function paramsFromSafetensors(sf) {
  const p = sf?.parameters
  if (!p) return null
  let total = 0
  for (const v of Object.values(p)) {
    const n = Number(v)
    if (!Number.isFinite(n) || n <= 0) return null
    total += n
  }
  return total > 0 ? total : null
}

export function paramsFromConfig(c) {
  if (c.n_params) return c.n_params
  if (c.num_local_experts && Number(c.num_local_experts) > 1) return null
  const vocab = c.vocab_size, hidden = c.hidden_size
  const layers = c.num_hidden_layers, inter = c.intermediate_size
  const heads = c.num_attention_heads, kv = c.num_key_value_heads || heads
  if (!vocab || !hidden || !layers || !inter || !heads || !Number.isFinite(heads)) return null
  const headDim = hidden / heads
  const attention = 2 * hidden * hidden + kv * headDim * hidden
  const mlp = 3 * hidden * inter
  return vocab * hidden + layers * (mlp + attention)
}

export function kvCacheGb(cfg) {
  if (!cfg || !cfg.numHiddenLayers || !cfg.hiddenSize || !cfg.numAttentionHeads) return null
  const headDim = cfg.hiddenSize / cfg.numAttentionHeads
  if (!Number.isFinite(headDim) || headDim <= 0) return null
  const kvHeads = cfg.numKeyValueHeads || cfg.numAttentionHeads
  return (2 * 2 * cfg.numHiddenLayers * kvHeads * headDim * DEFAULT_CTX) / 1e9
}

export function vramGb(params, kvGb, bytesPerParam) {
  if (!params) return null
  const weightsGb = (params * bytesPerParam) / 1e9
  return kvGb == null ? weightsGb : weightsGb + kvGb
}

async function fetchWithRetry(url) {
  const headers = { Accept: 'application/json' }
  const token = process.env.HF_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers })
      if (res.status === 429 && attempt < RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS[attempt]))
        continue
      }
      if (!res.ok) return { error: 'HTTP ' + res.status }
      return { json: await res.json(), headers: res.headers }
    } catch (e) {
      if (attempt < RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS[attempt]))
        continue
      }
      return { error: e.message }
    }
  }
  return { error: 'retries exhausted' }
}

export async function fetchPages(rawCap = DEFAULT_RAW_CAP) {
  const raw = []
  const seen = new Set()
  let url = `${UPSTREAM}?limit=${PER_PAGE}&sort=downloads&direction=-1&full=true`
  while (raw.length < rawCap && url) {
    const { json, headers: hdrs, error } = await fetchWithRetry(url)
    if (error) throw new Error(`page fetch failed: ${error}`)
    if (!Array.isArray(json) || json.length === 0) break
    for (const m of json) {
      if (!m?.id || seen.has(m.id)) continue
      seen.add(m.id)
      raw.push(m)
    }
    const link = hdrs?.get?.('link') || ''
    const next = link.match(/<([^>]+)>;\s*rel="next"/)
    url = next ? next[1] : null
    if (!url) break
  }
  raw.sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0))
  return raw
}

export async function fetchEnrich(id) {
  const [modelRes, configRes] = await Promise.all([
    fetchWithRetry(PER_MODEL.replace('{id}', id)),
    fetchWithRetry(RAW_CONFIG.replace('{id}', id)),
  ])

  const json = modelRes.json
  if (!json || modelRes.error) {
    const reason = String(modelRes.error || '').includes('403') ? 'gated' : 'fetch-failed'
    return { source: 'fallback', reason }
  }

  const params = paramsFromSafetensors(json.safetensors)
  const license = json.cardData?.license || null
  const licenseName = json.cardData?.license_name || null

  const c = configRes.json
  if (configRes.error) {
    const reason = String(configRes.error).includes('404') ? 'no-config-file' : String(configRes.error).includes('403') ? 'gated' : 'fetch-failed'
    return { source: 'fallback', reason, params, license, licenseName }
  }
  if (!c || typeof c !== 'object') {
    return { source: 'fallback', reason: 'no-config-file', params, license, licenseName }
  }

  const cfg = {
    source: 'config',
    params: params ?? paramsFromConfig(c),
    numHiddenLayers: c.num_hidden_layers ?? null,
    hiddenSize: c.hidden_size ?? null,
    numAttentionHeads: c.num_attention_heads ?? null,
    numKeyValueHeads: c.num_key_value_heads ?? null,
    headDim: c.hidden_size && c.num_attention_heads ? c.hidden_size / c.num_attention_heads : null,
    maxPositionEmbeddings: c.max_position_embeddings ?? null,
    contextUsed: DEFAULT_CTX,
    kvHeadsKnown: Boolean(c.num_key_value_heads),
    modelType: c.model_type ?? null,
    architectures: Array.isArray(c.architectures) ? c.architectures : null,
    torchDtype: c.torch_dtype ?? null,
  }

  if (!cfg.numHiddenLayers || !cfg.hiddenSize || !cfg.numAttentionHeads) {
    return { source: 'fallback', reason: 'no-architecture-fields', partial: cfg, params, license, licenseName }
  }
  return { source: 'config', params, license, licenseName, config: cfg }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  const worker = async () => {
    while (true) {
      const idx = i++
      if (idx >= items.length) return
      out[idx] = await fn(items[idx])
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return out
}

export async function pullCatalog({ maxModels = DEFAULT_MAX_MODELS, configLimit = DEFAULT_CONFIG_LIMIT, rawCap = DEFAULT_RAW_CAP } = {}) {
  const raw = await fetchPages(rawCap)
  const excluded = { 'mirror-org': 0, 'quant-mirror': 0, 'test-fixture': 0 }
  const kept = []
  for (const m of raw) {
    const reason = isExcluded(m.id || '')
    if (reason) { excluded[reason]++; continue }
    kept.push(m)
    if (kept.length >= maxModels) break
  }

  kept.sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0))
  const top = kept.slice(0, configLimit)
  const enriched = await mapLimit(top, CONCURRENCY, (m) => fetchEnrich(m.id))

  const models = kept.map((m, idx) => {
    const tags = m.tags || []
    const licenseTag = tags.find((t) => t.startsWith('license:'))
    const en = idx < top.length ? enriched[idx] : null
    const cfg = en?.source === 'config' ? en.config : en?.partial || null
    const params = en?.params ?? cfg?.params ?? null
    const paramsQuality = en?.params ? 'safetensors' : cfg?.params ? 'config-estimate' : 'missing'
    const license = en?.license || m.cardData?.license || licenseTag?.replace(/^license:/, '') || ''
    const structured = Boolean(en?.license || m.cardData?.license)
    const kv = kvCacheGb(cfg)
    const vram = params ? {
      kvCacheGb: kv,
      weightsOnly: kv == null,
      fp16: vramGb(params, kv, BYTES_PER_PARAM.fp16),
      q8: vramGb(params, kv, BYTES_PER_PARAM.q8),
      q4km: vramGb(params, kv, BYTES_PER_PARAM.q4km),
    } : null

    return {
      id: m.id,
      author: m.id.split('/')[0],
      name: m.id.split('/').slice(1).join('/'),
      pipelineTag: m.pipeline_tag || null,
      modality: modalityOf(m.pipeline_tag),
      library: m.library_name || null,
      archFamily: familyOf(m.id),
      license,
      licenseStructured: structured,
      gated: m.gated === 'false' || m.gated === false ? false : m.gated || false,
      private: Boolean(m.private),
      likes: m.likes ?? 0,
      downloads: m.downloads ?? 0,
      trendingScore: m.trendingScore ?? null,
      createdAt: m.createdAt || m.created_at || null,
      lastModified: m.lastModified || null,
      params,
      paramsQuality,
      config: cfg
        ? {
            source: en?.source === 'config' ? 'config' : 'partial',
            numHiddenLayers: cfg.numHiddenLayers,
            hiddenSize: cfg.hiddenSize,
            numAttentionHeads: cfg.numAttentionHeads,
            numKeyValueHeads: cfg.numKeyValueHeads,
            headDim: cfg.headDim,
            maxPositionEmbeddings: cfg.maxPositionEmbeddings,
            contextUsed: cfg.contextUsed ?? null,
            kvHeadsKnown: Boolean(cfg.kvHeadsKnown),
            modelType: cfg.modelType,
            architectures: cfg.architectures,
            torchDtype: cfg.torchDtype,
          }
        : null,
      configFallback: en?.source === 'fallback' ? { reason: en.reason } : null,
      vram,
      tags: tags.filter((t) => !t.startsWith('license:') && !t.startsWith('library:')).slice(0, 20),
    }
  })

  const withParams = models.filter((m) => m.params).length
  const cfgOk = models.filter((m) => m.config?.source === 'config').length
  const cfgFallback = models.filter((m) => m.configFallback).length
  const reasons = {}
  for (const m of models) {
    if (!m.configFallback) continue
    reasons[m.configFallback.reason] = (reasons[m.configFallback.reason] || 0) + 1
  }

  const payload = {
    source: UPSTREAM,
    fetchedAt: new Date().toISOString(),
    count: models.length,
    rawPulled: raw.length,
    excluded,
    coverage: {
      withParams,
      paramsRecoveryPct: models.length ? Math.round((withParams / models.length) * 100) : 0,
      withVram: models.filter((m) => m.vram).length,
      configOk: cfgOk,
      configFallback: cfgFallback,
      fallbackReasons: reasons,
    },
    vramModel: {
      bytesPerParam: BYTES_PER_PARAM,
      kvCache: 'K+V, FP16 (2 bytes/element), default context 4096 tokens',
      note: 'Computed from safetensors parameter counts + config.json architecture; weights-only when no architecture data.',
    },
    models,
  }

  return { payload, raw: raw.length, excluded }
}

// Delta merge: fresh pull rows replace/update matching ids, new ids are added,
// stale ids are dropped when the merged catalog exceeds `cap`.
export function mergeCatalog(prev, fresh, cap = DEFAULT_MAX_MODELS) {
  const byId = new Map((prev?.models || []).map((m) => [m.id, m]))
  for (const m of fresh?.models || []) {
    const old = byId.get(m.id)
    if (!old) {
      byId.set(m.id, m)
      continue
    }
    byId.set(m.id, {
      ...old,
      ...m,
      config: m.config || old.config || null,
      configFallback: m.configFallback || old.configFallback || null,
      vram: m.vram || old.vram || null,
      params: m.params || old.params || null,
      paramsQuality: m.params ? m.paramsQuality : old.paramsQuality || 'missing',
      license: m.license || old.license || '',
      licenseStructured: m.licenseStructured || old.licenseStructured || false,
    })
  }
  const merged = [...byId.values()]
    .sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0))
    .slice(0, cap)

  const withParams = merged.filter((m) => m.params).length
  return {
    ...fresh,
    fetchedAt: fresh.fetchedAt,
    count: merged.length,
    rawPulled: fresh.rawPulled,
    excluded: fresh.excluded,
    coverage: {
      withParams,
      paramsRecoveryPct: merged.length ? Math.round((withParams / merged.length) * 100) : 0,
      withVram: merged.filter((m) => m.vram).length,
      configOk: merged.filter((m) => m.config?.source === 'config').length,
      configFallback: merged.filter((m) => m.configFallback).length,
      fallbackReasons: fresh.coverage?.fallbackReasons || {},
    },
    merged: true,
    mergedAt: new Date().toISOString(),
    models: merged,
  }
}
