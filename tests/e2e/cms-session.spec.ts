import { expect, test } from '@playwright/test'

test('editor autentica pelo formulário e mantém autorização na sessão HTTP', async ({ page }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  await page.goto('/admin/login')
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: /entrar|login/i }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  // Use browser fetch so secure localhost cookies and Fetch Metadata match the UI.
  // Payload rejects cookie requests lacking both Origin and Sec-Fetch-Site.
  const self = await page.evaluate(async () => {
    const response = await fetch('/api/users/me')
    return { status: response.status, body: await response.json() }
  })
  expect(self.status).toBe(200)
  const identity = self.body
  expect(identity.user).not.toBeNull()
  expect(identity.user.role).toBe('editor')
  const users = await page.evaluate(async () => {
    const response = await fetch('/api/users?depth=0')
    return { status: response.status, body: await response.json() }
  })
  expect(users.status).toBe(200)
  const visible = users.body
  expect(visible.docs.map((user: { email: string }) => user.email)).toEqual(['editor@example.test'])
  const createUserStatus = await page.evaluate(async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'forbidden@example.test', password: 'invalid-action', name: 'Forbidden user', role: 'admin' }),
    })
    return response.status
  })
  expect(createUserStatus).toBe(403)
  const logoutStatus = await page.evaluate(async () => (await fetch('/api/users/logout', { method: 'POST' })).status)
  expect(logoutStatus).toBe(200)
  const afterLogoutStatus = await page.evaluate(async () => (await fetch('/api/users')).status)
  expect(afterLogoutStatus).toBe(403)
  const recoveryStatus = await page.evaluate(async () => (await fetch('/api/users/forgot-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor@example.test' }),
  })).status)
  expect(recoveryStatus).toBe(503)
})

test('login e recuperação exibem português mesmo com preferência de navegador em inglês', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })
  await page.goto('/admin/login')
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
  await page.goto('/admin/forgot')
  await expect(page.getByRole('textbox', { name: /e-?mail/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /esqueci|esqueceu|senha/i }).first()).toBeVisible()
})

for (const width of [1440, 1024, 768, 390]) {
  test(`login mantém alvos de toque e largura em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/admin/login')
    for (const target of [page.getByRole('textbox', { name: /e-?mail/i }),
      page.getByLabel(/senha/i), page.getByRole('button', { name: 'Entrar', exact: true }),
      page.getByRole('link', { name: /esqueceu|esqueci/i })]) {
      await expect(target).toBeVisible()
      const box = await target.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.width).toBeGreaterThanOrEqual(44)
      expect(box!.height).toBeGreaterThanOrEqual(44)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
}

test('editor salva, publica e despublica uma FAQ pelo formulário', async ({ page, browser }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  const question = `CI browser FAQ ${Date.now()}`
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  await page.goto('/admin/collections/faq/create')
  await page.getByLabel(/^pergunta/i).fill(question)
  await page.getByLabel(/^resposta/i).fill('Controlled answer created by the browser only in the isolated runner.')
  await page.getByLabel('Fonte da informação', { exact: true }).fill('CI browser controlled fixture')
  const verificationDate = page.getByLabel('Verificado em', { exact: true })
  await verificationDate.fill('01/10/2026')
  await verificationDate.press('Tab')
  await page.getByRole('button', { name: /salvar rascunho/i }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/faq\/\d+/)
  const documentID = new URL(page.url()).pathname.split('/').pop()!
  const publicContext = await browser.newContext({
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  })
  try {
    expect((await publicContext.request.get(`/api/faq/${documentID}?depth=0`)).status()).toBe(404)
    await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
    await expect.poll(async () => {
      const response = await publicContext.request.get(`/api/faq/${documentID}?depth=0`)
      return response.ok() ? (await response.json())._status : response.status()
    }).toBe('published')
    const published = await (await publicContext.request.get(`/api/faq/${documentID}?depth=0`)).json()
    expect(published.pergunta).toBe(question)
    expect(published.controleEditorial).toBeUndefined()
    // Unpublish lives in the named "more options" menu and asks for confirmation.
    await page.getByRole('button', { name: 'Mais opções', exact: true }).click()
    await page.getByRole('button', { name: 'Despublicar', exact: true }).click()
    await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
    await expect.poll(async () => (await publicContext.request.get(`/api/faq/${documentID}?depth=0`)).status()).toBe(404)
  } finally {
    await publicContext.close()
  }
})

test('notícia publicada da fixture renderiza na lista e na página individual', async ({ page }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  await page.goto('/noticias')
  await expect(page.getByRole('link', { name: /CI published institutional news/i }).first()).toBeVisible()
  const response = await page.goto('/noticias/ci-published-institutional-news')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CI published institutional news')
  await expect(page.getByText('Confirmed content used only in the isolated CI database.')).toBeVisible()
})
