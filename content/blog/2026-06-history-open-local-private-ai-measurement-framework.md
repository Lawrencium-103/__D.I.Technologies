---
title: "The measurement problem: from gradient to framework"
slug: "history-open-local-private-ai-measurement-framework"
date: 2026-06-01
author: Lawrence Oladeji
category: "History"
readingTime: "14 min"
template: standard
cover: "https://picsum.photos/seed/dit-ai-measurement-matrix/1600/900"
coverAlt: "An abstract 3D grid mapping different AI model components across axes of openness and access"
excerpt: "How the chaos of staged releases and accidental leaks forced academics to build real measurement systems for open artificial intelligence."
---

> TL;DR
> - The rapid changes in AI releases between 2019 and 2023 proved that "open" was a marketing label, not a technical measurement.
> - Academic work by Irene Solaiman, White et al., and Liesenfeld and Dingemanse created the first rigorous taxonomies for model release.
> - This research exposed the practice of open washing, where labs claim openness while withholding critical components.
> - The Open Model Safety Framework, or OMSF, is the applied, buyer-facing continuation of this exact academic lineage.

The current debates about open, local, and private artificial intelligence suffered from a measurement problem for years. Between 2019 and 2023, the industry threw the word "open" at every model release. Labs released weights with restrictive behavioral clauses. Other labs claimed openness while gating access behind approval forms. The chaos of staged releases, accidental leaks, and deliberate sovereignty plays made one fact clear. The industry needed a real measurement system, not a marketing label. Buyers, regulators, and developers required a structured way to evaluate what a model actually provided. This measurement problem sparked a direct academic response. The resulting frameworks are the exact intellectual lineage that the Open Model Safety Framework, or OMSF, sits inside today.

## The collapse of the open label

When OpenAI withheld GPT-2 in 2019, openness was still a binary concept. You either released the weights or you did not. By the end of 2023, this binary collapsed under the weight of competing corporate strategies. BigScience released BLOOM under the Responsible AI License, which restricted specific use cases. Stability AI released Stable Diffusion under a similar license. Meta released LLaMA under a restrictive research-only license, which was then leaked. Mistral released models under Apache 2.0, claiming true permissiveness.

Every single one of these labs used the word "open" to describe their approach. This semantic drift created a serious problem for enterprise procurement. When everything is open, nothing is. Legal teams and compliance officers could not differentiate between a model they could safely deploy in a commercial product and a model that would expose them to lawsuits or regulatory scrutiny. The marketing label had outlived its usefulness. The industry needed a technical vocabulary that mapped exactly what was being released and what was being withheld.

## Mapping the gradient of access

The first major academic response to this chaos came from Irene Solaiman. In 2023, Solaiman published "The Gradient of Generative AI Release" at the FAccT conference (P1). Her work provided the vocabulary the industry desperately needed. Instead of treating release as a binary state, the paper outlined a structured taxonomy based on specific access levels. Solaiman categorized releases into a gradient, considering access to the model weights, the inference API, the training code, and the evaluation data (P1).

This paper was the direct intellectual response to the GPT-2 staged release experiment she had observed at OpenAI. It formalized the idea that openness is a spectrum, not a switch. By mapping out the exact levels of access a lab can provide, the research provided the foundation for modern release frameworks. It allowed the conversation to move past marketing claims and into technical specifics. A lab could no longer just say a model was open. They had to specify if they were releasing the weights, the code, or just an API endpoint.

![A digital diagram showing a continuous spectrum of AI access levels from fully closed to fully open](https://picsum.photos/seed/dit-ai-access-spectrum/1400/800)

## The Model Openness Framework

While Solaiman mapped the gradient of access, other researchers sought to create a comprehensive rubric for evaluating the completeness of an open model. In 2024, White et al. published "The Model Openness Framework" (P1). This research expanded the definition of openness beyond just the model weights. The framework argued that a truly open model requires the release of the entire scientific and engineering stack. This includes the training data, the data preprocessing code, the training scripts, and the evaluation benchmarks (P1).

The Model Openness Framework introduced a scoring system to grade models. A model that only releases weights receives a low grade. A model that releases the full stack receives a high grade. This rubric was a direct response to the trend of partial releases. Labs would release the weights to generate community engagement, but keep the training data and code secret to maintain a competitive advantage. White et al. proved that partial release is not true openness. Without the training code and data, the community cannot independently verify the safety or bias of the model. They are forced to trust the lab.

## The threat of open washing

The practice of partial release was formally studied and named by Liesenfeld and Dingemanse in 2024 (P1). They presented their findings at the FAccT conference, documenting how artificial intelligence companies use the label of open source to gain community goodwill while actively withholding critical components (P1). Their survey analyzed thousands of models hosted on public repositories. They found that many models claiming to be open were actually missing essential components like training data or evaluation code.

This practice is called open washing. It is not just an academic annoyance. It is a structural barrier to independent verification. If you do not have the training data, you cannot audit the model for bias. If you do not have the training code, you cannot replicate the safety results. Open washing gives the illusion of transparency without the substance.

> The misuse of the open source label in AI creates a false sense of security and hinders independent auditing (P1). (Liesenfeld and Dingemanse, 2024)

> [callout: The open washing trap] Marketing a model as open source while withholding the training data or evaluation metrics removes the ability for third parties to verify safety claims.

For enterprise legal teams, open washing is a hidden liability. A vendor might claim their model is open, but if the training data is withheld, the enterprise cannot verify if the model was trained on copyrighted material. If the model generates copyrighted output, the enterprise is liable. The research by Liesenfeld and Dingemanse gave procurement officers the language to challenge these claims. It allowed them to demand the full stack, not just the weights.

## Operationalizing the academic research

The academic work of Solaiman, White, Liesenfeld, and Dingemanse defined the problem. The Open Model Safety Framework, or OMSF, is the applied, buyer-facing continuation of this exact line of work. OMSF does not exist in a vacuum. It sits directly inside the intellectual lineage of these three papers. The framework takes these academic taxonomies and rubrics and converts them into a practical tool for enterprise and public sector procurement.

When an organization uses OMSF to grade a model, they are applying the gradient concept from Solaiman. They are applying the completeness rubric from White et al. They are guarding against the open washing threats documented by Liesenfeld and Dingemanse. OMSF takes the theoretical work of defining openness and turns it into a checklist that a procurement officer can use to reject a vendor proposal. This translation from theory to practice is the core value of the framework.

The six-level release ladder in OMSF is a direct descendant of the gradient proposed by Solaiman. It forces a lab to declare exactly where their model sits on the spectrum. Are they releasing just the API? Are they releasing the weights but not the code? Are they releasing the full stack? The framework makes the lab declare their position, and then it grades that position against a standard.

![A software interface showing an AI model safety compliance checklist with several categories graded on a scale](https://picsum.photos/seed/dit-ai-compliance-ui/1400/800)

## Why buyers need frameworks, not labels

For a legal team or a procurement officer, a marketing label is useless. You cannot build a compliance strategy on a vendor's claim of being open. You need a structured evaluation. The measurement frameworks provide this structure. They force the vendor to answer specific questions. Did you release the weights? Yes. Did you release the training data? No. Did you restrict the field of endeavor? Yes. Based on the answers, the framework assigns a grade.

The grade tells the buyer exactly what they are getting. It eliminates the ambiguity that dominated the 2019 to 2023 period. This is the value of operationalizing the research. It turns academic theory into a procurement standard. A buyer does not need to read a fifty-page academic paper to understand the risks of open washing. They just need to look at the OMSF grade. If the grade is low, the model is not fully open. If the grade is high, the model has passed the completeness test.

## Implications for global AI strategy

The measurement problem is especially acute outside the United States. African governments and enterprises cannot rely on the goodwill of American labs. They need verifiable guarantees of access. The academic frameworks provide the language to demand these guarantees. By adopting OMSF, an African procurement office can reject models that fail the openness test. They can require vendors to provide the full stack, not just the weights.

This shifts the balance of power. It forces labs to compete on actual transparency, not marketing. It builds the foundation for sovereign, local AI infrastructure that is accountable to the people using it. If an African ministry of health is deploying a model to process patient records, they need to know exactly how that model was built. They need to verify that it was not trained on biased data. They need to verify that it will not leak data to a foreign server. The framework gives them the ability to demand this verification.

## The end of the ambiguity era

The history of open, local, and private AI is a history of measurement. The chaos of the early years proved that openness without definition is a liability. The academic response provided the definitions. Solaiman gave us the gradient. White et al. gave us the completeness rubric. Liesenfeld and Dingemanse gave us the warning about open washing. OMSF put these concepts to work for the buyer.

The era of accepting the open label at face value is over. The tools to measure openness exist. The frameworks to evaluate risk are established. For any organization building an AI strategy today, the question is not whether a model is open. The question is where it sits on the measured gradient of openness. What is your current process for independently verifying the openness and completeness of the artificial intelligence you deploy?
