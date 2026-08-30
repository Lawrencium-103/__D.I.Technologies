---
title: "Kimi K3: open 1M-context multimodal AI"
slug: "kimi-k3-profile"
date: "2026-08-16"
author: Lawrence Oladeji
category: "Model Profiles"
readingTime: "11 min"
template: standard
cover: "https://dintechnologies.com/images/blog/kimi-k3-profile/cover.png"
coverAlt: "An abstract diagram of a huge expert-routed model with a long-context memory band, showing text, image and video inputs entering"
excerpt: "Kimi K3 by Moonshot AI is a 2.8T open-weight model with a 1M-token context and native multimodal input. This is the reader's guide: what it is, what it takes to run, and whether the custom license fits your use."
references:
  - "Moonshot AI (2026) 'Kimi K3 technical report and model card'. Hugging Face. Available at: https://huggingface.co/moonshotai/Kimi-K3 (Accessed: 16 August 2026)."
  - "Moonshot AI (2026) 'Kimi K3 launch announcement'. Moonshot AI. Available at: https://kimi.com (Accessed: 16 August 2026)."
  - "Artificial Analysis (2026) 'Open-weight model intelligence index'. Artificial Analysis. Available at: https://artificialanalysis.ai (Accessed: 16 August 2026)."
  - "BenchLM (2026) 'Public model and benchmark tracker'. BenchLM. Available at: https://benchlm.ai (Accessed: 16 August 2026)."
---

> TL;DR
> - Kimi K3 is a 2.8-trillion-parameter open model with a 104B active mixture-of-experts, a native 1M-token context, and native text-image-video input.
> - It regularly ranks at or near the top of independent open-weight intelligence indexes, especially for long-horizon agentic and coding work.
> - The license is MIT-shaped but has revenue triggers, so a large MaaS or product must be reviewed before commercial use.
> - Self-hosting needs a multi-node data-centre cluster (roughly 1.56 TB of weights). It is not a desktop model.

Kimi K3 is what a frontier lab ships when it believes open weights can match the closed frontier. This post answers the questions you would actually type into a search or an AI assistant: what K3 is, when it arrived, what it does better than the other open flagships, and what exactly it takes to run it on hardware you control. If you are new to the open-model category, read the explainer on [what open-source models are](https://dintechnologies.com/blog/what-are-open-source-models) first, then come back.

## What is Kimi K3?

Kimi K3 is Moonshot AI's open-weight flagship, released to Hugging Face under the repo moonshotai/Kimi-K3 [model card](https://huggingface.co/moonshotai/Kimi-K3) (P1). The headline numbers: 2.8 trillion total parameters, 104 billion active per token, 896 experts with 16 activated each step plus shared experts, and a native 1,048,576-token context window. It accepts text, images through a MiMoonViT-based vision encoder, and video, which makes it one of the few frontier open models that is native multimodal rather than image-supporting on top of text.

Independent indexes place it at or near the top of open-weight leaderboards in mid-2026 [Artificial Analysis](https://artificialanalysis.ai) (P2), [BenchLM](https://benchlm.ai) (P2). If you want one open model competing with the best closed ones, this is on the short list.

## When did it arrive?

The hosted API, web, app, and the Kimi Code and Work surfaces launched on July 16, 2026 [Moonshot announcement](https://kimi.com) (P3). The full open weights, roughly 1.56 TB, and the technical report landed on Hugging Face on July 27, 2026 (P1). For the mid-2026 cycle, that made it second out of the gate among the top-parameter open flagships, after DeepSeek V4 and before Qwen3.8's August open release.

## How does it work, in plain terms?

Kimi K3 is a sparse mixture-of-experts model. Storage holds the 2.8T parameters; the runtime activates 104B per token. What makes it interesting architecturally: it mixes two attention kinds across 93 layers, with a delta-attention block set and gated MLA layers, plus attention residuals, and it trains with quantization-aware methods using MXFP4 weights and MXFP8 activations (P1). Two practical outcomes:

- The 1M context is native, not a limit stretched by tricks. That changes how much of a codebase or document set you can load in one pass.
- The low-precision-by-design weights mean the official, practical deployment path is already quantized. You are not leaving much on the table by serving it at reduced precision.

For everything it takes to run a cluster model like this on your own kit, from memory floors to serving engines, these earlier posts map the territory: [hardware tiers for local AI inference](https://dintechnologies.com/blog/2026-hardware-tiers-local-ai-inference) and [local AI runtimes compared](https://dintechnologies.com/blog/2026-inference-runtimes-local-ai-tooling-maturity).

## What is it good at?

The strongest independent results for K3 show up on agentic coding, terminal-tool long-horizon benchmarks `and large multi-step knowledge tasks (P2)`. In plain terms, this is a model you point at a big job and let run, not a model you ping for quick answers. The 1M context plus native multimodal input makes it a reasonable candidate for agents that read codebases, screenshots, meeting video, and long documents in one session. It is heavier than a laptop model, and the benchmarks it wins are the ones that reward patience and context, not latency.

## Can you legally use it for commercial work?

The Kimi K3 License is MIT-shaped: broad rights to use, copy, modify, distribute, sublicense, sell, deploy and fine-tune (P1). It carries two commercial conditions, and they matter more than the permissive tone:

- A Model-as-a-Service business that gives third parties meaningful control over inputs, parameters or training data, with aggregate revenue over 20 million in any consecutive 12 months (affiliates included), needs a separate Moonshot agreement before commercial use.
- Products exceeding 100 million monthly active users or 20 million in monthly revenue must display "Kimi K3" prominently.

Internal embedding and ordinary product use sit well below these gates. For teams designing in the EU, the practical stance is: MIT-shaped for internal work, legal review only if you start reselling inference to third parties. The difference from fully permissive MIT is explained in the post on [what open-source AI means after the license shifts](https://dintechnologies.com/blog/what-open-source-ai-means-after-2025-license-shifts).

## What hardware does it take?

Kimi K3 is data-centre class. The weights are roughly 1.56 TB. Supported day one in vLLM and SGLang, including kernels for the delta attention, but you still need multi-node high-memory GPU infrastructure. A realistic minimum is a multi-node server setup of high-memory GPUs; anything smaller will not hold the model with the context it is known for.

## What does it take to run it?

For a team with cluster hardware:

1. Pull the official MXFP4-weight checkpoint. It is designed for reduced-precision serving, so this is not the lossy fallback it sometimes is with other models.
2. Run vLLM or SGLang with the K3 attention kernels patched into the serving engine.
3. Provision network and disk fast enough to page a 1.4 TB weight set, and benchmark your long-context token throughput with a real 1M-token prompt before you commit to product latency.
4. Use a private run to keep all document and invocation data inside your boundary; the very feature that makes a local cluster attractive.

If you do not have the cluster, Kimi K3 exists via the hosted API, and the trade-off between the two paths is exactly the [cost reality check](https://dintechnologies.com/blog/mid-year-cost-reality-check) the open-model community keeps returning to: the API is cheaper until your utilisation is sustained, and only then does the cluster pay off.

## What is it not for?

- Edge, laptop or single-GPU privacy work: a 14B or 31B model covers those at a fraction of the footprint.
- Teams that must avoid revenue-triggered license clauses by policy: DeepSeek V4 or GLM-5.2 remove the legal review entirely.
- Pure-text fast serving where 1M context is not used: a dense mid-size model will feel faster and cost less.

## Where this leaves you

If an organisation can run a multi-node cluster and its commercial use stays under the license gates, Kimi K3 is one of the strongest open-weight choices in 2026 for long-context, multimodal, agent-style work. If those conditions do not hold, keep it as an API tool and run a smaller open model on premise. Re-read the model card and the exact license file before you adopt it.
