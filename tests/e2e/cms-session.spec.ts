import { expect, test } from '@playwright/test'

test('editor autentica pelo formulário e mantém autorização na sessão HTTP', async ({ page }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: /e-?mail/i }).fill('editor@example.test')
  await page.getByLabel(/senha/i).fill(process.env.CMS_TEST_PASSWORD!)
  await page.getByRole('button', { name: /entrar|login/i }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  const self = await page.request.get('/api/users/me')
  expect(self.status()).toBe(200)
  const identity = await self.json()
  expect(identity.user.role).toBe('editor')
  const users = await page.request.get('/api/users?depth=0')
  expect(users.status()).toBe(200)
  const visible = await users.json()
  expect(visible.docs.map((user: { email: string }) => user.email)).toEqual(['editor@example.test'])
  const createUser = await page.request.post('/api/users', {
    data: { email: 'forbidden@example.test', password: 'invalid-action', name: 'Forbidden user', role: 'admin' },
    headers: { Origin: new URL(page.url()).origin },
  })
  expect(createUser.status()).toBe(403)
  const logout = await page.request.post('/api/users/logout', { headers: { Origin: new URL(page.url()).origin } })
  expect(logout.status()).toBe(200)
  const afterLogout = await page.request.get('/api/users')
  expect(afterLogout.status()).toBe(403)
})
