---
title: "Mid-year reality check: what open models actually cost to run"
slug: "mid-year-cost-reality-check"
date: 2026-06-30
author: Lawrence Oladeji
category: "Cost and Infrastructure"
readingTime: "11 min"
template: deep-dive
cover: "https://picsum.photos/seed/dit-cost-reality/1600/900"
coverAlt: "A single GPU workstation on a desk next to a laptop, representing local inference hardware"
excerpt: "Running an open model on your own hardware trades a fixed cost for a variable one. Whether that saves money depends on your volume, and the honest answer is contested. Here is the mid-year check, with the hardware and license claims checked against named sources."
---

> TL;DR
> - Self-hosting swaps a recurring API bill for a fixed hardware cost plus power and operations. It is not automatically cheaper.
> - A 7B or 14B model runs on one consumer GPU with 12GB of memory, confirmed by named 2026 benchmarks (P2). Expect roughly 30 to 45 tokens per second for a 7B-class model at Q4_K_M on an RTX 3060 12GB.
> - The license is a real cost. Mistral 7B is Apache-2.0. Llama 4 permits commercial use below 700 million monthly active users and requires a Meta license above it (P1, actual license text).
> - Whether self-hosting saves money is still a lead (P3). It depends on your volume, and only a run on your own workload proves it.

Mid-year is a good moment to check assumptions. Through the first half of 2026, the advice to "just self-host an open model" has hardened into a default for many teams. The pitch is simple: stop paying per token, own the stack, keep your data local. The pitch is partly right. It is also incomplete, because the cost of running models locally has pieces that rarely appear in the comparison posts. This is a reality check, not a sales pitch in either direction.

## The two cost models

There are two ways to pay for model inference.

The first is the API model. You send text to a vendor and pay per token or per seat. The cost scales with usage. When usage is low, the bill is low. When usage spikes, the bill spikes with it. There is no hardware to buy and almost no operations to run.

The second is the owned model. You buy or rent hardware, install a runtime, and serve the model yourself. The cost is mostly fixed up front: a server, a GPU, power, and the time to keep it running. After that, each request is cheap in cash terms, but only because you already paid the fixed part.

The mistake is to compare the monthly API bill to the monthly hardware payment and call it a day. The API bill is the whole story. The owned model has a visible hardware payment and a set of hidden running costs underneath it.

## What the hardware actually costs

The single most useful fact is that model size, not raw cleverness, sets the floor on hardware. Across 2026 benchmark write-ups, 4-bit quantization (typically Q4_K_M) is the default for local deployment, because it shrinks memory traffic per token and lets a model fit on modest cards (P2: the benchmark methods below all run Q4_K_M by default).

The hardware fit is now confirmed by named benchmarks, not just blog claims:

- A 7B model runs on a single consumer GPU with 12GB of memory, such as an RTX 3060. Named 2026 benchmarks place a 7B-class model at Q4_K_M at roughly 30 to 45 tokens per second on that card (P2: Hardware Corner, March 2026; tyolab, May 2026; Labontese, April 2026; Markaicode, July 2026). This covers back-office tasks: summarising documents, drafting replies, simple classification.
- A 14B model also fits the same 12GB card at Q4_K, at about 22 tokens per second at 16k context (P2: Hardware Corner, March 2026). A 24GB card such as an RTX 4090 raises the ceiling to 30B-class models.
- Anything larger moves into multi-GPU or rack hardware, where the price steps up sharply.

The widely reported rule of thumb is that a $1,200 to $2,500 starter machine can remove $300 to $500 per month of API spend once usage is high enough (P3, dev.to, March 2026). That number is a lead, not a measurement. It is also where the argument usually stops, which is the problem.

![A desk with a GPU workstation and a laptop representing a small local inference setup](https://picsum.photos/seed/dit-localstack-cost/1400/800)

## The costs that never reach the spreadsheet

The hardware payment is the part everyone quotes. The parts underneath are the ones that decide whether self-hosting actually saves money.

Power and cooling. A production inference server draws real wattage. One vendor write-up puts a four-GPU server at roughly 2,000W, costing about $150 to $250 per month in electricity before cooling (P3, Petronella, May 2026, vendor estimate). Cooling, especially in warm climates, can add as much again. None of this shows up in the "GPU costs $X" posts.

Connectivity and data movement. A local model rarely sits alone. It usually connects to storage, a vector database for retrieval, logging, and the application that calls it. One 2026 breakdown lists retrieval, embeddings, vector indexes, and cross-region traffic as separate cost lines that a naive total omits (P3, OneSource Cloud). If you add retrieval over your own documents, the embedding and storage bills are yours now, not the vendor's.

Operations. Someone patches the runtime, watches the GPU, replaces a failed card, and restores from backup. Several write-ups put the operational tax (engineering hours, monitoring, updates) as the line that tips self-hosting from saving to losing for small teams (P3, n1n.ai, April 2026). This is the cost that is hardest to see in a demo and hardest to ignore in month eleven.

> [callout: The part people skip] The API bill is the entire bill. The owned model has a visible hardware payment and a set of hidden running costs underneath it. Compare the whole story to the whole story.

## Does self-hosting save money? The honest answer

Here the research disagrees with itself, and the disagreement is the finding, not a problem to hide.

On one side, the pro-self-hosting case is straightforward: at high and steady usage, a fixed cluster beats a per-token bill. A March 2026 guide puts the payback on a $1,200 to $2,500 machine at a few months for a busy team (P3). For an organisation processing millions of requests a month, the math is convincing.

On the other side, the skeptic case is just as concrete. A 2026 cost breakdown argues that for most solo builders, self-hosting does not win on cost, because the GPU sits idle much of the time and you still pay for it (P3, Cloudzy). The break-even is not one number but three, depending on which API you compare against and how busy the GPU actually is. A separate 2026 vendor note puts the break-even for a managed self-hosted cluster at around 350 developers before it matches per-seat spend (P3, Palark).

Both can be true at once. Self-hosting wins for high, steady volume and for teams that must keep data local. It loses for spiky, low-volume use where a mostly-idle GPU is a mostly-wasted cost. The right move is to compute your own line, not to adopt either slogan.

## A break-even you can run yourself

You do not need a spreadsheet from the internet. You need four numbers.

1. Your current monthly API or per-seat spend.
2. The monthly cost of the hardware you would buy, including power and a rough operations allowance.
3. Your monthly request count and average tokens per request.
4. The cost of a managed self-hosted option, if you will not run it yourself.

If the hardware plus operations is below your current spend at your actual volume, self-hosting pays. If your volume is spiky and the GPU would sit idle most hours, the per-token API is likely cheaper. The interesting case is the team whose volume is rising: the crossing point is where self-hosting flips from expensive to cheap, and only your numbers show where that is.

## How to measure it properly

If you do stand up a local model, measure before you trust any number you publish. The discipline is simple and borrowed from how good benchmarks are reported: state the hardware, the quantization, the date, and who ran it.

A practical measurement path: install a local runtime such as Ollama, load a specific model at a specific quantization, time the evaluation on a fixed prompt set, and measure the server's wattage during the run. From those you get tokens per second, watts, and a cost per million tokens you can defend. Without those four facts, a "self-hosting saved us 70%" claim is a story, not a measurement.

The hardware-fit and speed figures in this post are drawn from named 2026 benchmarks that state their hardware, quantization, date, and runner (P2). The dollar-saving comparison stays a lead (P3) until someone measures it on a real workload. Treat every dollar amount here as a lead to verify, not a fact to budget against.

> The number that matters is yours. A published saving from someone else's workload tells you nothing about your crossing point.

## The license is also a cost

Hardware is not the only bill. The license decides what you are allowed to do with the model you run, and that is a cost in its own right.

Some models ship under permissive licenses. Mistral 7B is released under Apache-2.0, which lets you self-host, modify, and ship commercially with almost no gate (P1: Mistral 7B model card on Hugging Face; Mistral Help Center, June 2026). Others ship under community licenses with strings attached. Llama 4 is released under the Llama 4 Community License, which permits commercial use but requires you to request a separate license from Meta once your products or services exceed 700 million monthly active users (P1: Llama 4 Community License, Meta, 2025, Section 2). A model that is free to download can still be expensive to build a business on, if the license forbids your use.

So the true cost of a local model is hardware plus operations plus the license constraints you must design around. Skipping the license read is how teams discover the real cost at procurement, which is the worst time to learn it.

## Where this leaves you

If you run a small shop, a clinic, or a school with spiky demand and real outage risk, a local model may be worth it for resilience and data control even when it is not the cheapest option. If you run high, steady volume and must keep data on your own infrastructure, self-hosting likely pays. If you are a solo builder with uneven usage, the API is probably the cheaper and simpler path today.

The mid-year check is not "cloud versus local." It is "what is my volume, what is my risk, and what does the license allow." Answer those three and the cost question answers itself.

## Sources

P1, license texts (primary):
- Mistral 7B model card, Apache-2.0 license, Hugging Face (mistralai/Mistral-7B-v0.1).
- Mistral Help Center, "Under which license are Mistral's open models available?", June 5, 2026.
- Llama 4 Community License, Meta, 2025, Section 2 (the 700 million monthly active user threshold).

P2, named benchmarks (hardware, quantization, date, and runner stated):
- Hardware Corner, "RTX 3060 12GB Local LLM Benchmarks," updated March 2026. RTX 3060 12GB, Q4_K, 22.6 t/s on 14B at 16k context.
- tyolab, "13 Local LLMs, One RTX 3060: What Actually Runs," May 11, 2026. 64GB RAM, RTX 3060 12GB, llama.cpp router mode.
- Labontese, "I Tested 9 Local LLMs on a $200 Graphics Card," tested April 4, 2026. Ollama 0.20.2, RTX 3060 12GB.
- Markaicode, "7B Q4_K_M Local LLM: Real VRAM and Speed Benchmarks," July 6, 2026. Three sources converge on 42 to 45 t/s for 7B Q4_K_M on RTX 3060 12GB.

P3, leads to verify on your own workload (analyst and vendor write-ups):
- dev.to, "Self-Hosted AI Models: A Practical Guide," March 2026. Hardware tiers and the $300 to $500 per month saving claim.
- Petronella, private LLM deployment guides, May 2026. Power and operations estimates.
- Cloudzy, "Self-Hosting an LLM vs API: Real Cost Math," 2026. Skeptic break-even view.
- Palark, "Private, self-hosted LLM," 2026. Per-seat versus fixed-cluster economics.
- OneSource Cloud, "The True Cost of Running LLM Inference at Scale," 2026. Retrieval and networking cost components.
- n1n.ai, April 2026. Operations tax for small teams.
