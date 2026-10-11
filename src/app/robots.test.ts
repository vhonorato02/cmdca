import { afterEach, describe, expect, it, vi } from 'vitest'
import robots from './robots'

afterEach(() => vi.unstubAllEnvs())

describe('indexação por ambiente', () => {
  it.each(['', 'false'])('bloqueia ambiente temporário quando SITE_INDEXABLE=%s', (value) => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://preview.example.test')
    vi.stubEnv('SITE_INDEXABLE', value)
    expect(robots()).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] })
  })
  it('somente libera o domínio promovido explicitamente', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://public.example.test')
    vi.stubEnv('SITE_INDEXABLE', 'true')
    expect(robots()).toMatchObject({
      rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }],
      sitemap: 'https://public.example.test/sitemap.xml',
    })
  })
})
