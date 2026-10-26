import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCard } from '@/components/NewsCard'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getTextos } from '@/lib/content'
import { sortByDateDesc } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Conferências e fóruns | CMDCA de Pindamonhangaba',
    description: textos.publicacoes.conferenciasIntro,
    path: '/conferencias',
  })
}

export default async function ConferenciasPage() {
  const payload = await getPayloadClient()
  const [textos, res] = await Promise.all([
    getTextos(),
    payload
      .find({
        collection: 'noticias',
        where: { _status: { equals: 'published' }, categoria: { in: ['conferencia', 'evento'] } },
        sort: '-data',
        limit: 12,
        depth: 1,
      })
      .catch(() => ({ docs: [] as Noticia[] })),
  ])
  const t = textos.publicacoes
  const relacionadas = sortByDateDesc(
    (res.docs as Noticia[]).filter(
      (item) => publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
    ),
  ).slice(0, 6)

  return (
    <>
      <PageHeader
        title={t.conferenciasTitulo}
        lead={t.conferenciasIntro}
        crumbs={[{ label: 'Participe', href: '/participe' }]}
      />
      <Section id="como-funciona">
        <div className="grid-2">
          <div>
            <h2>Como funciona</h2>
            <p className="lead mt-4">{t.conferenciasTexto}</p>
            <p className="mt-4">
              <Link className="more-link" href="/editais">
                Ver convocações e regulamentos
                <ArrowRight />
              </Link>
            </p>
          </div>
          {t.registroTitulo && t.registroTexto ? (
            <aside className="contact-card" aria-labelledby="registro-titulo">
              <h3 id="registro-titulo" className="callout__title">
                {t.registroTitulo}
              </h3>
              <p>{t.registroTexto}</p>
              {t.registroUrl ? (
                <ButtonLink href={t.registroUrl} variant="secondary" size="sm">
                  {t.registroRotulo}
                </ButtonLink>
              ) : null}
            </aside>
          ) : null}
        </div>
      </Section>
      {relacionadas.length ? (
        <Section id="noticias" title="Notícias de conferências e eventos" alt>
          <ul className="news-grid">
            {relacionadas.map((n) => (
              <li key={n.id}>
                <NewsCard noticia={n} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
