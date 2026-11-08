import { expect, test } from '@playwright/test'

import { gotoReady } from './ready'

// Auditoria visual automatizada (versão de teste do scripts/audit-visual.mjs): para cada
// rota pública e largura, sem rolagem lateral, um h1 só, imagens com alt e alvos de toque
// de pelo menos 24 px (WCAG 2.5.8; links dentro de texto corrido são exceção).
const ROUTES = [
  '/',
  '/ajuda',
  '/conselho',
  '/editais',
  '/entidades',
  '/fmdca',
  '/noticias',
  '/participe',
  '/resolucoes',
  '/reunioes',
  '/transparencia',
  '/rota-inexistente-auditoria',
] as const
const WIDTHS = [320, 390, 768, 1280, 1440] as const

test.describe('auditoria visual', () => {
  test.skip(({ isMobile }) => isMobile, 'as larguras são definidas no próprio teste')

  for (const width of WIDTHS) {
    test(`rotas públicas em ${width}px: sem estouro, h1 único, alt e alvos ≥ 24 px`, async ({ page }) => {
      test.setTimeout(180_000)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      for (const route of ROUTES) {
        await gotoReady(page, route)
        // A 404 chega por streaming e só é desenhada depois do carregamento.
        await page.locator('h1').first().waitFor()
        const m = await page.evaluate(() => {
          const doc = document.documentElement
          const small = [
            ...document.querySelectorAll<HTMLElement>(
              'a[href], button, input, select, textarea, [role="button"]',
            ),
          ]
            .filter((el) => {
              const box = el.getBoundingClientRect()
              if (!box.width || !box.height || getComputedStyle(el).visibility === 'hidden') return false
              if (el.closest('.sr-only, .skip-link, [aria-hidden="true"]')) return false
              const parent = el.parentElement
              if (el.tagName === 'A' && parent && ['P', 'LI', 'DD', 'TD', 'SPAN', 'SMALL', 'DIV'].includes(parent.tagName)
                && (parent.textContent ?? '').trim().length > (el.textContent ?? '').trim().length + 2) return false
              return box.width < 24 || box.height < 24
            })
            .map((el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 40))
          // Conteúdo cortado por overflow: hidden não gera rolagem, mas some da tela:
          // títulos, botões e links precisam caber na largura (trilhos com rolagem são exceção).
          const clipped = [...document.querySelectorAll<HTMLElement>('main :is(h1, h2, h3, a, button)')]
            .filter((el) => {
              if (el.closest('.highlights, [data-scroll-rail], .sr-only, .skip-link')) return false
              const box = el.getBoundingClientRect()
              return box.width > 0 && (box.right > doc.clientWidth + 1 || box.left < -1)
            })
            .map((el) => `${el.tagName} ${(el.textContent || '').trim().slice(0, 30)}`)
          return {
            clipped: [...new Set(clipped)].slice(0, 5),
            overflow: doc.scrollWidth - doc.clientWidth,
            h1: document.querySelectorAll('h1').length,
            imgNoAlt: [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
            small: [...new Set(small)],
          }
        })
        expect.soft(m.overflow, `${route} @${width}: rolagem lateral`).toBeLessThanOrEqual(1)
        expect.soft(m.clipped, `${route} @${width}: conteúdo fora da tela`).toEqual([])
        expect.soft(m.h1, `${route} @${width}: quantidade de h1`).toBe(1)
        expect.soft(m.imgNoAlt, `${route} @${width}: imagens sem alt`).toBe(0)
        expect.soft(m.small, `${route} @${width}: alvos < 24 px`).toEqual([])
      }
    })
  }

  test('a capa publica JSON-LD válido da organização e do site', async ({ page }) => {
    await gotoReady(page, '/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(blocks.length).toBeGreaterThan(0)
    const types = blocks.flatMap((text) => {
      const data = JSON.parse(text) as { '@graph'?: { '@type': string }[]; '@type'?: string }
      return data['@graph'] ? data['@graph'].map((node) => node['@type']) : [data['@type']]
    })
    expect(types).toEqual(expect.arrayContaining(['GovernmentOrganization', 'WebSite']))
  })
})
