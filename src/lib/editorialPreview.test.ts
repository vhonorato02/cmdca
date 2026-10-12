import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  editorialPath,
  editorialPreviewEntryPath,
  editorialPreviewMetadata,
  isEditorialPreviewUser,
  isValidEditorialSlug,
  hasEditorialOrigin,
} from './editorialPreview'

afterEach(() => vi.unstubAllEnvs())

describe('editorial preview', () => {
  it('validates the configured public origin behind the standalone proxy', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://cms.example.test')
    const request = (origin?: string) => new Request('http://0.0.0.0:3000/api/draft', {
      headers: origin ? { origin } : {},
    })
    expect(hasEditorialOrigin(request('https://cms.example.test'))).toBe(true)
    expect(hasEditorialOrigin(request('https://attacker.example.test'))).toBe(false)
    expect(hasEditorialOrigin(request('null'))).toBe(false)
    expect(hasEditorialOrigin(request())).toBe(false)
  })
  it('accepts only bounded, URL-safe article slugs', () => {
    expect(isValidEditorialSlug('conselho-em-pauta-2026')).toBe(true)
    for (const slug of ['', '../admin', '//example.test', 'a?next=/admin', 'A B', 'a'.repeat(181)]) {
      expect(isValidEditorialSlug(slug)).toBe(false)
    }
  })

  it('recognizes only Payload editorial roles', () => {
    expect(isEditorialPreviewUser({ role: 'editor' })).toBe(true)
    expect(isEditorialPreviewUser({ role: 'juridico' })).toBe(true)
    expect(isEditorialPreviewUser({ role: 'admin' })).toBe(true)
    expect(isEditorialPreviewUser({ role: 'intruso' })).toBe(false)
    expect(isEditorialPreviewUser(null)).toBe(false)
  })

  it('builds fixed same-origin paths and noindex metadata', () => {
    expect(editorialPath('conselho-em-pauta')).toBe('/noticias/conselho-em-pauta')
    expect(editorialPreviewEntryPath('conselho-em-pauta')).toBe(
      '/api/draft?slug=conselho-em-pauta',
    )
    expect(() => editorialPath('//example.test')).toThrow()
    expect(editorialPreviewMetadata()).toEqual({ robots: { index: false, follow: false } })
  })
})
