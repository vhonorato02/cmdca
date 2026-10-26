import { describe, expect, it } from 'vitest'

import { contentSecurityPolicy } from './csp'

const directive = (name: string) =>
  contentSecurityPolicy()
    .split('; ')
    .find((d) => d.startsWith(`${name} `))

describe('contentSecurityPolicy', () => {
  it('permite o iframe do VLibras (sem ele o avatar não carrega)', () => {
    expect(directive('frame-src')).toContain('https://vlibras.gov.br')
    expect(directive('frame-src')).toContain('https://*.vlibras.gov.br')
  })

  it('não usa eval de JavaScript; só o WebAssembly do avatar', () => {
    expect(directive('script-src')).not.toContain("'unsafe-eval'")
    expect(directive('script-src')).toContain("'wasm-unsafe-eval'")
  })

  it('não libera rastreadores de terceiros', () => {
    expect(contentSecurityPolicy()).not.toMatch(/posthog|google|facebook/i)
  })

  it('bloqueia objetos e o site dentro de iframe de outra origem', () => {
    expect(directive('object-src')).toBe("object-src 'none'")
    expect(directive('frame-ancestors')).toBe("frame-ancestors 'self'")
  })
})
