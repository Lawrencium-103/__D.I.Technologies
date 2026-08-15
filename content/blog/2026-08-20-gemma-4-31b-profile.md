---
title: "Gemma 4 31B: one-GPU open multimodal"
slug: "gemma-4-31b-profile"
date: "2026-04-02"
author: Lawrence Oladeji
category: "Model Profiles"
readingTime: "10 min"
template: standard
cover: "/images/blog/gemma4/1600/900"
coverAlt: "An abstract diagram of a dense 31B model fitting inside the marked memory of a single high-end GPU, with text and image input shown"
excerpt: "Gemma 4 31B is Google DeepMind's Apache 2.0 model that fits on one high-end GPU: strong code and reasoning, native multimodal, and the cleanest license in its size class. This is the full practical guide."
references:
  - "Google DeepMind (2026) 'Gemma 4 model card'. Hugging Face. Available at: https://huggingface.co/google/gemma-4-31b (Accessed: 20 August 2026)."
  - "Google (2026) 'Introducing Gemma 4'. Google. Available at: https://blog.google (Accessed: 20 August 2026)."
  - "Artificial Analysis (2026) 'Open-weight model intelligence index'. Artificial Analysis. Available at: https://artificialanalysis.ai (Accessed: 20 August 2026)."
  - "BenchLM (2026) 'Public model and benchmark tracker'. BenchLM. Available at: https://benchlm.ai (Accessed: 20 August 2026)."
---

> TL;DR
> - Gemma 4 31B is a dense 31B-parameter open model released under Apache 2.0 in April 2026, with a 26B-A4B MoE sibling and smaller edge variants.
> - It is the strongest practical single-high-end-GPU model with a truly permissive license, with code, reasoning and 140+ language support.
> - Native multimodal (text and image) and up to 256K context on the big variant.
> - It runs on 24 GB consumer GPUs when quantized and on Apple Silicon, with excellent Ollama and LM Studio support.

Here is the model the "I want it private but I do not want a cluster and I do not want a lawyer" crowd has been waiting for. Gemma 4 31B is the class of open model that closes the biggest practical gap in 2026: frontier-adjacent quality that fits on one GPU, under a license so permissive it is boring. This post is the practical guide to what it is, what you can legally do with it, and how to actually run it.

## What is Gemma 4 31B?

Gemma 4 31B is Google DeepMind's open-weight release from April 2026 [model card](https://huggingface.co/google/gemma-4-31b) (P1). The headline variant is a 31B dense model. The family also includes a 26B-A4B spillover MoE and smaller edge variants around 2B, 4B and 12B. The big variant carries a context up to 256K tokens, native multimodal input for text and images, and was trained across 140-plus languages [Google announcement](https://blog.google) (P3). Independent trackers rank it at the top of its hardware size class for code and reasoning relative to footprint [Artificial Analysis](https://artificialanalysis.ai) (P2), [BenchLM](https://benchlm.ai) (P2).

## What is it good at?

For most users, this is the honest frontier-for-one-GPU story: strong code generation and reasoning, genuinely good multilingual coverage, and native image understanding, in a package that serves from a workstation instead of a cluster. It does not match a 2.4T or even a 744B cluster model on the hardest long-horizon tasks. It wins by being good enough for production while being monetarily and legally trivial to own.

## Can you legally use it commercially?

Yes. Gemma 4 is Apache 2.0 (P1). That is the same license as much mainstream open-source software: commercial use, modification, distribution, self-hosting and fine-tuning, with no revenue gates, no MAU conditions, and no MaaS clauses. For schools, non-profits and regulated enterprises, this is the license that ends the conversation. The general differences between Apache 2.0 and custom licenses are in the post on [what open-source AI means after the license shifts](https://dintechnologies.com/blog/what-open-source-ai-means-after-2025-license-shifts).

## What hardware does it take?

Here is the part that changes your operating plan:

- Full-fidelity GPU serving: one high-end GPU, or a workstation.
- Consumer 24 GB cards: realistic with quantization, a mainstream community pattern (P3).
- Apple Silicon: supported, often remarkably usable for a 31B.
- The MoE sibling is smaller still for the same quality class.

If you know the [hardware floors for local inference](https://dintechnologies.com/blog/2026-hardware-tiers-local-ai-inference), this is the first horsepower tier where a single machine genuinely works. If your total budget is one workstation, this is the category to size.

## What does it take to run it?

The single-GPU path is the shortest in this whole survey:

1. Install Ollama or LM Studio and pull the GGUF quant that matches your card's memory. The quantization trade-offs are in the post on [quantization and memory optimization](https://dintechnologies.com/blog/2026-quantization-moe-efficiency-memory-optimization).
2. Confirm the vision path works for your image workload; multimodal on a consumer card is a memory negotiation, so test it explicitly.
3. Size context to available memory; a 256K window is not free on a 24 GB card.
4. For more than one user, move to vLLM on a workstation or small server. The runtimes are compared in [local AI runtimes](https://dintechnologies.com/blog/2026-inference-runtimes-local-ai-tooling-maturity).
5. Keep the machine offline-capable for private data. The argument is identical to the [guide to running open models privately](https://dintechnologies.com/blog/running-open-models-privately), just with a smaller box.

## What does it cost?

Your biggest cost item is the hardware, not the model or the license. At the workstation tier, the [cost reality check](https://dintechnologies.com/blog/mid-year-cost-reality-check) points the same way as always: the box pays for itself at steady utilisation, and with a single-GPU footprint the break-even point arrives much sooner than it does for a cluster.

## When is Gemma 4 the wrong choice?

- You need a million-token context or cluster-class peak reasoning: that is the DeepSeek, Kimi and GLM tier.
- You need to serve hundreds of concurrent users: scale with a cluster model or an API instead.
- You need the absolute cheapest tokens at high throughput: DeepSeek V4 Flash on a small node beats a single-GPU 31B on pure tokens-per-dollar.

## Where this leaves you

If your requirement is privacy without a cluster and permissive licensing without a review, buy the strongest single high-end GPU (or use a 24 GB card you already own), pull the quantized Gemma 4 31B, and pilot it this week. It is the model in this series most likely to be running in production for the least operational drama. Test your real prompts, then decide whether anything bigger is actually worth the next step up in cost.
