import { describe, expect, it } from 'vitest'

import {
  DEFAULT_NAVIGATION,
  resolvePublishedNavigation,
  validateNavigationHref,
} from './navigation'

describe('links da navegação pública', () => {
  it.each([
    ['/conselho', true],
    ['/ajuda#rede', true],
    ['https://example.org/page', true],
    ['http://example.org', false],
    ['//example.org/path', false],
    ['javascript:alert(1)', false],
    ['data:text/html,hello', false],
    ['', false],
  ])('valida destino %s', (href, valid) => {
    const result = validateNavigationHref(href)
    expect(valid ? result : typeof result === 'string').toBe(true)
  })

  it('usa defaults para nunca publicada ou para conteúdo não publicado', () => {
    expect(resolvePublishedNavigation(undefined)).toBe(DEFAULT_NAVIGATION)
    expect(resolvePublishedNavigation({ _status: 'draft', menuPrincipal: [] })).toBe(
      DEFAULT_NAVIGATION,
    )
  })

  it('retorna links publicados e recusa dados malformados como conjunto', () => {
    expect(
      resolvePublishedNavigation({
        _status: 'published',
        menuPrincipal: [{ label: 'Ajuda', href: '/ajuda' }],
        rodapeInstitucional: [{ label: 'Externo', href: 'https://example.org' }],
      }),
    ).toEqual({
      menuPrincipal: [{ label: 'Ajuda', href: '/ajuda' }],
      rodapeInstitucional: [{ label: 'Externo', href: 'https://example.org' }],
    })
    expect(
      resolvePublishedNavigation({
        _status: 'published',
        menuPrincipal: [{ label: 'Inseguro', href: 'javascript:alert(1)' }],
      }).menuPrincipal,
    ).toEqual(DEFAULT_NAVIGATION.menuPrincipal)
  })
})
