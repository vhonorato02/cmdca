import Image from 'next/image'
import Link from 'next/link'

import { Illustration } from '@/components/Illustration'
import { formatDate } from '@/lib/format'
import type { Noticia } from '@/payload-types'

export const CATEGORIA_LABEL: Record<string, string> = {
  noticia: 'Notícia',
  conferencia: 'Conferência',
  evento: 'Evento',
  gestao: 'Gestão',
  fmdca: 'FMDCA',
  orientacao: 'Orientação',
  'nota-tecnica': 'Nota técnica',
}

export function NewsCard({ noticia }: { noticia: Noticia }) {
  const capa = typeof noticia.capa === 'object' && noticia.capa ? noticia.capa : null
  return (
    <Link className="news" href={`/noticias/${noticia.slug}`}>
      <div className="vis">
        {capa?.url ? (
          <Image
            src={capa.url}
            alt={capa.alt || noticia.title}
            fill
            sizes="(max-width:880px) 100vw, 360px"
          />
        ) : (
          <Illustration theme={noticia.tema || 'familia'} />
        )}
        {capa?.credito ? <span className="credit">{capa.credito}</span> : null}
      </div>
      <div className="b">
        <span className="tag">{CATEGORIA_LABEL[noticia.categoria] || 'Notícia'}</span>
        <h3>{noticia.title}</h3>
        <p>{noticia.resumo}</p>
        {noticia.data ? (
          <time className="date" dateTime={noticia.data}>
            {formatDate(noticia.data)}
          </time>
        ) : null}
      </div>
    </Link>
  )
}
