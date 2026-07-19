const LOCAL_SITE_URL = 'http://localhost:3000'

export const SITE_NAME = 'CMDCA de Pindamonhangaba'
export const ORGANIZATION_NAME =
  'Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba'
export const DEFAULT_DESCRIPTION =
  'Portal do CMDCA de Pindamonhangaba: proteção de crianças e adolescentes, atos oficiais, reuniões, transparência e participação social.'

const UNVERIFIED_PATTERN =
  /\[?\s*a confirmar\s*\]?|dado(?:s)? ilustrativo(?:s)?|conte[uú]do ilustrativo|depoimento ilustrativo|percentual ilustrativo/i

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

/**
 * Origem canônica do site. A Vercel fornece VERCEL_PROJECT_PRODUCTION_URL sem
 * protocolo; localmente mantemos localhost para não impedir o desenvolvimento.
 * Em produção, a ausência de uma origem configurada interrompe o build em vez
 * de publicar canonicals e sitemap apontando para localhost.
 */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (!configured) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Configure NEXT_PUBLIC_SERVER_URL ou VERCEL_PROJECT_PRODUCTION_URL com a URL pública do site.',
      )
    }

    return new URL(LOCAL_SITE_URL)
  }

  const url = new URL(withProtocol(configured.trim()))
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url
}

export function absoluteUrl(path = '/') {
  return new URL(path, getSiteUrl()).toString()
}

export function containsUnverifiedMarker(value: unknown): boolean {
  if (value === null || value === undefined) return false

  const text = typeof value === 'string' ? value : JSON.stringify(value)
  return UNVERIFIED_PATTERN.test(text)
}

export function publicText(value?: string | null): string | undefined {
  const text = value?.trim()
  return text && !containsUnverifiedMarker(text) ? text : undefined
}

export function publicHref(value?: string | null): string | undefined {
  const href = publicText(value)
  if (!href) return undefined
  if (href.startsWith('/') && !href.startsWith('//')) return href

  try {
    const url = new URL(href)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export const ORGANIZATION_ID = () => `${absoluteUrl('/')}#organization`
export const WEBSITE_ID = () => `${absoluteUrl('/')}#website`
