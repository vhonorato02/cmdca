import { describe, expect, it } from 'vitest'
import { publicHref, publicText } from './site'

describe('public content boundary', () => {
  it('rejects schemes, protocol-relative URLs, backslashes and control characters', () => {
    for (const href of ['javascript:alert(1)', 'data:text/html,test', '//evil.example', '/\\evil.example', '/news\nitem']) {
      expect(publicHref(href)).toBeUndefined()
    }
    expect(publicHref('/noticias')).toBe('/noticias')
    expect(publicHref('https://example.org/document')).toBe('https://example.org/document')
  })
  it('does not publish unresolved content markers', () => {
    expect(publicText('PENDENCIA: contato não informado')).toBeUndefined()
    expect(publicText('Lorem ipsum')).toBeUndefined()
    expect(publicText('Conselho Municipal')).toBe('Conselho Municipal')
    expect(publicText('Autonomia e independência')).toBe('Autonomia e independência')
  })
})
