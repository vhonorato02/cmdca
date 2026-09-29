import { expect, test } from '@playwright/test'

test('editor autentica pelo formulário e mantém autorização na sessão HTTP', async ({ page }) => {
  test.skip(!process.env.GITHUB_ACTIONS || !process.env.CMS_TEST_PASSWORD, 'Only isolated CI fixtures')
  await page.goto('/admin/login')
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
})
