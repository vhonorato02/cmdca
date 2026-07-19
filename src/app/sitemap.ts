import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl, containsUnverifiedMarker, getSiteUrl, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

const STATIC_ROUTES = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/ajuda', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/conselho', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/reunioes', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/resolucoes', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/editais', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/fmdca', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/transparencia', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/entidades', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/conferencias', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/noticias', changeFrequency: 'daily', priority: 0.8 },
  { path: '/participe', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/mapa-do-site', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/acessibilidade', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacidade', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/creditos', changeFrequency: 'yearly', priority: 0.3 },
] as const

function validDate(value?: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Valida a origem mesmo quando o banco estiver indisponível.
  getSiteUrl()

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  try {
    const payload = await getPayloadClient()
    const news = await payload.find({
      collection: 'noticias',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      pagination: false,
    })

    ;(news.docs as Noticia[]).forEach((item) => {
      if (
        item.slug &&
        publicText(item.title) &&
        !containsUnverifiedMarker([item.title, item.resumo, item.corpo])
      ) {
        entries.push({
          url: absoluteUrl(`/noticias/${encodeURIComponent(item.slug)}`),
          lastModified: validDate(item.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  } catch {
    // O site continua rastreável pelas rotas estáticas se o banco estiver indisponível.
  }

  return entries
}
