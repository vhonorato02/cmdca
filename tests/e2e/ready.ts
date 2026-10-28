import type { Page } from '@playwright/test'

// Contra a produção o HTML chega bem antes do JavaScript. Espere o carregamento
// completo e as fontes antes de medir ou interagir; o resto (hidratação) é
// coberto com `toPass` nos testes que clicam.
// As entradas animadas (capa, cabeçalho) passam por opacidade parcial: medir
// contraste ou posição no meio delas dá falso positivo. Espera só as animações
// com fim; as ligadas à rolagem (view()) não terminam e ficam de fora.
export async function gotoReady(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (a) =>
            a.timeline === document.timeline &&
            Number.isFinite(Number(a.effect?.getComputedTiming().endTime)),
        )
        .map((a) => a.finished.catch(() => undefined)),
    ).then(() => undefined),
  )
}
