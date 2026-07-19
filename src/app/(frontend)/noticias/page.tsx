import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCard } from '@/components/NewsCard'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Notícias do CMDCA de Pindamonhangaba | Comunicados e Agenda',
  description:
    'Acompanhe comunicados, campanhas, reuniões, conferências e ações do CMDCA de Pindamonhangaba.',
  path: '/noticias',
})

export default async function NoticiasPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'noticias',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 60,
      depth: 1,
    })
    .catch(() => ({ docs: [] as Noticia[] }))
  const news = (res.docs as Noticia[]).filter(
    (item) =>
      publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
  )

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Publicações do conselho</span>
              <h1>Notícias</h1>
              <p>
                Comunicados, campanhas, atividades e informações de interesse público. Para atos com
                efeito oficial, consulte também <Link href="/resolucoes">Resoluções</Link> e{' '}
                <Link href="/editais">Editais</Link>.
              </p>
            </div>
          </div>
          {news.length ? (
            <div className="news-list">
              {news.map((n) => (
                <NewsCard key={n.id} noticia={n} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>
              Ainda não há notícias publicadas. Os conteúdos estão em preparação — volte em breve.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
