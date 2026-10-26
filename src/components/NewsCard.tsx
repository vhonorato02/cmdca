import Image from 'next/image'
import Link from 'next/link'

import { Pictogram } from '@/components/ui/icons'
import { dateParts, formatDateLong } from '@/lib/format'
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
 * Cartão de notícia. Com capa conferida, mostra a imagem; sem capa, vira um
 * cartão tipográfico com a data em numerais e o pictograma do tema, em vez de
 * uma ilustração genérica.
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
  const parts = dateParts(noticia.data)
  const credit = publicText(capa?.credito)
  return (
    <article className={lead ? 'news-card news-card--lead' : 'news-card'}>
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
      ) : (
        <div className="news-card__stamp" aria-hidden="true">
          {parts ? (
            <span className="news-card__date">
              <b>{parts.day}</b>
              <span>{parts.monthYear}</span>
            </span>
          ) : (
            <span />
          )}
          <Pictogram tema={noticia.tema} className="news-card__pictogram" />
        </div>
      )}
      <div className="news-card__body">
        <span className="tag">{CATEGORIA_LABEL[noticia.categoria] || 'Notícia'}</span>
        <Heading className="news-card__title">
          <Link href={`/noticias/${noticia.slug}`}>{noticia.title}</Link>
        </Heading>
        {noticia.resumo ? <p className="news-card__summary">{noticia.resumo}</p> : null}
        {noticia.data ? (
          <p className={imagePath ? 'news-card__meta' : 'news-card__meta sr-only'}>
            Publicada em <time dateTime={noticia.data}>{formatDateLong(noticia.data)}</time>
          </p>
        ) : null}
      </div>
    </article>
  )
}
