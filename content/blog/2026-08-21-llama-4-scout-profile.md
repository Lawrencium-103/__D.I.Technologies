---
title: "Llama 4 Scout: open model, 10M context"
slug: "llama-4-scout-profile"
date: "2026-08-21"
author: Lawrence Oladeji
category: "Model Profiles"
readingTime: "10 min"
template: standard
cover: "https://dintechnologies.com/images/blog/llama-4-scout-profile/cover.png"
coverAlt: "An abstract diagram of a long-context multimodal model holding a huge document band, labeled 10M tokens"
excerpt: "Llama 4 Scout has the largest open context window at 10M tokens. Here is what the model is, what makes its context special, what the community license allows, and what it takes to run it."
references:
  - "Meta (2025) 'Llama 4 Scout model card'. Hugging Face. Available at: https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E (Accessed: 21 August 2026)."
  - "Meta AI (2025) 'Introducing Llama 4: Scout and Maverick'. Meta. Available at: https://ai.meta.com/blog (Accessed: 21 August 2026)."
  - "Artificial Analysis (2026) 'Open-weight model long-context index'. Artificial Analysis. Available at: https://artificialanalysis.ai (Accessed: 21 August 2026)."
  - "BenchLM (2026) 'Public model and benchmark tracker'. BenchLM. Available at: https://benchlm.ai (Accessed: 21 August 2026)."
---

> TL;DR
> - Llama 4 Scout is Meta's long-context open model: 109B total, 17B active over 16 experts, with up to 10M-token context and native multimodality.
> - No other open model in this series matches its context length; that is its entire reason to exist for document-heavy work.
> - The Llama 4 Community License is custom; large-user thresholds and attribution apply, so run a legal check for big products.
> - It is a multi-GPU model, not a workstation, but far lighter than the 2.4T flagships.

Sometimes the question is not which model is smartest, but which model can hold the most at once. Llama 4 Scout exists to answer that second question: a context window measured in millions, on a model you can download. This post is the practical guide to what Scout is, where a ten-million-token context genuinely helps, and what its license really says.

## What is Llama 4 Scout?

Llama 4 Scout is Meta's open-weight release from the Llama 4 generation [model card](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E) (P1). It is a mixture-of-experts model: 109 billion total parameters, 17 billion active over 16 experts, with native early-fusion multimodality for text and images. The feature that defines it in 2026 is the context: up to 10 million tokens, the longest open context in this survey by an order of magnitude [Meta announcement](https://ai.meta.com/blog) (P3). Released April 5, 2025, it has had more than a year to mature in the ecosystem.

## What can you actually do with 10M context?

In practice, 10M tokens is a different discipline from 1M. You can load an entire codebase, a documentation corpus, a year of customer conversations, or a set of long legal or compliance files into a single session and ask questions across all of it without a retrieval pipeline. The still-standing caveat, from the trackers that measure it, is that real-world long-context quality degrades as you push toward the advertised ceiling; Scout is exceptional for 7-figure context lengths, and you should test at the length you plan to serve [Artificial Analysis](https://artificialanalysis.ai) (P2), [BenchLM](https://benchlm.ai) (P2). Scripting a per-request budget is still the professional habit.

## What is it good at?

- RAG-heavy and document-heavy internal systems, where the model itself replaces the retrieval stack.
- Codebase reasoning across a whole repository in one session.
- Private multimodal work on company documents, images and archives inside your own network.

Where Scout does not lead is peak reasoning on short hard problems at its size class; DeepSeek, Kimi and GLM flagships score higher. Scout is chosen for surface area, not for a reasoning sprint.

## Can you legally use it commercially?

Read this section before the shiny parts. Llama 4 Scout ships under the Llama 4 Community License, a custom agreement rather than MIT or Apache (P1). It grants redistribution, attribution and naming requirements, and historically applies thresholds around very large user bases, in the hundreds-of-millions-of-MAU range, which can require additional permission from Meta. Some regional terms have also been noted in the documentation. For small-to-medium products and internal use, this is normally fine to proceed after a quick legal read. For consumer-scale distribution, budget a real licensing review.

The practical phrasing of why this differs from permissive open licenses is in the post on [what open-source AI means after the license shifts](https://dintechnologies.com/blog/what-open-source-ai-means-after-2025-license-shifts).

## What hardware does it take?

Scout is a node-class model, not a workstation:

- A multi-GPU node of high-memory GPUs is the realistic serving baseline.
- Long context magnifies memory: a 10M-token session is a deliberate memory and infrastructure event, so provision accordingly.
- The active 17B keeps serving efficient compared with the 400B Maverick sibling.

The memory math for active-versus-total params is the standard MoE story in [hardware tiers for local inference](https://dintechnologies.com/blog/2026-hardware-tiers-local-ai-inference).

## What does it take to run it?

1. Pull the checkpoint and pick your quantization; the trade-offs are in [quantization and memory optimization](https://dintechnologies.com/blog/2026-quantization-moe-efficiency-memory-optimization).
2. Serve with vLLM, which has deep Llama-family support; compare runtimes in [local AI runtimes compared](https://dintechnologies.com/blog/2026-inference-runtimes-local-ai-tooling-maturity).
3. Size context explicitly per request, and test at the context you will actually serve.
4. Keep the whole stack inside your boundary for private corpora. The logic is identical to [running open models privately](https://dintechnologies.com/blog/running-open-models-privately).

## What does it cost?

The [cost reality check](https://dintechnologies.com/blog/mid-year-cost-reality-check) is brutally relevant here: long contexts are where per-token API bills explode, because one session can consume millions of tokens. Scout is the strongest argument in this survey for owning the model when your documents are large, your volume is sustained, and your data cannot leave the building.

## When is Scout the wrong choice?

- You need peak reasoning on short, hard problems: pick DeepSeek V4 Pro or GLM-5.2.
- Your legal team refuses custom licenses outright: MIT and Apache 2.0 lineup is waiting.
- You only need 100K of context: a smaller, faster model is cheaper and simpler.

## Where this leaves you

Choose Scout when the corpus is the product and the licence review clears. Build one pilot that feeds it your real document set at your real context length, measure quality and memory at 1M, 5M and 10M, and let those numbers decide whether the context is worth the node. If the answer is yes, you now own the largest open context surface in the market, in your building, on your hardware.
