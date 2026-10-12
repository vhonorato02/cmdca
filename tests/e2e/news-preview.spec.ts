import { expect, test } from '@playwright/test'

test('notícia em rascunho exige sessão atual inclusive com cookie de prévia ativo', async ({
  page,
  browser,
  baseURL,
}) => {
  const isolatedDatabase = (() => {
    try {
      const uri = new URL(process.env.DATABASE_URI || '')
      return ['localhost', '127.0.0.1'].includes(uri.hostname) && uri.pathname === '/cmdca_test'
    } catch {
      return false
    }
  })()
  test.skip(
    process.env.GITHUB_ACTIONS !== 'true' ||
      !process.env.CMS_TEST_PASSWORD ||
      !isolatedDatabase ||
      !baseURL?.startsWith('http://localhost'),
    'Rascunhos só são criados no PostgreSQL efêmero do CI',
  )

  const slug = `ci-news-preview-${Date.now()}`
  await page.goto('/admin/login')
  const login = await page.evaluate(async (password) => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'editor@example.test', password }),
    })
    return response.status
  }, process.env.CMS_TEST_PASSWORD!)
  expect(login).toBe(200)

  const create = await page.evaluate(async (articleSlug) => {
    const response = await fetch('/api/noticias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'CI draft preview article',
        slug: articleSlug,
        categoria: 'noticia',
        resumo: 'Controlled draft summary created only in the isolated CI database.',
        corpo: {
          root: {
            type: 'root',
            version: 1,
            format: '',
            indent: 0,
            direction: null,
            children: [{
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: null,
              children: [{
                type: 'text',
                version: 1,
                text: 'Private preview body from the disposable fixture.',
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
              }],
            }],
          },
        },
        autor: 'CI fixture author',
        data: '2026-10-11T00:00:00.000Z',
        _status: 'draft',
      }),
    })
    return { status: response.status, body: await response.json() }
  }, slug)
  expect(create.status).toBe(201)
  expect(create.body.doc.slug).toBe(slug)

  const anonymous = await browser.newContext({ baseURL })
  try {
    expect((await anonymous.request.get(`/noticias/${slug}`)).status()).toBe(404)
    const anonymousEntry = await anonymous.request.get(`/api/draft?slug=${slug}`)
    expect(anonymousEntry.status()).toBe(200)
    const anonymousPost = await anonymous.request.post('/api/draft', {
      headers: { Origin: baseURL! },
      form: { slug },
    })
    expect(anonymousPost.status()).toBe(404)
  } finally {
    await anonymous.close()
  }

  const entry = await page.goto(`/api/draft?slug=${slug}`)
  expect(entry?.status()).toBe(200)
  await expect(page).toHaveURL(new RegExp(`/noticias/${slug}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CI draft preview article')
  await expect(page.getByText('Prévia', { exact: true })).toBeVisible()
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)

  const logout = await page.evaluate(async () => {
    const response = await fetch('/api/users/logout', { method: 'POST' })
    return response.status
  })
  expect(logout).toBe(200)
  const afterLogout = await page.goto(`/noticias/${slug}`)
  expect(afterLogout?.status()).toBe(404)

  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  await page.goto(`/admin/collections/noticias/${create.body.doc.id}`)
  await page.getByLabel('Fonte da informação', { exact: true }).fill('CI controlled institutional source')
  const date = page.getByLabel('Verificado em', { exact: true })
  await date.fill('11/10/2026')
  await date.press('Tab')
  await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
  const visitor = await browser.newContext({ baseURL })
  const publishedPage = await visitor.newPage()
  try {
    await expect.poll(async () => {
      const response = await publishedPage.goto(`/noticias/${slug}`)
      return response?.status()
    }).toBe(200)
    await expect(publishedPage.getByRole('heading', { level: 1 })).toHaveText('CI draft preview article')
    await publishedPage.goto('/noticias')
    await expect(publishedPage.getByRole('link', { name: /CI draft preview article/ }).first()).toBeVisible()

    await page.getByLabel(/^Título/).fill('CI revised published article')
    await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
    await expect.poll(async () => {
      await publishedPage.goto(`/noticias/${slug}`)
      return publishedPage.getByRole('heading', { level: 1 }).textContent()
    }).toBe('CI revised published article')
    await page.getByRole('button', { name: 'Mais opções', exact: true }).click()
    await page.getByRole('button', { name: 'Despublicar', exact: true }).click()
    await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
    await expect.poll(async () => (await visitor.request.get(`/noticias/${slug}`)).status()).toBe(404)
  } finally {
    await visitor.close()
  }
})
