// Verified, manually-checked facts for well-known open-weight models.
// These OVERRIDE the LLM's summarization for legally/c commercially sensitive
// fields (license commercial rule, headline specs) and supply authoritative P1
// sources. Keep this data tight and only include what is confidently correct;
// everything else is still filled by the LLM from the web.
//
// Sources of truth: the model owner's official license text and model card.

const KNOWN = {
  'llama 4': {
    grade: 'L1',
    gradeLabel: 'Open weights with a restricted/custom license',
    publisher: 'Meta',
    releaseDate: '2025-04-05',
    canonical: 'llama 4',
    excludeVersions: ['llama 3', 'llama 3.1', 'llama 3.2', 'llama 3.3', 'llama 4.1', 'llama 4.2'],
    licenseUrl: 'https://www.llama.com/licensing/community-license/',
    license: {
      name: 'Llama 4 Community License',
      permitsCommercial: true,
      commercialNote:
        'Commercial use is permitted. A separate license from Meta is required only if products or services based on Llama reach more than 700 million monthly active users.',
      allowed: [
        'Use, reproduce, distribute and create derivative works, including commercial products',
        'Self-host and fine-tune the weights',
      ],
      notAllowed: [
        'Use by products or organizations exceeding 700 million monthly active users without a separate Meta license',
        'Remove Meta or safety-classifier notices',
        'Use contrary to the Llama 4 Acceptable Use Policy',
      ],
      scaleTrigger: 'Separate Meta license required above 700M monthly active users',
    },
    technical: {
      contextLength: 'Scout: 10M tokens; Maverick: 1M tokens',
      parameters: 'Scout: 109B total / 17B active (MoE, 16 experts); Maverick: 400B total / 17B active (MoE, 128 experts)',
      formats: ['Safetensors', 'Meta Llama download', 'GGUF (community, e.g. Unsloth)'],
      precision: 'BF16 (full); INT4 / GGUF quantizations available',
      series: [
        { name: 'Scout', params: '109B total / 17B active (MoE, 16 experts)', minVramGb: '55 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0, 1.78-bit Unsloth', notes: 'Single H100 80GB in 4-bit' },
        { name: 'Maverick', params: '400B total / 17B active (MoE, 128 experts)', minVramGb: '200 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0', notes: 'Multi-GPU server' },
      ],
    },
    officialSources: [
      { title: 'Llama 4 official page', url: 'https://www.llama.com/', tier: 'P1' },
      { title: 'Meta blog: Introducing Llama 4', url: 'https://ai.meta.com/blog/llama-4-multimodal-intelligence/', tier: 'P1' },
      { title: 'Llama 4 Community License', url: 'https://www.llama.com/licensing/community-license/', tier: 'P1' },
      { title: 'Llama 4 on Hugging Face', url: 'https://huggingface.co/meta-llama', tier: 'P1' },
    ],
  },
  'qwen3': {
    grade: 'L2',
    gradeLabel: 'Open weights under a permissive license',
    publisher: 'Alibaba (Qwen Team)',
    releaseDate: '2025-04-29',
    canonical: 'qwen3',
    excludeVersions: ['qwen2', 'qwen2.5', 'qwen3.5', 'qwen3.6'],
    licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
    license: {
      name: 'Apache 2.0',
      permitsCommercial: true,
      commercialNote:
        'Apache 2.0 permits commercial use, modification and redistribution provided attribution and the license notice are retained.',
      allowed: ['Commercial use', 'Modification', 'Redistribution', 'Fine-tuning and derivative works'],
      notAllowed: ['Remove the Apache 2.0 license or attribution notices', 'Use the Qwen trademarks without permission'],
      scaleTrigger: 'None (Apache 2.0, no MAU or revenue threshold)',
    },
    technical: {
      contextLength: '32K tokens native (up to 128K with YaRN)',
      parameters: 'Dense 0.6B to 32B; MoE 235B-A22B (22B active)',
      formats: ['Safetensors', 'GGUF'],
      precision: 'BF16',
      series: [
        { name: 'Qwen3-32B', params: '32B dense', minVramGb: '20 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0', notes: 'Single 24GB GPU' },
        { name: 'Qwen3-235B-A22B', params: '235B total / 22B active (MoE)', minVramGb: '130 GB (Q4_K_M)', quantOptions: 'Q4_K_M', notes: 'Multi-GPU' },
      ],
    },
    officialSources: [
      { title: 'Qwen3 blog', url: 'https://qwenlm.github.io/blog/qwen3/', tier: 'P1' },
      { title: 'Qwen3 on Hugging Face', url: 'https://huggingface.co/Qwen', tier: 'P1' },
    ],
  },
  'deepseek v3': {
    grade: 'L2',
    gradeLabel: 'Open weights under a permissive license',
    publisher: 'DeepSeek AI',
    licenseUrl: 'https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE',
    canonical: 'deepseek v3',
    excludeVersions: ['deepseek v3.1', 'deepseek v3.2', 'deepseek-v3.2', 'deepseek-r1', 'deepseek r1'],
    license: {
      name: 'MIT',
      permitsCommercial: true,
      commercialNote:
        'MIT permits commercial use, modification and redistribution provided the copyright and license notice are retained.',
      allowed: ['Commercial use', 'Modification', 'Redistribution'],
      notAllowed: ['Remove the MIT license or copyright notice'],
      scaleTrigger: 'None (MIT, no threshold)',
    },
    technical: {
      contextLength: '128K tokens',
      parameters: '671B total / 37B active (MoE, 256 experts)',
      formats: ['Safetensors', 'GGUF'],
      precision: 'BF16',
      series: [
        { name: 'DeepSeek-V3', params: '671B total / 37B active (MoE)', minVramGb: '~400 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0', notes: 'Multi-GPU / distributed' },
        { name: 'DeepSeek-V3 (distilled)', params: 'varies by distillation', minVramGb: 'Not available', quantOptions: 'GGUF', notes: 'Community distills' },
      ],
    },
    officialSources: [
      { title: 'DeepSeek-V3 on Hugging Face', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3', tier: 'P1' },
      { title: 'DeepSeek-V3 GitHub', url: 'https://github.com/deepseek-ai/DeepSeek-V3', tier: 'P1' },
    ],
  },
  'gemma 3': {
    grade: 'L1',
    gradeLabel: 'Open weights with a restricted/custom license',
    publisher: 'Google',
    releaseDate: '2025-03-12',
    canonical: 'gemma 3',
    excludeVersions: ['gemma 2', 'gemma 4'],
    licenseUrl: 'https://ai.google.dev/gemma/terms',
    license: {
      name: 'Gemma Terms of Use',
      permitsCommercial: true,
      commercialNote:
        'Commercial use is permitted under the Gemma Terms. If a product or service has more than 1 million monthly users, you must request a license from Google.',
      allowed: ['Commercial use within the Gemma Terms', 'Redistribution of the weights with the Gemma Terms attached'],
      notAllowed: [
        'Use the weights to train or improve other models',
        'Exceed 1 million monthly users without a Google license',
        'Remove or modify the Gemma Terms',
      ],
      scaleTrigger: 'Google license required above 1 million monthly users',
    },
    technical: {
      contextLength: '128K tokens',
      parameters: '1B / 4B / 12B / 27B (dense)',
      formats: ['Safetensors', 'GGUF'],
      precision: 'BF16',
      series: [
        { name: 'Gemma 3 27B', params: '27B', minVramGb: '17 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0', notes: 'Single 24GB GPU' },
        { name: 'Gemma 3 12B', params: '12B', minVramGb: '8 GB (Q4_K_M)', quantOptions: 'Q4_K_M', notes: 'Consumer GPU' },
        { name: 'Gemma 3 4B', params: '4B', minVramGb: '3 GB (Q4_K_M)', quantOptions: 'Q4_K_M', notes: 'Laptop / edge' },
      ],
    },
    officialSources: [
      { title: 'Gemma 3 on Hugging Face', url: 'https://huggingface.co/google/gemma-3-27b-it', tier: 'P1' },
      { title: 'Gemma 3 official', url: 'https://ai.google.dev/gemma', tier: 'P1' },
      { title: 'Gemma Terms of Use', url: 'https://ai.google.dev/gemma/terms', tier: 'P1' },
    ],
  },
  'mistral': {
    grade: 'L2',
    gradeLabel: 'Open weights under a permissive license',
    publisher: 'Mistral AI',
    releaseDate: '2025-07-22',
    canonical: 'mistral',
    excludeVersions: ['mistral 3.1', 'mistral 3.2', 'mistral 3.3', 'mistral large 3', 'mistral small 3.2'],
    licenseUrl: 'https://mistral.ai/licenses',
    license: {
      name: 'Apache 2.0 (open-weight releases)',
      permitsCommercial: true,
      commercialNote:
        'Mistral open-weight releases are under Apache 2.0, which permits commercial use, modification and redistribution with attribution.',
      allowed: ['Commercial use', 'Modification', 'Redistribution'],
      notAllowed: ['Remove the Apache 2.0 notice', 'Use the Mistral trademarks without permission'],
      scaleTrigger: 'None (Apache 2.0, no threshold)',
    },
    officialSources: [
      { title: 'Mistral AI models on Hugging Face', url: 'https://huggingface.co/mistralai', tier: 'P1' },
      { title: 'Mistral Licenses', url: 'https://mistral.ai/licenses', tier: 'P1' },
    ],
    technical: {
      contextLength: '128K tokens (Mistral Large 3)',
      parameters: 'Mistral Large 3: ~100B+ (per model card); 7B / 8B open-weight also available',
      formats: ['Safetensors', 'GGUF'],
      precision: 'BF16',
      series: [
        { name: 'Mistral 7B', params: '7B', minVramGb: '5 GB (Q4_K_M)', quantOptions: 'Q4_K_M, Q8_0', notes: 'Consumer GPU' },
        { name: 'Mistral Large 3', params: '~100B+ (per model card)', minVramGb: 'Not available', quantOptions: 'GGUF', notes: 'Check model card for VRAM' },
      ],
    },
  },
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')

export function getKnownModel(name) {
  if (!name) return null
  const n = norm(name)
  for (const key of Object.keys(KNOWN)) {
    if (n.includes(norm(key))) return KNOWN[key]
  }
  return null
}
