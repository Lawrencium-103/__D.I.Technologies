import fs from 'node:fs'

const src = 'C:/Users/user/Downloads/'
const out = 'public/sme-toolkit/'
const names = [
  'DIT_Tool-1-SME-Business-Evaluation.pdf',
  'DIT_Tool-2-Green-Energy-Checklist.pdf',
  'DIT_Tool-3-Business-Location-Checklist.pdf',
  'DIT_Tool-4-Sustainability-Operations.pdf',
  'DIT_Tool-5-KPI-Tracker.pdf',
  'DIT_Tool-6-Funding-Application-Checklist.pdf',
  'DIT_Tool-7-Compliance-Calendar.pdf',
]
for (const n of names) {
  fs.copyFileSync(src + n, out + n)
  console.log('restored:', n)
}
