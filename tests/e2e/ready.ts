import type { Page } from '@playwright/test'

// Contra a produção o HTML chega bem antes do JavaScript. Espere o carregamento
// completo e as fontes antes de medir ou interagir; o resto (hidratação) é
// coberto com `toPass` nos testes que clicam.
export async function gotoReady(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
}
