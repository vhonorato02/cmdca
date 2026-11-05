import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSiteUrl, publicHref, publicText } from './site'

afterEach(() => vi.unstubAllEnvs())

describe('public content boundary', () => {
  it('rejeita fallback de origem da Vercel em produção', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'cmdca.vercel.app')
    expect(() => getSiteUrl()).toThrow('NEXT_PUBLIC_SERVER_URL')
  })

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
    expect(publicText('XXXX')).toBeUndefined()
    expect(publicText('Agência XXXX, conta 123')).toBeUndefined()
    expect(publicText('Conselho Municipal')).toBe('Conselho Municipal')
    expect(publicText('Autonomia e independência')).toBe('Autonomia e independência')
  })
})
