import type { Metadata } from 'next'

import { NewsCard } from '@/components/NewsCard'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Notícias e comunicados do CMDCA de Pindamonhangaba.',
}

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
  const news = res.docs as Noticia[]

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Blog do conselho</span>
              <h1>Notícias</h1>
              <p>Conteúdo gerenciado pela coordenação e pelo jurídico no painel.</p>
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
