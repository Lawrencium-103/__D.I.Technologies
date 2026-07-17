// Client-side preview data for the Report Builder.
// Used only when the live backend is not configured (no API keys).
// Mirrors the OMSF Model Report template (sections 1-8), with a hardened
// technical block: GGUF/quant->VRAM, precision, tok/s, and per-series detail.

const KNOWN = {
  'llama 4': {
    version: 'Scout / Maverick',
    publisher: 'Meta',
    releaseDate: '2025',
    grade: 'L1',
    gradeLabel: 'Open weights, restricted',
    ladderVerdict: {
      rung: 'L1',
      justification:
        'Weights are downloadable but governed by the Llama 4 Community License, which caps commercial use above a monthly-active-user threshold (about 700M MAU). That custom license places it below permissive open source.',
      source: { title: 'Llama 4 Community License', url: 'https://www.llama.com/license/', date: '2025' },
    },
    license: {
      allowed: ['Self-host', 'Fine-tune', 'Use commercially below the MAU threshold', 'Redistribute within license terms'],
      notAllowed: ['Use above the MAU cap without Meta’s agreement', 'Remove license and attribution notices'],
      scaleTrigger: 'Monthly-active-user threshold near 700M; above it a separate agreement is required',
      commercialNote: 'Commercial use is permitted; a separate Meta license is required only above ~700M monthly active users.',
    },
    deployment: {
      minHardware: 'Quantized variants run on a single modern GPU; full variants need multi-GPU',
      offlineCapable: 'Yes, once weights are downloaded',
      throughput: 'P2: Scout (109B MoE, 11B active) needs substantial VRAM; conditions vary by size',
      verdict: 'Needs a small server for full size; smaller variants run on a single GPU',
    },
    technical: {
      contextLength: 'Up to 10M tokens (Scout)',
      parameters: 'Scout 109B total / 11B active (MoE); Maverick larger',
      formats: ['GGUF (community-quantized)', 'Safetensors (official)'],
      precision: 'BF16 official; INT4 GGUF for local',
      quantizationImpact: 'Full BF16 needs multi-GPU; Q4_K_M fits a single 80GB+ GPU; smaller quants run on 24-48GB consumer cards',
      tokensPerSec: 'Not available (P2; depends on hardware and quant)',
      minVramGb: 'Scout Q4 ~24GB on a single GPU; full precision needs multi-GPU',
    },
    series: [
      { name: 'Scout (109B MoE)', params: '109B / 11B active', minVramGb: '~24GB (Q4)', quantOptions: 'Q4_K_M, Q5', notes: '10M context window' },
      { name: 'Maverick', params: '400B-class MoE', minVramGb: 'Not available', quantOptions: 'Not available', notes: 'Larger variant; Behemoth referenced only' },
    ],
    frames: {
      private: { text: 'Usable at home below the threshold; read the MAU cap.', recommendation: 'adopt with caution' },
      enterprise: { text: 'Strong capability, but legal must clear the MAU threshold before scale.', recommendation: 'adopt with caution' },
      nonprofit: { text: 'Good for research and below-threshold outreach.', recommendation: 'adopt' },
    },
    disagreements:
      'Community debate continues on whether the Community License meets the OSI Open Source AI Definition. We grade it L1, not open source.',
    sources: [{ title: 'Llama 4 Community License', url: 'https://www.llama.com/license/', tier: 'P1', date: '2025' }],
  },
  'qwen3': {
    version: 'Various (0.6B to 235B)',
    publisher: 'Alibaba (Qwen Team)',
    releaseDate: '2025',
    grade: 'L2',
    gradeLabel: 'Open weights, permissive',
    ladderVerdict: {
      rung: 'L2',
      justification:
        'Released under Apache 2.0 with no monthly-active-user threshold, so commercial use is allowed with attribution. That is a permissive open-source license.',
      source: { title: 'Qwen3 license (Apache 2.0)', url: 'https://huggingface.co/Qwen', date: '2025' },
    },
    license: {
      allowed: ['Self-host', 'Fine-tune', 'Redistribute', 'Commercial use with attribution'],
      notAllowed: ['Remove the Apache 2.0 notice on redistributed code'],
      scaleTrigger: 'None',
      commercialNote: 'Apache 2.0 permits commercial use with attribution; no user-count threshold.',
    },
    deployment: {
      minHardware: 'Quantized 8B runs on consumer GPUs; larger needs more VRAM',
      offlineCapable: 'Yes, once downloaded',
      throughput: 'P2: 8B Q4 runs several tokens/sec on a consumer GPU',
      verdict: 'Runs on a single consumer GPU',
    },
    technical: {
      contextLength: 'Up to 128K tokens',
      parameters: '0.6B to 235B (dense and MoE)',
      formats: ['GGUF', 'Safetensors'],
      precision: 'BF16 official; INT4 / INT8 GGUF',
      quantizationImpact: '32B BF16 ~64GB -> Q4_K_M ~20GB; 8B Q4 ~5GB on a single consumer GPU',
      tokensPerSec: '8B Q4 on a consumer GPU: several tokens/sec (P2, varies by card)',
      minVramGb: '8B Q4 ~5GB; 32B Q4 ~20GB',
    },
    series: [
      { name: '0.6B', params: '0.6B', minVramGb: '~1GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Edge and mobile' },
      { name: '8B', params: '8B', minVramGb: '~5GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Consumer GPU' },
      { name: '32B', params: '32B', minVramGb: '~20GB (Q4)', quantOptions: 'Q4 / Q6 / Q8', notes: 'Single 24GB GPU' },
      { name: '235B (MoE)', params: '235B / smaller active', minVramGb: 'Not available', quantOptions: 'Not available', notes: 'Largest in family' },
    ],
    frames: {
      private: { text: 'Fully usable privately, no threshold.', recommendation: 'adopt' },
      enterprise: { text: 'Commercial use allowed; clean for products.', recommendation: 'adopt' },
      nonprofit: { text: 'Free to deploy at scale; strong multilingual coverage.', recommendation: 'adopt' },
    },
    disagreements: 'Minor disagreement on MoE vs dense sizing for some variants; no license conflict.',
    sources: [{ title: 'Qwen3 on Hugging Face (Apache 2.0)', url: 'https://huggingface.co/Qwen', tier: 'P1', date: '2025' }],
  },
  'deepseek v3': {
    version: 'V3 / R1',
    publisher: 'DeepSeek',
    releaseDate: '2025',
    grade: 'L2',
    gradeLabel: 'Open weights, permissive',
    ladderVerdict: {
      rung: 'L2',
      justification:
        'Released under the MIT license, which permits commercial use with minimal conditions (keep the copyright notice). That is permissive open source.',
      source: { title: 'DeepSeek license (MIT)', url: 'https://huggingface.co/deepseek-ai', date: '2025' },
    },
    license: {
      allowed: ['Self-host', 'Fine-tune', 'Redistribute', 'Commercial use'],
      notAllowed: ['Remove the MIT copyright notice'],
      scaleTrigger: 'None',
      commercialNote: 'MIT permits commercial use with the copyright notice retained; no threshold.',
    },
    deployment: {
      minHardware: 'Full model needs many GPUs; Q4 quantization fits a single high-VRAM card',
      offlineCapable: 'Yes, once downloaded',
      throughput: 'P2: quantized 8B-class runs on consumer GPUs; full V3 needs cluster-class hardware',
      verdict: 'Quantized runs on a single GPU; full model needs a server',
    },
    technical: {
      contextLength: '128K tokens',
      parameters: '671B total / 37B active (MoE); R1 reasoning variant',
      formats: ['GGUF', 'Safetensors'],
      precision: 'BF16 official; INT4 / INT8 GGUF',
      quantizationImpact: 'Full BF16 needs many GPUs; Q4 fits a single high-VRAM card (full ~hundreds of GB vs ~80GB quantized)',
      tokensPerSec: 'Not available (P2; depends on cluster)',
      minVramGb: 'Quantized on a single high-VRAM GPU; full needs a cluster',
    },
    series: [
      { name: 'V3 (671B MoE)', params: '671B / 37B active', minVramGb: 'Not available', quantOptions: 'Q4 / Q8', notes: 'Cluster-class' },
      { name: 'R1', params: '671B / 37B active (reasoning)', minVramGb: 'Not available', quantOptions: 'Q4 / Q8', notes: 'Reasoning variant' },
    ],
    frames: {
      private: { text: 'Excellent private use; R1 adds reasoning.', recommendation: 'adopt' },
      enterprise: { text: 'MIT allows commercial products.', recommendation: 'adopt' },
      nonprofit: { text: 'Free to deploy at scale.', recommendation: 'adopt' },
    },
    disagreements: 'Some regions add export or customs caveats; verify local rules. Headline benchmark claims differ across labs.',
    sources: [{ title: 'DeepSeek on Hugging Face (MIT)', url: 'https://huggingface.co/deepseek-ai', tier: 'P1', date: '2025' }],
  },
  'gemma 3': {
    version: 'Various (1B to 27B)',
    publisher: 'Google',
    releaseDate: '2025',
    grade: 'L1',
    gradeLabel: 'Open weights, restricted',
    ladderVerdict: {
      rung: 'L1',
      justification:
        'Weights are open but under the Gemma Terms of Use, which restrict use on services above a user threshold. Not an OSI-approved license.',
      source: { title: 'Gemma Terms of Use', url: 'https://ai.google.dev/gemma/terms', date: '2025' },
    },
    license: {
      allowed: ['Self-host', 'Fine-tune', 'Use commercially below the threshold'],
      notAllowed: ['Use above the Gemma Terms user threshold without Google’s permission'],
      scaleTrigger: 'Use on services above a user threshold is restricted',
      commercialNote: 'Commercial use is permitted under the Gemma Terms; above ~1M monthly users a Google license is required.',
    },
    deployment: {
      minHardware: 'Small sizes run on consumer hardware',
      offlineCapable: 'Yes, once downloaded',
      throughput: 'P2: strong small-model performance',
      verdict: 'Runs on a single consumer GPU for smaller sizes',
    },
    technical: {
      contextLength: '128K tokens',
      parameters: '1B to 27B',
      formats: ['GGUF', 'Safetensors'],
      precision: 'BF16 official; INT4 GGUF',
      quantizationImpact: '27B BF16 ~54GB -> Q4 ~15GB; 4B Q4 ~3GB',
      tokensPerSec: 'Small models: tens of tokens/sec on a consumer GPU (P2)',
      minVramGb: '4B Q4 ~3GB; 27B Q4 ~15GB',
    },
    series: [
      { name: '1B', params: '1B', minVramGb: '~1GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Edge' },
      { name: '4B', params: '4B', minVramGb: '~3GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Consumer' },
      { name: '12B', params: '12B', minVramGb: '~8GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Consumer' },
      { name: '27B', params: '27B', minVramGb: '~15GB (Q4)', quantOptions: 'Q4 / Q8', notes: 'Single 16-24GB GPU' },
    ],
    frames: {
      private: { text: 'Usable privately below threshold.', recommendation: 'adopt with caution' },
      enterprise: { text: 'Legal must review the Terms threshold before scale.', recommendation: 'adopt with caution' },
      nonprofit: { text: 'Good for research and below-threshold use.', recommendation: 'adopt' },
    },
    disagreements: 'Community notes the Terms threshold is less explicit than Llama’s; treat as restricted until confirmed.',
    sources: [{ title: 'Gemma Terms of Use', url: 'https://ai.google.dev/gemma/terms', tier: 'P1', date: '2025' }],
  },
}

export function getMockReport(model, audience) {
  const key = model.trim().toLowerCase()
  const match = KNOWN[key] || KNOWN[Object.keys(KNOWN).find((k) => key.includes(k))]
  const base = match || {
    version: '',
    publisher: 'Unknown in preview',
    releaseDate: 'Unknown',
    grade: 'L1',
    gradeLabel: 'Open weights, restricted',
    ladderVerdict: {
      rung: 'L1',
      justification: 'Preview only. Configure API keys for a verified, sourced grade.',
      source: { title: 'Preview (no live data)', url: '', date: '' },
    },
    license: {
      allowed: ['Unknown in preview'],
      notAllowed: ['Unknown in preview'],
      scaleTrigger: 'Unknown in preview',
      commercialNote: 'Preview only: configure API keys for a verified commercial-use statement.',
    },
    deployment: {
      minHardware: 'Live data required',
      offlineCapable: 'Live data required',
      throughput: 'Live data required',
      verdict: 'Live data required',
    },
    technical: {
      contextLength: 'Not available',
      parameters: 'Not available',
      formats: ['Not available'],
      precision: 'Not available',
      quantizationImpact: 'Not available',
      tokensPerSec: 'Not available',
      minVramGb: 'Not available',
    },
    series: [],
    frames: {
      private: { text: 'Unknown', recommendation: 'adopt with caution' },
      enterprise: { text: 'Unknown', recommendation: 'adopt with caution' },
      nonprofit: { text: 'Unknown', recommendation: 'adopt with caution' },
    },
    disagreements: 'Preview mode contains no verified claims.',
    sources: [],
  }
  return {
    model: model.trim(),
    version: base.version,
    publisher: base.publisher,
    releaseDate: base.releaseDate,
    reportDate: new Date().toISOString().slice(0, 10),
    audience,
    grade: base.grade,
    gradeLabel: base.gradeLabel,
    preview: true,
    ladderVerdict: base.ladderVerdict,
    license: base.license,
    deployment: base.deployment,
    technical: base.technical,
    series: base.series,
    frames: base.frames,
    disagreements: base.disagreements,
    comparison: null,
    sources: base.sources,
  }
}
