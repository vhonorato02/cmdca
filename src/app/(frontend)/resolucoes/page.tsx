import type { Metadata } from 'next'

import { ActFilters, hrefWith, pickParam, yearOf, yearOptions } from '@/components/ActFilters'
import { amendedBy, relatedActs, RESOLUCAO_SITUACAO, statusInfo } from '@/components/officialActs'
import { ActItem, ActList, StatusPill } from '@/components/ui/ActList'
import { ButtonLink } from '@/components/ui/Button'
import { ExternalIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination, parsePage } from '@/components/ui/Pagination'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { getConfiguracoes, getTextos } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'
import type { Resolucoe } from '@/payload-types'

const PER_PAGE = 20
const anchor = (id: number | string) => `resolucao-${id}`

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Resoluções do CMDCA | Pindamonhangaba',
    description: textos.atos.resolucoesIntro,
    path: '/resolucoes',
  })
}

async function load(): Promise<Resolucoe[] | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'resolucoes',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 1000,
      depth: 1,
    })
    return (res.docs as Resolucoe[]).filter((item) => publicText(item.numero) && publicText(item.titulo))
  } catch {
    return null
  }
}

export default async function ResolucoesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [textos, config, docs, params] = await Promise.all([getTextos(), getConfiguracoes(), load(), searchParams])
  const tribuna = publicHref(config?.tribunaUrl)
  const ano = pickParam(params.ano)
  const filtered = (docs ?? []).filter((r) => ano === 'todos' || yearOf(r.data) === ano)
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const page = parsePage(params.pagina, total)
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const listedIds = new Set(items.map((item) => item.id))

  return (
    <>
      <PageHeader
        title={textos.atos.resolucoesTitulo}
        lead={textos.atos.resolucoesIntro}
        crumbs={[{ label: 'Transparência', href: '/transparencia' }]}
        meta={
          tribuna ? (
            <>
              Edições anteriores estão na{' '}
              <a href={tribuna} target="_blank" rel="noopener noreferrer">
                imprensa oficial (Tribuna do Norte)
                <ExternalIcon />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              .
            </>
          ) : undefined
        }
      />
      <div className="section">
        <div className="wrap">
          {docs === null ? (
            <ErrorState
              title="Não foi possível carregar as resoluções"
              action={<ButtonLink href="/resolucoes">Tentar de novo</ButtonLink>}
            >
              O banco de dados não respondeu.{' '}
              {tribuna ? 'Enquanto isso, consulte a imprensa oficial pelo link acima.' : null}
            </ErrorState>
          ) : docs.length ? (
            <>
              <ActFilters
                action="/resolucoes"
                fields={[{ name: 'ano', label: 'Ano', options: yearOptions(docs.map((d) => d.data)), value: ano }]}
                resultLabel={`${filtered.length} ${filtered.length === 1 ? 'resolução' : 'resoluções'}`}
              />
              {items.length ? (
                <ActList label="Resoluções publicadas">
                  {items.map((r) => {
                    const arquivo = typeof r.arquivo === 'object' && r.arquivo ? r.arquivo : null
                    const numero = publicText(r.numero) as string
                    const titulo = publicText(r.titulo) as string
                    const linkTribuna = publicHref(r.linkTribuna)
                    const arquivoUrl = publicHref(arquivo?.url)
                    const altera = relatedActs(r, listedIds)
                    const alteradaPor = amendedBy(r, items)
                    return (
                      <ActItem
                        key={r.id}
                        id={anchor(r.id)}
                        numeral={numero}
                        numeralLabel={r.data ? formatDate(r.data) : undefined}
                        numeralDateTime={r.data ?? undefined}
                        title={titulo}
                        badges={<StatusPill status={statusInfo(RESOLUCAO_SITUACAO, r.situacaoJuridica)} />}
                        meta={
                          <>
                            {altera.length ? (
                              <p className="act__meta">
                                Altera ou retifica:{' '}
                                {altera.map((ref, index) => (
                                  <span key={ref.id}>
                                    {index ? ', ' : null}
                                    {ref.listed ? <a href={`#${anchor(ref.id)}`}>Resolução {ref.numero}</a> : <>Resolução {ref.numero}</>}
                                  </span>
                                ))}
                              </p>
                            ) : null}
                            {alteradaPor.length ? (
                              <p className="act__meta">
                                Alterada ou retificada por:{' '}
                                {alteradaPor.map((ref, index) => (
                                  <span key={ref.id}>
                                    {index ? ', ' : null}
                                    <a href={`#${anchor(ref.id)}`}>Resolução {ref.numero}</a>
                                  </span>
                                ))}
                              </p>
                            ) : null}
                          </>
                        }
                        actions={
                          arquivoUrl || linkTribuna ? (
                            <>
                              {arquivoUrl ? (
                                <a
                                  className="btn btn--primary btn--sm"
                                  href={arquivoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Abrir PDF da resolução ${numero}: ${titulo} (abre em nova aba)`}
                                >
                                  Abrir PDF
                                </a>
                              ) : null}
                              {linkTribuna ? (
                                <a
                                  className="btn btn--secondary btn--sm"
                                  href={linkTribuna}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Ver publicação oficial da resolução ${numero} (abre em nova aba)`}
                                >
                                  Publicação oficial
                                </a>
                              ) : null}
                            </>
                          ) : (
                            <span className="act__note">Documento em digitalização</span>
                          )
                        }
                      />
                    )
                  })}
                </ActList>
              ) : (
                <EmptyState
                  title="Nenhuma resolução neste ano"
                  action={<ButtonLink href="/resolucoes" variant="secondary">Ver todos os anos</ButtonLink>}
                />
              )}
              <Pagination
                current={page}
                total={total}
                buildHref={(p) => hrefWith('/resolucoes', { ano }, p)}
              />
            </>
          ) : (
            <EmptyState
              title="Ainda não há resoluções publicadas neste portal"
              action={
                tribuna ? (
                  <ButtonLink href={tribuna} variant="secondary">
                    Pesquisar na imprensa oficial
                  </ButtonLink>
                ) : undefined
              }
            >
              As resoluções aprovadas entram aqui depois de publicadas. As anteriores podem ser
              consultadas na imprensa oficial do Município.
            </EmptyState>
          )}
        </div>
      </div>
    </>
  )
}
