import { expect, test } from '@playwright/test'

test('portal continua legível em telas de 320 px a desktop, sem rolagem lateral', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/ajuda', '/fmdca', '/noticias']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${route} em ${width}px`).toBeLessThanOrEqual(2)
    }
  }
})

test('o portal usa navegador normal, sem convite técnico de instalação de aplicativo', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(0)
  await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveCount(0)
})
