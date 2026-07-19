import { describe, expect, it } from 'vitest'

import { illSvg } from './Illustration'

describe('illSvg', () => {
  it('usa um tema seguro quando recebe um valor fora da lista do CMS', () => {
    const unsafe = '"><script>alert(1)</script>'
    const svg = illSvg(unsafe)

    expect(svg).not.toContain(unsafe)
    expect(svg).not.toContain('<script>')
    expect(svg).toBe(illSvg('doc'))
  })
})
