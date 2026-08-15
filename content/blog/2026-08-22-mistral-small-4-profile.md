---
title: "Mistral Small 4 & Medium 3.5: EU AI"
slug: "mistral-small-4-medium-3-5-profile"
date: "2025-11-15"
author: Lawrence Oladeji
category: "Model Profiles"
readingTime: "9 min"
template: standard
cover: "/images/blog/mistral/1600/900"
coverAlt: "An abstract diagram of two efficient European-language models with a data-residency shield and a compliance marker"
excerpt: "Mistral Small 4 and Medium 3.5 are the efficient, Apache-leaning open models from Europe. This post covers what they are, why they fit EU data-residency requirements, and what they take to run."
references:
  - "Mistral AI (2026) 'Mistral Small 4 model card'. Hugging Face. Available at: https://huggingface.co/mistralai/Mistral-Small-4 (Accessed: 22 August 2026)."
  - "Mistral AI (2026) 'Mistral Medium 3.5 model card'. Hugging Face. Available at: https://huggingface.co/mistralai/Mistral-Medium-3.5 (Accessed: 22 August 2026)."
  - "Mistral AI (2026) 'Mistral model release announcements'. Mistral AI. Available at: https://mistral.ai/news (Accessed: 22 August 2026)."
  - "BenchLM (2026) 'Public model and benchmark tracker'. BenchLM. Available at: https://benchlm.ai (Accessed: 22 August 2026)."
---

> TL;DR
> - Mistral Small 4 and Medium 3.5 are Mistral's pragmatic open models, updated through 2025-2026, with Apache-leaning permissive licensing.
> - Their strongest argument is compliance: an EU-founded lab gives European buyers a data-residency and legal-continuity story no US or Chinese lab matches.
> - Both are efficient for their size class and well supported in the mainstream runtimes.
> - They target European regulated deployments and cost-optimized private serving, not the top of every benchmark.

Geography is a feature. Mistral's open models carry something that no benchmark measures: a home address in Europe, with the procurement, data-residency and accountability story that comes with it. Mistral Small 4 and Medium 3.5 are the two releases that matter for teams buying open AI under European regulation. This post explains what they are, why the EU angle is real, and how to run them.

## What are Mistral Small 4 and Medium 3.5?

Mistral Small 4 is the small end of Mistral's permissive open line, designed as an efficient, high-velocity model for production classification, routing and assistant workloads [model card](https://huggingface.co/mistralai/Mistral-Small-4) (P1). Mistral Medium 3.5 is the larger sibling in the same open family, built for heavier reasoning and generation [model card](https://huggingface.co/mistralai/Mistral-Medium-3.5) (P1). Both come from Mistral's 2025-2026 release cycle [Mistral news](https://mistral.ai/news) (P3), and both carry permissive, Apache-leaning licenses, with the exact texts confirmed on each model card.

## Why does the European angle matter?

Three concrete reasons, none of them sentimental:

- Data residency. Running an open model in your own EU infrastructure keeps personal data inside EU legal boundaries, which shortens the compliance chain for GDPR and sector rules.
- Vendor accountability. A lab answerable to European courts and regulators changes the risk posture of the procurement.
- Continued permissive terms. Apache-leaning licensing keeps self-hosting and fine-tuning safe without the revenue gates of the custom flagships.

An EU procurement officer comparing "hire a US API" versus "run open weights in Frankfurt on a European-supported model" is comparing two very different risk documents. There are other models with permissive licenses; none of them is European.

## What are they good at?

Small 4 is the workhorse: routing, classification, extraction and fast assistant replies where latency and cost decide the product. Medium 3.5 is the reasoning tier for the same organisation: longer writing, harder code, deeper analysis. Independent trackers show both performing efficiently for their size, chasing usefulness per euro rather than a single peak benchmark [BenchLM](https://benchlm.ai) (P2). That is exactly the trade a cost-optimized, compliance-constrained deployment wants.

## What hardware does it take?

- Small 4 serves comfortably on a workstation-class GPU or a modest internal node.
- Medium 3.5 needs a real GPU node, but nothing like the flagship MoE tier.
- The LLM tooling ecosystem supports both broadly across Ollama, vLLM and LM Studio.

The floors to plan around are the same as any model: memory holds the weights, context adds to it. The generic mapping is in [hardware tiers for local inference](https://dintechnologies.com/blog/2026-hardware-tiers-local-ai-inference).

## What does it take to run them?

1. Prototype with the quantized build in Ollama or LM Studio; quantize deliberately per the [quantization guide](https://dintechnologies.com/blog/2026-quantization-moe-efficiency-memory-optimization).
2. Serve production on vLLM, per the engine comparison in [local AI runtimes compared](https://dintechnologies.com/blog/2026-inference-runtimes-local-ai-tooling-maturity).
3. Point the deployment at EU data-processing locations and keep logs in-region.
4. Run it inside your network so the private data never leaves the building, the same logic as [running open models privately](https://dintechnologies.com/blog/running-open-models-privately).

## What does it cost?

At this size class, the [cost reality check](https://dintechnologies.com/blog/mid-year-cost-reality-check) resolves quickly: the hardware bill is modest, the per-token metering disappears, and the compliance saving from never exporting data is real though harder to line item.

## When are they the wrong choice?

- You need a 1M context or top reasoning marks: the cluster flagship tier wins far more benchmarks.
- You are not operating under any EU constraint and have cluster money: the MIT flagships score higher per euro.
- You need native multilingual image or video: these are text-first models.

## Where this leaves you

For European institutions and enterprises that want open AI without a transatlantic data story, Mistral Small 4 and Medium 3.5 are the shortlist's safe answer. Prototype Small 4 for your high-volume routes and Medium 3.5 for your difficult work, measure on your own prompts, and let the double win of permissive licensing plus EU residency be the deciding factor. If your region or policy differs, the permissive lineup in this series covers the rest.
