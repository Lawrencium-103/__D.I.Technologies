---
title: "Inkling: Thinking Machines' open 1M model"
slug: "thinking-machines-inkling-profile"
date: "2026-07-15"
author: Lawrence Oladeji
category: "Model Profiles"
readingTime: "9 min"
template: standard
cover: "/images/blog/inkling/1600/900"
coverAlt: "An abstract diagram of a large expert-routed model with a 1M-token context band and a research-lab marking"
excerpt: "Inkling from Thinking Machines Lab is the ~975B open-weight entrant with a 1M context: competitive mid-to-high ranks, built for long-context research and agents. Here is what it is and what it takes to run."
references:
  - "Thinking Machines Lab (2026) 'Inkling model card'. Hugging Face. Available at: https://huggingface.co/thinkingmachines/Inkling (Accessed: 25 August 2026)."
  - "Thinking Machines Lab (2026) 'Inkling release announcement'. Thinking Machines Lab. Available at: https://thinkingmachines.ai (Accessed: 25 August 2026)."
  - "BenchLM (2026) 'Public model and benchmark tracker'. BenchLM. Available at: https://benchlm.ai (Accessed: 25 August 2026)."
  - "Artificial Analysis (2026) 'Open-weight model intelligence index'. Artificial Analysis. Available at: https://artificialanalysis.ai (Accessed: 25 August 2026)."
---

> TL;DR
> - Inkling is Thinking Machines Lab's open-weight release: reported around 975B total, 41B active, with a 1M-token context.
> - Independent indexes give it competitive mid-to-high rankings, strongest on long-context research and agent workloads.
> - It answers the question of what a new lab ships when it enters the open frontier: a 1M context, research-grade open model.
> - Node-class hardware, in the same serving family as the other large MoE opens.

The open-model map has a new producer, and its first flagship is worth a closer look. Inkling comes from Thinking Machines Lab, a research lab entering the 2026 open-weight contest with a 1M-context mixture-of-experts model big enough to matter and positioned for the workloads that most others treat as afterthoughts: long-context research. This post runs through the practical read on what Inkling is, what to believe what about its scores, and what it would take to run.

## What is Inkling?

Inkling is the open-weight model from Thinking Machines Lab [model card](https://huggingface.co/thinkingmachines/Inkling) (P1). Reported figures place it around 975 billion total parameters with roughly 41 billion active per token in an MoE layout, and a native context of 1 million tokens [Thinking Machines announcement](https://thinkingmachines.ai) (P3). Independent indexes place it in the competitive mid-to-high range of the open rankings, with its most consistent strength in long-context and layered agent tasks [BenchLM](https://benchlm.ai) (P2), [Artificial Analysis](https://artificialanalysis.ai) (P2).

## What is it for?

The design point is research-grade long-context work: scientific reading, multi-part document analysis, and agent loops that hold a large evidence base in memory while reasoning over steps. It does not strain for the top general reasoning crowns, it targets the workload where context and recall change the answer, the workload that the 1M-context cluster of models exists to serve.

## Can you legally use it commercially?

Inkling ships as an open-weight model from a research lab, and as with any custom-terms release, the answer depends on the exact license published for the checkpoint (P1). Confirm the current file before you build a product on it. The general lesson, reviews of custom license vs MIT/Apache, is in the post on [what open-source AI means after the license shifts](https://dintechnologies.com/blog/what-open-source-ai-means-after-2025-license-shifts).

## What hardware does it take?

Inkling is in the node-class tier:

- A multi-GPU node of high-memory GPUs is the realistic serving configuration, alongside vLLM or SGLang.
- A 1M-token session is a memory event per request; provision context deliberately.
- It is not a workstation model. The memory floors that explain why are in [hardware tiers for local inference](https://dintechnologies.com/blog/2026-hardware-tiers-local-ai-inference).

## What does it take to run it?

1. Pull the checkpoint and check quantization availability; the trade-offs are in the [quantization guide](https://dintechnologies.com/blog/2026-quantization-moe-efficiency-memory-optimization).
2. Serve with vLLM or SGLang per your runtime of choice, compared in [local AI runtimes](https://dintechnologies.com/blog/2026-inference-runtimes-local-ai-tooling-maturity).
3. Size the context to the task and test at your real length; a research pipeline at 800K tokens is a different cost than at 8K.
4. Keep evidence and conversation inside your boundary. The same logic as [running open models privately](https://dintechnologies.com/blog/running-open-models-privately).

## What does it cost?

The rule from the [cost reality check](https://dintechnologies.com/blog/mid-year-cost-reality-check) is the same, with one twist: long-context research is exactly the workload where API metering punishes you most, so private ownership of the weights under sustained research volume is comparatively easy to justify.

## When is Inkling the wrong choice?

- Your workload is fast, short, high-volume assistant traffic: a mid-size or flash-tier model wins on latency and cost.
- Your research benefits from the very top reasoning scores: the flagships ahead have modest-term advantages.
- You need frontier multimodal: check the exact multimodality story on the card first.

## Where this leaves you

Inkling is the model to evaluate when your work is long-form, evidence-heavy and agentic, and you want a second 1M-context open option beyond the Chinese flagships. Pull it on the largest node you have, build the real evaluation prompt, and compare against GLM-5.2 and Kimi K3 on your material rather than on the leaderboard. The lab is new, which is precisely why you run your own test before you trust the numbers.
