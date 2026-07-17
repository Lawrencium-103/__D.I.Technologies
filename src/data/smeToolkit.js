// Sustainable SME Toolkit — content model
// Source: "Practical Toolkit for Nigerian SMEs" (v1.0, 2026), prepared by Jasmmycreativity Digital Hub.
// Tools 1-4 are weighted scoring tools (rating 1-5 x weight 1-3). Tools 5-7 are practical aids.

export const ratingScale = [
  { v: 1, label: 'Absent', desc: 'Not in place at all - no policy, no practice, no records' },
  { v: 2, label: 'Aware', desc: 'You know it matters but have not started acting on it' },
  { v: 3, label: 'Starting', desc: 'Basic steps taken, informal, not yet consistent' },
  { v: 4, label: 'Embedded', desc: 'Documented, practiced regularly, with some records' },
  { v: 5, label: 'Optimised', desc: 'Fully embedded, measured, reviewed, continuously improved' },
]

// Per-rating status colour (drives the green / yellow / red indicators)
export function ratingStatus(r) {
  if (!r) return 'none'
  if (r <= 2) return 'red'
  if (r === 3) return 'yellow'
  return 'green'
}

// Four maturity tiers, shared across Tools 1-4. Bands are percent of maximum.
export const tiers = [
  {
    label: 'Beginner',
    min: 0,
    max: 40,
    color: 'red',
    advice:
      'Foundational gaps exist. Close the three lowest-scoring weight-3 items in the next 90 days before adding anything new.',
  },
  {
    label: 'Progressing',
    min: 40,
    max: 60,
    color: 'yellow',
    advice:
      'Foundations are in place but practices are inconsistent. Build discipline and documentation; lift every weight-3 item to a 4.',
  },
  {
    label: 'Established',
    min: 60,
    max: 80,
    color: 'green',
    advice:
      'You operate professionally with documented systems. You are fundable. Deepen measurement and plan for owner independence.',
  },
  {
    label: 'Leader',
    min: 80,
    max: 101,
    color: 'emerald',
    advice:
      'You are a reference within your sector. Mentor another SME, pursue certification, and explore new markets.',
  },
]

export function tierFor(pct) {
  return tiers.find((t) => pct >= t.min && pct < t.max) || tiers[tiers.length - 1]
}

export const scoringTools = [
  {
    id: 't1',
    title: 'Tool 1 - SME Business Evaluation Tool',
    intro:
      'A snapshot of how healthy your SME is across governance, financial health, operations, market, and people. Score honestly - the value comes from surfacing gaps.',
    maxWeightSum: 44,
    items: [
      { n: 1, text: 'Business is registered with CAC (Limited Liability or Enterprise name)', weight: 3, note: 'Unregistered businesses cannot open corporate accounts, bid for contracts, or access BoI/DBN finance.' },
      { n: 2, text: 'CAC annual returns filed for the last 2 years', weight: 2, note: 'Late filing attracts penalties and can lead to delisting; financiers check this.' },
      { n: 3, text: 'FIRS TIN obtained and VAT registered (if turnover exceeds N25m/year)', weight: 3, note: 'VAT registration is mandatory above the threshold; non-registration triggers back-tax assessment.' },
      { n: 4, text: 'Tax filings (VAT, PAYE, CIT) are current with receipts', weight: 3, note: 'Tax clearance certificate is required for most government and large-customer contracts.' },
      { n: 5, text: "Business has a separate corporate bank account from owner's personal account", weight: 3, note: 'Mixing funds destroys financial visibility and disqualifies you from formal finance.' },
      { n: 6, text: 'Audited or professionally compiled financial statements for the last 2 years', weight: 2, note: 'BoI, DBN and most commercial lenders require 2-3 years of statements.' },
      { n: 7, text: 'Monthly management accounts (P&L, cash position) prepared internally', weight: 2, note: 'You cannot steer what you do not measure - most SME failures stem from cash blindness.' },
      { n: 8, text: 'Cash flow forecast covering at least the next 3 months', weight: 2, note: 'Helps anticipate crunches (VAT week, salary week) and plan working capital.' },
      { n: 9, text: 'Inventory and/or job costing tracked per product or service line', weight: 2, note: 'Reveals which products actually make money after direct costs.' },
      { n: 10, text: 'Debtors aged report maintained and overdue invoices actively chased', weight: 2, note: 'Late customer payments are the leading cause of cash crunches in Nigerian B2B SMEs.' },
      { n: 11, text: 'Documented standard operating procedures (SOPs) for the top 5 recurring activities', weight: 2, note: 'Reduces dependence on the owner and on key staff.' },
      { n: 12, text: 'Sales and customer data captured digitally (POS, CRM, or spreadsheet)', weight: 2, note: 'Customer behaviour insights are impossible without structured data.' },
      { n: 13, text: 'At least one supplier for critical inputs has a written contract or SLA', weight: 1, note: 'Reduces supply shocks; increasingly demanded by auditors and large customers.' },
      { n: 14, text: 'No single customer accounts for more than 30% of revenue', weight: 3, note: 'Customer concentration is the single biggest revenue risk for small Nigerian firms.' },
      { n: 15, text: 'At least 3 active sales/marketing channels (walk-in, WhatsApp, social, referrals)', weight: 2, note: 'Channel diversification protects against platform shocks.' },
      { n: 16, text: 'Brand assets (logo, colours, tagline) are documented and used consistently', weight: 1, note: 'Builds recognisability and trust; required to scale or franchise.' },
      { n: 17, text: 'All staff have written employment letters and the business is registered with NSITF/Pension', weight: 3, note: 'Mandatory under the Pension Reform Act; non-compliance attracts penalties.' },
      { n: 18, text: 'Staff have clear roles, performance targets, and at least one annual review', weight: 2, note: 'Drives accountability and retention in a tight SME labour market.' },
      { n: 19, text: 'At least one staff member (including the owner) trained in the last 12 months', weight: 1, note: 'Skill decay is rapid; training retains talent and competitiveness.' },
      { n: 20, text: 'The business has a documented succession or key-person plan', weight: 1, note: 'Protects the business if the owner or a key staff member exits.' },
    ],
  },
  {
    id: 't2',
    title: 'Tool 2 - Green Energy Evaluation Checklist',
    intro:
      'Energy is one of the top three operating costs for almost every Nigerian SME. This tool evaluates readiness to shift load to cleaner, cheaper, more resilient sources.',
    maxWeightSum: 44,
    items: [
      { n: 1, text: 'You know your average monthly electricity consumption in kWh (grid + generator)', weight: 3, note: 'Without a baseline you cannot size a solar system or measure savings.' },
      { n: 2, text: 'You know your average monthly diesel or petrol consumption (litres) and cost', weight: 3, note: 'Generator fuel is usually 40-70% of SME energy cost; tracking it is the first step.' },
      { n: 3, text: 'You have a 7-day load profile (hour-by-hour power demand) for a typical day', weight: 2, note: 'Solar vendors size systems off this profile; without it you over- or under-size.' },
      { n: 4, text: 'You have identified your critical loads (what must stay on during an outage)', weight: 2, note: 'Critical-load sizing determines battery bank size, the biggest cost driver.' },
      { n: 5, text: 'Roof or ground space available for solar panels has been measured (m2)', weight: 2, note: 'Array sizing is constrained by available space, not just by kWh need.' },
      { n: 6, text: 'Roof orientation and shading have been assessed (south-facing is ideal)', weight: 1, note: 'Shading can cut yield by 20-40%.' },
      { n: 7, text: 'Roof structural condition has been inspected (no leaks, can carry panel weight)', weight: 2, note: 'A weak roof will leak within 12 months of mounting.' },
      { n: 8, text: 'All lighting has been converted to LED', weight: 2, note: 'Lowest-cost efficiency measure - payback under 9 months in Nigeria.' },
      { n: 9, text: 'Air conditioners are inverter-type and sized correctly for each room', weight: 1, note: 'Inverter ACs use 30-40% less power.' },
      { n: 10, text: 'Refrigeration door seals checked and condensers cleaned quarterly', weight: 1, note: 'Dirty condensers raise power draw by 15-25%.' },
      { n: 11, text: 'Major equipment is serviced on a written schedule', weight: 2, note: 'Poorly serviced equipment draws more power and breaks down more often.' },
      { n: 12, text: 'Power factor measured and corrected if below 0.9 (businesses with motors)', weight: 1, note: 'Low power factor attracts DisCo surcharges and oversizes your inverter.' },
      { n: 13, text: 'Battery backup sizing calculated for at least 4 hours of critical load', weight: 2, note: '4 hours is the typical Nigerian evening gap.' },
      { n: 14, text: 'Inverter sizing covers continuous load plus 25% headroom for surge', weight: 2, note: 'Inverter overload is the most common cause of system shutdowns.' },
      { n: 15, text: 'System design reviewed by an independent engineer (not just the vendor)', weight: 3, note: 'Independent review saves 10-20% on inflated vendor designs.' },
      { n: 16, text: 'You have read the REA programmes relevant to your area', weight: 2, note: 'REA funds mini-grids and productive-use solar; rebates available.' },
      { n: 17, text: 'You have checked whether your site is served by an active mini-grid operator', weight: 1, note: 'Mini-grid tariffs are often 30-50% cheaper than diesel, zero capex.' },
      { n: 18, text: 'You have requested at least 2 competitive quotes from vetted installers', weight: 2, note: 'Solar prices vary by 40%+ between vendors for identical specs.' },
      { n: 19, text: 'Proposed system includes monitoring (portal or app showing production/consumption)', weight: 2, note: 'Without monitoring you cannot detect performance drift or warranty issues.' },
      { n: 20, text: 'Vendor offers at least 5-year inverter and 10-year panel warranty', weight: 2, note: 'Inverter failure is the most common post-installation issue.' },
      { n: 21, text: 'End-of-life plan for batteries and panels exists (vendor or NESREA recycler)', weight: 1, note: 'NESREA classifies solar batteries and panels as e-waste; dumping is illegal.' },
      { n: 22, text: 'You have a financing plan (cash, BoI Solar Fund, lease, or Pay-As-You-Go)', weight: 3, note: 'Solar capex is the biggest barrier; structured finance turns it into an opex.' },
    ],
  },
  {
    id: 't3',
    title: 'Tool 3 - Business Location Sustainability Checklist',
    intro:
      'Where you operate from is expensive to reverse. This tool evaluates your current site or one you are considering, across power, water, access, environment, security, and regulation.',
    maxWeightSum: 48,
    items: [
      { n: 1, text: 'Average grid power availability is at least 8 hours per day', weight: 3, note: 'Below 8 hours means your generator becomes primary - diesel cost dominates.' },
      { n: 2, text: 'You know the local DisCo feeder reliability', weight: 2, note: 'Industrial feeders get priority restoration; residential feeders suffer longer outages.' },
      { n: 3, text: 'A three-phase connection is available if your equipment requires it', weight: 2, note: 'Upgrading after lease signing is expensive and slow.' },
      { n: 4, text: 'Transformer is dedicated to the area or shared only with commercial users', weight: 2, note: 'Shared residential transformers trip more often.' },
      { n: 5, text: 'Reliable piped water is available, or a borehole is feasible on the plot', weight: 2, note: 'Water trucking can add N50,000-N200,000 per month.' },
      { n: 6, text: 'Drainage does not flood during typical rainy-season downpours', weight: 3, note: 'Flooded stock is a total loss in Lagos, Port Harcourt, Ibadan, Kano.' },
      { n: 7, text: 'Toilet and sanitation facilities meet minimum public-health standards', weight: 2, note: 'Required for NAFDAC, hospitality licences, and staff welfare.' },
      { n: 8, text: 'Site is within 30 minutes of your top 3 customer segments or suppliers', weight: 2, note: 'Long distances inflate logistics cost and reduce responsiveness.' },
      { n: 9, text: 'Public transport serves the area (staff and customers can reach you)', weight: 2, note: 'Poor connectivity makes recruiting and retention expensive.' },
      { n: 10, text: 'Road access is paved and passable year-round', weight: 2, note: 'Unpaved access cuts visits and damages vehicles and goods.' },
      { n: 11, text: 'Internet (fibre or reliable 4G) available from at least 2 providers', weight: 2, note: 'Single-provider areas are risky for POS and cloud tools.' },
      { n: 12, text: 'Loading bay or parking accommodates delivery vehicles without blocking traffic', weight: 1, note: 'Blocked access leads to fines and complaints.' },
      { n: 13, text: 'Site is not within 30 metres of a major watercourse or wetland', weight: 3, note: 'NESREA setbacks forbid some activities near water; flood risk higher.' },
      { n: 14, text: 'Site is not downwind of a major polluter (refinery, abattoir, dump)', weight: 2, note: 'Air pollution affects staff health, product quality, and perception.' },
      { n: 15, text: 'Waste collection serves the area, or you have a contracted collector', weight: 2, note: 'Open dumping attracts NESREA fines and pests.' },
      { n: 16, text: 'Crime rate is moderate to low; police or civil defence post nearby', weight: 3, note: 'Theft and vandalism are leading causes of SME losses.' },
      { n: 17, text: 'Site has perimeter fencing and lockable storage for high-value inventory', weight: 2, note: 'Physical security is the cheapest risk management.' },
      { n: 18, text: 'Fire service or trained private response reachable within 20 minutes', weight: 1, note: 'Market and estate fires spread fast; response time matters.' },
      { n: 19, text: 'Certificate of Occupancy (C of O) or governor’s consent exists', weight: 3, note: 'Without proper title you cannot use the property as collateral and risk eviction.' },
      { n: 20, text: 'Land use zoning permits your type of business activity', weight: 2, note: 'Residential-zone businesses face frequent shutdown orders.' },
      { n: 21, text: 'Required state-level permits (LASG, OGSG, etc.) are obtainable and affordable', weight: 2, note: 'Some states impose signage, hawking, or environmental permits.' },
      { n: 22, text: 'Local community / landlord relationship is documented and stable', weight: 1, note: 'Community disputes can shut operations overnight with no recourse.' },
    ],
  },
  {
    id: 't4',
    title: 'Tool 4 - General Sustainability Operations Checklist',
    intro:
      'The day-to-day practices that determine whether your business is responsible in operation, not just on paper. Many items are cheap or free; value comes from consistency.',
    maxWeightSum: 45,
    items: [
      { n: 1, text: 'Waste is segregated at source into recyclables, organics, and general waste', weight: 2, note: 'Segregation is the foundation of every waste-reduction programme.' },
      { n: 2, text: 'A licensed waste collector (LAWMA-accredited, etc.) is contracted', weight: 3, note: 'Open dumping is illegal under NESREA and attracts escalating fines.' },
      { n: 3, text: 'Recyclable materials are sold or donated to recyclers', weight: 1, note: 'Generates small revenue and diverts 20-40% of waste from landfill.' },
      { n: 4, text: 'Organic waste is composted or donated to farmers', weight: 1, note: 'Reduces collection cost and supports local agriculture.' },
      { n: 5, text: 'E-waste is collected separately for NESREA-licensed recyclers', weight: 2, note: 'E-waste contains lead, mercury, cadmium; dumping contaminates soil.' },
      { n: 6, text: 'Plastic single-use items have been reduced or eliminated', weight: 2, note: 'Several states have plastic-bag restrictions; sentiment is shifting fast.' },
      { n: 7, text: 'Monthly water consumption is tracked and reviewed against a target', weight: 2, note: 'Untracked water use creeps up through hidden leaks.' },
      { n: 8, text: 'Taps fitted with low-flow aerators and toilets with dual-flush', weight: 1, note: 'Cheap retrofit that cuts water use by 20-40%.' },
      { n: 9, text: 'Rainwater harvesting in place for non-potable uses', weight: 1, note: 'Free water source; valuable in high-rainfall states.' },
      { n: 10, text: 'Greywater from sinks reused for landscaping where feasible', weight: 1, note: 'Reduces water consumption and discharge volume.' },
      { n: 11, text: 'Suppliers evaluated on sustainability criteria', weight: 2, note: 'Your footprint includes your supply chain; large customers ask for this.' },
      { n: 12, text: 'Local sourcing preferred where quality and price are competitive', weight: 2, note: 'Reduces logistics emissions and hedges currency shocks.' },
      { n: 13, text: 'Packaging minimised and uses recyclable or biodegradable materials', weight: 2, note: 'Brand benefit; aligns with Extended Producer Responsibility rules.' },
      { n: 14, text: 'Hazardous materials stored and disposed of per NESREA guidelines', weight: 3, note: 'Mismanagement triggers cleanup liability exceeding business value.' },
      { n: 15, text: 'Invoicing, receipts, and contracts sent digitally by default', weight: 2, note: 'Cuts paper cost, speeds cash collection, creates an audit trail.' },
      { n: 16, text: 'Internal records stored in cloud or local server, not paper files', weight: 2, note: 'Improves retrieval, enables remote work, protects against loss.' },
      { n: 17, text: 'Meetings default to virtual where physical attendance is not essential', weight: 1, note: 'Saves travel time, fuel, and vehicle wear.' },
      { n: 18, text: 'Staff trained on sustainability practices at least once a year', weight: 2, note: 'Practice only changes with awareness.' },
      { n: 19, text: 'Business supports at least one community initiative', weight: 1, note: 'Builds social licence; talent is often found through community work.' },
      { n: 20, text: 'Workplace is inclusive with a written non-discrimination policy', weight: 2, note: 'Required by growing number of corporate customers.' },
      { n: 21, text: 'A simple annual sustainability report (1-2 pages) is produced', weight: 2, note: 'Forces consolidation of progress; financiers expect this.' },
      { n: 22, text: 'Sustainability KPIs reviewed at least quarterly', weight: 2, note: 'What is not reviewed does not improve (see Tool 5).' },
      { n: 23, text: 'Tier-1 suppliers screened annually for environmental and labour compliance', weight: 2, note: 'Aligns with EU ESRS S2 and IFC PS2.' },
      { n: 24, text: 'Take-back, repair, or refurbish programme for at least one product line', weight: 1, note: 'Operationalises circular-economy principles; opens aftermarket revenue.' },
      { n: 25, text: 'Site and supply chain screened for deforestation / biodiversity impact', weight: 2, note: 'Required by EU export buyers under EUDR from 2025.' },
    ],
  },
]

// Tool 5 - Sustainability KPI Tracker (not scored; variance tracked)
export const kpis = [
  { key: 'grid', label: 'Grid electricity', unit: 'kWh', note: 'Read prepaid/postpaid meter same date each month' },
  { key: 'diesel', label: 'Diesel / petrol', unit: 'Litres', note: 'Sum fuel purchases from receipts' },
  { key: 'water', label: 'Water', unit: 'Litres', note: 'Borehole meter, truck invoices, or estimate' },
  { key: 'waste', label: 'General waste', unit: 'kg', note: 'Weigh bags; multiply by frequency' },
  { key: 'recyclables', label: 'Recyclables diverted', unit: 'kg', note: 'Weights from recycler receipts' },
  { key: 'paper', label: 'Paper consumed', unit: 'Reams', note: 'Count reams (500 sheets)' },
  { key: 'carbon', label: 'Carbon (estimated)', unit: 'kg CO2e', note: 'Diesel x 2.68 + grid kWh x 0.40' },
]

// Tool 6 - Funding Application Checklist (checklist, no scoring)
export const fundingSections = [
  {
    title: 'Mandatory documents (every lender)',
    items: [
      'CAC registration certificate (Form CAC 1.1 or equivalent)',
      'Memorandum and Articles of Association (MEMART)',
      'FIRS Tax Identification Number (TIN) certificate',
      'Tax Clearance Certificate (TCC) for the last 3 years',
      'VAT registration certificate (if turnover above threshold)',
      "Directors' / owner's valid ID (NIN, Driver's Licence, Passport, Voter's Card)",
      'Utility bill (proof of business address, not older than 3 months)',
      'Bank statements for the last 12 months (corporate account)',
      'Bank reference letter from your corporate bank',
      "Resolution of the board (or owner's consent) to borrow",
    ],
  },
  {
    title: 'Business plan components',
    items: [
      'Executive summary (1-2 pages)',
      'Business description and history',
      'Product or service description (pricing, units, margins)',
      'Market analysis (target customers, competitors, size)',
      'Marketing and sales strategy',
      'Operations plan (location, capacity, suppliers, processes)',
      'Management team and key staff bios',
      'SWOT or risk analysis with mitigations',
      '3-year financial projections (P&L, cash flow, balance sheet)',
      'Use of funds breakdown (itemised, with quotes)',
      'Repayment plan showing cash flow covers principal and interest',
    ],
  },
  {
    title: 'Financial records',
    items: [
      'Audited financial statements for the last 2-3 years',
      'Management accounts for the current year (monthly)',
      'Bank statements reconciled with financial statements',
      'Tax filings reconciled with financial statements',
      'Aged debtors and creditors report',
      'Inventory valuation report',
      'Fixed asset register with proof of ownership',
      'Customer contracts or purchase orders',
    ],
  },
  {
    title: 'Sustainability / green finance add-ons',
    items: [
      'Energy audit report (kWh + diesel baseline)',
      'Solar system design and vendor quote (for solar loans)',
      'Projected energy savings and payback calculation',
      'NESREA compliance certificate or environmental impact assessment',
      'Sustainability KPI tracker (last 6-12 months)',
      'Brief sustainability policy (1 page)',
      'Carbon footprint estimate (annual)',
    ],
  },
  {
    title: 'Common rejection reasons (avoid these)',
    items: [
      'Bank statements do not match stated revenue',
      'Use of funds is vague (e.g. "working capital")',
      'Tax filings are behind or inconsistent',
      'No collateral registered or value understated',
      'Repayment plan ignores seasonality',
      'Business plan reads like a marketing brochure',
      "Owner's personal credit has unresolved issues (BVN report)",
      'Application submitted incomplete',
    ],
  },
]

export const fundingWhere = [
  { inst: 'Bank of Industry (BoI)', window: 'Solar Energy Fund, SME Loans', best: 'Solar capex, equipment, expansion', url: 'boi.ng' },
  { inst: 'Development Bank of Nigeria (DBN)', window: 'SME loans via PFIs', best: 'Working capital, growth capex', url: 'dbn.ng' },
  { inst: 'SMEDAN', window: 'Conditional Grant Scheme, MSME clinics', best: 'Micro and small enterprises', url: 'smedan.gov.ng' },
  { inst: 'CBN', window: 'Intervention windows (AGSMEIS, TCF, others)', best: 'Sector-specific, often via PFIs', url: 'cbn.gov.ng' },
  { inst: 'REA Nigeria', window: 'Productive Use, Mini-grid, EAEP', best: 'Solar for productive use clusters', url: 'rea.gov.ng' },
  { inst: 'Commercial banks', window: 'Various SME loans', best: 'Quick, smaller-ticket finance', url: '' },
  { inst: 'Impact investors', window: 'SunFunder, All On, ETC', best: 'Green SMEs with social impact', url: '' },
]

// Tool 7 - Risk and Compliance Calendar
export const monthlyObligations = [
  { n: 1, obligation: 'PAYE remittance for staff salaries', agency: 'State IRS (e.g. LIRS)', due: '10th of following month', penalty: 'Late payment interest + penalties' },
  { n: 2, obligation: 'Pension contribution remittance', agency: 'PFA via PENCOM', due: '15th of following month', penalty: 'Penalty charges; loss of NSITF cover' },
  { n: 3, obligation: 'NSITF (Employees’ Compensation) contribution', agency: 'NSITF', due: '15th of following month', penalty: 'Penalties; staff not covered' },
  { n: 4, obligation: 'VAT remittance (if registered)', agency: 'FIRS', due: '21st of following month', penalty: 'N10,000 fine + interest; account freeze risk' },
  { n: 5, obligation: 'Withholding tax remittance', agency: 'FIRS / State IRS', due: '21st of following month', penalty: 'Interest + penalty; TCC withheld' },
  { n: 6, obligation: 'Industrial Training Fund (ITF) contribution', agency: 'ITF', due: 'Varies - typically quarterly', penalty: '1-2% of payroll penalty' },
]

export const annualObligations = [
  { month: 'January', obligation: 'Renew business premises permit / registration', agency: 'State ministry / local government', notes: 'Annual fee; failure leads to sealed premises' },
  { month: 'January', obligation: 'Start-of-year staff review; reset KPI tracker', agency: 'Internal', notes: 'Sets the tone for the year' },
  { month: 'February', obligation: 'Prepare ITF annual return', agency: 'ITF', notes: 'Due 1 April' },
  { month: 'March', obligation: 'NSITF annual return', agency: 'NSITF', notes: '28 Feb - 31 Mar window' },
  { month: 'March', obligation: 'PENCOM annual return', agency: 'PENCOM', notes: 'Confirm contributions reconciled' },
  { month: 'April', obligation: 'ITF annual return deadline', agency: 'ITF', notes: 'Significant late penalty' },
  { month: 'April', obligation: 'Start preparing annual financial statements', agency: 'Internal / auditor', notes: 'Required for June CAC filing' },
  { month: 'May', obligation: 'Submit financial statements to auditor', agency: 'External auditor', notes: 'Audit takes 6-8 weeks' },
  { month: 'June', obligation: 'CAC annual returns filing', agency: 'CAC', notes: 'Penalty accrues monthly; delisting after 3 years' },
  { month: 'June', obligation: 'FIRS Company Income Tax (CIT) filing', agency: 'FIRS', notes: 'Due 30 June for Dec year-end' },
  { month: 'July', obligation: 'Mid-year sustainability KPI review', agency: 'Internal', notes: 'Compare H1 actuals to targets' },
  { month: 'July', obligation: 'Renew professional / industry licences', agency: 'Industry regulator', notes: 'Track renewal windows' },
  { month: 'August', obligation: 'Fire safety certificate renewal', agency: 'State fire service', notes: 'Required for hospitality, retail, manufacturing' },
  { month: 'September', obligation: 'NESREA environmental permit renewal', agency: 'NESREA', notes: 'Manufacturing, healthcare, chemical' },
  { month: 'September', obligation: 'Insurance policy renewals', agency: 'Insurance broker', notes: 'Shop for quotes 4 weeks before' },
  { month: 'October', obligation: 'Internal audit / compliance self-check (Tools 1-4)', agency: 'Internal', notes: 'Identify gaps before year-end' },
  { month: 'November', obligation: 'Begin year-end tax planning', agency: 'Accountant', notes: 'Do not leave to December' },
  { month: 'December', obligation: 'Year-end stock count and asset verification', agency: 'Internal', notes: 'Feeds audited statements' },
  { month: 'December', obligation: 'Staff bonus / 13th-cheque calculations', agency: 'Internal', notes: 'Avoid January cash crunch' },
]
// Fillable DIT-branded PDFs (themed from the original toolkit forms, served from /sme-toolkit/)
export const smePdfDownloads = [
  {
    label: 'Tool 1 - SME Business Evaluation',
    file: '/sme-toolkit/DIT_Tool-1-SME-Business-Evaluation.pdf',
    summary: 'Rates 18 questions on finance, operations, market, people and sustainability.',
    achieve: 'See your maturity tier and the gaps to fix before you seek funding or coaching.',
  },
  {
    label: 'Tool 2 - Green Energy Evaluation',
    file: '/sme-toolkit/DIT_Tool-2-Green-Energy-Checklist.pdf',
    summary: 'Checks your energy use and the savings from generators, solar and efficiency fixes.',
    achieve: 'Find the quick wins that cut both cost and emissions before you buy solar or apply for green finance.',
  },
  {
    label: 'Tool 3 - Business Location Sustainability',
    file: '/sme-toolkit/DIT_Tool-3-Business-Location-Checklist.pdf',
    summary: 'Rates how sustainable and resilient your site is: access, logistics, climate risk and utilities.',
    achieve: 'Back up a lease, relocation or site choice to a partner, bank or investor.',
  },
  {
    label: 'Tool 4 - General Sustainability Operations',
    file: '/sme-toolkit/DIT_Tool-4-Sustainability-Operations.pdf',
    summary: 'Audits daily operations, waste, water, sourcing and compliance, and builds a sustainability policy.',
    achieve: 'Answer the questionnaires buyers, NGOs and tender processes now ask for.',
  },
  {
    label: 'Tool 5 - Sustainability KPI Tracker',
    file: '/sme-toolkit/DIT_Tool-5-KPI-Tracker.pdf',
    summary: 'Tracks energy, water, waste, emissions and spend month by month; the sheet calculates variance for you.',
    achieve: 'Report to investors, regulators and tenders with numbers, not guesses.',
  },
  {
    label: 'Tool 6 - Funding Application Checklist',
    file: '/sme-toolkit/DIT_Tool-6-Funding-Application-Checklist.pdf',
    summary: 'Lists the documents Nigerian funders ask for: CAC, tax, financials and your pitch.',
    achieve: 'Walk into BoI, DBN or CBN applications complete instead of scrambling the night before.',
  },
  {
    label: 'Tool 7 - Risk & Compliance Calendar',
    file: '/sme-toolkit/DIT_Tool-7-Compliance-Calendar.pdf',
    summary: 'A 12-month calendar of the statutory dates you cannot miss: FIRS, VAT, PAYE, CAC, NSITF, ITF and pension.',
    achieve: 'Tick each one off as it is done and avoid the penalties that sink cash-flow.',
  },
]

// Standards Alignment Matrix — DIT-branded Excel companion workbook
// Item-by-item cross-reference of Tools 1-7 to IFC PS1-PS8, EU ESRS / VSME / EU Taxonomy,
// and 14 Nigerian regulators. Includes a "How to use" sheet.
export const smeMatrix = {
  label: 'Standards Alignment Matrix (Excel)',
  file: '/sme-toolkit/Sustainable-SME-Standards-Matrix.xlsx',
  description:
    'One workbook that proves your SME meets the frameworks that matter: IFC Performance Standards (PS1-PS8), EU ESRS, the VSME standard and EU Taxonomy, and 14 Nigerian regulators (CAC, FIRS, NESREA, SMEDAN/FRCN, BoI, DBN, CBN, REA and more). 117 items, individually mapped, with a built-in How-to-use sheet.',
}
