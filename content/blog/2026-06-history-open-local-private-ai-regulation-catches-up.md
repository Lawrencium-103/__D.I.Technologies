---
title: "Regulation catches up: defining open source AI"
slug: "history-open-local-private-ai-regulation-catches-up"
date: 2026-07-01
author: Lawrence Oladeji
category: "History"
readingTime: "14 min"
template: standard
cover: "https://picsum.photos/seed/dit-ai-regulation-compliance/1600/900"
coverAlt: "An abstract representation of a legal scale balancing a glowing neural network against a stack of regulatory documents"
excerpt: "How the 2024 EU AI Act and the Open Source AI Definition forced legal teams to treat open model licenses as serious compliance risks."
---

> TL;DR
> - In 2024, the EU AI Act gave the term open source legal weight without defining it precisely, creating major compliance uncertainty.
> - In October 2024, the Open Source Initiative published version 1.0 of the Open Source AI Definition to establish a formal standard.
> - Researchers warn that regulatory ambiguity incentivizes open washing, where vendors claim openness to bypass rules without providing actual transparency.
> - Enterprise legal teams and public sector buyers must now use structured frameworks to verify open claims, bridging the gap between policy and procurement.

The debate over open artificial intelligence moved from academic conferences to legislative chambers in 2024. For years, openness was a technical and philosophical discussion. Last year, it became a matter of legal compliance. The European Union finalized the AI Act, which treats open source models as a distinct legal category with specific exemptions and liabilities. However, the legislation did not include a rigorous definition of what open source means in the context of artificial intelligence. This regulatory gap created a massive compliance risk. Vendors suddenly had an incentive to label their models as open source to capture market interest, even if their licenses restricted actual use. For enterprise legal teams and public sector procurement offices, 2024 marked the end of taking the open label at face value.

## The EU AI Act and legal weight

The EU AI Act is the first major legal framework to regulate artificial intelligence based on risk. It categorizes systems into tiers, from minimal risk to unacceptable risk. Within this structure, the Act includes specific provisions for general purpose AI and open source systems. The legislation provides certain exemptions for open source models, particularly regarding transparency and documentation obligations, under the assumption that open development inherently provides public scrutiny (P1).

This approach created an immediate problem. The Act granted legal privileges and reduced burdens to open source models, but it relied on a common understanding of the term that does not exist in the artificial intelligence industry. In traditional software, open source has a strict definition maintained by the Open Source Initiative. In machine learning, vendors use the term loosely to describe anything from a fully permissive weight release to a strictly gated API. By giving open source legal weight without a precise statutory definition, the EU inadvertently created a compliance trap.

## The open washing incentive

Academic researchers immediately identified the danger in this regulatory ambiguity. In their 2024 FAccT paper, Liesenfeld and Dingemanse explicitly analyzed the EU AI Act's treatment of open source. They warned that the lack of a precise definition creates a strong incentive for open washing (P1). Open washing is the practice of marketing a model as open source to gain regulatory exemptions and community goodwill, while simultaneously withholding critical components like training data, evaluation code, or applying restrictive behavioral licenses.

If a vendor can label a model as open source and receive reduced regulatory scrutiny, they have a financial incentive to stretch the definition as far as possible. A company might release model weights under a custom license that prohibits commercial use or restricts specific industries, yet still market the model as open source to attract developers. Under the EU AI Act, this ambiguity allows vendors to enjoy the benefits of the open source exemption without bearing the costs of true transparency.

> [callout: The regulatory loophole] Granting legal exemptions to open source models without a strict definition encourages vendors to open wash their products to avoid compliance costs.

For a public sector procurement office, this loophole is a direct threat. If a government agency buys a model marketed as open source, expecting it to be exempt from certain transparency rules, and a regulator later determines the model does not actually qualify as open source, the agency is left holding a non compliant asset. The legal liability shifts from the vendor to the buyer.

## The Open Source AI Definition v1.0

Recognizing the looming regulatory crisis, the Open Source Initiative, or OSI, accelerated its efforts to define open source for the artificial intelligence era. In October 2024, the OSI published version 1.0 of the Open Source AI Definition (P1). This was the first formal, structured attempt to define open source specifically for AI systems.

The definition is strict. It requires that an open source AI system be available for use, study, modification, and distribution by anyone for any purpose. Crucially, it defines the system as more than just the code. To qualify as open source AI under the OSI definition, a model must provide access to the complete corresponding source code used to train the model. This includes the data processing scripts, the training parameters, and the evaluation methods. It also requires access to the training data itself, or a detailed description of how to obtain it (P1).

This definition sets a high bar. It explicitly rejects the idea that releasing only model weights under a permissive license constitutes open source. The OSI argues that without the training data and code, the community cannot independently audit, replicate, or improve the model. The model remains a black box. The v1.0 definition provides the exact standard that the EU AI Act lacked.

![A diagram showing the required components of an open source AI system including data, code, and weights](https://picsum.photos/seed/dit-ai-osi-components/1400/800)

## The compliance burden for enterprise legal teams

The publication of the OSI definition and the enactment of the EU AI Act fundamentally change the job of an enterprise legal team. In the past, legal teams treated open source models as low risk. If a model was on Hugging Face with an MIT license, it was cleared for use. That is no longer sufficient.

If a model is marketed as open source, the legal team must verify if it meets the OSI v1.0 standard. If it does not, and the legal team accepted the open washing marketing claim, the enterprise is exposed to regulatory risk under the EU AI Act. The enterprise might be using a model that was supposed to have transparency obligations, but the vendor skipped them by claiming open source status. When the regulator audits the enterprise, the regulator will ask for the transparency documentation. The enterprise will have to explain that they relied on the vendor's open source label.

This shifts the procurement process. Legal teams can no longer just review the license file. They must request the training data, the data processing code, and the evaluation scripts. If the vendor cannot provide these, the model is not open source under the OSI definition, and the enterprise must assume it is subject to the full weight of the AI Act's general purpose AI obligations.

## Implications for public sector procurement

For public sector buyers, the stakes are even higher. Government agencies are often the primary targets of regulatory enforcement. A public sector agency deploying an open washed model risks severe political and legal backlash. The agency cannot defend itself by claiming it was misled by the vendor's marketing. The burden of due diligence falls on the procurement office.

Public sector procurement must now explicitly require OSI compliance or an equivalent framework, such as the Open Model Safety Framework, or OMSF. When issuing a tender for an AI system, the procurement office must specify that the vendor must provide the full stack. This includes the weights, the code, and the data. If the vendor cannot provide it, the model must be treated as a closed system subject to full regulatory compliance.

This requirement also intersects with the sovereignty argument. A government cannot claim sovereign control over its AI infrastructure if the underlying models are closed black boxes. True sovereignty requires the ability to audit the training data for bias and to modify the model for local contexts. This is only possible if the model meets the strict definition of open source AI.

## The divergence of global standards

While the EU AI Act is the most prominent regulation, it is not the only one. Other jurisdictions are watching closely. The United States has taken a more fragmented approach, with executive orders and agency specific guidelines. However, the underlying principle remains the same. Regulators are demanding transparency and accountability from AI developers.

The OSI v1.0 definition provides a global baseline. Even if a jurisdiction does not explicitly adopt the OSI definition into law, it provides a defensible standard for compliance. If an enterprise can demonstrate that it procured models meeting the OSI standard, it has a strong argument that it acted responsibly. This makes the OSI definition a valuable tool for risk management, regardless of the specific local regulations.

In Africa, where AI procurement is still scaling up, adopting the OSI standard or OMSF provides a protective mechanism. It prevents African public sector buyers from becoming dumping grounds for models that fail to meet European or American regulatory standards. By requiring strict openness, African governments can ensure they are importing verifiable, auditable technology, not opaque black boxes wrapped in open washing marketing.

## The bridge to applied compliance

The history of open, local, and private artificial intelligence has reached a regulatory inflection point. The chaotic release strategies of 2019 to 2023 forced the industry to confront the measurement problem. The academic response provided the taxonomies and frameworks to measure openness. The regulatory response in 2024 gave those measurements legal weight.

> The intersection of the EU AI Act and the OSI definition means that open washing is no longer just a community grievance, it is a regulatory liability (P1). (Liesenfeld and Dingemanse, 2024)

This is the natural bridge between the history of open models and the need for applied compliance services. Knowing that a model needs to be open is not the same as verifying that it is open. Legal teams and procurement offices need practical tools to audit vendor claims. They need checklists that map directly to the OSI definition and the EU AI Act requirements. This is the exact gap that compliance frameworks like OMSF fill. They translate the legal requirements and academic definitions into a procurement ready evaluation.

## Where this leaves you

The era of self reported openness is over. In 2024, open source became a legal term with real consequences. If you are procuring AI systems, you can no longer rely on the vendor's word. You must demand the full stack of data, code, and weights. You must verify that the license is truly permissive and not laden with hidden behavioral restrictions. If you do not have the internal expertise to audit these models, you need a framework to do it for you. What is your current process for ensuring your AI procurement meets the new legal definitions of open source?
