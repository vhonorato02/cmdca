import { describe, expect, it } from 'vitest'

import manifest from './manifest'

describe('manifesto de instalação do portal CMDCA', () => {
  it('usa um escopo consistente para abrir como aplicativo independente', () => {
    expect(manifest()).toMatchObject({
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      lang: 'pt-BR',
    })
  })

  it('expõe ícones instaláveis e abre primeiro o canal de ajuda', () => {
    const data = manifest()

    expect(data.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
        expect.objectContaining({ sizes: '512x512', type: 'image/png' }),
        expect.objectContaining({ sizes: '512x512', purpose: 'maskable' }),
      ]),
    )
    expect(data.shortcuts?.at(0)).toMatchObject({ url: '/ajuda' })
    expect(data.shortcuts?.some((shortcut) => String(shortcut.url).startsWith('/admin'))).toBe(false)
  })
})
