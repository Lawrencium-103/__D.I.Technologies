---
title: "Edge and on-device AI, explained"
slug: "2026-edge-on-device-ai-ai-pcs"
date: "2026-08-05"
author: Lawrence Oladeji
category: "Edge AI"
readingTime: "11 min"
template: standard
cover: "https://dintechnologies.com/images/blog/2026-edge-on-device-ai-ai-pcs/cover.png"
coverAlt: "A close-up of a computer processor chip with circuit traces, representing on-device AI compute"
excerpt: "About half of new PCs shipping in 2026 are projected to be AI PCs with dedicated neural processing units. Here is what the TOPS numbers mean, which small models run on them, and why on-device AI changes the privacy and offline story."
references:
  - "IDC (2026) 'Worldwide AI PC and Smartphone Forecast'. International Data Corporation. Available at: https://www.idc.com (Accessed: 5 August 2026)."
  - "Microsoft (2026) 'Copilot+ PC requirements and NPU specifications'. Microsoft. Available at: https://learn.microsoft.com/en-us/windows/ai/copilot-plus-pcs (Accessed: 5 August 2026)."
  - "Qualcomm (2026) 'Snapdragon X2 Elite NPU and TOPS specifications'. Qualcomm. Available at: https://www.qualcomm.com (Accessed: 5 August 2026)."
  - "NVIDIA (2026) 'Jetson Orin and Thor edge AI accelerator specifications'. NVIDIA. Available at: https://www.nvidia.com/jetson (Accessed: 5 August 2026)."
---

> TL;DR
> - Around 50% of new PCs shipping in 2026 are projected to be AI PCs with dedicated neural processing units, with forecasts aligned to IDC and Canalys.
> - The Copilot+ floor is 40 TOPS, and 2026 leaders reach 50 to 80+ TOPS, with the Snapdragon X2 Elite at roughly 80 to 85 TOPS, AMD Ryzen AI 400 at about 60, and Intel Core Ultra series at 48 to 50.
> - Small models (Phi, Gemma E-series, Llama 1 to 3B class, Qwen small) run at interactive speeds on phones and laptops, with no cloud round trip.
> - Edge accelerators like Hailo and NVIDIA Jetson Orin and Thor deliver tens to hundreds of TOPS for vision and light generative workloads, with sub-20 ms inference reported for optimized vision models on mid-range mobile.

The shift of AI inference from the cloud to the device is no longer a roadmap item. In 2026 it is a shipping reality. About half of new PCs expected to ship this year are projected to be AI PCs with dedicated neural processing units (NPUs), and the small models that run on them now execute at interactive speeds without a network connection (P3, aligned to IDC and Canalys forecasts).

For an organisation that cares about offline capability, data privacy, and predictable cost, this changes the architecture options. On-device AI is not a distant alternative to a cloud API. It is a third tier of deployment, sitting between the cloud endpoint and the self-hosted server, and it has its own hardware floor, its own model class, and its own tradeoffs.

## What an AI PC is

An AI PC is a personal computer with a dedicated neural processing unit that accelerates AI inference locally. The NPU is a separate block of silicon, distinct from the CPU and GPU, engineered to run the matrix operations that neural networks rely on. Its purpose is to offload lightweight AI workloads from the main processor so they run faster and draw less power.

The defining metric is TOPS, which stands for trillions of operations per second. It is a measure of how many arithmetic operations the NPU can perform per second, and it serves as a rough proxy for how large a model the hardware can run and how fast. The Microsoft Copilot+ floor is 40 TOPS, meaning a PC must hit at least 40 TOPS to qualify for the Copilot+ label (P1).

> [callout: TOPS is a ceiling, not a guarantee] TOPS describes raw throughput, not model quality. A higher TOPS number lets you run a larger model or the same model faster, but it does not say anything about the quality of the output. Match the hardware to the model you actually need, not the highest number on the spec sheet.

The 2026 leaders go well past the floor. The Qualcomm Snapdragon X2 Elite reaches roughly 80 to 85 TOPS, AMD Ryzen AI 400 sits around 60, and the Intel Core Ultra series lands at 48 to 50 (P1). These numbers matter because they determine which model class the device can run at interactive speed. A 40 TOPS NPU comfortably runs a 1 to 3B parameter model. An 80 TOPS NPU can push toward larger small language models and lighter multimodal workloads.

![A chart comparing the TOPS ratings of the 2026 leading AI PC NPUs, from the 40 TOPS Copilot+ floor up to the 85 TOPS Snapdragon X2 Elite](/images/blog/2026-edge-on-device-ai-ai-pcs/fig-1.png)

## The small models that run on-device

The capability of an AI PC is defined not by the hardware alone but by the models that fit on it. The relevant class is the small language model, or SLM, typically in the 1 to 3 billion parameter range. These are not the frontier models of the cloud. They are compact models designed to run within the memory and power envelope of a phone or laptop.

The 2026 small model landscape includes Phi, Gemma E-series, Llama 1 to 3B class, and Qwen small variants. These run at interactive speeds on consumer hardware, generating tokens fast enough for chat, summarisation, and light classification without a perceptible delay. The key property is that they run entirely on-device, so no prompt leaves the device and no network is required.

The significance of the 1 to 3B class is that it fits the memory budget of a typical laptop. A 3B model at 4-bit quantization occupies roughly 2 GB of memory, which is available on any modern machine alongside the operating system and applications. This is the difference between an AI feature that requires a cloud round trip and one that answers instantly from the device, even on a plane or in a school with no connectivity.

## Edge accelerators: beyond the laptop

For workloads that need more than a laptop NPU, the edge accelerator market provides dedicated hardware. NVIDIA Jetson Orin and Thor variants, and Hailo accelerators, deliver tens to hundreds of TOPS for vision and light generative workloads (P1). These are purpose-built boards designed for embedded and edge deployment, not general-purpose laptops.

The practical use case is vision. A Jetson Orin module can run object detection, pose estimation, and video analytics at real-time rates on a device that draws a fraction of the power of a data center GPU. This is the hardware behind on-device cameras, industrial inspection, and retail analytics that never send a frame to the cloud.

The reported figure for optimized vision models on mid-range mobile is sub-20 ms inference, which is fast enough for real-time interaction (P3). At that latency, a model can respond to a user's motion or a scene change in real time, which is the difference between a tool that feels responsive and one that feels laggy.

## The privacy and offline story

The most important property of on-device AI is that it keeps data local by architectural default. A feature that runs on the NPU does not send a prompt to a server, does not route a document through a third party, and does not depend on a connection to keep working. This is not a privacy policy. It is a structural property of where the computation happens.

For a school, a clinic, or a small business, this matters. A reading assistant that runs on a laptop works during a power outage, in a classroom with no internet, and with a child's data never leaving the device. A translation feature that runs on-device does not expose a conversation to a foreign API. The always-available, offline, private property is the takeaway, and it is the reason on-device AI is not just a convenience (P3).

> [callout: The offline-first fit] On-device AI is the purest form of offline-first. The model runs where the data is, on hardware the user owns, with no cloud dependency and no per-request cost. For the communities many organisations serve, this is not a nice-to-have. It is the only option that works.

There is a fairness dimension here too. Cloud AI bills scale with usage, and a per-seat or per-token model prices out the people who can least afford it. On-device AI has a fixed hardware cost and then runs. For a school that serves hundreds of families, that is the difference between a tool it can keep and a subscription it cannot.

## The tradeoffs

On-device AI is not a replacement for cloud or self-hosted serving. It is a tier with limits, and understanding them prevents a bad deployment decision.

The first limit is model size. A laptop NPU runs a 1 to 3B parameter model, not a 70B one. The capability gap is real. On-device models handle chat, summarisation, classification, and light vision, but they do not match the reasoning depth of larger models. The right use is targeted tasks, not general-purpose reasoning.

The second limit is total memory. The NPU shares the system's memory, so a large model competes with the operating system and applications for the same RAM. The total parameter count at the chosen quantization must fit within the available memory alongside everything else the device runs.

The third limit is update and control. On-device models are static artifacts that need to be updated to improve. The vendor controls the model that ships with the device, and the user may not be able to swap in a different model. For a deployment that needs a specific model, a self-hosted server gives more control than a laptop NPU.

## Where this leaves you

On-device AI is now a real deployment tier, not a promise. About half of new PCs in 2026 ship with an NPU, the small models that run on them are interactive, and edge accelerators handle vision and light generative workloads at real-time speed. The result is a third option alongside the cloud API and the self-hosted server: always-available, offline, private AI on hardware the user owns.

The decision is not which tier is best in general. It is which tier fits the task. For a lightweight, private, offline feature on a device the user already has, on-device is the answer. For a heavyweight reasoning task, the cloud or a self-hosted server is still necessary. The architectures are complementary, and the mature approach uses each where it fits.

Before you build on on-device AI, check the TOPS of the target hardware, confirm the model you need fits in memory at your chosen quantization, and verify the model runs within your latency budget. Does the current generation of on-device hardware cover the task you are trying to solve, or does it reach a ceiling you will hit in a year?
