import { writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { blogPosts } from '../src/data/blogPosts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://dintechnologies.com'
const OUT = join(__dirname, '..', 'public', 'sitemap.xml')

const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/framework', priority: 0.9, changefreq: 'monthly' },
  { path: '/open-models', priority: 0.8, changefreq: 'weekly' },
  { path: '/reports', priority: 0.7, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/edutech', priority: 0.8, changefreq: 'monthly' },
  { path: '/ai-hub', priority: 0.8, changefreq: 'monthly' },
  { path: '/s-sme', priority: 0.7, changefreq: 'monthly' },
  { path: '/s-sme/evidence', priority: 0.5, changefreq: 'monthly' },
  { path: '/s-sme/toolkit', priority: 0.6, changefreq: 'monthly' },
  { path: '/research', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'yearly' },
]

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const urls = [...staticPages]
const seen = new Set(urls.map((u) => u.path))

for (const post of blogPosts) {
  const path = `/blog/${post.slug}`
  if (seen.has(path)) continue
  seen.add(path)
  urls.push({
    path,
    priority: 0.8,
    changefreq: 'yearly',
    lastmod: post.date,
  })
}

urls.sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(SITE_URL + u.path)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

await mkdir(join(__dirname, '..', 'public'), { recursive: true })
await writeFile(OUT, xml, 'utf8')
console.log(`sitemap.xml written: ${urls.length} URLs -> ${OUT}`)
