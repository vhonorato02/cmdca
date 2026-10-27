import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/payload', () => ({ getPayloadClient: vi.fn() }))

describe('sitemap', () => {
  // Sem revalidate o Next gera o sitemap uma vez no build (banco vazio do CI) e
  // nunca mais inclui notícias publicadas depois.
  it('é regenerado periodicamente em vez de ficar congelado no build', async () => {
    const { revalidate } = await import('./sitemap')
    expect(revalidate).toBeGreaterThanOrEqual(60)
    expect(revalidate).toBeLessThanOrEqual(3600)
  })
})
