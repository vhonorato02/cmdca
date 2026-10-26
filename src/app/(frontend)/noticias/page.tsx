import type { Metadata } from 'next'

import { NewsCard } from '@/components/NewsCard'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination, parsePage } from '@/components/ui/Pagination'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { getTextos } from '@/lib/content'
import { sortByDateDesc } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Noticia } from '@/payload-types'

const PER_PAGE = 9

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Notícias do CMDCA | Pindamonhangaba',
    description: textos.publicacoes.noticiasIntro,
    path: '/noticias',
  })
}

async function loadNews(): Promise<Noticia[] | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'noticias',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 300,
      depth: 1,
    })
    // Ordenação em memória: notícias sem data vão para o fim (o Postgres as põe no topo).
    return sortByDateDesc(
      (res.docs as Noticia[]).filter(
        (item) => publicText(item.title) && !containsUnverifiedMarker([item.title, item.resumo, item.corpo]),
      ),
    )
  } catch {
    return null
  }
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [textos, news, params] = await Promise.all([getTextos(), loadNews(), searchParams])
  const total = news ? Math.max(1, Math.ceil(news.length / PER_PAGE)) : 1
  const page = parsePage(params.pagina, total)
  const items = news?.slice((page - 1) * PER_PAGE, page * PER_PAGE) ?? []

  return (
    <>
      <PageHeader
        title={textos.publicacoes.noticiasTitulo}
        lead={textos.publicacoes.noticiasIntro}
        meta={news?.length ? `${news.length} publicações${total > 1 ? `, página ${page} de ${total}` : ''}` : undefined}
      />
      <div className="section">
        <div className="wrap">
          {news === null ? (
            <ErrorState
              title="Não foi possível carregar as notícias"
              action={<ButtonLink href="/noticias">Tentar de novo</ButtonLink>}
            >
              O banco de dados não respondeu. Atos oficiais também podem ser consultados na imprensa
              oficial do Município.
            </ErrorState>
          ) : items.length ? (
            <>
              <ul className="news-grid">
                {items.map((n) => (
                  <li key={n.id}>
                    <NewsCard noticia={n} headingLevel={2} />
                  </li>
                ))}
              </ul>
              <Pagination
                current={page}
                total={total}
                buildHref={(p) => (p === 1 ? '/noticias' : `/noticias?pagina=${p}`)}
              />
            </>
          ) : (
            <EmptyState
              title="Ainda não há notícias publicadas"
              action={<ButtonLink href="/resolucoes" variant="secondary">Ver as resoluções</ButtonLink>}
            >
              Enquanto isso, as decisões do conselho estão em Resoluções e Editais.
            </EmptyState>
          )}
        </div>
      </div>
    </>
  )
}
