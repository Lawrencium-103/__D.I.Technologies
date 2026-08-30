// Executes every page component server-side (same render path as the browser)
// to reproduce client-side crashes that prerender's static bodies hide.
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// [url, route-pattern, file]
const PAGES = [
  ['/', '/', '/src/pages/Home.jsx'],
  ['/about', '/about', '/src/pages/About.jsx'],
  ['/edutech', '/edutech', '/src/pages/EduTech.jsx'],
  ['/ai-hub', '/ai-hub', '/src/pages/AIHub.jsx'],
  ['/s-sme', '/s-sme', '/src/pages/SSME.jsx'],
  ['/s-sme/evidence', '/s-sme/evidence', '/src/pages/SsmeEvidence.jsx'],
  ['/s-sme/toolkit', '/s-sme/toolkit', '/src/pages/SsmeToolkit.jsx'],
  ['/report', '/report', '/src/pages/ReportBuilder.jsx'],
  ['/reports', '/reports', '/src/pages/ReportsLibrary.jsx'],
  ['/open-models', '/open-models', '/src/pages/OpenModels.jsx'],
  ['/framework', '/framework', '/src/pages/Framework.jsx'],
  ['/research', '/research', '/src/pages/Research.jsx'],
  ['/blog', '/blog', '/src/pages/Blog.jsx'],
  ['/blog/kimi-k2-6-profile', '/blog/:slug', '/src/pages/BlogPost.jsx'],
  ['/contact', '/contact', '/src/pages/Contact.jsx'],
  ['/ai-creatives-training-nigeria', '/ai-creatives-training-nigeria', '/src/pages/AiCreativesTraining.jsx'],
]

// "window is not defined" etc. are SSR-only artifacts, not browser crashes
const isSsrNoise = (msg) => /^(window|document|localStorage|navigator|sessionStorage) is not defined/i.test(msg.trim())

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  await vite.ssrLoadModule('/src/App.jsx')
  console.log('OK    App.jsx module loads')
} catch (e) {
  console.log('FAIL  App.jsx module load: ' + e.message)
}

let failed = 0
for (const [url, pattern, file] of PAGES) {
  try {
    const mod = await vite.ssrLoadModule(file)
    const Page = mod.default
    const html = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: [url] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: pattern,
            element: React.createElement(React.Suspense, { fallback: null }, React.createElement(Page)),
          }),
        ),
      ),
    )
    console.log(`OK    ${url} (${html.length} chars)`)
  } catch (e) {
    if (isSsrNoise(e.message)) {
      console.log(`NOISE ${url}: ${e.message.split('\n')[0]}`)
    } else {
      failed++
      console.log(`FAIL  ${url}: ${e.message.split('\n')[0]}`)
      const src = (e.stack || '').split('\n').filter((l) => l.includes('/src/')).slice(0, 2).join('\n      ')
      if (src) console.log('      ' + src)
    }
  }
}

await vite.close()
console.log(failed ? `SMOKE FAILED: ${failed} page(s) crash on render` : 'SMOKE PASSED: all pages render')
process.exit(failed ? 1 : 0)