// Auditoria visual e de acessibilidade de leitura (não grava nada no site).
// Uso: node scripts/audit-visual.mjs [baseURL] [pasta-de-saída]
// Para cada rota pública e largura: status, estouro horizontal, alvos de toque < 24 px,
// imagens sem alt, h1 único, captura de página inteira; axe (WCAG 2.2 AA) em 390 e 1440 px.
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'

const base = (process.argv[2] || 'https://www.cmdcapinda.org').replace(/\/$/, '')
const out = process.argv[3] || 'test-results/audit-visual'
const widths = [320, 360, 390, 430, 768, 1024, 1440, 1920]
const axeWidths = new Set([390, 1440])

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname)
  .filter((route, index, all) => all.indexOf(route) === index)
// Uma notícia representa o modelo de detalhe; as demais usam o mesmo layout.
const sampled = routes.filter((route) => !route.startsWith('/noticias/')).concat(
  routes.filter((route) => route.startsWith('/noticias/')).slice(0, 2), ['/rota-inexistente-auditoria'])

await mkdir(out, { recursive: true })
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const report = []
for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  for (const route of sampled) {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const small = [...document.querySelectorAll('a[href], button, input, select, textarea, [role="button"]')]
        .filter((element) => {
          const box = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          if (!box.width || !box.height || style.visibility === 'hidden') return false
          // Links dentro de texto corrido são exceção do critério 2.5.8.
          if (element.tagName === 'A' && getComputedStyle(element.parentElement).display === 'block'
            && element.parentElement.tagName === 'P') return false
          return box.width < 24 || box.height < 24
        })
        .map((element) => (element.getAttribute('aria-label') || element.textContent || element.tagName).trim().slice(0, 40))
      return {
        overflow: doc.scrollWidth - window.innerWidth,
        h1: document.querySelectorAll('h1').length,
        imgNoAlt: [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
        small: [...new Set(small)].slice(0, 6),
        title: document.title,
        lang: doc.lang,
      }
    })
    const name = `${width}-${route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}.png`
    await page.screenshot({ path: path.join(out, name), fullPage: true })
    let axe = null
    if (axeWidths.has(width)) {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      axe = result.violations.map((violation) => `${violation.id}(${violation.impact}):${violation.nodes.length}`)
    }
    report.push({ width, route, status: response?.status(), ...metrics, axe })
    const flags = [metrics.overflow > 0 && `overflow ${metrics.overflow}px`, metrics.h1 !== 1 && `h1=${metrics.h1}`,
      metrics.imgNoAlt && `img sem alt ${metrics.imgNoAlt}`, metrics.small.length && `toque<24: ${metrics.small.join(' | ')}`,
      axe?.length && `axe: ${axe.join(' ')}`].filter(Boolean)
    console.log(`${width}\t${response?.status()}\t${route}\t${flags.join('; ') || 'ok'}`)
  }
  await context.close()
}
await browser.close()
await writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2))
