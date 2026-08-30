import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { blogPosts } from '../src/data/blogPosts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://dintechnologies.com'
const OUT = join(__dirname, '..', 'public', 'llms.txt')

const pages = [
  ['Home', '/', 'Dara Initiative Technology: open models, offline AI and EdTech for Africa'],
  ['Blog', '/blog', 'Notes on open models, local infrastructure and practical AI'],
  ['OpenModel Synthesis Framework (OMSF)', '/framework', 'The six-rung Openness Ladder for grading open AI models'],
  ['Open Model Leaderboard', '/open-models', 'Leading open models graded on the OMSF ladder'],
  ['Reports Library', '/reports', 'Ready-made OMSF-audited model reports'],
  ['Research', '/research', 'Academic and industry sources behind OMSF'],
  ['EduTech / SomaBox', '/edutech', 'Offline AI tutor for schools, zero internet required'],
  ['AI Training Hub', '/ai-hub', 'Hands-on AI training in Nigeria'],
  ['AI Creatives Training', '/ai-creatives-training-nigeria', 'Portfolio-first AI creatives training for Nigerian organisations: images, flyers, social packs and Reels for Lagos, Abuja and nationwide clients'],
  ['S-SME', '/s-sme', 'Sustainable SME services: green energy, offline inventory, compliance'],
  ['S-SME Toolkit', '/s-sme/toolkit', '117-item scored toolkit with fillable PDFs'],
  ['S-SME Evidence', '/s-sme/evidence', 'Published sources behind the S-SME numbers'],
  ['About', '/about', 'Mission, ecosystem and team of Dara Initiative Technology'],
  ['Contact', '/contact', 'Reach DIT'],
]

const lines = [
  '# DIT Dara Initiative Tech (DIT)',
  '',
  '> Dara Initiative Technology builds open models, offline-first AI and EdTech for communities where connectivity and power are uncertain. Based in Oyo State, Nigeria. All technical claims in our writing trace to primary sources (P1), independent benchmarks (P2) or clearly-labelled community leads (P3).',
  '',
  '## Key pages',
  '',
  ...pages.map(([label, path, desc]) => `- [${label}](${SITE_URL}${path}): ${desc}`),
  '',
  '## Blog posts',
  '',
  ...blogPosts.map(
    (p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`
  ),
  '',
]

await mkdir(join(__dirname, '..', 'public'), { recursive: true })
await writeFile(OUT, lines.join('\n'), 'utf8')
console.log(`llms.txt written: ${pages.length} pages + ${blogPosts.length} posts -> ${OUT}`)
