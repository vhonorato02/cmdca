import { expect, test } from '@playwright/test'

test('editor publica capa e menu, confirma no site e restaura sem alterar dados operacionais', async ({ page, browser, baseURL }, testInfo) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  const original = await page.evaluate(async () => {
    const home = await fetch('/api/globals/pagina-inicial?depth=0').then((response) => response.json())
    const navigation = await fetch('/api/globals/navegacao?depth=0').then((response) => response.json())
    return { home, navigation }
  })
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } })
  const publicPage = await context.newPage()
  try {
    await page.goto('/admin/globals/pagina-inicial')
    await page.getByLabel(/^Título/).first().fill('Capa conferida no navegador')
    await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
    await expect.poll(async () => {
      await publicPage.goto('/')
      return publicPage.getByRole('heading', { level: 1 }).textContent()
    }).toBe('Capa conferida no navegador')
    await expect(publicPage.locator('.home-hero__image img')).toHaveAttribute('alt', 'CI isolated cover')
    await expect.poll(() => publicPage.locator('.home-hero__image img').evaluate(
      (image) => (image as HTMLImageElement).naturalWidth,
    )).toBeGreaterThan(0)
    await publicPage.screenshot({ path: testInfo.outputPath('published-cover-mobile.png'), fullPage: true })

    await page.goto('/admin/globals/navegacao')
    await page.getByLabel(/^Texto do link/).first().fill('Conselho QA')
    await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
    await expect.poll(async () => {
      await publicPage.goto('/noticias')
      await publicPage.getByRole('button', { name: 'Abrir menu', exact: true }).click()
      return publicPage.getByRole('navigation', { name: 'Navegação principal' }).textContent()
    }).toContain('Conselho QA')
    await expect(publicPage.getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Conselho QA', exact: true })).toBeVisible()
    await publicPage.screenshot({ path: testInfo.outputPath('published-menu-mobile.png'), fullPage: true })
  } finally {
    const restored = await page.evaluate(async ({ home, navigation }) => {
      const statuses = []
      for (const [slug, data] of [
        ['pagina-inicial', { capa: home.capa, blocos: home.blocos, _status: 'published' }],
        ['navegacao', { menuPrincipal: navigation.menuPrincipal, rodapeInstitucional: navigation.rodapeInstitucional, _status: 'published' }],
      ] as const) {
        const response = await fetch(`/api/globals/${slug}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        })
        statuses.push(response.status)
      }
      return statuses
    }, original)
    expect(restored).toEqual([200, 200])
    await publicPage.goto('/')
    await expect(publicPage.getByRole('heading', { level: 1 })).toHaveText(original.home.capa.titulo)
    await context.close()
  }
})
