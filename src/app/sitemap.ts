import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import type { Noticia } from '@/payload-types'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const STATIC_ROUTES = [
  '',
  '/conselho',
  '/reunioes',
  '/resolucoes',
  '/editais',
  '/fmdca',
  '/entidades',
  '/conferencias',
  '/noticias',
  '/transparencia',
  '/ajuda',
  '/participe',
  '/acessibilidade',
  '/privacidade',
  '/creditos',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r || '/'}`,
    changeFrequency: 'weekly',
    priority: r === '' ? 1 : 0.7,
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
    ;(news.docs as Noticia[]).forEach((n) => {
      if (n.slug) {
        entries.push({
          url: `${BASE}/noticias/${n.slug}`,
          lastModified: n.updatedAt ? new Date(n.updatedAt) : undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  } catch {
    /* banco indisponível — devolve apenas as rotas estáticas */
  }

  return entries
}
