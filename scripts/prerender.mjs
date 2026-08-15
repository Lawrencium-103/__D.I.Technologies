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
import {
  SITE_URL,
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_IMAGE,
  buildFullTitle,
} from '../src/lib/seo.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')

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
  const fullTitle = buildFullTitle(title)
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
      body: `<h1>AI that works where the internet doesn&rsquo;t.</h1>
<p>Dara Initiative Technology builds open, local AI that runs entirely on offline hardware &mdash; open-weight models, on-device inference, edge hardware powered by solar, grid or hybrid. No internet. No cloud.</p>
<ul>
  <li><a href="/edutech">SomaBox &mdash; offline AI tutor for schools</a></li>
  <li><a href="/open-models">Open Model Leaderboard</a></li>
  <li><a href="/s-sme">S-SME sustainable SME services</a></li>
  <li><a href="/ai-hub">AI Training Hub</a></li>
  <li><a href="/framework">OpenModel Synthesis Framework (OMSF)</a></li>
  <li><a href="/blog">Blog</a></li>
  <li><a href="/about">About</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>`,
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

  // Static pages. `body` is static, crawler-visible HTML injected into
  // <div id="root"> so search engines and non-JS AI crawlers (e.g. Perplexity)
  // see real H1 + copy + internal links instead of an empty SPA shell. The
  // client SPA (createRoot, not hydrateRoot) replaces this on load, so it is
  // purely for indexing/discovery and never causes a hydration mismatch.
  const staticPages = [
    {
      path: '/blog',
      title: 'Open models, offline AI & EdTech field notes',
      description: 'Notes on open models, local infrastructure and practical AI from DIT Dara Initiative Tech.',
      body: `<h1>DIT Blog — open models, offline AI &amp; EdTech</h1>
<p>Practical, source-backed notes from Dara Initiative Technology on building and running AI where the internet does not always work. We cover open-weight models, on-device inference, edge hardware, and offline-first tools for schools and small businesses across Africa.</p>
<p>Popular reads: <a href="/blog/the-quiet-cost-of-vendor-lock-in">The quiet cost of vendor lock-in</a> &middot; <a href="/blog/offline-first-parent-teacher-portals">Offline-first parent-teacher portals</a> &middot; <a href="/blog/running-open-models-privately">Running open models privately</a> &middot; <a href="/blog/the-openness-ladder">The Openness Ladder</a></p>
<p>New here? Start with the <a href="/open-models">Open Model Leaderboard</a>, the <a href="/framework">OMSF framework</a>, or read <a href="/about">about DIT</a>.</p>`,
    },
    {
      path: '/framework',
      title: 'OpenModel Synthesis Framework (OMSF)',
      description: 'The six-rung Openness Ladder for grading open AI models. A structured framework for evaluating how open an AI model really is.',
      body: `<h1>OpenModel Synthesis Framework (OMSF)</h1>
<p>OMSF is DIT&rsquo;s structured framework for grading how open an AI model really is. It answers a question that the phrase &ldquo;open source AI&rdquo; often blurs: can you actually inspect it, run it, modify it, and ship it without asking anyone&rsquo;s permission?</p>
<p>The heart of OMSF is the six-rung Openness Ladder, which scores a model on weights, code, training data, license terms, documentation and deployment freedom. A model can be freely downloadable yet still locked by its license &mdash; the Ladder makes that visible at a glance.</p>
<p>Browse the <a href="/open-models">graded Open Model Leaderboard</a>, download ready-made <a href="/reports">OMSF audit reports</a>, or read the <a href="/research">research behind the framework</a>.</p>`,
    },
    {
      path: '/open-models',
      title: 'Open Model Leaderboard, OMSF-graded',
      description: 'Leading open models graded on the OMSF ladder, plus the full HuggingFace catalog with computed VRAM estimates, license and access analysis.',
      body: `<h1>Open Model Leaderboard</h1>
<p>Leading open models graded on the OMSF Openness Ladder, plus the full Hugging Face catalog with computed VRAM estimates, license and access analysis.</p>
<p>The Leaderboard is built for one decision: given your hardware and your needs, which open-weight model should you actually deploy? Each entry carries an OMSF openness grade, an estimated VRAM footprint for common quantization levels, and a plain-language read on its license and access restrictions.</p>
<p>The model catalog syncs daily from Hugging Face, so the list stays current without manual updates. If a model you need is missing a grade, the <a href="/reports">Reports Library</a> holds full OMSF audit reports and the <a href="/blog">blog</a> explains the reasoning behind the grades.</p>
<p><a href="/framework">Read the OMSF framework</a> &middot; <a href="/reports">OMSF Reports Library</a> &middot; <a href="/blog">Blog</a></p>`,
    },
    {
      path: '/reports',
      title: 'OpenModel Reports Library',
      description: 'Ready-made OMSF-audited model reports. Download PDF reports on open AI models.',
      body: `<h1>OMSF Reports Library</h1>
<p>Ready-made OMSF audit reports for open AI models. Each report grades a model against the six-rung Openness Ladder, documents its license and access terms, estimates the hardware needed to run it, and gives a practical recommendation for schools, SMEs and public-sector teams.</p>
<p>Reports are written to be acted on: if a report says a model is deployment-ready for your budget, the <a href="/open-models">Leaderboard</a> and the <a href="/blog">blog</a> show you how to run it. If you need a model audited that is not in the library, <a href="/contact">ask us</a>.</p>
<p><a href="/framework">About OMSF</a> &middot; <a href="/open-models">Leaderboard</a> &middot; <a href="/contact">Request a report</a></p>`,
    },
    {
      path: '/research',
      title: 'The research behind OMSF',
      description: 'Academic and industry sources behind OMSF. The evidence base for open model evaluation.',
      body: `<h1>Research — the evidence behind OMSF</h1>
<p>The academic and industry sources behind the OpenModel Synthesis Framework. OMSF is not a set of opinions &mdash; each rung of the Openness Ladder and every grade in the <a href="/reports">Reports Library</a> traces back to published work on open-source licensing, model evaluation and AI deployment.</p>
<p>This page gathers that evidence base in one place: papers on open-weight licensing, industry analysis of model access, and technical documentation from the projects themselves. It is the same material the <a href="/open-models">Leaderboard</a> grades are built on.</p>
<p><a href="/framework">The OMSF framework</a> &middot; <a href="/blog">Blog</a> &middot; <a href="/contact">Suggest a source</a></p>`,
    },
    {
      path: '/edutech',
      title: 'SomaBox: offline AI tutor for schools',
      description: 'Offline AI tutor for schools, zero internet required. SomaBox brings AI tutoring to classrooms without connectivity.',
      body: `<h1>SomaBox — Offline AI Tutor for Schools</h1>
<p>SomaBox brings AI tutoring to classrooms without connectivity &mdash; zero internet required. Offline-first EdTech for Nigerian schools and schools across Africa where network access and electricity are unreliable.</p>
<p>Because SomaBox runs entirely on local hardware, a classroom can keep learning through outages, expensive data plans and network bans. Lessons, practice and feedback run on-device, powered by solar, grid or hybrid energy where available.</p>
<p>We work with schools, parent-teacher associations and state education agencies to pilot and scale deployments. Every deployment starts with the <a href="/blog/offline-first-parent-teacher-portals">offline-first portal</a> approach we document on the blog.</p>
<p><a href="/contact">Request SomaBox for my school</a> &middot; <a href="/about">About DIT</a> &middot; <a href="/blog">Blog</a></p>`,
    },
    {
      path: '/ai-hub',
      title: 'Dara AI Training Hub for Nigeria',
      description: 'Hands-on AI training in Nigeria. Practical skills for building and deploying AI locally.',
      body: `<h1>AI Training Hub — AI skills for Nigeria</h1>
<p>Hands-on AI training in Nigeria. Practical skills for building and deploying AI locally and offline, not just prompting public chatbots.</p>
<p>The Hub focuses on what actually matters on the ground: running open-weight models on available hardware, evaluating which model fits a budget, and deploying offline-first systems that keep working without the internet. Courses are available for individuals and for corporate teams, from introductory sessions to deeper deployment workshops.</p>
<p>Training pairs directly with our other work &mdash; graduates leave ready to use the <a href="/open-models">Leaderboard</a>, follow <a href="/framework">OMSF</a> grades, and apply the <a href="/s-sme">S-SME</a> approach in their own projects.</p>
<p><a href="/contact">Enquire about training</a> &middot; <a href="/about">About</a> &middot; <a href="/blog">Blog</a></p>`,
    },
    {
      path: '/s-sme',
      title: 'S-SME: sustainable SME toolkit for Nigeria',
      description: 'Sustainable SME services: green energy, offline inventory, compliance. Tools for small businesses.',
      body: `<h1>S-SME — Sustainable SME services</h1>
<p>Sustainable SME services: green energy, offline inventory and compliance tools for small businesses in Nigeria. S-SME helps growing businesses measure and improve how sustainable, resilient and audit-ready they are.</p>
<p>The programme pairs a <a href="/s-sme/toolkit">117-item scored toolkit</a> with a published <a href="/s-sme/evidence">evidence base</a> behind every score, so the assessment is defensible when banks, investors or regulators ask.</p>
<p>Businesses that complete the assessment walk away with a scored baseline, a prioritised improvement list and the paperwork to prove it &mdash; built to work offline in power- and connectivity-constrained environments.</p>
<p><a href="/s-sme/toolkit">S-SME Toolkit</a> &middot; <a href="/s-sme/evidence">Evidence base</a> &middot; <a href="/contact">Contact</a></p>`,
    },
    {
      path: '/s-sme/toolkit',
      title: 'S-SME Toolkit: score your business',
      description: '117-item scored toolkit with fillable PDFs for sustainable SME assessment.',
      body: `<h1>S-SME Toolkit</h1>
<p>The 117-item scored toolkit for sustainable SME assessment. Each item maps to the <a href="/s-sme/evidence">published evidence base</a> behind the S-SME standards, so every score means something specific rather than a vague &ldquo;good effort&rdquo;.</p>
<p>The toolkit ships as fillable PDFs designed to work offline: a business can complete its assessment on paper or in a PDF reader without a stable connection, then submit results for a scored report.</p>
<p>It covers green energy, offline inventory management, compliance and the operational basics that determine whether a small business can survive disruptions. The output is a scored baseline plus a prioritised list of improvements.</p>
<p><a href="/s-sme">About S-SME</a> &middot; <a href="/s-sme/evidence">Evidence base</a> &middot; <a href="/contact">Get assessed</a></p>`,
    },
    {
      path: '/s-sme/evidence',
      title: 'S-SME evidence: the numbers that matter',
      description: 'Published sources behind the S-SME numbers. Evidence base for sustainable SME standards.',
      body: `<h1>S-SME Evidence Base</h1>
<p>Published sources behind the S-SME numbers. Every score in the <a href="/s-sme/toolkit">S-SME Toolkit</a> is anchored to a source: development-bank guidance, energy-access studies, and SME resilience research, with the exact reference recorded.</p>
<p>Keeping the evidence public matters for a simple reason: when a bank, investor or regulator reviews an S-SME assessment, the underlying claim can be checked rather than taken on trust. It is the same principle behind the <a href="/framework">OMSF</a> grading of open models.</p>
<p><a href="/s-sme">About S-SME</a> &middot; <a href="/s-sme/toolkit">The toolkit</a> &middot; <a href="/contact">Contact</a></p>`,
    },
    {
      path: '/about',
      title: 'About us',
      description: 'Mission, ecosystem and team of Dara Initiative Technology. Open models, offline AI and EdTech for Africa.',
      body: `<h1>About DIT — Dara Initiative Technology</h1>
<p>Dara Initiative Technology (DIT) builds open models, offline-first AI and EdTech for communities where connectivity and power are uncertain. We exist because most AI is built for always-online, always-powered environments &mdash; and much of the world is not that place.</p>
<p>Our work spans the <a href="/open-models">Open Model Leaderboard</a> and <a href="/framework">OMSF framework</a> for choosing open models honestly, <a href="/edutech">SomaBox</a> for offline tutoring in schools, the <a href="/s-sme">S-SME</a> programme for sustainable SMEs, and the <a href="/ai-hub">AI Training Hub</a> for hands-on skills. Everything we publish is documented on the <a href="/blog">blog</a>.</p>
<p>If our mission matches what you are trying to do &mdash; a school, a ministry, a business or a funder &mdash; <a href="/contact">get in touch</a>.</p>`,
    },
    {
      path: '/contact',
      title: 'Contact us',
      description: 'Reach DIT Dara Initiative Tech. Get in touch about open models, offline AI and EdTech.',
      body: `<h1>Contact DIT</h1>
<p>Tell us what you are trying to build. Whether you want SomaBox in your school, an AI training programme for your team, an S-SME assessment, an OMSF audit of a model, or a partnership &mdash; start with the form below and we will get back to you.</p>`,
    },
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
        body: page.path === '/contact' ? `${page.body || ''}\n${contactFormHtml}` : (page.body || ''),
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