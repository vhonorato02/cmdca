import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const PUBLIC_ROUTES = [
  '/',
  '/acessibilidade',
  '/ajuda',
  '/conferencias',
  '/conselho',
  '/creditos',
  '/editais',
  '/entidades',
  '/fmdca',
  '/mapa-do-site',
  '/noticias',
  '/participe',
  '/privacidade',
  '/resolucoes',
  '/reunioes',
  '/transparencia',
] as const
const ALL_ROUTES = [...PUBLIC_ROUTES, '/admin/login'] as const

const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

for (const route of ALL_ROUTES) {
  test(`${route} não tem violações WCAG A/AA ou de boas práticas detectáveis pelo axe`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('body')).not.toBeEmpty()

    const results = await new AxeBuilder({ page }).withTags(axeTags).analyze()

    expect(
      results.violations,
      results.violations
        .map(
          (violation) =>
            `${violation.id} (${violation.impact ?? 'impacto desconhecido'}): ` +
            `${violation.description}\n${violation.nodes
              .map((node) => `  ${node.target.join(' ')} — ${node.failureSummary ?? ''}`)
              .join('\n')}`,
        )
        .join('\n\n'),
    ).toEqual([])
  })
}

for (const route of PUBLIC_ROUTES) {
  test(`${route} expõe idioma, landmarks e hierarquia principal`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('#nav')).toHaveCount(1)
    const isMobile = await page.evaluate(() => window.matchMedia('(max-width: 880px)').matches)
    if (isMobile) {
      await expect(page.locator('button.burger')).toBeVisible()
    } else {
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
    }
    await expect(page.getByRole('contentinfo')).toHaveCount(1)

    const unnamedInteractive = await page
      .locator('a, button, input, select, textarea')
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const html = element as HTMLElement
            if (html.hidden || html.getAttribute('aria-hidden') === 'true') return false
            const style = getComputedStyle(html)
            if (style.display === 'none' || style.visibility === 'hidden') return false
            const text = html.innerText?.trim()
            const ariaLabel = html.getAttribute('aria-label')?.trim()
            const labelledBy = html.getAttribute('aria-labelledby')?.trim()
            const title = html.getAttribute('title')?.trim()
            const alt = html.querySelector('img')?.getAttribute('alt')?.trim()
            const labels =
              'labels' in element
                ? Array.from((element as HTMLInputElement).labels ?? [])
                    .map((label) => label.textContent?.trim())
                    .filter(Boolean)
                    .join(' ')
                : ''
            return !(text || ariaLabel || labelledBy || title || alt || labels)
          })
          .map((element) => element.outerHTML.slice(0, 240)),
      )

    expect(unnamedInteractive, `Controles sem nome acessível em ${route}`).toEqual([])
  })
}

test('skip link é o primeiro foco e leva o foco ao conteúdo principal', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()

  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
})

test('menu móvel abre no teclado, move o foco e fecha com Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const menuButton = page.locator('button.burger')
  await expect(menuButton).toHaveAccessibleName('Abrir menu')
  await menuButton.focus()
  await page.keyboard.press('Enter')

  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(menuButton).toHaveAccessibleName('Fechar menu')
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Início', exact: true })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(menuButton).toHaveAccessibleName('Abrir menu')
  await expect(menuButton).toBeFocused()
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).not.toBeVisible()
})

test('reflow em largura equivalente a 400% não cria rolagem horizontal', async ({ page }) => {
  test.setTimeout(90_000)
  await page.setViewportSize({ width: 320, height: 900 })

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, `Rolagem horizontal de ${overflow}px em ${route}`).toBeLessThanOrEqual(1)
  }
})

test('links que abrem nova aba são seguros e PDFs públicos continuam acessíveis', async ({
  page,
  request,
}) => {
  test.setTimeout(60_000)
  const documentRoutes = ['/reunioes', '/transparencia', '/editais', '/resolucoes'] as const
  const pdfUrls = new Set<string>()

  for (const route of documentRoutes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })

    const externalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) =>
      links.map((link) => ({
        href: (link as HTMLAnchorElement).href,
        rel: link.getAttribute('rel') || '',
      })),
    )
    for (const link of externalLinks) {
      expect(link.rel.split(/\s+/), `${link.href} deve impedir acesso a window.opener`).toContain(
        'noopener',
      )
    }

    const pagePdfUrls = await page.locator('a[href*=".pdf" i]').evaluateAll((links) =>
      links.map((link) => ({
        href: (link as HTMLAnchorElement).href,
        name: (
          link.getAttribute('aria-label') ||
          (link as HTMLElement).innerText ||
          ''
        ).trim(),
      })),
    )
    for (const link of pagePdfUrls) {
      expect(link.name, `Link de PDF sem nome explícito: ${link.href}`).toMatch(/pdf|documento|ata/i)
      pdfUrls.add(link.href)
    }
  }

  for (const url of [...pdfUrls].slice(0, 10)) {
    const response = await request.get(url)
    expect(response.ok(), `PDF indisponível: ${url} (${response.status()})`).toBeTruthy()
    expect(response.headers()['content-type'] || '', `Tipo incorreto para ${url}`).toMatch(
      /application\/pdf/i,
    )
  }
})

test('controles próprios alteram fonte e alto contraste com estado exposto', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const root = page.locator('html')
  const fontSizeBefore = await root.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )

  await page.getByRole('button', { name: 'Aumentar tamanho da fonte' }).click()
  const fontSizeAfter = await root.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )
  expect(fontSizeAfter).toBeGreaterThan(fontSizeBefore)

  const contrast = page.getByRole('button', { name: 'Ativar alto contraste' })
  await contrast.click()
  await expect(contrast).toHaveAttribute('aria-pressed', 'true')
  await expect(root).toHaveClass(/contrast/)
})

test('preferência por movimento reduzido desativa movimentos não essenciais', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const longMotion = await page.locator('body *').evaluateAll((elements) =>
    elements
      .map((element) => {
        const style = getComputedStyle(element)
        return {
          element: element.tagName.toLowerCase() + (element.className ? `.${element.className}` : ''),
          animation: style.animationDuration,
          transition: style.transitionDuration,
        }
      })
      .filter(({ animation, transition }) => {
        const seconds = (value: string) =>
          value
            .split(',')
            .map((part) => Number.parseFloat(part) || 0)
            .some((duration) => duration > 0.01)
        return seconds(animation) || seconds(transition)
      })
      .slice(0, 20),
  )

  expect(longMotion).toEqual([])
})

test('alto contraste do sistema mantém foco e controles identificáveis', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'forced-colors é verificado no Chromium')
  await page.emulateMedia({ forcedColors: 'active' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.keyboard.press('Tab')

  const focusStyle = await page.locator(':focus').evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    }
  })

  expect(focusStyle.outlineStyle).not.toBe('none')
  expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThanOrEqual(2)
})

test('login do CMS associa os campos a nomes acessíveis', async ({ page }) => {
  await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })

  const email = page.getByRole('textbox', { name: /e-?mail/i })
  const password = page.getByLabel(/senha/i)
  const submit = page.getByRole('button', { name: /entrar|login/i })

  await expect(email).toBeVisible()
  await expect(password).toBeVisible()
  await expect(password).toHaveAttribute('type', 'password')
  await expect(submit).toBeVisible()
})
