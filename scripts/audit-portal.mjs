import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'

const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const routes = ['/', '/ajuda', '/conselho', '/reunioes', '/transparencia', '/noticias', '/participe', '/fmdca', '/editais', '/resolucoes', '/entidades', '/conferencias', '/privacidade', '/acessibilidade', '/creditos', '/mapa-do-site', '/pagina-inexistente-ci']
if (process.env.AUDIT_INCLUDE_ADMIN !== 'false') routes.push('/admin/login')
if (process.env.AUDIT_NEWS === 'true') {
  const response = await fetch(new URL('/api/noticias?limit=100&depth=0', base))
  if (!response.ok) throw new Error(`Unable to enumerate public news: HTTP ${response.status}`)
  const news = await response.json()
  for (const item of news.docs) {
    if (item.slug) routes.push(`/noticias/${encodeURIComponent(item.slug)}`)
  }
}
const widths = [1440, 1024, 768, 390]
const directory = process.env.AUDIT_OUTPUT_DIR || 'test-results/portal-audit'
await fs.mkdir(directory, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.setDefaultNavigationTimeout(240000)
const issues = []
page.on('pageerror', error => issues.push({ route: page.url(), message: error.message }))
const results = []
try {
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 })
      const response = await page.goto(base + route, { waitUntil: 'domcontentloaded' })
      await page.locator('h1').first().waitFor({ state: 'visible', timeout: 60000 })
      await page.evaluate(async () => { await document.fonts.ready })
      const report = await page.evaluate(() => {
        const shown = element => { const r = element.getBoundingClientRect(); const s = getComputedStyle(element); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' }
        const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(shown).map(e => ({ level: Number(e.tagName[1]), text: e.textContent.trim() }))
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content,
          og: Object.fromEntries(['title','description','image','url'].map(k => [k, document.querySelector(`meta[property="og:${k}"]`)?.content])),
          h1: headings.filter(h => h.level === 1).length,
          headingSkips: headings.filter((h,i) => i > 0 && h.level > headings[i-1].level + 1),
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          overflowing: [...document.querySelectorAll('main *')].filter(shown).filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0,15).map(e => e.tagName + '.' + e.className),
          images: [...document.images].map(e => ({ src: e.getAttribute('src')?.split('?')[0], alt: e.getAttribute('alt'), loaded: e.complete && e.naturalWidth > 0 })),
          // WCAG 2.5.8 inline exception: a link inside a sentence is constrained by line height.
          smallTargets: [...document.querySelectorAll('a,button,input,select')].filter(shown).filter(e => {
            if (e.tagName === 'A' && getComputedStyle(e).display === 'inline') {
              const block = e.closest('p,li,dd,td,figcaption')
              if (block && block.textContent.replace(/\s+/g, ' ').trim().length > e.textContent.replace(/\s+/g, ' ').trim().length + 3) return false
            }
            const r = e.getBoundingClientRect(); return r.width < 44 || r.height < 44
          }).map(e => ({ text: e.textContent.trim().slice(0,80) || e.getAttribute('aria-label'), tag: e.tagName, width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })),
          links: [...new Set([...document.querySelectorAll('a[href]')].map(e => e.href))],
          mainText: document.querySelector('main')?.textContent?.trim().slice(0,150)
        }
      })
      const name = (route === '/' ? 'home' : route.replaceAll('/', '-').slice(1)) + '-' + width
      await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true })
      results.push({ route, width, status: response?.status(), ...report })
      await fs.writeFile(`${directory}/report.json`, JSON.stringify({ base, results, issues }, null, 2))
      console.log(JSON.stringify({route,width,status:response?.status(),overflow:report.horizontalOverflow,h1:report.h1,skips:report.headingSkips.length,smallTargets:report.smallTargets.length,title:report.title}))
    }
  }
} finally { await browser.close() }

const failures = results.filter((result) =>
  result.status !== (result.route === '/pagina-inexistente-ci' ? 404 : 200) ||
  result.horizontalOverflow || result.h1 !== 1 || result.headingSkips.length ||
  result.smallTargets.length || !result.title || !result.description ||
  (result.status === 200 && Object.values(result.og).some((value) => !value)) ||
  result.images.some((image) => image.alt === null),
)
if (failures.length || issues.length) {
  throw new Error(`Portal audit failed: ${failures.length} invalid captures, ${issues.length} browser errors. See report.json.`)
}
