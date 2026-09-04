<!-- GITHUB PROFILE README — Lawrence Oladeji (lawdata) -->
<!-- v2 · re-published to refresh the profile-page render -->
<p align="center">
  <img src="https://img.shields.io/badge/Data%20Analyst-%23000?style=for-the-badge&logo=tableau&logoColor=white" />
  <img src="https://img.shields.io/badge/GIS%20%26%20Data%20Scientist-%23000?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/AI%20Automation%20%26%20Agentic%20Workflows-%23000?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<h1 align="center">👋 Hi, I'm Lawrence Oladeji — <code>lawdata</code></h1>

<p align="center">
  <b>Data Analyst · GIS &amp; Data Scientist · AI Automation &amp; Agentic Workflow Engineer</b><br/>
  <i>I turn messy, disconnected data into decisions, dashboards, and deployed AI systems.</i>
</p>

<p align="center">
  <a href="https://github.com/Lawrencium-103"><img src="https://img.shields.io/badge/GitHub-Lawrencium--103-black?logo=github" /></a>
  <a href="mailto:oladeji.lawrence@gmail.com"><img src="https://img.shields.io/badge/Email-oladeji.lawrence%40gmail.com-red?logo=gmail" /></a>
  <a href="https://lawrenceanalyst1.github.io"><img src="https://img.shields.io/badge/Portfolio-lawrenceanalyst1.github.io-blue" /></a>
  <a href="https://www.linkedin.com/in/lawrence-oladeji"><img src="https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/%F0%9F%8F%86%20Employee%20of%20the%20Month-December%202024-gold?style=for-the-badge" />
</p>

---

## 🧭 Who I Am — and the "Not a Generalist" Truth

I have **4+ years** of validated, hands-on experience across **health, finance, energy, retail, and enterprise**. My profiles on platforms often get reduced to a one-line "data analyst," but that undersells the depth — so let me be precise about what I actually do, and *prove it* with shipped projects.

I'm not a generalist who "knows a bit of everything." I'm a professional with **four distinct, validated disciplines** — and each maps cleanly to a job you might be hiring for:

| Track | What I deliver | Flagship proof |
|-------|----------------|----------------|
| 📊 **Data Analytics & Business Intelligence** | Executive dashboards, DAX/Power BI, SQL, KPI systems that drive real decisions | Fintech Churn Dashboard, Financial Strategy app |
| 🏥 **Public Health Data Analytics & Modeling** | Health dashboards, Bayesian disease modeling, deliverable tracking for national programs | Nigeria Health Dashboard, WHO ESPEN NTD Dashboard, Lagos NCD & CVD models, National Health Tracker |
| 🗺️ **GIS & Data Science / Machine Learning** | Geospatial analysis (QGIS, Leaflet, GeoPandas), Bayesian & ML models, scenario simulation | Premiership Fair-Value ML, Lagos Bayesian NCD models |
| 🤖 **AI Automation & Agentic Workflows** | RAG assistants, LLM agents, workflow & multi-agent automation, deployed & tested | RegulAI, CBAM Agent, Leadflow AI |

> **Why this matters to you (recruiter / client):** if you're hiring a **Data Analyst**, I bring validated dashboards, DAX, and SQL. If you're hiring a **Data Scientist / ML**, I bring validated Bayesian modeling, pipeline ML, and geospatial analytics on *real* public-health & finance data — not demos. If you're hiring an **AI Automation engineer**, I bring shipped, deployed, tested agentic/RAG systems. Three roles, three real portfolios — **one person, zero fluff.**

---

## 📑 Quick Navigation

- [🏥 01 — Public Health Data Analytics & Modeling](#public-health)
- [📊 02 — Data Analytics & Business Intelligence](#data-analytics)
- [🗺️ 03 — GIS & Data Science / Machine Learning](#gis-data-science)
- [🤖 04 — AI Automation & Agentic Workflow Development](#ai-automation)
- [🧰 Tools, Languages, GIS & Stack](#tools)
- [🕒 4+ Years — Validated Experience](#experience)
- [📬 Let's Work Together](#contact)

---

<a id="public-health"></a>
## 🏥 01 — Public Health Data Analytics & Modeling

**What I do:** I specialize in turning fragmented national health datasets into systems people actually use — dashboards that map disease burden, Bayesian models that quantify what public-health actions could achieve, and tracker tools that keep national programs on schedule. My health work combines **data analytics, GIS, and statistical/Bayesian modeling**, and it runs in the low-resource, low-bandwidth environments where most of the world's population actually lives.

**Core toolkit:** Power BI · Python (pandas, PyMC, statsmodels, scikit-learn) · R · SQL · QGIS / Leaflet / GeoPandas · Streamlit · NLP · DHIS2-style long-format data

### 🏆 Featured Projects

---

#### 🇳🇬 Nigeria Public Health Dashboard — *AI-Powered Health Intelligence for 37 States*

| | |
|---|---|
| **Why / How** | Public-health decisions in Nigeria stall because data exists but isn't accessible to the people who need it. A program officer in Sokoto shouldn't need a data-science team to ask *"Which LGAs have the lowest immunization coverage?"* I built an AI-powered web app with interactive maps, an NLP question-answering chatbot, and a voice interface — designed deliberately for **low-resource, low-bandwidth, offline-capable** environments. |
| **Process & thinking** | To serve intermittent connectivity I used **on-device (browser) speech** and a **deterministic rule-based NLP engine** — engineered so it *never returns the wrong data* (false positives are unacceptable in health). I curated and validated **1,665 data points (37 states × 3 years × 15 indicators)**, chose a **choropleth** (not bubble) map to preserve geographic cluster insight, and kept the PWA fully offline-capable. |
| **Result / output** | A working, deployment-ready health-intelligence system letting users query, map, and voice-ask public-health questions in plain language — no expensive SaaS, no three-week BI backlog. |
| **Stack** | Next.js · TypeScript · Chart.js · NLP · GeoJSON · Vercel |

- **Links:** [🔗 Live Demo](https://nigeria-publichealth-dashboard.vercel.app) · [GitHub Repo](https://github.com/Lawrencium-103/nigeria-public-health-dashboard) · **★ Featured**

---

#### 🌍 WHO ESPEN Nigeria NTD Dashboard — *Logistics ↔ Health Correlation Intelligence*

| | |
|---|---|
| **Why / How** | Mass Drug Administration (MDA) for neglected tropical diseases (NTDs) keeps missing targets — and the root cause is often **supply-chain logistics**, not medicine. The logistics and epidemiology data lived in separate silos, so nobody could see the connection. I built a dashboard that mathematically correlates **dispatch/transit delays** with **treatment-coverage failures** across all **774 Nigerian LGAs**, supporting the WHO Expanded Special Project for Elimination of NTDs (ESPEN). |
| **Process & thinking** | Wrote a custom **Node.js aggregation pipeline** to join *spatial* epidemiological data (by LGA) with *temporal* logistics data (by shipment/PO date), then added a **live Pearson-correlation module** (`r`) plus scatter plots and dual-axis trends so users can *prove* — not just observe — that delays drive coverage drops. I deliberately used **Vanilla JS + Leaflet + CartoDB** for sub-second loads on low-end devices in remote zones, isolating the 774 LGAs and washing out neighboring regions to reduce noise. |
| **Result / output** | A unified "intervention HUD" with **10 precision KPIs** (dispatch lag, transit time, last-mile delay, arrival delay…), an independent **Excel verification guide** so stakeholders can audit every metric, and a clear correlation story connecting logistics spend to health outcomes. |
| **Stack** | JavaScript (ES6) · Node.js/Express · Leaflet · CartoDB · Chart.js |

- **Links:** [🔗 Live Demo](https://who-espen-nigeria-ntd.onrender.com) · [GitHub Repo](https://github.com/Lawrencium-103/WHO_ESPEN__Nigeria_NTD) · **★ Featured**

---

#### ❤️ Lagos CVD Pre-Triage Tool — *Bayesian Risk Prediction for Frontline Workers*

| | |
|---|---|
| **Why / How** | Community health workers in low-resource settings can't wait for specialists to estimate cardiovascular risk. I built a **Bayesian logistic regression** model that predicts an individual patient's probability of CVD from age, sex, residential area, skill category, and LGA urbanization profile — designed for fast triage in the field. |
| **Process & thinking** | Trained and validated on a **6,044-patient** dataset: computed posterior odds ratios with **95% credible intervals**, benchmarked against **Framingham, QRISK3, and WHO/ISH** risk tools, and ran **5-fold cross-validation (AUROC + Brier score)**. Built it as a 6-page Streamlit triage dashboard for frontline, low-bandwidth use. |
| **Result / output** | A deployable pre-triage tool that gives community health workers an immediate, statistically defensible risk read — bridging the gap between specialists and the last mile of care. |
| **Stack** | Python · PyMC · ArviZ (Bayesian) · Geopandas · Streamlit |

- **Links:** [🔗 Live App](https://lagos-cdv-pretriage-tool.streamlit.app/) · [GitHub Repo](https://github.com/Lawrencium-103/Lagos_CDV_Pretriage_tool)

---

#### 🧪 Lagos NCD Policy Simulator — *Bayesian Scenario Model (Hypertension / CVD / Diabetes)*

| | |
|---|---|
| **Why / How** | Policymakers asked: *"How many NCD cases could Lagos avoid, per LGA, if air pollution (NO₂) were reduced or green cover (NDVI) increased?"* I built a **Bayesian hierarchical Poisson regression** model to answer it with quantified uncertainty. |
| **Process & thinking** | Ran Bayesian inference (PyMC) to produce posterior distributions and **IRR (incidence rate ratio) with 95% credible intervals**, cross-checked against a frequentist GLM, and ran **8 scenarios × 3 diseases (HTN, CVD, diabetes)** tied to each LGA's geography. Delivered it as a 7-page Streamlit dashboard. |
| **Result / output** | A scenario-comparison tool that shows, LGA by LGA, the avoidable disease burden under each policy lever — turning environmental-health policy debate into numbers policymakers can defend. |
| **Stack** | Python · PyMC · ArviZ · Geopandas · Streamlit |

- **Links:** [🔗 Live App](https://lagos-health-policy-simulation.streamlit.app/) · [GitHub Repo](https://github.com/Lawrencium-103/Lagos_Health_Policy_Simulation)

---

#### 📋 National Health & Reproductive Health — *Project Deliverable Tracker (Nigeria-wide)*

| | |
|---|---|
| **Why / How** | I built the **project deliverable tracker** for the National Health & Reproductive Health program — used by **all program coordinators across Nigeria** to keep hundreds of deliverables, activities, and reporting obligations on schedule and visible. |
| **Process & thinking** | Designed it as a practical, coordinator-friendly tracking system: clear deliverable statuses, ownership, due dates, and progress visibility so program leadership always knows what's on track vs. at risk — turning scattered Excel lists and email threads into one accountable system. |
| **Result / output** | A single, live source of truth that helped keep a national health program coordinated and accountable — recognized with **Employee of the Month (December 2024)**. |
| **Status** | Public-health program deliverable (client/internal) — deployment link available on request. |

- **Links:** [🔗 Deployed — provide link] · *(internal health-program toolkit)*

---

<a id="data-analytics"></a>
## 📊 02 — Data Analytics & Business Intelligence

**What I do:** I convert raw operational data into executive-ready dashboards and trackable KPIs. My work is engineered to be *acted upon*, not just admired — every chart answers a business question, and every metric drives a decision. I move comfortably between enterprise BI tools (Power BI, Tableau) and developer-friendly / open-source stacks (Superset, Metabase, Looker Studio, Lightdash, Redash, Grafana) depending on the team's budget and maturity.

**Core toolkit:** Power BI · DAX · Tableau · SQL (PostgreSQL / MySQL / SQLite / MySQL Workbench) · Apache Superset · Metabase · Google Looker Studio · Lightdash · Redash · Grafana · Python (pandas, plotly) · Streamlit

### 🏆 Featured Projects

---

#### 🏦 Fintech Customer Churn Dashboard — *Power BI + DAX*

| | |
|---|---|
| **Why / How** | A fintech needed to understand *why customers leave — before they leave*. I turned a churn dataset into a retention dashboard with hand-built **DAX** measures. |
| **Process & thinking** | Engineered reusable DAX measures — Total Customers, Churn Rate, Average Credit Score, Average Tenure, Geography, Active Status, Credit-card Usage, Average Age, Estimated Salary — each chosen because it maps to a **retention lever** the business can act on, not just a chart. |
| **Result / output** | A single source of truth for churn: management can track departures, segment at-risk customers, and take proactive, targeted retention action. |
| **Stack** | Power BI · DAX · Data Modeling |

- **Links:** [GitHub Repo](https://github.com/Lawrencium-103/Fintech_Churn_PowerBI_Dashbaord) · [🔗 Deployed — provide link]

---

#### 💡 Startup Signal — *Startup / Business Analytics App*

| | |
|---|---|
| **Why / How** | Analysts and founders need a fast way to track startup/business signals — traction, activity, and performance — without spinning up heavy enterprise BI. |
| **Process & thinking** | Built a **containerized Python web app** (Docker, GitHub Actions CI) with a clean architecture and environment-based configuration, keeping deployment simple and reproducible. |
| **Result / output** | A live, deployable analytics app for surfacing startup/business signals. |
| **Stack** | Python · Docker · GitHub Actions |

- **Links:** [🔗 Live Demo](https://lawrencium-103.github.io/startup-signal/) · [GitHub Repo](https://github.com/Lawrencium-103/startup-signal)

---

#### 📈 Financial Strategy & Stock Analytics — `finstrat`

| | |
|---|---|
| **Why / How** | Analysts needed a self-serve way to run financial/stock strategy analysis without hand-running notebooks every week. |
| **Process & thinking** | Built a **Streamlit** app backed by a **SQLite** data layer (`stocks.db`) with an automated **scheduler** to refresh data and an `analysis.py` module for strategy metrics — a real data pipeline, not a static report. |
| **Result / output** | A repeatable, deployable analytics app with a guide for standing it up on Streamlit Cloud. |
| **Stack** | Python · Streamlit · SQLite · Scheduler · CI (GitHub Actions) |

- **Links:** [🔗 Live App](https://finstratz.streamlit.app/) · [GitHub Repo](https://github.com/Lawrencium-103/finstrat)

---

### 📋 More Analytics Work I've Shipped

| Project | Purpose / What it shows | Stack |
|---------|-------------------------|-------|
| [`RetailAnalysis`](https://github.com/Lawrencium-103/RetailAnalysis) | Retail sales analysis & optimization — solid end-to-end analytics workflow | Python · pandas · Jupyter |
| [`HR_Analytics`](https://github.com/Lawrencium-103/HR_Analytics) | HR metrics & workforce insight — attrition, demographics, structure | Analytics · BI |
| [`Power_demand_Modeling`](https://github.com/Lawrencium-103/Power_demand_Modeling) | Energy demand forecasting & modeling — domain transfer to energy | Python · Stats · Jupyter |
| [`Britz`](https://github.com/Lawrencium-103/Britz) | General data & business analytics project — clean EDA to insight | Python · Jupyter |
| [`Stanbic-IBTC-Portfolio-Simulation-App`](https://github.com/Lawrencium-103/Stanbic-IBTC-Portfolio-Simulation-App) | Investment/portfolio simulation — finance domain analytics · [🔗 Live](https://stanbic-ibtc-portfolio-simulation.streamlit.app/) | Python |

> **Why this proves I'm a Data Analyst:** not toy reports — KPI design, DAX, SQL data layers, scheduling, and BI tooling across finance, retail, HR, energy, and public health: the transferable core of a senior analyst role.

---

<a id="gis-data-science"></a>
## 🗺️ 03 — GIS & Data Science / Machine Learning

**What I do:** I combine geography with statistics and ML to extract insight that's impossible from flat tables — disease mapping, predictive risk modeling, valuation models, and Bayesian simulation for policy. I work in Python and R, and I'm **intermediate in GIS** — comfortable in **QGIS**, plus web mapping (Leaflet, CartoDB) and Python geospatial (GeoPandas, GeoJSON/Shapefile processing). My Bayesian health models (CVD / NCD) live in [Section 01](#public-health); this section holds the ML, valuation and quantitative-modeling work.

**Core toolkit:** Python · R · QGIS (intermediate) · ArcGIS (working) · GeoPandas · Leaflet · CartoDB · PyMC · scikit-learn · XGBoost · statsmodels · pandas · Jupyter

### 🏆 Featured Projects

---

#### ⚽ Premiership Player "Fair Value" — *ML Transfer Cap Estimator*

| | |
|---|---|
| **Why / How** | Football transfer fees are often inflated or driven by gut feel. I built an ML estimator grounded in **Hedonic Pricing Theory** to compute a defensible "transfer ceiling" for Premier League players. |
| **Process & thinking** | Built a pipeline that ingests player/performance data, engineers hedonic value features, trains an **XGBoost** model with validation, and outputs fair-value ranges — deliberately turning transfer negotiations from opinion into numbers. Includes model artifacts, methodology docs, a data schema, and a recruitment-leads output. |
| **Result / output** | A deployed web app that estimates fair transfer values, complete with technical methodology, pitch deck, and schema documentation. |
| **Stack** | Python · XGBoost · scikit-learn · Docker · Vercel |

- **Links:** [🔗 Live Demo](https://premiership-player-fair-value.vercel.app) · [GitHub Repo](https://github.com/Lawrencium-103/PremiershipPlayerFairValue)

---

#### 📉 Customer Churn Prediction — *Classic ML Pipeline*

| | |
|---|---|
| **Why / How** | Predicting which customers will churn so retention spend can be targeted where it pays. A foundational-but-serious ML project showing the full pipeline. |
| **Process & thinking** | Data prep, feature engineering, model training/evaluation, and interpretation — the reproducible classification workflow I bring to any predictive challenge. |
| **Result / output** | A working churn classifier and notebook walkthrough. |
| **Stack** | Python · scikit-learn · Jupyter |

- **Links:** [GitHub Repo](https://github.com/Lawrencium-103/CustomerChurnPredictionz) · [🔗 Deployed — provide link]

---

### 🌱 Energy & Environmental Modeling

| Project | What it does | Live |
|---------|--------------|------|
| [`SESA — Smart Energy Storage Arbitrage`](https://github.com/Lawrencium-103/sesa-energy) | Optimization engine that decides when battery storage charges/discharges based on real-time electricity prices to cut building energy costs (multi-agent optimization) | [🔗 Live](https://sesa-energy.streamlit.app/) |
| [`OyoAirTrack — Environmental Intelligence`](https://github.com/Lawrencium-103/-Oyo_Air_Track) | Maps invisible air-quality & heat data into actionable public-health dashboards — geospatial intelligence for a healthier Africa | [🔗 Live](https://oyoairtrack.netlify.app/) |

---

### ⚙️ Quantitative & Scientific Modeling

Beyond pure data, I model physical and engineering systems — evidence of strong mathematical and numerical-methods fundamentals that transfer cleanly to complex analytical roles:

| Project | What it shows |
|---------|---------------|
| [`Heat-Exchanger`](https://github.com/Lawrencium-103/Heat-Exchanger) | Thermal engineering models — ODE/numerical methods |
| [`Cantilever-Bending`](https://github.com/Lawrencium-103/Canteliver-Bending) | Structural/mechanical bending computations |
| [`Non-Steady-heat-conductivity`](https://github.com/Lawrencium-103/Non-Steady-heat-conductivity) | Transient heat conduction — PDE/numerical solutions |
| [`Electric-Vehicle-Modeling`](https://github.com/Lawrencium-103/Electric-Vehicle-Modeling) | EV systems modeling — domain transfer to transport/energy |

> **Why these matter:** they demonstrate the same core that powers strong data science — rigorous formulation of problems, mathematical modeling, and computational implementation — not just calling an API or library.

---

<a id="ai-automation"></a>
## 🤖 04 — AI Automation & Agentic Workflow Development

**What I do:** I design and ship AI systems that *do work* — RAG assistants grounded in proprietary data, LLM agents that research/copy/draft/act, and agentic workflows that orchestrate tools into repeatable processes that replace manual drudgery with deployed automation.

**Frontier models I build with:** OpenAI (GPT-4 / 4o / 4o-mini) · Anthropic (Claude 3.5/3.7 Sonnet & Opus) · Google Gemini 2.x · Meta Llama 3.

**Local & self-hosted models:** Llama 3 / Mistral / Qwen for privacy-sensitive or offline workloads, and multimodal **Qwen3-VL** for vision tasks — so I can deliver AI that runs without shipping data to the cloud.

**Automation & agent ecosystem:** Python agent builds · RAG (ChromaDB) · Gradio · Streamlit · **n8n** (workflow automation) · **GitHub Copilot** · **Antigravity** · **OpenCode** · **Harness / Claude Code** · **Cline** · Docker · webhooks & API integration.

### 🏆 Featured Projects

---

#### 🧾 RegulAI — *Regulatory Question-Answering Assistant (RAG)*

| | |
|---|---|
| **Why / How** | Regulatory documents are dense, long and hard to query quickly. RegulAI is a RAG assistant that lets users ask natural-language questions and get grounded answers from a curated regulatory corpus. |
| **Process & thinking** | Built retrieval over a **ChromaDB** vector store, a **Gradio** UI for interaction, and LLM generation — then wrote **tests for every layer** (backend, Chroma retrieval, Gradio logic, LLM output) so the assistant is verifiable, not vibes. |
| **Result / output** | A tested retrieval-augmented assistant that answers regulatory questions with sourced, grounded responses. |
| **Stack** | Python · ChromaDB · Gradio · LLM (frontier) · pytest |

- **Links:** [GitHub Repo](https://github.com/Lawrencium-103/RegulAI) · [🔗 Deployed — provide link]

---

#### 🌍 CBAM Agent — *EU Carbon Border (CBAM) Compliance Agent*

| | |
|---|---|
| **Why / How** | The EU's Carbon Border Adjustment Mechanism (CBAM) creates complex, time-sensitive compliance obligations for importers. I built an AI **agent** to help navigate assessment and reporting. |
| **Process & thinking** | Agent core + server + **webhook** integration with a deployment setup (Procfile), and explicit testing across multiple models (`list_models`, live and webhook tests) to verify behavior across backends. |
| **Result / output** | A deployable compliance agent that turns a dense regulatory obligation into answerable, actionable guidance. |
| **Stack** | Python · Agent framework · Webhooks · Multiple LLM backends |

- **Links:** [GitHub Repo](https://github.com/Lawrencium-103/CBAM_Agent) · [🔗 Deployed — provide link]

---

#### 🧲 Leadflow AI — *Lead Research + Copywriting Agents*

| | |
|---|---|
| **Why / How** | Sales teams lose hours researching prospects and drafting outreach. Leadflow AI chains a **research agent** with a **copywriter agent** and a **Gmail integration** to produce targeted, ready-to-send outreach. |
| **Process & thinking** | Built a Streamlit app with a database layer, access-code delivery, a research agent, a copywriter agent, and a Gmail service — with a dedicated **deployment guide** so it's actually shippable, not a notebook. |
| **Result / output** | A deployable lead-generation workflow: research a prospect → draft personalized copy → push toward outreach. |
| **Stack** | Python · Streamlit · Agent orchestration · Gmail API · SQLite |

- **Links:** [GitHub Repo](https://github.com/Lawrencium-103/Leadflowai) · [🔗 Deployed — provide link]

---

#### 💼 J_oblin — *AI Job Board (Live Product)*

| | |
|---|---|
| **Why / How** | Job hunting is scattered and noisy. J_oblin is an **AI-assisted job board** that makes discovery and matching smarter. |
| **Process & thinking** | Designed and shipped as a live web product with an AI layer for improved matching/discovery. |
| **Result / output** | A live, deployed job board product at [joblin](https://joblin-hx5a.onrender.com/). |
| **Stack** | Web app · AI matching · Render |

- **Links:** [🔗 Live](https://joblin-hx5a.onrender.com/) · [GitHub Repo](https://github.com/Lawrencium-103/J_oblin)

---

---

### ✍️ AI Content Generation Agents *(live products)*

| Project | What it does | Live |
|---------|--------------|------|
| [`XGen Studio`](https://github.com/Lawrencium-103/XGenStudio) | Brand-content writing assistant (CrewAI + LangChain) — drafts articles, social posts & email sequences for review and publication | [🔗 Live](https://xgenstudio.streamlit.app/) |
| [`LinkyGen`](https://github.com/Lawrencium-103/Linky-V2) | Multi-agent content generation (LangGraph) — routes, drafts & edits long-form content with human review at each stage | [🔗 Live](https://linkygen.streamlit.app/) |
| [`Stratos`](https://github.com/Lawrencium-103/Stratos_App) | Content "empire" tool that maps audience segments to tailored messaging via multi-step LLM workflows | [🔗 Live](https://stratos-content.streamlit.app/) |

> **Also from this track:** the **NLP chatbot** inside the [Nigeria Public Health Dashboard](#public-health) (rule-based + LLM-ready query engine), plus active work across **n8n workflows**, **agentic skills** (SAFe-style agent harnesses, agentic skill libraries), and open-source AI tooling — continuously building toward production-grade agent systems.

---

<a id="tools"></a>
## 🧰 Tools, Languages, GIS & Stack

### Programming & Query Languages

| Language | Where I use it |
|----------|----------------|
| **Python** | Data analysis, ML, Bayesian modeling (PyMC), automation, AI agents, APIs |
| **R** | Statistical modeling & analysis |
| **SQL** | Querying & modeling data in PostgreSQL, MySQL, SQLite |
| **JavaScript / TypeScript** | Interactive dashboards & web apps (Next.js, Node, Express) |
| **HTML / CSS** | Data products & web interfaces |
| **Shell / Bash** | Automation & deployment |

### Databases & Data Storage

| Technology | Use |
|------------|-----|
| **PostgreSQL** | Relational analytics & app data |
| **MySQL** (+ **Workbench**) | Relational DBs & modeling |
| **SQLite** | Lightweight app & local data layers |
| **Excel / CSV / Parquet** | Rapid analysis & reporting |
| **dbt** | Analytics engineering transforms (via **Lightdash**) |

### Data Analysis & Business Intelligence

| Tool | Where I use it |
|------|----------------|
| **Microsoft Power BI** (+ DAX) | Enterprise dashboards & KPIs — *flagship* |
| **Tableau** | Enterprise visualization |
| **Apache Superset** | Open-source BI & exploration |
| **Metabase / Redash** | Lightweight team analytics |
| **Google Looker Studio** | Fast, shared reporting |
| **Lightdash** | dbt-native analytics |
| **Grafana / Retool** | Monitoring & operational products |

### Data Science, Statistics & ML

| Tool | Where I use it |
|------|----------------|
| **pandas / NumPy / SciPy** | Data wrangling & computation |
| **scikit-learn / XGBoost** | Classic ML & gradient boosting |
| **PyMC / ArviZ / statsmodels** | Bayesian & statistical modeling |
| **matplotlib / plotly** | Visualization |
| **Jupyter** | Analysis & reproducibility |

### GIS & Geospatial

| Tool | Level |
|------|-------|
| **QGIS** | Intermediate (mapping, styling, analysis) |
| **ArcGIS** | Working knowledge |
| **GeoPandas / GeoJSON / Shapefiles** | Python geospatial processing |
| **Leaflet / CartoDB** | Web mapping & interactive geo-dashboards |

### AI, Automation & Agentic Workflows

| Area | Tools |
|------|-------|
| **Frontier LLMs** | OpenAI GPT-4/4o · Anthropic Claude 3.5/3.7 · Google Gemini · Meta Llama 3 |
| **Local / self-hosted models** | Llama · Mistral · Qwen · Qwen3-VL (multimodal) |
| **RAG & retrieval** | ChromaDB vector store |
| **AI interfaces** | Gradio · Streamlit · custom UIs |
| **Agent orchestration** | Python agent builds · multi-agent/agentic harnesses (SAFe-style, agentic skills) |
| **Workflow automation** | **n8n** · webhooks · scheduled jobs |
| **AI coding tools** | **GitHub Copilot** · **Antigravity** · **OpenCode** · **Harness / Claude Code** · **Cline** |

### Cloud & DevOps

Vercel · Render · Netlify · Docker · GitHub Actions (CI/CD)

> **How to read this:** this isn't a wallpaper list — it's the exact toolkit behind the shipped projects above, mapped to the job roles they prove. If a hiring manager needs Power BI → it's in my deployed Fintech dashboard. QGIS / geospatial → in my health dashboards. Bayesian ML → in my Lagos models. Agentic AI → in my shipped agents.

---

<a id="experience"></a>
## 🕒 4+ Years — Validated, Transferable Experience

I have **4+ years** of hands-on experience across data analytics, data science, and GIS analysis — but I've deliberately built this profile around **proof per role**, so you're never guessing whether my skills transfer. Here's exactly what each role would evaluate, and where the evidence lives:

| If you're hiring for… | What you'd evaluate | Where the proof lives in this profile |
|-----------------------|---------------------|---------------------------------------|
| **Data Analyst** | Dashboards, KPIs, DAX, SQL, BI storytelling | Fintech Churn (Power BI/DAX), finstrat, Startup Signal, retail/HR/energy analytics |
| **Data Scientist / ML** | Modeling rigor, validation, statistics | Premiership Fair-Value (XGBoost), Churn (scikit-learn), Bayesian CVD/NCD models (PyMC) |
| **GIS / Geospatial Analyst** | Mapping, spatial data handling, analysis | Nigeria Health geo-dashboard, WHO ESPEN (774-LGA mapping), QGIS (intermediate) |
| **AI Automation / Agentic Engineer** | Shipped, working agent systems | RegulAI (RAG), CBAM Agent, Leadflow AI, J_oblin, NLP chatbot |

**Domains I've delivered in:** Public Health · Finance / Fintech · Energy · Retail · Enterprise.

**Recognition:** 🏆 **Employee of the Month — December 2024** (national public-health program deliverable tracking).

> **Bottom line:** I'm not "a data person who dabbles" — I'm a specialist with four ship-verified disciplines. Pick a role, and there's a real, deployed project in this profile that demonstrates I can do it.

---

<a id="contact"></a>
## 📬 Let's Work Together

I'm open to roles and projects where **data meets decisions** — whether that's building a BI function, modeling a policy outcome, analyzing geospatial patterns, or automating work with AI agents.

- 📧 **Email:** [oladeji.lawrence@gmail.com](mailto:oladeji.lawrence@gmail.com)
- 🐙 **GitHub:** [Lawrencium-103](https://github.com/Lawrencium-103)
- 🧭 **Portfolio:** [lawrenceanalyst1.github.io](https://lawrenceanalyst1.github.io)
- 💼 **LinkedIn:** [lawrence-oladeji](https://www.linkedin.com/in/lawrence-oladeji)

### 🏢 D.I. Technologies — Dara Initiative Tech

The organisation behind the public research and offline-first AI work:

- 🌐 **Website:** [DIT Dara Initiative Tech — dintechnologies.com](https://dintechnologies.com)
- 🔬 **Research:** [OMSF Research & Methodology — dintechnologies.com/research](https://dintechnologies.com/research)

> **🔗 Live demos:** everything marked **Live / Live App** is publicly deployed — Nigeria Health, WHO ESPEN, Premiership Fair-Value, Startup Signal, J_oblin, Lagos CVD Pre-Triage, Lagos NCD Simulator, Financial Strategy, Stanbic, SESA, OyoAirTrack, XGen, LinkyGen, Stratos. A few items remain private or available on request (Fintech Power BI, RegulAI, CBAM, Leadflow, churn, National Health Tracker) — [email me](mailto:oladeji.lawrence@gmail.com) and I'll point you to the demo or walk you through the repo.

---

<p align="center">
  <i>Built on validated work — not buzzwords. Data Analyst · GIS & Data Scientist · AI Automation Engineer.</i><br/>
  <b>Lawrence Oladeji</b> — <code>lawdata</code>
</p>
