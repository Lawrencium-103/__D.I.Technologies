---
title: "Community-built giants: BLOOM and the RAIL license"
slug: "history-open-local-private-ai-bloom-rail"
date: 2026-06-15
author: Lawrence Oladeji
category: "History"
readingTime: "11 min"
template: standard
cover: "https://picsum.photos/seed/dit-ai-bloom-network/1600/900"
coverAlt: "An abstract visualization of interconnected global nodes branching out into multiple language paths representing a multilingual AI model"
excerpt: "How the BigScience workshop proved massive open models could be built by communities, while introducing the complications of use-based licensing."
---

> TL;DR
> - In July 2022, the BigScience workshop released BLOOM, a 176-billion-parameter model built by a global volunteer collaboration (P3).
> - Convened by Hugging Face and trained on public French supercomputers, it proved massive models need not come from closed corporate labs.
> - BLOOM shipped under the Responsible AI License (RAIL), attaching named use-case restrictions to open weights (P1).
> - RAIL created a new hurdle for local AI developers, who must now read behavioral clauses alongside standard code licenses.

The debate over open artificial intelligence often focuses on whether a lab will release model weights. The release of BLOOM in 2022 proved that having the weights is only half the battle. The other half is the license attached to them. BLOOM demonstrated that a global community could organize to build a massive model outside the traditional corporate structure. But it also introduced the Responsible AI License, or RAIL. This license attempted to attach behavioral restrictions to model weights. This created a new set of legal questions for developers building local and private AI applications. The BLOOM project is a touchstone for understanding how open collaboration scales and how licensing tries to enforce ethics.

## The BigScience workshop

In 2021, Hugging Face and the French National Center for Scientific Research, or CNRS, initiated the BigScience research workshop. The goal was to train a large language model openly, mirroring the collaborative structure of scientific projects like the Large Hadron Collider. This was a structural departure from the norm. Instead of a single company hiring engineers to build a model behind closed doors, BigScience organized a global volunteer collaboration. Over one thousand researchers from two hundred and fifty institutions across sixty countries participated in the effort (P3).

Hugging Face played a central role in this process. The company is widely known as a hosting hub for models, but BigScience highlighted its capacity to convene large-scale open collaboration. The organization of the workshop was divided into working groups. There were groups for data sourcing, data governance, model architecture, and evaluation. This distributed structure ensured that the resulting model was not just a technical artifact, but a multidisciplinary effort involving sociologists, ethicists, and linguists alongside machine learning engineers.

The compute required to train a massive model was provided by the French government. The Jean Zay supercomputer, located in Saclay, was made available for the project. This provision of public compute was a critical enabler. It removed the reliance on corporate data centers and allowed the project to remain independent of commercial incentives. The structural success of BigScience serves as a blueprint for grant-funded and multi-institution consortia looking to build public infrastructure today.

## The BLOOM model specifications

On July 12, 2022, the BigScience workshop released BLOOM. The model contained 176 billion parameters, making it comparable in size to the closed GPT-3 model released by OpenAI in 2020 (P1). The most significant technical achievement of BLOOM was its multilingual capability. While most large models at the time were heavily biased toward English, BLOOM was trained on the ROOTS corpus. This dataset contained 1.6 terabytes of text spanning forty-six natural languages and thirteen programming languages (P1).

The inclusion of forty-six languages was a deliberate choice to address the linguistic imbalance in artificial intelligence. African languages like Swahili, Yoruba, and Amharic were included alongside European and Asian languages. This was a milestone for local AI development in non-English speaking regions. It meant that researchers and developers in Africa could access a foundation model that had some understanding of their local context without having to train one from scratch.

![A terminal screen displaying Python code for loading multilingual AI model weights and checking language tokens](https://picsum.photos/seed/dit-bloom-terminal/1400/800)

The weights were released publicly on Hugging Face. Anyone with an internet connection could download them. This was the realization of the open model dream. A massive, capable model built by the community, for the community, available to anyone. However, the technical achievement was quickly overshadowed by the legal framework attached to the download.

## Introducing the RAIL license

The BigScience workshop chose to release BLOOM under the BigScience RAIL License v1.0. RAIL stands for Responsible AI License. This license was designed to bridge the gap between the open source community and the AI safety community. The core mechanism of RAIL is that it permits free use, distribution, and modification of the model, but it explicitly forbids certain use cases (P1).

The license includes a set of prohibited uses. You cannot use BLOOM to break the law. You cannot use it to harm minors. You cannot use it to generate disinformation. You cannot use it to make automated decisions that affect someone's legal rights, such as employment or housing. You cannot use it to provide medical advice or to make medical diagnoses without proper oversight (P1).

This was an early and serious attempt to solve a problem that frameworks like OMSF grade for today. The question of how to prevent the misuse of open models is a live debate. The standard open source licenses, like MIT or Apache 2.0, do not restrict the field of endeavor. You can use an MIT-licensed library to build a medical device or a weapon system, and the license does not care. RAIL was an explicit rejection of this neutrality. It attempted to encode ethics directly into the legal text.

## The tension between open and responsible

The introduction of RAIL created immediate tension in the open source community. The Open Source Initiative, or OSI, maintains the official definition of open source. Their definition explicitly states that no license can restrict the use of the software in a specific field of endeavor. Because RAIL restricts fields like law and medicine, it is technically not an open source license according to the OSI definition.

This meant that BLOOM was an open weights model, not an open source model. This distinction is not just semantic. It has real implications for how the model can be used in commercial and institutional settings. Legal teams at large organizations are familiar with MIT and Apache 2.0. They know how to clear these licenses. When they encounter RAIL, they have to conduct a new review. They have to assess the behavioral restrictions and determine if their use case violates the prohibited list.

> [callout: The licensing friction] Introducing behavioral restrictions to an open model creates legal friction that slows down enterprise adoption, even when the technical capabilities are sufficient.

The tension here is fundamental. If you want to ensure a model is never used to generate disinformation, you can restrict the license. But if you restrict the license, you lose the legal protections and clarity of standard open source. This makes it harder for developers to use the model in commercial applications. It also makes it harder to integrate the model into standard software supply chains that assume OSI-approved licenses.

## Implications for local and private AI

For developers building local and private AI applications, the RAIL license presents a specific hurdle. Local execution is necessary for data privacy. If you are building an application that processes sensitive healthcare data, you need to run inference on your own hardware. You cannot send the data to a third-party API. This means you need the model weights.

However, if you choose a model licensed under RAIL, you have to navigate the behavioral restrictions. If you are building a medical triage tool, the RAIL license explicitly prohibits providing medical advice. You would have to argue that your application provides informational support rather than medical advice. This requires a legal interpretation that many startups and independent developers cannot afford to make.

The release gradient framework that emerged from the GPT-2 era focused on access to weights and APIs. The BLOOM era added a new dimension to the gradient. It added the license itself as a variable. A model can have fully open weights, but a restricted license. This means that local AI developers must evaluate both the technical accessibility of the weights and the legal accessibility of the license.

## Structural lessons for modern consortia

The BigScience workshop proved that a global consortium can build a model that rivals the output of a multi-billion dollar lab. This is a crucial precedent for funders and research institutions. The structural success of the project relied on three pillars.

The first pillar was distributed organization. The working groups allowed experts to contribute to specific parts of the project without needing to understand the entire system. The second pillar was public compute. The Jean Zay supercomputer provided the necessary resources without requiring the project to monetize the model. The third pillar was open collaboration. By making the process transparent, the project attracted contributions from researchers who wanted to build public infrastructure rather than corporate products.

These pillars are replicable. A grant-funded consortium today can use the BigScience model to build specialized models for specific domains. They can organize working groups, secure public compute, and release the weights openly. The remaining challenge is the license.

![A schematic diagram showing a multi-institution AI research network collaborating on a single large language model architecture](https://picsum.photos/seed/dit-bloom-consortium/1400/800)

## How OMSF grades this problem

The Open Model Safety Framework, or OMSF, grades models on a release ladder. The existence of RAIL highlights exactly why a framework like OMSF is needed. When a developer looks at a model on Hugging Face, they see a license tag. If the tag says MIT, they know they can use it. If the tag says RAIL, they have to read the fine print. OMSF provides a structured way to evaluate these restrictions.

The framework forces an evaluation of what the restrictions actually prohibit and how they are enforced. A license restriction is only as good as the enforcement mechanism. RAIL relies on the legal system to enforce its prohibitions. It does not have a technical enforcement mechanism. This means that a malicious actor who downloads the weights can still run them locally for prohibited purposes. The license only provides a legal remedy after the harm is done.

This is the central paradox of behavior-based licensing. It restricts the good actors who read the license, but it does not stop the bad actors who ignore it. For local and private AI developers, this means that choosing a RAIL-licensed model imposes a compliance burden without providing a technical guarantee of safety.

## Where this leaves you

The BLOOM project expanded the definition of what an open model could be. It proved that community collaboration and public compute can produce models on the scale of those built by large tech companies. It also proved that the question of openness is not just about the availability of weights. It is about the legal framework that governs their use.

If you are building a local AI application, you have to decide how much legal friction you are willing to accept. A model with a fully permissive license gives you maximum freedom but no guarantees about how others might use the same model. A model with a RAIL license attempts to enforce ethics, but it complicates your legal compliance. How do you currently evaluate the behavioral restrictions attached to the open models you download?
