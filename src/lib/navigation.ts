import { cache } from 'react'

export type NavigationLink = { label: string; href: string }
export type SiteNavigation = {
  menuPrincipal: NavigationLink[]
  rodapeInstitucional: NavigationLink[]
  rodapeSobreSite: NavigationLink[]
}

export const DEFAULT_NAVIGATION: SiteNavigation = {
  menuPrincipal: [
    { label: 'CMDCA', href: '/conselho' },
    { label: 'Reuniões', href: '/reunioes' },
    { label: 'Transparência', href: '/transparencia' },
    { label: 'Fundo e IR', href: '/fmdca' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Participe', href: '/participe' },
  ],
  rodapeInstitucional: [
    { label: 'Sobre o CMDCA', href: '/conselho' },
    { label: 'Reuniões', href: '/reunioes' },
    { label: 'Transparência', href: '/transparencia' },
    { label: 'Fundo Municipal', href: '/fmdca' },
    { label: 'Conferências', href: '/conferencias' },
    { label: 'Notícias', href: '/noticias' },
  ],
  rodapeSobreSite: [
    { label: 'Mapa do site', href: '/mapa-do-site' },
    { label: 'Acessibilidade', href: '/acessibilidade' },
    { label: 'Privacidade (LGPD)', href: '/privacidade' },
    { label: 'Termos de uso', href: '/termos' },
    { label: 'Créditos de imagens', href: '/creditos' },
  ],
}

export function validateNavigationHref(value: unknown): true | string {
  if (typeof value !== 'string' || !value.trim()) return 'Informe o destino do link.'
  const href = value.trim()
  if (/[\\\u0000-\u001f\u007f]/.test(href)) return 'Informe um destino sem caracteres de controle.'
  if (/^\/(?!\/)/.test(href) && !href.includes('\\') && !/[\u0000-\u001f]/.test(href)) {
    return true
  }
  try {
    const url = new URL(href)
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password
      ? true
      : 'Use um caminho interno ou uma URL completa começando com https://.'
  } catch {
    return 'Use um caminho interno ou uma URL completa começando com https://.'
  }
}

export function resolvePublishedNavigation(value: unknown): SiteNavigation {
  if (
    !value ||
    typeof value !== 'object' ||
    (value as { _status?: unknown })._status !== 'published'
  ) {
    return DEFAULT_NAVIGATION
  }
  const data = value as Partial<SiteNavigation>
  return {
    menuPrincipal: sanitizeLinks(data.menuPrincipal, DEFAULT_NAVIGATION.menuPrincipal, 6),
    rodapeInstitucional: sanitizeLinks(
      data.rodapeInstitucional,
      DEFAULT_NAVIGATION.rodapeInstitucional,
      8,
    ),
    rodapeSobreSite: sanitizeLinks(data.rodapeSobreSite, DEFAULT_NAVIGATION.rodapeSobreSite, 8),
  }
}

function sanitizeLinks(value: unknown, fallback: NavigationLink[], max: number): NavigationLink[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > max) return fallback
  const links = value
    .filter((item): item is NavigationLink => {
      if (!item || typeof item !== 'object') return false
      const link = item as NavigationLink
      return (
        typeof link.label === 'string' &&
        link.label.trim().length > 0 &&
        link.label.trim().length <= 40 &&
        validateNavigationHref(link.href) === true
      )
    })
    .map(({ label, href }) => ({ label: label.trim(), href: href.trim() }))
  return links.length === value.length ? links : fallback
}

export const getSiteNavigation = cache(async (): Promise<SiteNavigation> => {
  try {
    const { getPayloadClient } = await import('./payload')
    const payload = await getPayloadClient()
    const global: unknown = await payload.findGlobal({
      slug: 'navegacao',
      draft: false,
      overrideAccess: false,
    })
    return resolvePublishedNavigation(global)
  } catch {
    return DEFAULT_NAVIGATION
  }
})
