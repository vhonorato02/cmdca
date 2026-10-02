import { expect, test } from '@playwright/test'

test('simulador limita valores vazios, negativos e extremos sem produzir NaN', async ({ page }) => {
  await page.goto('/fmdca')
  const amount = page.getByRole('spinbutton', { name: 'Seu imposto devido' })
  for (const [input, expected] of [['', '0'], ['-500', '0'], ['999999999', '20000'], ['1000', '1000']]) {
    await amount.fill(input)
    await expect(amount).toHaveValue(expected)
    await expect(page.locator('.sim-out')).not.toContainText(/NaN|Infinity/)
    await expect(page.getByRole('slider', { name: 'Imposto de renda devido' })).toHaveValue(expected)
  }
})

test('falha de rede do tradutor oferece mensagem e caminho alternativo', async ({ page }) => {
  await page.route('https://vlibras.gov.br/**', (route) => route.abort('failed'))
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-translation-state', 'error')
  await page.getByRole('button', { name: 'VLibras: abrir tradução para Libras' }).click()
  const status = page.getByRole('status').filter({ hasText: 'Tradutor indisponível' })
  await expect(status).toBeVisible()
  await expect(status.getByRole('link')).toHaveAttribute('href', '/acessibilidade')
})

test('menu mantém navegação visível e estado coerente ao mudar para desktop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.locator('button.burger')).toHaveAttribute('aria-expanded', 'true')
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.locator('button.burger')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).not.toBeVisible()
})

test('rota inexistente apresenta recuperação e status 404', async ({ page }) => {
  const response = await page.goto('/pagina-inexistente-ci')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('main a[href="/"]')).toBeVisible()
})

const STATUS_LABELS = {
  '/resolucoes': ['Vigente', 'Alterada', 'Revogada', 'Sem efeito'],
  '/editais': ['Vigente ou em andamento', 'Encerrado', 'Suspenso', 'Revogado', 'Anulado'],
  '/entidades': ['Registro ativo', 'Registro vencido', 'Registro suspenso', 'Registro cancelado'],
} as const

for (const [route, labels] of Object.entries(STATUS_LABELS)) {
  test(`${route} exibe a situação publicada de cada item e retificações navegáveis`, async ({
    page,
  }) => {
    await page.goto(route)
    const items = page.locator('main ul.meeting-list > li')
    const count = await items.count()
    if (!count) {
      await expect(page.getByText(/^Não há .+ no momento\.$/)).toBeVisible()
      return
    }
    const pattern = new RegExp(`^Situação: (${labels.join('|')}|Situação não informada)$`)
    for (let index = 0; index < count; index += 1) {
      const pills = items.nth(index).locator('.pill[class*="status-"]')
      await expect(pills).toHaveCount(1)
      await expect(pills).toHaveText(pattern)
    }
    const anchors = page.locator('main .meta a[href^="#"]')
    for (const href of await anchors.evaluateAll((links) => links.map((a) => a.getAttribute('href')))) {
      await expect(page.locator(href as string)).toHaveCount(1)
    }
  })
}

test('rodapé leva ao mapa do site e ao bloco dos Conselhos Tutelares', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  await expect(footer.getByRole('link', { name: 'Mapa do site' })).toHaveAttribute('href', '/mapa-do-site')
  await footer.getByRole('link', { name: 'Conselho Tutelar' }).click()
  await expect(page).toHaveURL(/\/ajuda#conselhos-tutelares$/)
  await expect(page.locator('#conselhos-tutelares')).toBeInViewport()
  await expect(page.locator('#conselhos-tutelares').getByRole('heading', { level: 2 })).toHaveText(
    'Conselhos Tutelares',
  )
})
