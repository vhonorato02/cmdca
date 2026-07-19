import { describe, expect, it } from 'vitest'

import { safeJsonLd } from './safeJsonLd'

describe('safeJsonLd', () => {
  it('impede o fechamento da tag script por conteúdo do CMS', () => {
    const serialized = safeJsonLd({ title: '</script><script>alert(1)</script>' })

    expect(serialized).not.toContain('<')
    expect(serialized).not.toContain('>')
    expect(JSON.parse(serialized)).toEqual({ title: '</script><script>alert(1)</script>' })
  })

  it('escapa separadores Unicode e E comercial', () => {
    const serialized = safeJsonLd({ text: `A&B\u2028C\u2029D` })

    expect(serialized).toContain('\\u0026')
    expect(serialized).toContain('\\u2028')
    expect(serialized).toContain('\\u2029')
    expect(JSON.parse(serialized)).toEqual({ text: `A&B\u2028C\u2029D` })
  })
})
