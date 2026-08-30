// Generates branded 1600x900 PNG cover images for every blog post whose
// cover is a placeholder (picsum) or points at a missing local file.
// Covers are written to public/images/blog/<slug>/cover.png and referenced
// from frontmatter / blogPosts.js as absolute URLs so og:image always works.
//
// Usage:
//   node scripts/generate-covers.mjs          # generate missing covers only
//   node scripts/generate-covers.mjs --force  # regenerate every cover
//
// Zero dependencies: PNGs are encoded by hand (zlib + CRC32) and text is
// drawn with a built-in 5x7 bitmap font. Covers are committed to the repo,
// so this script only needs to be re-run when covers change.

import { deflateSync } from 'node:zlib'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { blogPosts } from '../src/data/blogPosts.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'images', 'blog')
const W = 1600
const H = 900
const FORCE = process.argv.includes('--force')

// ---------------------------------------------------------------------------
// Theme palette per category (matched by keyword, ordered by specificity)
// ---------------------------------------------------------------------------
const THEMES = {
  profiles: { bgTop: [11, 18, 32], bgBottom: [16, 30, 56], accent: [34, 211, 238], text: [248, 250, 252], kicker: 'MODEL PROFILE' },
  history: { bgTop: [23, 18, 8], bgBottom: [36, 26, 11], accent: [245, 158, 11], text: [255, 247, 237], kicker: 'HISTORY' },
  opensource: { bgTop: [6, 23, 15], bgBottom: [11, 36, 24], accent: [52, 211, 153], text: [236, 253, 245], kicker: 'OPEN SOURCE' },
  infra: { bgTop: [20, 11, 36], bgBottom: [30, 18, 53], accent: [167, 139, 250], text: [245, 243, 255], kicker: 'AI INFRASTRUCTURE' },
  edtech: { bgTop: [6, 32, 28], bgBottom: [10, 44, 38], accent: [45, 212, 191], text: [240, 253, 250], kicker: 'EDTECH' },
  policy: { bgTop: [32, 11, 11], bgBottom: [48, 16, 18], accent: [251, 113, 133], text: [255, 241, 242], kicker: 'POLICY' },
  default: { bgTop: [11, 18, 32], bgBottom: [22, 35, 63], accent: [96, 165, 250], text: [248, 250, 252], kicker: 'DIT RESEARCH' },
}

function pickTheme(post) {
  const hay = `${post.category || ''} ${post.title || ''}`.toLowerCase()
  if (/model profile|profile|benchmark/.test(hay)) return THEMES.profiles
  if (/histor/.test(hay)) return THEMES.history
  if (/licen[s|c]e|open source|open-source/.test(hay)) return THEMES.opensource
  if (/infra|deploy|hardware|runtime|quantiz/.test(hay)) return THEMES.infra
  if (/edtech|education|school|offline|portal/.test(hay)) return THEMES.edtech
  if (/polic/.test(hay)) return THEMES.policy
  return THEMES.default
}

// ---------------------------------------------------------------------------
// 5x7 bitmap font (each glyph: 7 rows, 5 bits per row, MSB = leftmost pixel)
// ---------------------------------------------------------------------------
const FONT = {
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11], B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e], D: [0x1c, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1c],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f], F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  G: [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f], H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e], J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11], L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11], N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e], P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  Q: [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d], R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e], T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e], V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  W: [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11], X: [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  Y: [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04], Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  0: [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e], 1: [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  2: [0x0e, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1f], 3: [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  4: [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02], 5: [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  6: [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e], 7: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  8: [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e], 9: [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  ' ': [0, 0, 0, 0, 0, 0, 0], '-': [0, 0, 0, 0x0e, 0, 0, 0], '.': [0, 0, 0, 0, 0, 0x0c, 0x0c],
  ',': [0, 0, 0, 0, 0x0c, 0x04, 0x08], ':': [0, 0x0c, 0x0c, 0, 0x0c, 0x0c, 0],
  '&': [0x0c, 0x12, 0x14, 0x08, 0x15, 0x12, 0x0d], '/': [0x01, 0x01, 0x02, 0x04, 0x08, 0x10, 0x10],
  "'": [0x04, 0x04, 0x08, 0, 0, 0, 0], '!': [0x04, 0x04, 0x04, 0x04, 0x04, 0, 0x04],
  '?': [0x0e, 0x11, 0x01, 0x02, 0x04, 0, 0x04], '(': [0x02, 0x04, 0x08, 0x08, 0x08, 0x04, 0x02],
  ')': [0x08, 0x04, 0x02, 0x02, 0x02, 0x04, 0x08], '+': [0, 0x04, 0x04, 0x1f, 0x04, 0x04, 0],
  '#': [0x0a, 0x1f, 0x0a, 0x0a, 0x0a, 0x1f, 0x0a], '"': [0x0a, 0x0a, 0x14, 0, 0, 0, 0],
}

// ---------------------------------------------------------------------------
// PNG encoder (color type 6 = RGBA, filter 0 per scanline)
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}

function encodePng(pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0)
  ihdr.writeUInt32BE(H, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const raw = Buffer.alloc((W * 4 + 1) * H)
  for (let y = 0; y < H; y++) {
    const rowStart = y * (W * 4 + 1)
    raw[rowStart] = 0 // filter: none
    pixels.copy(raw, rowStart + 1, y * W * 4, (y + 1) * W * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------
function drawCover(post, theme, opts = {}) {
  const px = Buffer.alloc(W * H * 4)
  const [rT, gT, bT] = theme.bgTop
  const [rB, gB, bB] = theme.bgBottom
  const [aR, aG, aB] = theme.accent
  const [tR, tG, tB] = theme.text

  // Background: vertical gradient + faint grid + diagonal accent band
  for (let y = 0; y < H; y++) {
    const t = y / H
    const br = Math.round(rT + (rB - rT) * t)
    const bg = Math.round(gT + (gB - gT) * t)
    const bb = Math.round(bT + (bB - bT) * t)
    for (let x = 0; x < W; x++) {
      let r = br, g = bg, b = bb
      if (x % 80 === 0 || y % 80 === 0) { r += 10; g += 12; b += 16 } // grid
      const d = x + y * 1.7 // diagonal band
      if (d > 1750 && d < 1900) { r = r * 0.75 + aR * 0.25; g = g * 0.75 + aG * 0.25; b = b * 0.75 + aB * 0.25 }
      else if (d >= 1900 && d < 1930) { r += 24; g += 24; b += 24 }
      const i = (y * W + x) * 4
      px[i] = Math.min(255, r); px[i + 1] = Math.min(255, g); px[i + 2] = Math.min(255, b); px[i + 3] = 255
    }
  }

  const setPx = (x, y, r, g, b) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return
    const i = (y * W + x) * 4
    px[i] = r; px[i + 1] = g; px[i + 2] = b
  }

  function drawGlyph(ch, x0, y0, s, r, g, b) {
    const rows = FONT[ch] || FONT[' ']
    for (let gy = 0; gy < 7; gy++) {
      const bits = rows[gy]
      for (let gx = 0; gx < 5; gx++) {
        if (!(bits & (1 << (4 - gx)))) continue
        for (let sy = 0; sy < s; sy++) for (let sx = 0; sx < s; sx++) setPx(x0 + gx * s + sx, y0 + gy * s + sy, r, g, b)
      }
    }
  }

  function drawText(str, x0, y0, s, r, g, b) {
    let x = x0
    for (const raw of str.toUpperCase()) {
      const ch = FONT[raw] ? raw : ' '
      drawGlyph(ch, x, y0, s, r, g, b)
      x += 6 * s
    }
    return x
  }

  const MARGIN = 120

  // Accent tick above the kicker
  for (let y = 96; y < 104; y++) for (let x = MARGIN; x < MARGIN + 90; x++) setPx(x, y, aR, aG, aB)

  // Kicker (category label)
  drawText(opts.kicker || theme.kicker, MARGIN, 140, 3, aR, aG, aB)

  // Title: wrap to fit, max 3 lines
  const words = String(opts.title || post.title || 'Untitled').replace(/[—–]/g, '-').split(/\s+/)
  const maxChars = Math.floor((W - 2 * MARGIN) / (6 * 4))
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = w } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur.trim())
  const shown = lines.slice(0, 3)
  let ty = 240
  for (const line of shown) {
    drawText(line, MARGIN, ty, 4, tR, tG, tB)
    ty += 7 * 4 + 22
  }

  // Rule under the title
  const ruleY = Math.min(ty + 8, H - 220)
  for (let y = ruleY; y < ruleY + 4; y++) for (let x = MARGIN; x < MARGIN + 420; x++) setPx(x, y, aR, aG, aB)

  // Footer: site + slug tag
  drawText('DINTECHNOLOGIES.COM', MARGIN, H - 120, 3, tR, tG, tB)
  const tag = String(post.slug || '').slice(0, 30).toUpperCase()
  drawText(tag, W - MARGIN - tag.length * 18, H - 120, 3, aR, aG, aB)

  // Bottom accent bar
  for (let y = H - 14; y < H; y++) for (let x = 0; x < W; x++) setPx(x, y, aR, aG, aB)

  return encodePng(px)
}

// ---------------------------------------------------------------------------
// Main: covers + inline figures for every post with placeholder images
// ---------------------------------------------------------------------------
const mdDir = join(ROOT, 'content', 'blog')
const mdFiles = existsSync(mdDir)
  ? readdirSync(mdDir).filter((f) => f.endsWith('.md') && f !== 'standard-blog-post.md')
  : []

function mdPicsumCount(slug) {
  // Slug lives in frontmatter; find the md file declaring it and count picsum refs
  for (const f of mdFiles) {
    const t = readFileSync(join(mdDir, f), 'utf8')
    const m = t.match(/^slug:\s*"?([^\s"\r\n]+)/m)
    if (m && m[1] === slug) return (t.match(/picsum\.photos/g) || []).length
  }
  return 0
}

const targets = blogPosts.filter((p) => {
  const c = String(p.cover || '')
  const bodyFigs = (p.body || []).some((b) => b.type === 'image' && String(b.src || '').includes('picsum.photos'))
  return c.includes('picsum.photos') || c.startsWith('/images/blog/') || bodyFigs || mdPicsumCount(p.slug) > 0
})

console.log(`Posts needing generated images: ${targets.length}`)
let made = 0
let skipped = 0
for (const post of targets) {
  const dir = join(OUT_DIR, post.slug)
  mkdirSync(dir, { recursive: true })

  const writeIfMissing = (name, image) => {
    const file = join(dir, name)
    if (!FORCE && existsSync(file)) { skipped++; return }
    writeFileSync(file, image)
    made++
  }

  // Cover image
  const coverSrc = String(post.cover || '')
  const needsCover = coverSrc.includes('picsum.photos') || coverSrc.startsWith('/images/blog/') || mdPicsumCount(post.slug) > 0
  if (needsCover) {
    const png = drawCover(post, pickTheme(post))
    writeIfMissing('cover.png', png)
    console.log(`  cover ${post.slug}`)
  }

  // Inline figures: manual bodies + md twins (max of both counts)
  const bodyFigs = (post.body || []).filter((b) => b.type === 'image' && String(b.src || '').includes('picsum.photos'))
  const total = Math.max(bodyFigs.length, mdPicsumCount(post.slug))
  for (let n = 1; n <= total; n++) {
    const alt = bodyFigs[n - 1]?.alt || post.title || ''
    const png = drawCover(post, pickTheme(post), { kicker: `FIGURE ${n}`, title: String(alt).slice(0, 90) })
    writeIfMissing(`fig-${n}.png`, png)
  }
  if (total > 0) console.log(`  figs   ${post.slug}: ${total}`)
}
console.log(`Done. generated=${made} skipped(existing)=${skipped} total=${targets.length}`)

