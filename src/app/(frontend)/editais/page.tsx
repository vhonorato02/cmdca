import type { Metadata } from 'next'

import { ActFilters, hrefWith, pickParam, yearOf, yearOptions } from '@/components/ActFilters'
import { amendedBy, EDITAL_SITUACAO, relatedActs, statusInfo } from '@/components/officialActs'
import { ActItem, ActList, StatusPill, Tag } from '@/components/ui/ActList'
import { ButtonLink } from '@/components/ui/Button'
import { ExternalIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination, parsePage } from '@/components/ui/Pagination'
import { EmptyState, ErrorState } from '@/components/ui/states'
import { getConfiguracoes, getTextos } from '@/lib/content'
import { formatDate, formatDateLong } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'
import type { Editai } from '@/payload-types'

const PER_PAGE = 20
const anchor = (id: number | string) => `edital-${id}`

const TIPO_LABEL: Record<string, string> = {
  chamamento: 'Chamamento público',
  conselho_tutelar: 'Conselho Tutelar',
  fmdca: 'Fundo Municipal',
  outro: 'Outro',
}

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Editais do CMDCA | Prazos, anexos e publicações',
    description: textos.atos.editaisIntro,
    path: '/editais',
  })
}

async function load(): Promise<Editai[] | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'editais',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 1000,
      depth: 1,
    })
    return (res.docs as Editai[]).filter((item) => publicText(item.titulo))
  } catch {
    return null
  }
}

export default async function EditaisPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [textos, config, docs, params] = await Promise.all([getTextos(), getConfiguracoes(), load(), searchParams])
  const tribuna = publicHref(config?.tribunaUrl)
  const ano = pickParam(params.ano)
  const tipo = pickParam(params.tipo)
  const filtered = (docs ?? []).filter(
    (e) => (ano === 'todos' || yearOf(e.data) === ano) && (tipo === 'todos' || e.tipo === tipo),
  )
  const total = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const page = parsePage(params.pagina, total)
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const listedIds = new Set(items.map((item) => item.id))
  const refLabel = (numero: string) => `Edital ${numero}`

  return (
    <>
      <PageHeader
        title={textos.atos.editaisTitulo}
        lead={textos.atos.editaisIntro}
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
              title="Não foi possível carregar os editais"
              action={<ButtonLink href="/editais">Tentar de novo</ButtonLink>}
            >
              O banco de dados não respondeu.
            </ErrorState>
          ) : docs.length ? (
            <>
              <ActFilters
                action="/editais"
                fields={[
                  { name: 'ano', label: 'Ano', options: yearOptions(docs.map((d) => d.data)), value: ano },
                  {
                    name: 'tipo',
                    label: 'Tipo',
                    value: tipo,
                    options: [
                      { value: 'todos', label: 'Todos os tipos' },
                      ...Object.entries(TIPO_LABEL).map(([value, label]) => ({ value, label })),
                    ],
                  },
                ]}
                resultLabel={`${filtered.length} ${filtered.length === 1 ? 'edital' : 'editais'}`}
              />
              {items.length ? (
                <ActList label="Editais publicados">
                  {items.map((e) => {
                    const arquivo = typeof e.arquivo === 'object' && e.arquivo ? e.arquivo : null
                    const titulo = publicText(e.titulo) as string
                    const numero = publicText(e.numero)
                    const linkTribuna = publicHref(e.linkTribuna)
                    const arquivoUrl = publicHref(arquivo?.url)
                    const retifica = relatedActs(e, listedIds)
                    const retificadoPor = amendedBy(e, items)
                    return (
                      <ActItem
                        key={e.id}
                        id={anchor(e.id)}
                        numeral={numero || 'Edital'}
                        numeralLabel={e.data ? formatDate(e.data) : undefined}
                        numeralDateTime={e.data ?? undefined}
                        title={titulo}
                        badges={
                          <>
                            <StatusPill status={statusInfo(EDITAL_SITUACAO, e.situacaoJuridica)} />
                            <Tag>{TIPO_LABEL[e.tipo] || 'Edital'}</Tag>
                          </>
                        }
                        meta={
                          <>
                            {e.prazo ? (
                              <p className="act__meta">
                                Prazo final: <time dateTime={e.prazo}>{formatDateLong(e.prazo)}</time>
                              </p>
                            ) : null}
                            {retifica.length ? (
                              <p className="act__meta">
                                Retifica:{' '}
                                {retifica.map((ref, index) => (
                                  <span key={ref.id}>
                                    {index ? ', ' : null}
                                    {ref.listed ? <a href={`#${anchor(ref.id)}`}>{refLabel(ref.numero)}</a> : refLabel(ref.numero)}
                                  </span>
                                ))}
                              </p>
                            ) : null}
                            {retificadoPor.length ? (
                              <p className="act__meta">
                                Retificado por:{' '}
                                {retificadoPor.map((ref, index) => (
                                  <span key={ref.id}>
                                    {index ? ', ' : null}
                                    <a href={`#${anchor(ref.id)}`}>{refLabel(ref.numero)}</a>
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
                                  aria-label={`Abrir PDF do edital${numero ? ` ${numero}` : ''}: ${titulo} (abre em nova aba)`}
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
                                  aria-label={`Ver publicação oficial do edital${numero ? ` ${numero}` : ''} (abre em nova aba)`}
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
                  title="Nenhum edital com esses filtros"
                  action={<ButtonLink href="/editais" variant="secondary">Limpar filtros</ButtonLink>}
                />
              )}
              <Pagination current={page} total={total} buildHref={(p) => hrefWith('/editais', { ano, tipo }, p)} />
            </>
          ) : (
            <EmptyState
              title="Ainda não há editais publicados neste portal"
              action={
                tribuna ? (
                  <ButtonLink href={tribuna} variant="secondary">
                    Pesquisar na imprensa oficial
                  </ButtonLink>
                ) : undefined
              }
            >
              Chamamentos e processos de escolha entram aqui assim que forem publicados.
            </EmptyState>
          )}
        </div>
      </div>
    </>
  )
}
