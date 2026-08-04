import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(__dirname, '..', 'content', 'blog')
const OUT = join(__dirname, '..', 'src', 'data', 'generatedPosts.js')

function cleanQuotes(val) {
  const s = val.trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  return s
}

function parseFrontmatter(raw) {
  const fm = {}
  const lines = raw.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) {
      i++
      continue
    }
    const idx = line.indexOf(':')
    if (idx === -1) {
      i++
      continue
    }
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()

    if (val === '' && key === 'references') {
      const arr = []
      i++
      while (i < lines.length && lines[i].trim().startsWith('-')) {
        arr.push(cleanQuotes(lines[i].trim().replace(/^-\s*/, '')))
        i++
      }
      fm[key] = arr
      continue
    }

    fm[key] = cleanQuotes(val)
    i++
  }
  return fm
}

function parseBlocks(bodyLines) {
  const blocks = []
  const L = bodyLines.length
  let i = 0
  while (i < L) {
    const line = bodyLines[i]
    const t = line.trim()
    if (!t) {
      i++
      continue
    }

    if (t.startsWith('## ')) {
      blocks.push({ type: 'heading', text: t.slice(3).trim() })
      i++
    } else if (t.startsWith('> ')) {
      const content = t.slice(2).trim()
      if (/^\[callout:/i.test(content)) {
        const end = content.indexOf(']')
        const title = content.slice(9, end).trim()
        const text = content.slice(end + 1).trim()
        blocks.push({ type: 'callout', title, text })
        i++
      } else if (/^TL;DR/i.test(content)) {
        const parts = [content.replace(/^TL;DR\s*/i, '').trim()]
        i++
        while (i < L && bodyLines[i].trim().startsWith('> ')) {
          parts.push(bodyLines[i].trim().slice(2).trim().replace(/^-\s*/, ''))
          i++
        }
        blocks.push({ type: 'tldr', text: parts.filter(Boolean).join(' ') })
      } else {
        let text = content
        let cite = ''
        i++
        if (i < L) {
          const nx = bodyLines[i].trim()
          if (nx.startsWith('> ') && /^\(.+\)$/.test(nx.slice(2).trim())) {
            cite = nx.slice(2).trim().replace(/^\(|\)$/g, '')
            i++
          }
        }
        blocks.push({ type: 'quote', text, cite })
      }
    } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(t)) {
      const m = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      blocks.push({ type: 'image', src: m[2].trim(), alt: m[1].trim() })
      i++
    } else if (t.startsWith('- ')) {
      const items = []
      while (i < L && bodyLines[i].trim().startsWith('- ')) {
        items.push(bodyLines[i].trim().slice(2).trim())
        i++
      }
      blocks.push({ type: 'list', items })
    } else {
      blocks.push({ type: 'paragraph', text: t })
      i++
    }
  }

  const leadIdx = blocks.findIndex((b) => b.type === 'paragraph')
  if (leadIdx !== -1) {
    blocks[leadIdx] = { ...blocks[leadIdx], type: 'lead' }
  }

  return blocks
}

async function main() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'))

  const posts = []
  for (const file of files) {
    if (file === 'standard-blog-post.md') continue
    const raw = await readFile(join(CONTENT_DIR, file), 'utf8')

    const fenceIdx = raw.indexOf('---')
    const fenceEnd = raw.indexOf('---', fenceIdx + 3)
    if (fenceIdx === -1 || fenceEnd === -1) {
      console.warn(`[build-posts] skip ${file}: no frontmatter`)
      continue
    }

    const fm = parseFrontmatter(raw.slice(fenceIdx + 3, fenceEnd))
    if (!fm.slug || !fm.title) {
      console.warn(`[build-posts] skip ${file}: missing slug/title in frontmatter`)
      continue
    }

    const bodyLines = raw
      .slice(fenceEnd + 3)
      .split('\n')
      .map((l) => l.trimEnd())

    posts.push({
      slug: fm.slug,
      title: fm.title,
      excerpt: fm.excerpt || '',
      date: fm.date,
      author: 'blogAuthor',
      category: fm.category || 'Notes',
      readingTime: fm.readingTime || '8 min',
      template: fm.template || 'standard',
      cover: fm.cover || '',
      coverAlt: fm.coverAlt || fm.title,
      body: parseBlocks(bodyLines),
      ...(Array.isArray(fm.references) && fm.references.length ? { references: fm.references } : {}),
    })
  }

  posts.sort((a, b) => String(b.date).localeCompare(String(a.date)))

  const entries = posts
    .map(
      (p) => `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    excerpt: ${JSON.stringify(p.excerpt)},
    date: ${JSON.stringify(p.date)},
    author: ${p.author},
    category: ${JSON.stringify(p.category)},
    readingTime: ${JSON.stringify(p.readingTime)},
    template: ${JSON.stringify(p.template)},
    cover: ${JSON.stringify(p.cover)},
    coverAlt: ${JSON.stringify(p.coverAlt)},
    body: ${JSON.stringify(p.body).replace(/"type":"(\w+)"/g, 'type: "$1"')},
${p.references ? `    references: ${JSON.stringify(p.references, null, 2).replace(/\n\s*/g, ' ')}` : ''}
  },`
    )
    .join('\n')

  const out = `// AUTO-GENERATED from content/blog/*.md by scripts/build-posts.mjs. Do not edit.
import { blogAuthor } from './blogAuthor.js'

export const generatedPosts = [
${entries}
]
`

  await writeFile(OUT, out, 'utf8')
  console.log(`[build-posts] ${posts.length} post(s) compiled -> ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
