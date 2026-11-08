import { CalendarDays } from 'lucide-react'
import Image from 'next/image'

import { AppLink as Link } from '@/components/ui/AppLink'

import { formatDateLong } from '@/lib/format'
import { publicMediaHref, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

export const CATEGORIA_LABEL: Record<string, string> = {
  noticia: 'Notícia',
  conferencia: 'Conferência',
  evento: 'Evento',
  gestao: 'Gestão',
  fmdca: 'Fundo e IR',
  orientacao: 'Orientação',
  'nota-tecnica': 'Nota técnica',
}

/**
 * Cartão de notícia (padrão gov.br): capa quando houver imagem conferida no CMS,
 * etiqueta da categoria, data, título e resumo. O cartão todo é clicável.
 */
export function NewsCard({
  noticia,
  headingLevel = 3,
  lead = false,
}: {
  noticia: Noticia
  headingLevel?: 2 | 3
  lead?: boolean
}) {
  const capa = typeof noticia.capa === 'object' && noticia.capa ? noticia.capa : null
  const imagePath = publicMediaHref(capa?.url)
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const credit = publicText(capa?.credito)
  const classes = ['news-card', lead ? 'news-card--lead' : '', imagePath ? 'news-card--media' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <article className={classes}>
      {imagePath ? (
        <div className="news-card__media">
          <Image
            src={imagePath}
            alt={publicText(capa?.alt) || ''}
            fill
            unoptimized={imagePath.startsWith('/api/media/file/')}
            sizes={lead ? '(max-width: 900px) 100vw, 600px' : '(max-width: 900px) 100vw, 380px'}
          />
          {credit ? <span className="news-card__credit">{credit}</span> : null}
        </div>
      ) : null}
      <div className="news-card__body">
        <p className="news-card__meta">
          <span className="tag">{CATEGORIA_LABEL[noticia.categoria] || 'Notícia'}</span>
          {noticia.data ? (
            <span className="news-card__date">
              <CalendarDays aria-hidden="true" />
              <span className="sr-only">, publicada em </span>
              <time dateTime={noticia.data}>{formatDateLong(noticia.data)}</time>
            </span>
          ) : null}
        </p>
        <Heading className="news-card__title">
          <Link href={`/noticias/${noticia.slug}`}>{noticia.title}</Link>
        </Heading>
        {noticia.resumo ? <p className="news-card__summary">{noticia.resumo}</p> : null}
      </div>
    </article>
  )
}
