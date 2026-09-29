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
