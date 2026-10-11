import { describe, expect, it } from 'vitest'

import {
  editorialPath,
  editorialPreviewEntryPath,
  editorialPreviewMetadata,
  isEditorialPreviewUser,
  isValidEditorialSlug,
} from './editorialPreview'

describe('editorial preview', () => {
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
