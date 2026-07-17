const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, 'dist')
const EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' }

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0])
  if (url === '/') url = '/index.html'
  let file = path.join(ROOT, url)
  // SPA fallback for client routes
  if (!fs.existsSync(file)) file = path.join(ROOT, 'index.html')
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
})

const ROUTES = ['/', '/about', '/edutech', '/ai-hub', '/s-sme', '/contact']
const VIEWS = [
  { w: 375, h: 800, name: 'mobile' },
  { w: 768, h: 900, name: 'tablet' },
  { w: 1280, h: 900, name: 'desktop' },
]

server.listen(4178, async () => {
  const browser = await puppeteer.launch({ executablePath: EXE, headless: true, args: ['--no-sandbox'] })
  for (const v of VIEWS) {
    const page = await browser.newPage()
    await page.setViewport({ width: v.w, height: v.h })
    for (const route of ROUTES) {
      await page.goto('http://localhost:4178' + route, { waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 600))
      const info = await page.evaluate(() => {
        const de = document.documentElement
        const sw = de.scrollWidth, cw = de.clientWidth
        const offenders = []
        const vw = window.innerWidth
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect()
          if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.toString().slice(0, 80)) || '',
              left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
            })
          }
        })
        const nav = document.querySelector('header')
        let navInfo = null
        if (nav) {
          const r = nav.getBoundingClientRect()
          navInfo = { left: Math.round(r.left), right: Math.round(r.right), center: Math.round(r.left + r.width / 2), vwCenter: Math.round(vw / 2) }
        }
        return { sw, cw, vw, offenders: offenders.slice(0, 12), navInfo }
      })
      const overflow = info.sw > info.cw
      console.log(`\n[${v.name} ${v.w}px] ${route}  scrollW=${info.sw} clientW=${info.cw}  OVERFLOW=${overflow ? 'YES ❌' : 'no ✅'}`)
      if (info.navInfo) console.log(`   nav center=${info.navInfo.center} vs viewport center=${info.navInfo.vwCenter} (diff ${info.navInfo.center - info.navInfo.vwCenter}px)`)
      if (info.offenders.length) {
        console.log('   overflowing elements:')
        info.offenders.forEach(o => console.log(`     <${o.tag}> left=${o.left} right=${o.right} w=${o.w}  .${o.cls}`))
      }
    }
    await page.close()
  }
  await browser.close()
  server.close()
})
