// Phase 1 indexation helper: ensure netlify.toml has a clean-URL redirect
// for EVERY blog post so Google/AI crawlers get the prerendered HTML at the
// canonical /blog/<slug> URL (and never fall back to the SPA shell).
// Idempotent: only appends redirects for slugs not already present.
import { readFile, writeFile } from 'node:fs/promises'
import { blogPosts } from '../src/data/blogPosts.js'

const NETLIFY = 'netlify.toml'
const slugs = blogPosts.map((p) => p.slug)

let toml = await readFile(NETLIFY, 'utf8')

// Collect existing clean-URL blog redirects.
const existing = new Set(
  [...toml.matchAll(/from\s*=\s*"\/blog\/([^"/]+)"\s*$/gm)].map((m) => m[1])
)

const missing = slugs.filter((s) => !existing.has(s)).sort()

if (missing.length === 0) {
  console.log(`All ${slugs.length} blog posts already have redirects. Nothing to add.`)
} else {
  const block = missing
    .map((s) => `[[redirects]]\n  from = "/blog/${s}"\n  to = "/blog/${s}.html"\n  status = 200`)
    .join('\n')
  toml = toml.trimEnd() + '\n\n# Prerendered blog posts (complete list, kept in sync with src/data/blogPosts.js)\n' + block + '\n'
  await writeFile(NETLIFY, toml, 'utf8')
  console.log(`Added ${missing.length} blog redirects. Total posts covered: ${slugs.length}`)
  console.log('Added:')
  missing.forEach((s) => console.log(`  /blog/${s}`))
}