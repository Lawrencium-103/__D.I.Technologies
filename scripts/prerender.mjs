// Prerender script: generates static HTML files for every route with
// correct meta tags, JSON-LD structured data, and blog post content.
// This makes the SPA crawlable by search engines and AI crawlers that
// do not execute JavaScript.
//
// Run AFTER `vite build` (the dist/ folder must exist).

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { blogPosts } from '../src/data/blogPosts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const SITE_URL = 'https://dintechnologies.com'
const SITE_NAME = 'DIT Dara Initiative Tech'
const SITE_DEFAULT_TITLE = 'DIT Dara Initiative Tech — Open models, offline AI & EdTech for Africa'
const SITE_DEFAULT_DESCRIPTION =
  'Dara Initiative Tech (DIT) builds open models, offline-first AI and EdTech for communities where connectivity and power are uncertain. OMSF framework, S-SME toolkit, AI training and more.'
const SITE_DEFAULT_IMAGE = `${SITE_URL}/Lawrence.png`

function esc(s) {
  const A = String.fromCharCode(38) // ampersand
  return String(s)
    .replace(/&/g, A + 'amp;')
    .replace(/</g, A + 'lt;')
    .replace(/>/g, A + 'gt;')
    .replace(/"/g, A + 'quot;')
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Convert blog post body blocks to static HTML for crawlers
function blocksToHtml(blocks = []) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'lead':
          return `<p class="lead">${esc(b.text)}</p>`
        case 'tldr':
          return `<blockquote class="tldr"><strong>TL;DR</strong> ${esc(b.text)}</blockquote>`
        case 'heading':
          return `<h2>${esc(b.text)}</h2>`
        case 'paragraph':
          return `<p>${esc(b.text)}</p>`
        case 'image':
          return `<figure><img src="${esc(b.src)}" alt="${esc(b.alt || '')}" loading="lazy" /><figcaption>${esc(b.caption || '')}</figcaption></figure>`
        case 'quote':
          return `<blockquote>${esc(b.text)}${b.cite ? ` <cite>(${esc(b.cite)})</cite>` : ''}</blockquote>`
        case 'list':
          return `<ul>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
        case 'callout':
          return `<aside class="callout"><strong>${esc(b.title || '')}</strong> ${esc(b.text || '')}</aside>`
        default:
          return `<p>${esc(b.text || '')}</p>`
      }
    })
    .join('\n')
}

function buildHtml({ title, description, path, type = 'website', image = SITE_DEFAULT_IMAGE, imageAlt = '', jsonLd = null, body = '', headAssets = '', entryScripts = '' }) {
  const url = `${SITE_URL}${path}`
  const fullTitle = title ? `${title} — DIT Dara Initiative Tech` : SITE_DEFAULT_TITLE
  const jsonLdScript = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''
  // Preserve the production-built CSS/link assets and JS entry bundles so the
  // prerendered page hydrates and works exactly like the built SPA.
  const prodAssets = `${headAssets}
    ${entryScripts}`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headAssets}
    <title>${esc(fullTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="google-site-verification" content="ksidrlYqHooO_qXl-f51kqna4-x7bnULNWuuhfQ2K74" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${esc(fullTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${esc(image)}" />
    ${imageAlt ? `<meta property="og:image:alt" content="${esc(imageAlt)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(fullTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    ${jsonLdScript}
    <script type="text/javascript">
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "xozkj2kou0");
    </script>
    <script type="text/javascript">
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "xx6md1g9dn");
    </script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-EQ0LZQGJNF');
    </script>
  </head>
  <body>
    <div id="root">${body}</div>
    ${entryScripts}
  </body>
</html>`
}

function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

async function main() {
  // Read the built index.html to extract the JS/CSS asset links.
  // Only capture modulepreload and stylesheet links so we do not duplicate
  // the favicon or override the canonical URL that buildHtml sets per route.
  const indexHtml = await readFile(join(DIST, 'index.html'), 'utf8')
  const assetLinks =
    indexHtml.match(/<link[^>]*rel="(?:modulepreload|stylesheet)"[^>]*>/g)?.join('\n    ') || ''
  const scriptTags = indexHtml.match(/<script[^>]+src="[^"]+"[^>]*><\/script>/g)?.join('\n    ') || ''

  const routes = []

  // Homepage
  routes.push({
    path: '/',
    file: 'index.html',
    html: buildHtml({
      title: '',
      description: SITE_DEFAULT_DESCRIPTION,
      path: '/',
      headAssets: assetLinks,
      entryScripts: scriptTags,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.svg`,
          description: SITE_DEFAULT_DESCRIPTION,
        },
      ],
    }),
  })

  // Static pages
  const staticPages = [
    { path: '/blog', title: 'Blog', description: 'Notes on open models, local infrastructure and practical AI from DIT Dara Initiative Tech.' },
    { path: '/framework', title: 'OpenModel Synthesis Framework (OMSF)', description: 'The six-rung Openness Ladder for grading open AI models. A structured framework for evaluating how open an AI model really is.' },
    { path: '/open-models', title: 'Open Model Leaderboard', description: 'Leading open models graded on the OMSF ladder, plus the full HuggingFace catalog with computed VRAM estimates, license and access analysis.' },
    { path: '/reports', title: 'Reports Library', description: 'Ready-made OMSF-audited model reports. Download PDF reports on open AI models.' },
    { path: '/research', title: 'Research', description: 'Academic and industry sources behind OMSF. The evidence base for open model evaluation.' },
    { path: '/edutech', title: 'EduTech / SomaBox', description: 'Offline AI tutor for schools, zero internet required. SomaBox brings AI tutoring to classrooms without connectivity.' },
    { path: '/ai-hub', title: 'AI Training Hub', description: 'Hands-on AI training in Nigeria. Practical skills for building and deploying AI locally.' },
    { path: '/s-sme', title: 'S-SME', description: 'Sustainable SME services: green energy, offline inventory, compliance. Tools for small businesses.' },
    { path: '/s-sme/toolkit', title: 'S-SME Toolkit', description: '117-item scored toolkit with fillable PDFs for sustainable SME assessment.' },
    { path: '/s-sme/evidence', title: 'S-SME Evidence', description: 'Published sources behind the S-SME numbers. Evidence base for sustainable SME standards.' },
    { path: '/about', title: 'About', description: 'Mission, ecosystem and team of Dara Initiative Technology. Open models, offline AI and EdTech for Africa.' },
    { path: '/contact', title: 'Contact', description: 'Reach DIT Dara Initiative Tech. Get in touch about open models, offline AI and EdTech.' },
  ]

  // Static contact form markup so Netlify's deploy-time detector finds the
  // form (the SPA renders it client-side, which the detector cannot see).
  const contactFormHtml = `
    <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact" />
      <p><label>Name <input type="text" name="name" required /></label></p>
      <p><label>Organisation <input type="text" name="org" /></label></p>
      <p><label>Email <input type="email" name="email" required /></label></p>
      <p><label>What do you need?
        <select name="need">
          <option>AI Training Hub (individual)</option>
          <option>AI Training Hub (corporate)</option>
          <option>SomaBox for my school</option>
          <option>S-SME sustainability audit</option>
          <option>Partnership / Collaboration</option>
          <option>General enquiry</option>
        </select>
      </label></p>
      <p><label>Message <textarea name="message" required></textarea></label></p>
      <p><button type="submit">Send message</button></p>
    </form>`

  for (const page of staticPages) {
    routes.push({
      path: page.path,
      file: page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`,
      html: buildHtml({
        title: page.title,
        description: page.description,
        path: page.path,
        headAssets: assetLinks,
        entryScripts: scriptTags,
        body: page.path === '/contact' ? contactFormHtml : '',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            url: `${SITE_URL}${page.path}`,
            description: page.description,
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: page.title, path: page.path },
          ]),
        ],
      }),
    })
  }

  // Blog posts
  for (const post of blogPosts) {
    const path = `/blog/${post.slug}`
    const bodyHtml = blocksToHtml(post.body)
    const contentHtml = `
      <article>
        <h1>${esc(post.title)}</h1>
        <p class="meta">${formatDate(post.date)} · ${esc(post.readingTime)} · ${esc(post.category)}</p>
        <img src="${esc(post.cover)}" alt="${esc(post.coverAlt || post.title)}" />
        ${bodyHtml}
        ${post.references?.length ? `<section><h2>References</h2><ul>${post.references.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></section>` : ''}
      </article>`

    routes.push({
      path,
      file: `blog/${post.slug}.html`,
      html: buildHtml({
        title: post.title,
        description: post.excerpt,
        path,
        type: 'article',
        image: post.cover,
        imageAlt: post.coverAlt,
        headAssets: assetLinks,
        entryScripts: scriptTags,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            articleSection: post.category,
            image: post.cover,
            author: {
              '@type': 'Person',
              name: 'Lawrence Oladeji',
              url: `${SITE_URL}/about`,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_NAME,
              url: SITE_URL,
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/favicon.svg`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${SITE_URL}${path}`,
            },
          },
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
        ],
        body: contentHtml,
      }),
    })
  }

  // Write all prerendered files
  let count = 0
  for (const route of routes) {
    const outPath = join(DIST, route.file)
    await mkdir(dirname(outPath), { recursive: true })
    await writeFile(outPath, route.html, 'utf8')
    count++
  }

  console.log(`[prerender] ${count} static HTML files written to dist/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})