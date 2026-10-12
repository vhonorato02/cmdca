import { createHash } from 'node:crypto'
import { expect, test } from '@playwright/test'

test('PDF publicado preserva bytes e rascunho exige sessão editorial', async ({ page, request }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PDF_SHA256, 'Only isolated CI fixtures')
  const publicFile = await request.get('/api/media/file/ci-public-document.pdf')
  expect(publicFile.status()).toBe(200)
  expect(publicFile.headers()['content-type']).toContain('application/pdf')
  expect(createHash('sha256').update(await publicFile.body()).digest('hex')).toBe(process.env.CMS_TEST_PDF_SHA256)

  const privatePath = '/api/media/file/ci-draft-document.pdf'
  expect([401, 403, 404]).toContain((await request.get(privatePath)).status())
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  const privateFile = await page.evaluate(async (path) => {
    const response = await fetch(path)
    return { status: response.status, bytes: Array.from(new Uint8Array(await response.arrayBuffer())) }
  }, privatePath)
  expect(privateFile.status).toBe(200)
  expect(createHash('sha256').update(Buffer.from(privateFile.bytes)).digest('hex')).toBe(process.env.CMS_TEST_PDF_SHA256)
  await page.evaluate(async () => fetch('/api/users/logout', { method: 'POST' }))
  const afterLogout = await page.evaluate(async (path) => (await fetch(path, { cache: 'no-store' })).status, privatePath)
  expect([401, 403, 404]).toContain(afterLogout)
})

test('editor envia e publica PDF pelo formulário e o visitante baixa os mesmos bytes', async ({ page, request }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PDF_SHA256, 'Only isolated CI fixtures')
  const bytes = await (await request.get('/api/media/file/ci-public-document.pdf')).body()
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  await page.goto('/admin/collections/media/create')
  await page.locator('input[type="file"]').setInputFiles({
    name: `ci-browser-${Date.now()}.pdf`, mimeType: 'application/pdf', buffer: bytes,
  })
  await page.getByLabel(/^Texto alternativo da imagem/).fill('CI browser PDF')
  await page.getByLabel('Fonte da informação', { exact: true }).fill('CI isolated document')
  const date = page.getByLabel('Verificado em', { exact: true })
  await date.fill('11/10/2026')
  await date.press('Tab')
  await page.getByRole('button', { name: /^publicar(?: alterações)?$/i }).click()
  await expect(page).toHaveURL(/\/admin\/collections\/media\/\d+/)
  const id = new URL(page.url()).pathname.split('/').pop()
  await expect.poll(async () => {
    const response = await request.get(`/api/media/${id}?depth=0`)
    return response.ok() ? (await response.json())._status : response.status()
  }).toBe('published')
  const media = await (await request.get(`/api/media/${id}?depth=0`)).json()
  const file = await request.get(media.url)
  expect(file.status()).toBe(200)
  expect(createHash('sha256').update(await file.body()).digest('hex')).toBe(process.env.CMS_TEST_PDF_SHA256)
  await page.getByRole('button', { name: 'Mais opções', exact: true }).click()
  await page.getByRole('button', { name: 'Despublicar', exact: true }).click()
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
  await expect.poll(async () => (await request.get(media.url)).status()).toBe(403)
})
