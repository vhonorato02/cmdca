import { expect, test } from '@playwright/test'

test('reunião publicada exibe participação e filtros sem revelar reunião reservada', async ({ page }) => {
  test.skip(process.env.GITHUB_ACTIONS !== 'true', 'Fixtures exist only in the isolated CI database')
  await page.goto('/reunioes')
  await expect(page.getByRole('heading', { name: 'Próximas reuniões' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /CI public meeting/ })).toBeVisible()
  await expect(page.getByText('CI reserved meeting')).toHaveCount(0)
  await expect(page.getByText('Horário: 14:30. Online')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Acessar reunião' })).toHaveAttribute('href', 'https://example.test/meeting')
  await page.getByLabel('Tipo de reunião').selectOption('extraordinaria')
  await expect(page.getByText('Nenhuma reunião neste filtro.')).toBeVisible()
  await page.getByLabel('Tipo de reunião').selectOption('ordinaria')
  const year = String(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getUTCFullYear())
  await page.getByRole('combobox', { name: /^Ano/ }).selectOption(year)
  await expect(page.getByRole('heading', { name: /CI public meeting/ })).toBeVisible()
})
