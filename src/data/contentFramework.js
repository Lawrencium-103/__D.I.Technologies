// DIT OpenModel Synthesis Framework (OMSF)
// A buyer-side method that adapts established openness-grading work into a
// decision tool for schools, SMEs and non-profits. Not a new standard: it
// operationalizes the Model Openness Framework (MOF) and the OSI Open Source
// AI Definition for the people deciding what to actually deploy.

export const framework = {
  name: "OpenModel Synthesis Framework",
  shortName: "OMSF",
  version: "1.0",
  tagline:
    "One research base. A six-rung openness grade. Three decision frames for private, enterprise and non-profit buyers.",
  position:
    "OMSF is not a new standard. It adapts established openness-grading work, above all the Model Openness Framework (MOF, LF AI & Data Foundation, 2024) and the OSI Open Source AI Definition, and points it at a job those efforts do not: helping a school, SME or non-profit decide whether to adopt and deploy a model. The value is not the ladder. It is the translation of openness data into a private, enterprise and non-profit decision.",
  // The synthesis loop. Each stage is a forced step, not a suggestion.
  stages: [
    {
      id: "intake",
      step: "01",
      title: "Intake",
      body:
        "Pull from three source tiers at once: primary weights, model cards, licenses and papers; secondary benchmark and analyst work; tertiary news and community signal. Capture the URL and the date with every item.",
    },
    {
      id: "provenance",
      step: "02",
      title: "Provenance",
      body:
        "Tag every claim with its source tier and date. Drop any claim that has no dated source. A technical post that cannot show its receipts is opinion, not research.",
    },
    {
      id: "grade",
      step: "03",
      title: "Grade",
      body:
        "Place every model on the Openness Ladder. A model is only as open as its license lets you use it. Grade before you adopt.",
    },
    {
      id: "synthesize",
      step: "04",
      title: "Synthesize",
      body:
        "Form a thesis, not a summary. State what changed this quarter and why a specific buyer should care. Disagreement between sources is a finding, not a problem to hide.",
    },
    {
      id: "map",
      step: "05",
      title: "Map",
      body:
        "Rewrite the same research for three lenses: private user, enterprise legal and engineering, non-profit and public sector. Each gets its own decision frame and its own open-model grade.",
    },
    {
      id: "attribute",
      step: "06",
      title: "Attribute and Dissent",
      body:
        "Cite sources inline. Name where the field disagrees. Flag uncertainty plainly. The reader must be able to retrace the reasoning.",
    },
    {
      id: "mark",
      step: "07",
      title: "Mark",
      body:
        "Stamp the piece with the OMSF marker and the model's openness grade. The marker is what makes the catalogue recognizable and defensible.",
    },
  ],
  // How much to trust a source before it earns a place in a post.
  sourceTiers: [
    {
      tier: "P1",
      name: "Primary",
      trust: "Highest",
      includes:
        "Model weights, model cards, license text, official release notes, original papers, reproduction recipes.",
      rule: "Use for any claim about what a model is and what you may do with it.",
    },
    {
      tier: "P2",
      name: "Secondary",
      trust: "High",
      includes:
        "Benchmark reports, reputable lab analyses, vendor documentation, measured throughput and VRAM numbers.",
      rule: "Use for performance and behaviour claims, with the measurement conditions stated.",
    },
    {
      tier: "P3",
      name: "Tertiary",
      trust: "Signal only",
      includes:
        "News coverage, launch chatter, community threads, last-30-days listening.",
      rule: "Use to find what to investigate next. Never use as the sole source for a factual claim.",
    },
  ],
  // The six-rung ladder. This is the heart of the framework.
  opennessLadder: [
    {
      rung: "L0",
      name: "Closed API",
      published: "Nothing. Weights are private.",
      license: "No usage rights granted beyond the API terms.",
      example: "Closed commercial APIs.",
    },
    {
      rung: "L1",
      name: "Open weights, restricted",
      published: "Weights are downloadable, but the license is custom and limits use.",
      license:
        "Community or bespoke license with scale or commercial caps, for example a monthly-active-user threshold.",
      example: "Llama 4 (Community License), Gemma 3 (Gemma Terms).",
    },
    {
      rung: "L2",
      name: "Open weights, permissive",
      published: "Weights published under a recognized permissive license.",
      license: "Apache 2.0 or MIT. Commercial use allowed with attribution.",
      example: "Qwen3, DeepSeek V3 and R1, Mistral, Phi-4.",
    },
    {
      rung: "L3",
      name: "Open code",
      published: "Training and inference code are public, not just the weights.",
      license: "Permissive, with the full stack reproducible.",
      example: "Research releases that ship training code.",
    },
    {
      rung: "L4",
      name: "Open data",
      published: "Training data is published or fully documented.",
      license: "Permissive, with data and recipe open.",
      example: "OLMo 2 (open data, Apache 2.0).",
    },
    {
      rung: "L5",
      name: "Fully open",
      published: "Weights, code, data and license are all open and reproducible.",
      license: "OSI-aligned, end to end.",
      example: "OLMo 2, BLOOM, Pythia (research).",
    },
  ],
  // The three buyer lenses that make one research base serve three audiences.
  audienceLenses: [
    {
      lens: "Private",
      frame: "Cost, privacy, offline control.",
      questions:
        "Can I run this on my own machine? Does the license let me use it freely? What leaves my network?",
    },
    {
      lens: "Enterprise",
      frame: "Legal clearance, scale, deployment risk.",
      questions:
        "Will our usage cross a license threshold? Can we serve a team at throughput? What is the vendor and security exposure?",
    },
    {
      lens: "Non-profit and Public",
      frame: "Sovereignty, procurement law, service reach.",
      questions:
        "Does this meet open-source-first procurement? Can it run offline for underserved areas? Can it be audited by the public?",
    },
  ],
  // The real edge: MOF is producer-side, OMSF is buyer-side.
  differentiation:
    "MOF tells a model maker what to release to earn a class. OMSF takes that same openness signal and answers a different question for the buyer: should we adopt this, and what does the license mean for our procurement, legal and deployment? That buyer-side lens, tuned for African schools, SMEs and non-profits, is the part that did not exist before.",
  // We stand on established work. Name it; it builds credibility.
  lineage: [
    {
      name: "Model Openness Framework (MOF)",
      detail:
        "LF AI & Data Foundation, Generative AI Commons, 2024. A producer-side ranking across 17 lifecycle components (code, data, weights, docs, licensing) built to counter openwashing. OMSF borrows its core idea and points it at buyers.",
      url: "https://arxiv.org/abs/2403.13784",
    },
    {
      name: "OSI Open Source AI Definition",
      detail:
        "The Open Source Initiative's definition of what counts as open source for an AI system. OMSF applies this test at every rung of the ladder.",
      url: "https://opensource.org/ai",
    },
    {
      name: "Forrester open-source AI model framework",
      detail:
        "An analyst three-tier framing of model openness that informed how OMSF separates restricted from permissive release.",
      url: "",
    },
  ],
  moatMarker:
    "Synthesized with the DIT OpenModel Synthesis Framework (OMSF): established openness-grading work, operationalized for buyer-side decisions across private, enterprise and non-profit frames.",
  consultancy: {
    title: "Open-Source Model Consultancy",
    body:
      "DIT Dara Initiative Tech helps organizations choose, license and deploy open models with eyes open. We review model licenses against your usage, design private and on-prem deployment, align public-sector procurement with open-source-first rules, and run offline programs for non-profits and underserved communities.",
    cta: "Talk to us about an open-model review.",
  },
};

export default framework;
