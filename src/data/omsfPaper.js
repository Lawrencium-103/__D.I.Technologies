// Official Academic Preprint Metadata for DIT OMSF Framework
// Subject Areas: cs.AI (Artificial Intelligence), cs.CY (Computers and Society)
// Target Venues: arXiv preprint, Zenodo (DOI), FAccT 2026 / EACL 2026

export const omsfPaper = {
  title: "The Model Openness Synthesis Framework (OMSF): Operationalizing Composite Openness for Procurement and Edge Deployment in Resource-Constrained Environments",
  shortTitle: "The OMSF Framework & Deployment Taxonomy",
  authors: [
    { name: "Dara Initiative Technology (DIT) Research Group", affiliation: "Dara Initiative Technology", role: "Lead Authors" }
  ],
  date: "July 2026",
  status: "Preprint Ready for arXiv / Zenodo Submission",
  targetCategory: "cs.AI / cs.CY (Computers and Society)",
  abstract: `While recent benchmarks evaluate Artificial Intelligence (AI) model openness from a producer-side release perspective (e.g., the Model Openness Framework and the OSI Open Source AI Definition), enterprise buyers, public sector agencies, and educational institutions in resource-constrained environments lack an empirical, buyer-side evaluation taxonomy. We present the OpenModel Synthesis Framework (OMSF), a composite evaluation methodology that operationalizes model openness across three novel dimensions: (1) a 6-rung legal usage and licensing ladder ($L0$--$L5$), (2) a three-tier provenance verification protocol ($P1$--$P3$), and (3) an African Edge & Sovereign Infrastructure (AESI) metric measuring zero-egress data compliance and 4-bit/8-bit quantization efficiency under low-power hardware constraints. We demonstrate OMSF's utility by evaluating 50+ leading open-weight LLMs, providing a reproducible framework for institutional procurement and localized AI deployment.`,
  keywords: ["Model Openness", "AI Governance", "Edge Deployment", "Data Sovereignty", "Quantization Efficiency", "African AI Infrastructure"],
  sections: [
    {
      id: "intro",
      title: "1. Introduction & The Buyer-Side Gap",
      content: `The rapid proliferation of "open-weight" Large Language Models (LLMs) has created significant ambiguity for organizational decision-makers. Existing frameworks focus almost exclusively on producer-side compliance—cataloging which artifacts (code, data, weights) a lab chooses to publish. However, an open-weight release under a restrictive commercial license (e.g. Llama 4 Community License) presents fundamentally different operational, legal, and financial risks than a permissively licensed release (e.g. Apache 2.0 or MIT). OMSF bridges this gap by shifting the paradigm from producer compliance to buyer-side risk mitigation.`
    },
    {
      id: "cosa",
      title: "2. Composite Openness Scoring Algorithm (COSA)",
      content: `OMSF defines a composite scoring formula $S_{OMSF} \\in [0, 100]$ to quantify model suitability for local deployment:\n\n$$S_{OMSF} = w_1 L_{rung} + w_2 P_{tier} + w_3 E_{quant}$$\n\nWhere:\n- $L_{rung} \\in \\{0, 20, 40, 60, 80, 100\\}$ corresponds to rungs L0 through L5.\n- $P_{tier} \\in \\{33, 66, 100\\}$ represents Tertiary, Secondary, or Primary weight verification.\n- $E_{quant}$ measures perplexity retention after 4-bit GGUF/AWQ quantization for offline edge execution.`
    },
    {
      id: "aesi",
      title: "3. The African Edge & Sovereign AI Metric (AESI)",
      content: `Sub-Saharan Africa represents a critical testbed for AI sovereignty due to strict data localization laws (such as Nigeria's NDPR, Ghana's Data Protection Act, and Kenya's DPA) alongside low-bandwidth infrastructure. OMSF establishes the AESI metric to certify models that achieve zero foreign telemetry egress while maintaining inference latency below 150ms on off-grid, low-power solar hardware.`
    }
  ],
  bibtex: `@techreport{dit_omsf_2026,
  title={The Model Openness Synthesis Framework (OMSF): Operationalizing Composite Openness for Procurement and Edge Deployment in Resource-Constrained Environments},
  author={Dara Initiative Technology (DIT) Research Group},
  year={2026},
  institution={Dara Initiative Technology},
  type={Preprint},
  url={https://ditechnology.netlify.app/research}
}`
}

export default omsfPaper
